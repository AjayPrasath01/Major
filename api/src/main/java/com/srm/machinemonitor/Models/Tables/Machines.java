package com.srm.machinemonitor.Models.Tables;

import lombok.*;

import javax.persistence.*;
import java.math.BigInteger;
import java.util.List;

@Entity
@lombok.Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(indexes = { @Index(name="machines_idx_org", columnList = "organizationId"), @Index(name="machines_idx_multi1", columnList = "organizationId,machineName"), @Index(name="machines_idx_multi2", columnList = "organizationId,machineName,sensors") })
public class Machines {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "BIGINT")
    private BigInteger id;

    @Column
    @NonNull
    private String machineName;

    @Column
    @NonNull
    private String secert;

    @Column
    @NonNull
    private String sensors;

    @Column(name="organizationId", columnDefinition = "BIGINT")
    @NonNull
    private BigInteger organizationId;

    @Column
    @NonNull
    String mode = "dev";

    @OneToMany(targetEntity = Data.class, cascade = CascadeType.ALL)
    @JoinColumn(name="machineId", referencedColumnName = "id")
    List<Data> data;

    @OneToMany(targetEntity = WrongData.class, cascade = CascadeType.ALL)
    @JoinColumn(name="machineId", referencedColumnName = "id")
    List<WrongData> wrongData;

}
