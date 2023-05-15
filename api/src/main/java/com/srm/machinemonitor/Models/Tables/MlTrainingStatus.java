package com.srm.machinemonitor.Models.Tables;


import lombok.*;

import javax.persistence.*;
import java.math.BigInteger;
import java.time.LocalDateTime;

@Entity
@lombok.Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name="MlTrainingStatus")
public class MlTrainingStatus {

    @Id
    @Column(columnDefinition = "varchar(256)")
    @NonNull
    private String modelKey;

    @Column
    @NonNull
    private String status;

    @Column
    @NonNull
    private LocalDateTime startTime;
}
