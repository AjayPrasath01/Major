package com.srm.machinemonitor.Models.Requests;

import com.srm.machinemonitor.Modes;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
public class SwitchModeRequest {

    @NotEmpty(message="organization can't be empty")
    @NotNull(message="organization can't be not null")
    String organization;

    @NotEmpty(message="sensor can't be empty")
    @NotNull(message="sensor can't be not null")
    String sensor;

    @NotEmpty(message="machineName can't be empty")
    @NotNull(message="machineName can't be not null")
    String machineName;

    @Pattern(regexp = "^(dev|prod)$", message = "Mode must be either dev or prod")
    String mode;
}
