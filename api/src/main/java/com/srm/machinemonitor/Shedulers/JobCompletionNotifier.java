package com.srm.machinemonitor.Shedulers;

import com.srm.machinemonitor.Constants;
import com.srm.machinemonitor.Models.Tables.Organizations;
import com.srm.machinemonitor.Services.OrganizationDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.sql.SQLSyntaxErrorException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Objects;

@Service
public class JobCompletionNotifier {

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Autowired
    OrganizationDAO organizationDAO;

    @Scheduled(fixedRate = 1000)
    public void notifier(){
        try {
            Map<String, Object> completedJobs = jdbcTemplate.queryForMap("SELECT * FROM BATCH_JOB_EXECUTION WHERE status = 'COMPLETED' ");
            if (Objects.equals(completedJobs.get(Constants.STATUS), Constants.COMPLETED)) {
                Map<String, Object> jobDetails = jdbcTemplate.queryForMap("SELECT * FROM BATCH_JOB_EXECUTION_PARAMS WHERE JOB_EXECUTION_ID = " + completedJobs.get("JOB_EXECUTION_ID") + " AND KEY_NAME = '" + Constants.ORGANIZATION_ID + "'");
                Organizations organization = organizationDAO.findById(BigInteger.valueOf((Long) jobDetails.get("LONG_VAL"))).orElse(null);
                if (organization != null) {
                    String messages  = organization.getMessage();
                    if (messages == null){
                        organization.setMessage("Migration request is completed at " + LocalDateTime.now());
                    }else{
                        organization.setMessage(messages + ",Migration request is completed at " + LocalDateTime.now());
                    }
                    organizationDAO.save(organization);
                    jdbcTemplate.execute("DELETE FROM BATCH_JOB_EXECUTION_CONTEXT WHERE JOB_EXECUTION_ID = '" + jobDetails.get("JOB_EXECUTION_ID") + "'");
                    jdbcTemplate.execute("DELETE FROM BATCH_JOB_EXECUTION_PARAMS WHERE JOB_EXECUTION_ID = '" + jobDetails.get("JOB_EXECUTION_ID") + "'");
                    jdbcTemplate.execute("DELETE FROM BATCH_STEP_EXECUTION WHERE JOB_EXECUTION_ID = '" + jobDetails.get("JOB_EXECUTION_ID") + "'");
                    jdbcTemplate.execute("DELETE FROM BATCH_JOB_EXECUTION WHERE JOB_EXECUTION_ID = '" + jobDetails.get("JOB_EXECUTION_ID") + "'");
                    System.out.println(messages);
                    System.out.println(jobDetails);
                }
            }
        } catch(EmptyResultDataAccessException e){

        }
    }
}
