from django.shortcuts import render
from django.http import JsonResponse, HttpResponse, HttpResponseBadRequest
from django_q.tasks import async_task
from django.db import connection
import pandas as pd
import pickle
import datetime
from urllib.parse import unquote
# Create your views here.

memo = {}


def iniziate_training(request):
    if (request.method == "POST"):
        modelKey = unquote(str(request.GET.get("key")))
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
                cursor.execute(
                    "SELECT machineId, value FROM WrongData WHERE WrongData.machineId = %s ORDER BY WrongData.dateTime ASC", [machineId])
                rows = cursor.fetchall()
                datas[machineId] = [values[1] for values in rows]
                datas['label'] = [0 for _ in rows]
            with connection.cursor() as cursor:
                if mode == 'dev':
                    cursor.execute(
                        "SELECT count(*) FROM DevData WHERE DevData.machineId = %s", [machineId])
                    limit = cursor.fetchone()
                    cursor.execute("SELECT machineId, value FROM DevData WHERE DevData.machineId = %s AND DevData.value NOT IN (SELECT value FROM WrongData WHERE WrongData.machineId = %s) ORDER BY DevData.date ASC  LIMIT %s", [
                                   machineId, machineId, limit[0]])
                else:
                    cursor.execute(
                        "SELECT count(*) FROM Data WHERE Data.machineId = %s", [machineId])
                    limit = cursor.fetchone()
                    cursor.execute("SELECT machineId, value FROM Data WHERE Data.machineId = %s AND Data.value NOT IN (SELECT value FROM WrongData WHERE WrongData.machineId = %s) ORDER BY Data.date ASC LIMIT %s", [
                                   machineId, limit[0]])
                rows = cursor.fetchall()
                datas[machineId] += [values[1] for values in rows]
                datas['label'] += [1 for _ in rows]
        dataframe = pd.DataFrame(datas)
        value_counts = dataframe['label'].value_counts()
        try:
            num_zeros = value_counts[0]
        except KeyError:
            return HttpResponseBadRequest("There is no wrong data when compared with correct data")
        try:
            num_ones = value_counts[1]
        except KeyError:
            return HttpResponseBadRequest("There is no correct data when compared with wrong data")

        total = len(dataframe)
        pct_zeros = num_zeros / total * 100
        pct_ones = num_ones / total * 100

        if (pct_zeros < 10):
            return HttpResponseBadRequest("Wrong data is too low")
        elif pct_ones < 10:
            return HttpResponseBadRequest("Correct data is too low compared with given sample of wrong data")
        target_file = ""
        machineAlgo = machineAlgo.lower()
        if machineAlgo == 'randomforest' or machineAlgo == "teatop":
            target_file = 'randomforest'
        elif machineAlgo == 'svm':
            target_file = 'svm'
        elif machineAlgo == 'knn':
            target_file = 'knn'
        else:
            return HttpResponseBadRequest("machineAlgo not matched")
        try:
            async_task('learner.tasks.ml_' + target_file + '_training',
                       modelKey, machineIds, machineName, organizationId, dataframe)
        except Exception as e:
            print(e)
        # Preprocess data
    else:
        return HttpResponse("Method not allowed")
    return HttpResponse("Data Preprocessing Completed")


def predict(request):
    if (request.method == "GET"):
        modelKey = unquote(request.GET.get('modelKey'))
        mode = request.GET.get('mode')
        machineIds = request.GET.getlist('machineIds')
        with connection.cursor() as cursor:
            if modelKey not in memo:
                cursor.execute(
                    "SELECT model FROM MlModels WHERE modelKey = %s", [modelKey])
                model_pickle = cursor.fetchone()[0]
                model = pickle.loads(model_pickle)
                memo[modelKey] = {"model": model,
                                  "lastUsed": datetime.datetime.now()}
            if (mode == 'dev'):
                cursor.execute(
                    "SELECT value FROM DevData where machineId in %s order by date desc limit 1", [machineIds])
            else:
                cursor.execute(
                    "SELECT value FROM Data where machineId in %s order by date desc limit 1", [machineIds])
            value  = cursor.fetchone()
            if value is None:
                return HttpResponseBadRequest("No data found")
            value = value[0]
        predited = memo[modelKey]["model"].predict([[value]])
        memo[modelKey]["lastUsed"] = datetime.datetime.now()
        async_task('learner.views.remove_unused_models', memo)
        return HttpResponse(predited[0])
    return HttpResponseBadRequest("Method not allowed")


def remove_unused_models(memo):
    current_time = datetime.datetime.now()
    keys_to_remove = []

    for key, value in memo.items():
        last_used = value['lastUsed']
        time_difference = current_time - last_used

        if time_difference.total_seconds() > 600:  # 10 minutes = 600 seconds
            keys_to_remove.append(key)
    print(f"Removing models {keys_to_remove}")
    for key in keys_to_remove:
        del memo[key]

    return memo
