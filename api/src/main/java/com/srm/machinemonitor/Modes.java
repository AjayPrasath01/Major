package com.srm.machinemonitor;

import java.util.Objects;

public enum Modes {
    PROD(Constants.PROD),
    DEV(Constants.DEV);
    private final String currentMode;

    Modes(String mode){
        this.currentMode = mode;
    }

    public String toString() {
        return currentMode;
    }

    public boolean isEqualTo(String mode){
        return Objects.equals(this.currentMode, mode.toUpperCase());
    }
}
