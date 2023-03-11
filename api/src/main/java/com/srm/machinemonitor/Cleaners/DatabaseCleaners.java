package com.srm.machinemonitor.Cleaners;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.srm.machinemonitor.Services.LogDAO;

@Transactional
@Service
public class DatabaseCleaners {
    @Autowired
    LogDAO logDAO;

    @Scheduled(fixedRate = 600000)
    public void Cleaner(){
        logDAO.deleteDust();
    }
}
