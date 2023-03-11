package com.srm.machinemonitor.Services;

import com.srm.machinemonitor.Models.Tables.Machines;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;
import java.math.BigInteger;
import java.util.List;
public interface MachinesDAO extends JpaRepository<Machines, BigInteger> {

    boolean existsByOrganizationIdAndMachineNameAndSensors(BigInteger organizationId, String machineName, String sensor);

    @Query(value="SELECT u.secert FROM machines u where u.machineName = ?1 AND u.organizationId = ?2 LIMIT 1", nativeQuery = true)
    String getSeceretTokenByMachineNameAndOrganizationId(String machinneName, BigInteger organizationId);

    boolean existsBymachineNameAndOrganizationId(String machineName, BigInteger organizationId);

    Boolean existsByOrganizationIdAndMachineNameAndSecert(BigInteger organizationId, String machineName, String secert);

    List<Machines> findAllByOrganizationIdOrderByMachineNameAsc(BigInteger organizationId);

    Machines getIdByMachineNameAndSensorsAndOrganizationId(String machineName, String sensor, BigInteger orgnaizatonId);

    Machines findByMachineNameAndSensorsAndOrganizationId(String machineName, String sensor, BigInteger organizationId);


    @Query(value="SELECT * FROM machines WHERE machines.machineName = ?1 AND machines.organizationId = ?2 ORDER BY machines.machineName ASC", nativeQuery = true)
    List<Machines> findByMachineNamesAndOrganizationId(String machineNames, BigInteger organizationId);
}
