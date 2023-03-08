package com.srm.machinemonitor.Models.Tables;

import com.srm.machinemonitor.Models.Other.BaseData;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.ToString;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import java.math.BigInteger;
import java.time.LocalDateTime;

@Entity
public class DevData extends BaseData {
}
