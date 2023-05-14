from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django_q.tasks import async_task
from django.db import connection
import pandas as pd

# Create your views here.

def iniziate_training(request):
    if (request.method == "POST"):
        modelKey = str(request.GET.get("key"))
        machineIds = str(request.GET.get("machineIds"))
        machineName = str(request.GET.get("machineName"))
        machineAlgo = str(request.GET.get("machineAlgo"))
        organizationId = int(request.GET.get("organizationId"))
        trainDataSize = float(request.GET.get("trainDataSize"))
        mode = str(request.GET.get("mode"))

        datas = {}
        machineIds = machineIds.split(",")
        for machineId in machineIds:
            with connection.cursor() as cursor:
                cursor.execute("SELECT machineId, value FROM WrongData WHERE WrongData.machineId = %s ORDER BY WrongData.dateTime ASC", [machineId])
                rows = cursor.fetchall()
                datas[machineId] = [values[1] for values in rows]
                datas['label'] = [0 for _ in rows]
            with connection.cursor() as cursor:
                if mode == 'dev':
                    cursor.execute("SELECT count(*) FROM DevData WHERE DevData.machineId = %s", [machineId])
                    limit  = cursor.fetchone()
                    cursor.execute("SELECT machineId, value FROM DevData WHERE DevData.machineId = %s AND DevData.value NOT IN (SELECT value FROM WrongData WHERE WrongData.machineId = %s) ORDER BY DevData.date ASC  LIMIT %s", [machineId, machineId, limit[0]])
                else:
                    cursor.execute("SELECT count(*) FROM Data WHERE Data.machineId = %s", [machineId])
                    limit  = cursor.fetchone()
                    cursor.execute("SELECT machineId, value FROM Data WHERE Data.machineId = %s AND Data.value NOT IN (SELECT value FROM WrongData WHERE WrongData.machineId = %s) ORDER BY Data.date ASC LIMIT %s", [machineId, limit[0]])
                rows = cursor.fetchall()
                datas[machineId] += [values[1] for values in rows]
                datas['label'] += [1 for _ in rows]
        dataframe = pd.DataFrame(datas)
        value_counts = dataframe['label'].value_counts()
        try:
            num_zeros = value_counts[0]
        except KeyError:
            return HttpResponse("There is no wrong data when compared with correct data")
        try:
            num_ones = value_counts[1]
        except KeyError:
            return HttpResponse("There is no correct data when compared with wrong data")
        
        total = len(dataframe)
        pct_zeros = num_zeros / total * 100
        pct_ones = num_ones / total * 100

        if (pct_zeros < 20):
            return HttpResponse("Wrong data is too low")
        elif pct_ones < 20:
            return HttpResponse("Correct data is too low compared with given sample of wrong data")
        target_file = ""
        machineAlgo = machineAlgo.lower()
        if machineAlgo == 'randomforest':
            target_file = 'randomforest'
        elif machineAlgo == 'svm':
            target_file = 'svm'
        elif machineAlgo == 'knn':
            target_file = 'knn'
        else:
            return HttpResponse("machineAlgo not matched")
        try:
            async_task('learner.tasks.ml_' + target_file + '_training', modelKey, machineIds, machineName, organizationId, dataframe)
        except Exception as e:
            print(e)
        # Preprocess data
    else:
        return HttpResponse("Method not allowed")
    return HttpResponse("Data Preprocessing Completed")

def predict(request):
    return HttpResponse("Predected value will be sent")


