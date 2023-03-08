package com.srm.machinemonitor.Services;

import com.srm.machinemonitor.Models.Other.BaseData;
import com.srm.machinemonitor.Models.Tables.Data;
import com.srm.machinemonitor.Models.Tables.DevData;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigInteger;
import java.util.List;

public interface DevDataDAO extends JpaRepository<DevData, BigInteger> {

    List<BaseData> findAllByMachineId(BigInteger machineId);
}
