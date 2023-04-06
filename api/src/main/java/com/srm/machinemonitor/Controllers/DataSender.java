package com.srm.machinemonitor.Controllers;

import com.srm.machinemonitor.Constants;
import com.srm.machinemonitor.Models.Other.BaseData;
import com.srm.machinemonitor.Models.Other.CustomUserDetails;
import com.srm.machinemonitor.Models.Other.DataWithSensorAndMachineName;
import com.srm.machinemonitor.Models.Tables.Machines;
import com.srm.machinemonitor.Modes;
import com.srm.machinemonitor.Services.DevDataDAO;
import com.srm.machinemonitor.Utils;
import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.supercsv.io.CsvBeanWriter;
import org.supercsv.io.ICsvBeanWriter;
import java.lang.Math;
import org.supercsv.prefs.CsvPreference;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;
import java.math.BigInteger;
import java.security.Principal;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.format.DateTimeParseException;
import java.util.*;
import com.srm.machinemonitor.Services.DataDAO;
import com.srm.machinemonitor.Services.OrganizationDAO;
import com.srm.machinemonitor.Services.MachinesDAO;

@RestController
@RequestMapping("/api/fetch")
@CrossOrigin
public class DataSender {

    enum Mode{
        prod,dev
    }

    @Autowired
    private DataDAO dataDAO;

    @Autowired
    private DevDataDAO devDataDAO;

    @Autowired
    private MachinesDAO machineDAO;

    @Autowired
    private OrganizationDAO organizationDAO;

//    @GetMapping("/data")
//    public ResponseEntity<List<Data>> sendMachineData(@RequestParam(value = "machineName") String machineName,
//                                                      @RequestParam(value = "startDateTime", defaultValue = "1999-01-01 00:00:00", required = false) @DateTimeFormat(pattern =  "yyyy-MM-dd HH:mm:ss") LocalDateTime startDateTime,
//                                                      @RequestParam(value = "stopDateTime", required = false) @DateTimeFormat(pattern =  "yyyy-MM-dd HH:mm:ss") LocalDateTime endDateTime){
//        if (endDateTime == null){
//            endDateTime = LocalDateTime.now();
//        }
//        System.out.println("machineName fetch/data " + machineName);
//        System.out.println("start fetch/data " + startDateTime);
//        System.out.println("end fetch/data " + endDateTime);
//        // Returns date time in utc format
//        return new ResponseEntity<>(dataDAO.getDataBetweenTime(machineName, startDateTime, endDateTime), HttpStatus.OK);
//    }

    @GetMapping({"/sensor/data"})
    public ResponseEntity movedPoints(){
        final Map response = new HashMap<>();
        response.put("message", "Endpoint closed permanently");
        return new ResponseEntity(response, HttpStatus.MOVED_PERMANENTLY);
    }

    @GetMapping("/machineNames")
    public ResponseEntity<List<String>> sendMachinesAvailable(Principal principal, HttpServletResponse response){
        final Map res = new HashMap();
        if (principal == null){
            res.put("message", "Unauthorized");
            return new ResponseEntity(res, HttpStatus.UNAUTHORIZED);
        }
        List<Map<String, String>> data = new ArrayList<>();
        BigInteger organization_id = ((CustomUserDetails) ((UsernamePasswordAuthenticationToken) principal).getPrincipal()).getOrganizationId();
        if (organization_id == null){
            res.put("message", "Organization id not found");
            return new ResponseEntity(res, HttpStatus.NOT_FOUND);
        }
        String mode = "";
        List<Machines> machinesRequired = machineDAO.findAllByOrganizationIdOrderByMachineNameAsc(organization_id);
        // To combine sensorType together under single machine name
        for (Machines m : machinesRequired){
            Map temp = new HashMap<>();
            for (Map eachMachine: data){
                if (eachMachine.get("machineName").equals(m.getMachineName())){
                    temp = eachMachine;
                    mode = m.getMode();
                    break;
                }
            }
            if (temp.containsKey("sensorType")){
                temp.put("sensorType", temp.get("sensorType") + "," + m.getSensors() + ":" + mode);
            }else{
                temp.put("machineName", m.getMachineName());
                temp.put("sensorType", m.getSensors() + ":" + m.getMode());
                data.add(temp);
            }
        }
        System.out.println(new JSONArray(data));
        return new ResponseEntity(new JSONArray(data).toString(), HttpStatus.OK);
    }

    @GetMapping("/csv")
    public void sendAsCSV(@RequestParam("machinename") String machinename, @RequestParam("organization") String organization, @RequestParam("sensor") String sensor, @RequestParam(value = "mode", required = false ,defaultValue = "dev") @Valid Mode mode, HttpServletResponse response, Principal principal) throws IOException {
        response.setContentType("text/csv");
        String currentdate = new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss").format(new Date());

        String headerkey = "Content-Disposition";
        String headervalue = "attachment; filename=" + machinename + currentdate + ".csv";

        response.setHeader(headerkey, headervalue);

        BigInteger organization_id = organizationDAO.getIdByName(organization);

        if (organization_id == null){
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "IDOR not allowed");
            return;
        }

        if (principal == null){
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authentication required");
            return;
        }

        if (!organization_id.equals(((CustomUserDetails) ((UsernamePasswordAuthenticationToken) principal).getPrincipal()).getOrganizationId())){
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "IDOR not allowed");
            return;
        }


        Machines machineId =  machineDAO.getIdByMachineNameAndSensorsAndOrganizationId(machinename, sensor, organization_id);
        if (machineId == null){
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Machine not found");
            return;
        }
        List<BaseData> data = null;
        if (mode == Mode.dev){
            data = devDataDAO.findAllByMachineId(machineId.getId());
        }else{
            data = dataDAO.findAllByMachineId(machineId.getId());
        }

        ICsvBeanWriter csvWriter = new CsvBeanWriter(response.getWriter(), CsvPreference.STANDARD_PREFERENCE);
        String[] csvHeader = {"Date", "DataType", "Sensor_Name", "Value", "Machine_Name"};
        String[] namemapping = {"date", "data_type", "sensor_name", "value", "machine_name"};

        csvWriter.writeHeader(csvHeader);

        for (BaseData d : data){
            DataWithSensorAndMachineName dWithSM = new DataWithSensorAndMachineName();
            dWithSM.setDate(d.getDate());
            dWithSM.setData_type(d.getData_type());
            dWithSM.setSensor_name(machinename);
            dWithSM.setValue(d.getValue());
            dWithSM.setMachine_name(sensor);
            csvWriter.write(dWithSM, namemapping);
        }

        csvWriter.close();

    }

    @GetMapping("/data")
    public ResponseEntity sendData(@RequestParam("organization") String organization,
                                   @RequestParam("machineName") String machineName,
                                   @RequestParam("sensor") String sensor,
                                   @RequestParam("mode") String mode,
                                   @RequestParam("startDate") String startDate,
                                   @RequestParam("endDate") String endDate,
                                   @RequestParam("limit") int limit,
                                   @RequestParam("offset") long offset,
                                   HttpServletResponse response,
                                   Principal principal) throws IOException {
        Map verify = Utils.verifyOrgnaization(response, principal, organization, organizationDAO);
        if (verify == null){
            return null;
        }
        final Map res = new HashMap();
        if (startDate.compareTo(endDate) >= 0){
            res.put("message", "Start date must be smaller than end date");
            return new ResponseEntity(res, HttpStatus.NO_CONTENT);
        }
        LocalDateTime startDateTime = parseLocalDateTime(startDate);
        LocalDateTime endDateTime = parseLocalDateTime(endDate);
        BigInteger organizationId = (BigInteger) verify.get(Constants.ORGANIZATION_ID);
        Machines machine = machineDAO.getIdByMachineNameAndSensorsAndOrganizationId(machineName, sensor, organizationId);
        if (machine == null){
            res.put("message", "Not found machine or sensor");
            return new ResponseEntity(res, HttpStatus.NOT_FOUND);
        }
        List data = null;
        BigInteger number_of_data = BigInteger.valueOf(0);
        if (mode.equals(Modes.DEV.toString())){
            data = devDataDAO.getDataBetweenTimeWithMachineIdWithLimitAndOffset(machine.getId(), startDateTime, endDateTime, limit, offset);
            number_of_data = devDataDAO.countByMachineID(machine.getId());
        }else if ((mode.equals(Modes.PROD.toString()))){
            data = dataDAO.getDataBetweenTimeWithMachineIdWithLimitAndOffset(machine.getId(), startDateTime, endDateTime, limit, offset);
            number_of_data = dataDAO.countByMachineID(machine.getId());
        }
        final Map clientRes = new HashMap();
        clientRes.put("data", data);
        clientRes.put("pages",  (int) Math.ceil((double) number_of_data.longValueExact() / limit));
        System.out.println("clientRes");
        System.out.println(clientRes);
        return new ResponseEntity<>(clientRes, HttpStatus.OK);
    }

    private LocalDateTime parseLocalDateTime(String dateTime){
        try{
            DateTimeFormatter formatter = new DateTimeFormatterBuilder()
                    .appendOptional(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"))
                    .appendOptional(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
                    .appendOptional(DateTimeFormatter.ofPattern("HH:mm:ss yyyy-MM-dd "))
                    .appendOptional(DateTimeFormatter.ofPattern("HH:mm:ss yyyy/MM/dd "))
                    .appendOptional(DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss"))
                    .appendOptional(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"))
                    .appendOptional(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS"))
                    .toFormatter();
            return LocalDateTime.parse(dateTime, formatter);
        }catch(DateTimeParseException e){
            Instant instant = Instant.parse(dateTime);
            return instant.atZone(ZoneId.systemDefault()).toLocalDateTime();
        }
    }
}
