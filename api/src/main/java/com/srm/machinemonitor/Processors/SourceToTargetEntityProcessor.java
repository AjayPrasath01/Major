package com.srm.machinemonitor.Processors;

import com.srm.machinemonitor.Models.Tables.Data;
import com.srm.machinemonitor.Models.Tables.DevData;
import com.srm.machinemonitor.Services.DataDAO;
import com.srm.machinemonitor.Utils;
import org.springframework.batch.item.ItemProcessor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

public class SourceToTargetEntityProcessor implements ItemProcessor<DevData, Data> {

    @Autowired
    DataDAO dataDAO;

    @Override
    public Data process(DevData sourceEntity) throws Exception {
        System.out.println("here job");
        System.out.println(sourceEntity);
        if(!dataDAO.existsByMachineIdAndDate(sourceEntity.getMachineId(), sourceEntity.getDate())){
            Data targetEntity = new Data();
            targetEntity.setData_type(sourceEntity.getData_type());
            targetEntity.setDate(sourceEntity.getDate());
            targetEntity.setMachineId(sourceEntity.getMachineId());
            targetEntity.setValue(sourceEntity.getValue());
            return targetEntity;
        }
        return null;
    }
}
