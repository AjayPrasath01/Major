package com.srm.machinemonitor.Controllers;


import com.opencsv.CSVParser;
import com.opencsv.CSVParserBuilder;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import com.opencsv.exceptions.CsvException;
import com.srm.machinemonitor.Constants;
import com.srm.machinemonitor.Models.Tables.*;
import com.srm.machinemonitor.Modes;
import com.srm.machinemonitor.Services.*;
import com.srm.machinemonitor.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.StringReader;
import java.math.BigInteger;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping(path = "/api/learn")
public class MachineLearning {

    @Autowired
    OrganizationDAO organizationDAO;

    @Autowired
    DataDAO dataDAO;

    @Autowired
    DevDataDAO devDataDAO;

    @Autowired
    MachinesDAO machinesDAO;

    @Autowired
    WrongDataDAO wrongDataDAO;

    @Autowired
    MlModelDAO mlModelDAO;

    @Autowired
    MlTrainingStatusDAO mlTrainingStatusDAO;

    @GetMapping(path="/params")
    public ResponseEntity<Map> learnParamsSetter(@RequestParam(value="trainDataSize") float trainDataSize,
                                            @RequestParam(value="modelName") String modelName,
                                            @RequestParam(value="organization") String organization,
                                            @RequestParam(value="sensors") String sensors,
                                            @RequestParam(value="machineName") String machineName,
                                            @RequestParam(value="mode") String mode,
                                            Principal principal,
                                            HttpServletResponse response) throws IOException {
        Map verify = Utils.verifyAdminAndOrganizationIDOR(response, principal, organization, organizationDAO);
        if (verify == null){
            return null;
        }
        long lengthTrainingData = 0;
        BigInteger organizationId = (BigInteger) verify.get(Constants.ORGANIZATION_ID);
        String sensor[]  = sensors.split(",");
        int sensors_length = sensor.length;
        final Map res = new HashMap<>();
        for (int i = 0; i < sensors_length; i++){
            Machines machine = machinesDAO.getIdByMachineNameAndSensorsAndOrganizationId(machineName, sensor[i], organizationId);
            if (machine == null){
                res.put("message", "Some sensor name or machine name do not exists");
                return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
            }
            if (Objects.equals(mode, String.valueOf(Modes.DEV))){
                lengthTrainingData += devDataDAO.countByMachineID(machine.getId()).longValueExact();
            }else{
                lengthTrainingData += dataDAO.countByMachineID(machine.getId()).longValueExact();
            }
        }
        lengthTrainingData = (long) Math.ceil(lengthTrainingData * trainDataSize);
        res.put("trainingDataLength", lengthTrainingData);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Map> inizializeTraining(@RequestParam(value="trainDataSize") float trainDataSize,
                                                  @RequestParam(value="modelName") String modelName,
                                                  @RequestParam(value="organization") String organization,
                                                  @RequestParam(value="sensors") String sensors,
                                                  @RequestParam(value="machineName") String machineName,
                                                  @RequestParam(value="mode") String mode,
                                                  Principal principal,
                                                  HttpServletResponse response) throws IOException {
        Map verify = Utils.verifyAdminAndOrganizationIDOR(response, principal, organization, organizationDAO);
        if (verify == null){
            return null;
        }
        BigInteger organizationId = (BigInteger) verify.get(Constants.ORGANIZATION_ID);
        RestTemplate restTemplate = new RestTemplate();
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl("http://127.0.0.1:8080/learner/learn")
                .queryParam("organizationId", organizationId.toString())
                .queryParam("sensors", sensors)
                .queryParam("machineName", machineName);

        String url = builder.toUriString();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String requestBody = "";
        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> result = restTemplate.postForEntity(url, request, String.class);
        System.out.println(result);
        return new ResponseEntity(result, HttpStatus.OK);
    }

    @Transactional
    @RequestMapping(value="/upload", method = RequestMethod.POST)
    public ResponseEntity<Map> wrongPoints(Principal principal,
                                           HttpServletResponse response,
                                           @RequestParam(value="machineName") String machineName,
                                           @RequestParam(value="organization") String organization,
                                           @RequestParam(value="sensor") String sensor,
                                           @RequestBody String csvData) throws IOException {
        Map verify = Utils.verifyAdminAndOrganizationIDOR(response, principal, organization, organizationDAO);
        if (verify == null){
            return null;
        }
        BigInteger organizationId = (BigInteger) verify.get(Constants.ORGANIZATION_ID);
        Machines machine = machinesDAO.getIdByMachineNameAndSensorsAndOrganizationId(machineName, sensor, organizationId);

        try (CSVReader csvReader = new CSVReader(new StringReader(csvData))) {
        String[] headers = csvReader.readNext();
        int indexOfMachineName = Arrays.binarySearch(headers, Constants.MACHINENAME);
        int indexOfValue = Arrays.binarySearch(headers, "value");
        int indexOdDateTime = Arrays.binarySearch(headers, "dateTime");
        if (indexOfValue < 0){
            Map res = new HashMap<>();
            res.put("message", "Value column is missing");
            return new ResponseEntity<>(res, HttpStatus.OK);
        }
        List<WrongData> wrongDatas = new ArrayList<>();
        List<String[]> rows = csvReader.readAll(); // Read the CSV data
            for (String[] row : rows) {
                WrongData wrongData = new WrongData();
                wrongData.setMachineId(machine.getId());
                if (indexOfMachineName >= 0 && !machine.getMachineName().equals(row[indexOfMachineName])){
                    Map res = new HashMap<>();
                    res.put("message", "Selected machine name does not match with the column values");
                    return new ResponseEntity<>(res, HttpStatus.OK);
                }
                if (indexOdDateTime >= 0){
                    wrongData.setDateTime(LocalDateTime.parse(row[indexOdDateTime]));
                }
                wrongData.setValue(row[indexOfValue]);
                wrongDatas.add(wrongData);
            }
            wrongDataDAO.deleteByMachineId(machine.getId());
            wrongDataDAO.saveAllAndFlush(wrongDatas);
            final Map res = new HashMap<>();
            res.put("message", "Updated the your recored");
            return new ResponseEntity<>(res, HttpStatus.OK);
        } catch (IOException | CsvException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/start")
    public ResponseEntity startTraining(Principal principal,
                                        HttpServletResponse response,
                                        @RequestParam(value="organization") String organization,
                                        @RequestParam(value="modelName") String modelName,
                                        @RequestParam(value="modelAlgo") String modelAlgo,
                                        @RequestParam(value="sensors") String sensors,
                                        @RequestParam(value="machineName") String machineName,
                                        @RequestParam(value="mode") String mode,
                                        @RequestParam(value="trainDataSize") float trainDataSize) throws IOException {
        Map verify = Utils.verifyAdminAndOrganizationIDOR(response, principal, organization, organizationDAO);
        if (verify == null){
            return null;
        }

        BigInteger organizationId = (BigInteger) verify.get(Constants.ORGANIZATION_ID);
        String key = Constants.modelKeyGenerator(String.valueOf(organizationId), modelName, sensors, machineName, modelAlgo);
        Organizations organizationModel = organizationDAO.findById(organizationId).orElse(null);

        MlTrainingStatus mlTrainingStatus = new MlTrainingStatus();
        mlTrainingStatus.setModelKey(key);
        mlTrainingStatus.setStatus("QUEUED");
        mlTrainingStatusDAO.save(mlTrainingStatus);


        String sensor[]  = sensors.split(",");
        StringBuilder machineIds = new StringBuilder();
        for (String s : sensor) {
            Machines machine = machinesDAO.getIdByMachineNameAndSensorsAndOrganizationId(machineName, s, organizationId);
            if (machineIds.toString().isBlank()) {
                machineIds.append(String.valueOf(machine.getId()));
            } else {
                machineIds.append("," + String.valueOf(machine.getId()));
            }
        }

        MlModels mlModel = new MlModels();

        mlModel.setMchineIds(machineIds.toString());
        mlModel.setModelKey(key);
        mlModel.setName(modelName);
        mlModelDAO.save(mlModel);

        Map res = new HashMap();
        try{
            ResponseEntity result = requestMLServer(
                    Map.of(Constants.ORGANIZATION_ID, organizationId.toString(),
                            "machineIds", machineIds,
                            "key", key,
                            Constants.MACHINENAME, machineName,
                            "mode", mode,
                            "trainDataSize", trainDataSize,
                            "machineAlgo", modelAlgo
                    )
            );
            System.out.println(result);
            res.put("message", result.getBody());
        }catch(Exception e){
            res.put("message", "Some thing went wrong");
            System.out.println(e);
            return new ResponseEntity<>(res, HttpStatus.OK);
        }

        organizationModel.addMessage("ML Training for the machine " + machineName + " withSensors " + sensors + " has been queued");
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    private ResponseEntity requestMLServer(Map<String, Object> queryParams){
        RestTemplate restTemplate = new RestTemplate();
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl("http://127.0.0.1:8080/learner/learn");
        for (String key : queryParams.keySet()) {
            builder.queryParam(key, queryParams.get(key));
        }

        String url = builder.toUriString();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        String requestBody = "";
        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);
        return restTemplate.postForEntity(url, request, String.class);
    }
}
