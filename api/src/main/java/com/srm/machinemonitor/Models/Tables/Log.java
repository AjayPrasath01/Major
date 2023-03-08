package com.srm.machinemonitor.Models.Tables;

import lombok.*;

import javax.persistence.*;
import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@lombok.Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Log {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "NUMERIC(38,0)")
    BigInteger id;

    @Column
    @NonNull
    String machineName;

    @Column(name="organizationId")
    BigInteger organizationId;

    @Column
    @NonNull
    String log;

    @Column
    @NonNull
    LocalDateTime time;
}
