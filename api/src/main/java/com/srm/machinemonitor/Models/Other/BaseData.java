package com.srm.machinemonitor.Models.Other;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.ToString;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import java.math.BigInteger;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@lombok.Data
@ToString
@MappedSuperclass
public class BaseData {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "NUMERIC(38,0)")
    private BigInteger id;

    @NonNull
    @Column
    public LocalDateTime date;

    @NonNull
    @Column
    public String data_type;

    @NonNull
    @NotEmpty
    @Column
    public String value;

    @NonNull
    @Column
    BigInteger machineId;
}
