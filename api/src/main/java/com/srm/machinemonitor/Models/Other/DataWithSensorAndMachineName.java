package com.srm.machinemonitor.Models.Other;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DataWithSensorAndMachineName extends BaseData {
    private String sensor_name;
    private String machine_name;
}
