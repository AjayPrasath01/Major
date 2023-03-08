package com.srm.machinemonitor.Models.Requests;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;

@AllArgsConstructor
@Setter
@Getter
public class ModifyDeviceRequest {
    @NotNull
    String machineName;
    @NotNull
    String organization;
    @NotNull
    String sensors;
}
