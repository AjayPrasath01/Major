package com.srm.machinemonitor.Cleaners;

import com.srm.machinemonitor.Services.LogDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Service
public class DatabaseCleaners {
    @Autowired
    LogDAO logDAO;

    @Scheduled(fixedRate = 1000)
    public void Cleaner(){
        logDAO.deleteDust();
    }
}
