package com.srm.machinemonitor.Services;

import com.srm.machinemonitor.Models.Other.BaseData;
import com.srm.machinemonitor.Models.Tables.Data;
import com.srm.machinemonitor.Models.Tables.DevData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;
import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.List;

@Transactional
public interface DataDAO extends JpaRepository<Data, BigInteger> {

    @Query(value="SELECT COUNT(*) FROM data WHERE data.machineId = ?1 AND data.data_type <> ?2", nativeQuery = true)
    BigInteger countByMachineIDAndDatatype(BigInteger machineId, String dataType);

    @Query(value="SELECT * FROM data u WHERE u.date >= ?2 AND u.date <= ?3 AND u.machineId = ?1 ORDER BY u.date ASC", nativeQuery = true)
    List<Data> getDataBetweenTimeWithMachineId(BigInteger machineId, LocalDateTime startDate, LocalDateTime endDate);

    @Query(value="SELECT * FROM data u WHERE u.date >= ?2 AND u.date <= ?3 AND u.machineId = ?1 ORDER BY u.date ASC LIMIT ?4 OFFSET ?5", nativeQuery = true)
    List<DevData> getDataBetweenTimeWithMachineIdWithLimitAndOffset(BigInteger machineId, LocalDateTime startDate, LocalDateTime endDate, int limit, long offset);

    List<Data> findAllByMachineIdAndDateGreaterThanOrderByDateAsc(BigInteger machineId, LocalDateTime date);

    List<BaseData> findAllByMachineId(BigInteger machineId);

    @Modifying
    @Query(value="UPDATE data u SET u.value = ?2 where u.id = ?1", nativeQuery = true)
    void changeDataByIdandValue(BigInteger id, String value);

    @Modifying
    @Query(value="DELETE FROM data u where u.id = ?1", nativeQuery = true)
    void deleteDataById(BigInteger id);

    @Modifying
    void deleteAllByMachineId(BigInteger machineId);

    @Query(value="SELECT DISTINCT data.sensor_name FROM data WHERE data.machine_name = ?1", nativeQuery = true)
    List<String> finAllSensorsByMachineName(String machinename);
}
