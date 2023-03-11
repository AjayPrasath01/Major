package com.srm.machinemonitor;

public enum Modes {
    PROD(Constants.PROD),
    DEV(Constants.DEV);
    private final String currentMode;

    Modes(String mode){
        this.currentMode = mode;
    }

    public String getCurrentMode() {
        return currentMode;
    }
}
