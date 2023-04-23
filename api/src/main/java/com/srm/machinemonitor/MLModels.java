package com.srm.machinemonitor;

public enum MLModels {
    RANDOMFOREST(Constants.RANDOMFOREST),
    SVM(Constants.SVM);

    private String model;


    MLModels(String model) {
        this.model = model.toUpperCase();
    }

    @Override
    public String toString() {
        return this.model;
    }
}
