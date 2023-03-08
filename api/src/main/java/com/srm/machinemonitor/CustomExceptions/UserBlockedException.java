package com.srm.machinemonitor.CustomExceptions;

public class UserBlockedException extends org.springframework.security.core.AuthenticationException {
    public UserBlockedException(String message) {
        super(message);
    }
}
