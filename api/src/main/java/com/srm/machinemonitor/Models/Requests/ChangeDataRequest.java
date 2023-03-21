package com.srm.machinemonitor.Models.Requests;

import com.srm.machinemonitor.Modes;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Enumerated;
import javax.validation.constraints.*;
import java.math.BigInteger;
import java.time.LocalDateTime;

@Getter
@Setter
public class ChangeDataRequest {

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

    @NotNull
    @Size(min=1)
    String[] values;

    @NotNull
    @Enumerated
    Modes mode;
}
