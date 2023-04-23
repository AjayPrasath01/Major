package com.srm.machinemonitor.Models.Tables;

import lombok.*;
import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import java.math.BigInteger;
import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table
public class WrongData {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "BIGINT")
    BigInteger id;

    @NonNull
    @Column(columnDefinition = "BIGINT")
    BigInteger machineId;

    @NonNull
    @NotEmpty
    @Column
    String value;

    @Column
    LocalDateTime dateTime;
}
