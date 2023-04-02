package com.srm.machinemonitor.Models.Tables;

import com.srm.machinemonitor.Models.Other.BaseData;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import java.math.BigInteger;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(indexes = { @Index(name="data_idx_machineId", columnList = "machineId") })
public class DevData extends BaseData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "BIGINT")
    private BigInteger id;
}
