package com.srm.machinemonitor.Services;

import com.srm.machinemonitor.Models.Other.BaseData;
import com.srm.machinemonitor.Models.Tables.Data;
import com.srm.machinemonitor.Models.Tables.DevData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.List;

public interface DevDataDAO extends JpaRepository<DevData, BigInteger> {

    List<BaseData> findAllByMachineId(BigInteger machineId);

    @Query(value="SELECT * FROM DevData WHERE DevData.date >= ?2 AND DevData.date <= ?3 AND DevData.machineId = ?1 ORDER BY DevData.date ASC", nativeQuery = true)
    List<DevData> getDataBetweenTimeWithMachineId(BigInteger machineId, LocalDateTime startDate, LocalDateTime endDate);

    List<DevData> findAllByMachineIdAndDateGreaterThanOrderByDateAsc(BigInteger machineId, LocalDateTime date);

}
