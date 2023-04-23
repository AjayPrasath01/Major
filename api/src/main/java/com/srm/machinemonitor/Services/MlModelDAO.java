package com.srm.machinemonitor.Services;

import com.srm.machinemonitor.Models.Tables.MlModels;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigInteger;

public interface MlModelDAO extends JpaRepository<MlModels, BigInteger> {
}
