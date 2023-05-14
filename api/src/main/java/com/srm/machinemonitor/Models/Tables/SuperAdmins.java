package com.srm.machinemonitor.Models.Tables;

import lombok.*;
import lombok.Data;

import javax.persistence.*;
import java.math.BigInteger;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@RequiredArgsConstructor
@Getter
@Setter
@Data
@Table(name="SuperAdmins", indexes = { @Index(name="superadmin_idx_usernamename", columnList = "username", unique = true) })
public class SuperAdmins {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "BIGINT")
    BigInteger id;

    @NonNull
    @Column(unique = true)
    String username;

    @NonNull
    @Column
    String password;
}
