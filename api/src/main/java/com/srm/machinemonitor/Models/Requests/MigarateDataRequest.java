package com.srm.machinemonitor.Models.Requests;

import com.srm.machinemonitor.Modes;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Enumerated;
import javax.validation.constraints.*;
import java.math.BigInteger;

@Getter
@Setter
public class MigarateDataRequest {

    @NotNull
    @NotEmpty
    @NotBlank
    String organization;

    @NotNull
    @Positive
    BigInteger machineId;

    @NotNull
    @Size(min=1)
    BigInteger[] ids;
}
