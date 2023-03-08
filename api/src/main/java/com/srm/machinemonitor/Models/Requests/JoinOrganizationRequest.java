package com.srm.machinemonitor.Models.Requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotEmpty;

@Getter
@Setter
@Data
@AllArgsConstructor
public class JoinOrganizationRequest {
    @NotEmpty(message="Email can't be empty")
    String email;
    @NotEmpty(message="Username can't be empty")
    String username;
    @NotEmpty(message="Password can't be empty")
    String password;
    @NotEmpty(message="Organization can't be empty")
    String organization;
    @NotEmpty(message="Organization can't be empty")
    String role;
}
