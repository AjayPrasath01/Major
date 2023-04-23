package com.srm.machinemonitor.Services;

import com.srm.machinemonitor.Models.Tables.MlTrainingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigInteger;

public interface MlTrainingStatusDAO extends JpaRepository<MlTrainingStatus, BigInteger> {

}
