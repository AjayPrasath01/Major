package com.srm.machinemonitor.Models.Tables;

import com.srm.machinemonitor.Models.Other.BaseData;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import java.math.BigInteger;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.TimeZone;

@Entity
@Getter
@Setter
public class Data extends BaseData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "BIGINT")
    private BigInteger id;

}
