package com.srm.machinemonitor.Handlers;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

public class CustomSuccessAuthHandlers implements AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        response.setStatus(200);
        response.setContentType("application/json");
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("message", "Logged In");
        PrintWriter out = response.getWriter();
        out.write(new ObjectMapper().writeValueAsString(responseData));
        out.flush();
        out.close();
    }
}
