package com.srm.machinemonitor.Services;

import com.srm.machinemonitor.Models.Other.BaseData;
import com.srm.machinemonitor.Models.Tables.Data;
import com.srm.machinemonitor.Models.Tables.DevData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.List;

public interface DevDataDAO extends JpaRepository<DevData, BigInteger> {

    @Query(value="SELECT COUNT(*) FROM DevData u WHERE u.machineId = ?1 AND u.data_type <> ?2", nativeQuery = true)
    BigInteger countByMachineIDAndDatatype(BigInteger machineId, String dataType);

    List<BaseData> findAllByMachineId(BigInteger machineId);

    @Query(value="SELECT * FROM DevData WHERE DevData.date >= ?2 AND DevData.date <= ?3 AND DevData.machineId = ?1 ORDER BY DevData.date ASC LIMIT ?4 OFFSET ?5", nativeQuery = true)
    List<DevData> getDataBetweenTimeWithMachineIdWithLimitAndOffset(BigInteger machineId, LocalDateTime startDate, LocalDateTime endDate, int limit, long offset);

    @Modifying
    @Query(value="UPDATE DevData u SET u.value = ?2 where u.id = ?1", nativeQuery = true)
    void changeDataByIdandValue(BigInteger id, String value);

    @Modifying
    @Query(value="DELETE FROM DevData u where u.id = ?1", nativeQuery = true)
    void deleteDataById(BigInteger id);

    @Query(value="SELECT * FROM DevData WHERE DevData.date >= ?2 AND DevData.date <= ?3 AND DevData.machineId = ?1 ORDER BY DevData.date ASC", nativeQuery = true)
    List<DevData> getDataBetweenTimeWithMachineId(BigInteger machineId, LocalDateTime startDate, LocalDateTime endDate);

    List<DevData> findAllByMachineIdAndDateGreaterThanOrderByDateAsc(BigInteger machineId, LocalDateTime date);

}
