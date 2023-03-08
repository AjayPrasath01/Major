package com.srm.machinemonitor;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.srm.machinemonitor.Models.Other.CustomUserDetails;
import com.srm.machinemonitor.Services.MachinesDAO;
import com.srm.machinemonitor.Services.OrganizationDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.math.BigInteger;
import java.security.Principal;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

public class Utils {

    public static Map verifyOrgnaization(HttpServletResponse response, Principal principal, String organizationName, OrganizationDAO organizationDAO) throws IOException {
        final Map res = new HashMap();
        Boolean isValid = checkPrincipal(response, principal);
        if (!isValid){
            return null;
        }
        BigInteger organization_id = checkOrganizationIDOR(response, principal, organizationDAO, organizationName);
        if (organization_id == null){
            return null;
        }

        res.put("organizationId", organization_id);
        return res;
    }

    public static Map verifyAdminAndOrganizationIDOR(HttpServletResponse response, Principal principal, String organizationName, OrganizationDAO organizationDAO) throws IOException {
        final Map res = new HashMap();
        Boolean isValid = checkPrincipal(response, principal);
        if (!isValid){
            return null;
        }
        BigInteger organization_id = checkOrganizationIDOR(response, principal, organizationDAO, organizationName);
        if (organization_id == null){
            return null;
        }
        if(!((CustomUserDetails) ((UsernamePasswordAuthenticationToken) principal).getPrincipal()).getRole().equals("admin")){
            res.put("message", "Unauthorized only admin allowed");
            sender(response, res, HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }
        res.put("organizationId", organization_id);
        return res;
    }

    public static Map verifyIotToken(HttpServletResponse response, String organizationName, String machinename, String token, MachinesDAO machinesDAO, OrganizationDAO organizationDAO) throws IOException {
        BigInteger organization_id = organizationDAO.getIdByName(organizationName);
        final Map res = new HashMap();
        if (organization_id == null){
            res.put("message", "Organization do not exists");
            sender(response, res, HttpServletResponse.SC_NOT_FOUND);
            return null;
        }
        Boolean verified = machinesDAO.existsByOrganizationIdAndMachineNameAndSecert(organization_id, machinename, token);
        if (!verified){
            res.put("message", "Given data cant be verified");
            sender(response, res, HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }
        final Map data = new HashMap();
        data.put("organizationId", organization_id);
        return data;
    }

    public static String verifyLogType(String logType){
        if (logType.toLowerCase().equals("error")){
            return "ERROR";
        }else
        if (logType.toLowerCase().equals("warning")){
            return "WARNING";
        }
        return "INFO";
    }

    private static Boolean checkPrincipal(HttpServletResponse response, Principal principal) throws IOException {
        if (principal == null) {
            final Map res = new HashMap();
            res.put("message", "Missing authentication");
            sender(response, res, HttpServletResponse.SC_UNAUTHORIZED);
            return false;
        }
        return true;
    }

    private static BigInteger checkOrganizationIDOR(HttpServletResponse response, Principal principal, OrganizationDAO organizationDAO, String organizationName) throws IOException {
        BigInteger organization_id = organizationDAO.getIdByName(organizationName);
        final Map res = new HashMap();
        if (organization_id == null){
            res.put("message", "Organization do not exists");
            sender(response, res, HttpServletResponse.SC_NOT_FOUND);
            return null;
        }
        if (!organization_id.equals(((CustomUserDetails) ((UsernamePasswordAuthenticationToken) principal).getPrincipal()).getOrganizationId())){
            res.put("message", "Unauthorized");
            sender(response, res, HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }
        return organization_id;
    }

    private static void sender(HttpServletResponse response, Map data, int statusCode) throws IOException{
        ObjectMapper objectMapper = new ObjectMapper();
        String jsonString = objectMapper.writeValueAsString(data);
        response.setStatus(statusCode);
        response.setContentType("application/json");
        PrintWriter writer = response.getWriter();
        writer.write(jsonString);
        writer.flush();
    }

    public static boolean hasDuplicates(String[] arr) {
        Arrays.sort(arr);
        for (int i = 0; i < arr.length - 1; i++) {
            if (Objects.equals(arr[i], arr[i + 1])) {
                return true;
            }
        }
        return false;
    }
}
