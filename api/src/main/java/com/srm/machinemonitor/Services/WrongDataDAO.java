package com.srm.machinemonitor.Services;

import com.srm.machinemonitor.Models.Tables.WrongData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigInteger;

public interface WrongDataDAO extends JpaRepository<WrongData, BigInteger> {

    void deleteByMachineId(BigInteger machineId);
}
