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
@Table(name="MlModels")
public class MlModels {

    @Id
    @Column(columnDefinition = "varchar(256)")
    private String modelKey;

    @Column
    @NonNull
    private String name;

    @Lob
    @Column
    private byte[] model;

    @Column
    @NonNull
    private String mchineIds;

    @Column
    private Float accuracy;

    @Override
    public int hashCode() {
        return this.modelKey.hashCode();
    }
}
