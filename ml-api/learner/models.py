from django.db import models

# Create your models here.
class MlModels(models.Model):
    modelKey = models.CharField(max_length=256, primary_key=True)
    name = models.CharField(max_length=255)
    model = models.BinaryField()
    mchineIds = models.CharField(max_length=255)
    accuracy = models.FloatField(null=True)

    class Meta:
        db_table = "MlModels"

class MlTrainingStatus(models.Model):
    modelKey = models.CharField(max_length=256, primary_key=True)
    status = models.CharField(max_length=255)
    startTime = models.DateTimeField()

    class Meta:
        db_table = "MlTrainingStatus"