package com.srm.machinemonitor.Filters;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.srm.machinemonitor.RateLimiter;
import org.springframework.http.HttpStatus;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.Map;

public class RateLimitingFilter implements Filter {

    private final RateLimiter rateLimiter = new RateLimiter(1, 500);

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String queryString = httpRequest.getQueryString();
        Map<String, String> queryParams = new HashMap<>();
        if (queryString != null) {
            try {
                String decodedQueryString = URLDecoder.decode(queryString, "UTF-8");
                String[] parameters = decodedQueryString.split("&");
                for (String parameter : parameters) {
                    String[] parts = parameter.split("=");
                    String name = parts[0];
                    String value = parts.length > 1 ? parts[1] : "";
                    queryParams.put(name, value);
                }
            } catch (UnsupportedEncodingException ex) {
                HttpServletResponse httpResponse = (HttpServletResponse) response;
                httpResponse.setStatus(HttpStatus.BAD_REQUEST.value());
                Map<String, String> data = new HashMap<>();
                data.put("message", "A wrong encoding format is used");
                ObjectMapper objectMapper = new ObjectMapper();
                String json = objectMapper.writeValueAsString(data);
                httpResponse.getWriter().write(json);
                httpResponse.getWriter().flush();
            }
        }
        String key = queryParams.get("token") + "/" +  queryParams.get("sensorName");// Change this to the header or attribute that identifies the user
        if (rateLimiter.allow(key)) {
            chain.doFilter(request, response);
        } else {
            HttpServletResponse httpResponse = (HttpServletResponse) response;
            httpResponse.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            Map<String, String> data = new HashMap<>();
            data.put("message", "A sensor is allowed to send 1 request per 500 millisecond");
            ObjectMapper objectMapper = new ObjectMapper();
            String json = objectMapper.writeValueAsString(data);
            httpResponse.getWriter().write(json);
            httpResponse.getWriter().flush();
        }
    }
}
