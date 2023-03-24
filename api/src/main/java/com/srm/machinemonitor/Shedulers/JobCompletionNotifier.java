package com.srm.machinemonitor.Shedulers;

import com.srm.machinemonitor.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.sql.SQLSyntaxErrorException;
import java.util.Map;
import java.util.Objects;

@Service
public class JobCompletionNotifier {

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Scheduled(fixedRate = 100)
    public void notifier(){
//        try {
//            Map<String, Object> completedJobs = jdbcTemplate.queryForMap("SELECT * FROM BATCH_JOB_EXECUTION WHERE status = 'COMPLETED' ");
//            if (Objects.equals(completedJobs.get(Constants.STATUS), Constants.COMPLETED)){
//                Map<String, Object> jobDetails = jdbcTemplate.queryForMap("SELECT * FROM BATCH_JOB_EXECUTION WHERE status = 'COMPLETED' ");
//            }
//            System.out.println(completedJobs);
//        } catch(EmptyResultDataAccessException e){
//
//        }
    }
}
