package com.srm.machinemonitor.Models.Requests;

import lombok.*;

import javax.validation.constraints.NotNull;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UnBlockUserRequest {
    @NotNull(message="Username can't be not null")
    String username;
    @NotNull(message="organization can't be not null")
    String organization;
}
