package com.srm.machinemonitor.Services;

import com.srm.machinemonitor.Models.Tables.SuperAdmins;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigInteger;

public interface SuperAdminsDAO extends JpaRepository<SuperAdmins, BigInteger> {
    SuperAdmins findByUsername(String username);
}
