package com.srm.machinemonitor.Models.Requests;

import lombok.*;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Data
public class AllowUserRequest {
    @NotNull(message="organization can't be null")
    String organization;
    @NotNull(message="username can't be null")
    String username;
}
