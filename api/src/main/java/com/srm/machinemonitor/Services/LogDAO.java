package com.srm.machinemonitor.Services;

import com.srm.machinemonitor.Models.Tables.Log;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.List;


public interface LogDAO extends JpaRepository<Log, BigInteger> {
    @Query(value = "SELECT * FROM Log WHERE machineName = ?1 AND organizationId = ?2 LIMIT 1500", nativeQuery = true)
    List<Log> findAllLogByMachineNameAndOrganizationId(String machineName, BigInteger organizationId);

    // GROUP_CONCAT(log SEPARATOR '\n')
    @Query(value = "SELECT * FROM Log WHERE machineName = ?1 AND organizationId = ?2 AND time > ?3 LIMIT 1500", nativeQuery = true)
    List<Log> findAllLogByMachineNameAndOrganizationIdANDTimeGte(String machineName, BigInteger organizationId, LocalDateTime lastTime);

    @Query(value= "SELECT time from log WHERE machineName = ?1 AND organizationId = ?1 AND time > ?3", nativeQuery = true)
    LocalDateTime getLastDateByTimeGteAndMachineNameAndOrganizationId(String machineName, BigInteger organizationId, LocalDateTime lastTime);

    @Modifying
    @Query(value = "DELETE t1 FROM log t1 LEFT JOIN ( SELECT id FROM log ORDER BY log.time DESC LIMIT 1500) t2 ON t1.id = t2.id WHERE t2.id IS NULL", nativeQuery = true)
    void deleteDust();
}
