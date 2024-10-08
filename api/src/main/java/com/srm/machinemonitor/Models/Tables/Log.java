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
@Table(name="Log", indexes = { @Index(name="log_idx_org", columnList = "organizationId"), @Index(name="log_idx_multi", columnList = "organizationId,machineName") })
public class Log {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "BIGINT")
    BigInteger id;

    @Column
    @NonNull
    String machineName;

    @Column(name="organizationId", columnDefinition = "BIGINT")
    BigInteger organizationId;

    @Column
    @NonNull
    String log;

    @Column
    @NonNull
    LocalDateTime time;
}
