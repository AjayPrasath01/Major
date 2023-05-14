from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.neighbors import KNeighborsClassifier
from sklearn import svm
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from django.db import connection
import pickle
import datetime


def ml_randomforest_training(model_key, machineIds, machineName, organizationId, dataframe):
    try:
        X_train, X_test, y_train, y_test = dataPrefrocessing(
            dataframe=dataframe)
        rfc = RandomForestClassifier()
        param_grid = {
            'n_estimators': [100, 500, 1000],
            'max_depth': [None, 10, 20],
            'min_samples_split': [2, 5, 10],
        }
        grid_search = GridSearchCV(rfc, param_grid, cv=5)
        grid_search.fit(X_train, y_train)
        best_model = grid_search.best_estimator_
        saveModel(best_model=best_model, X_test=X_test, y_test=y_test,
                  model_key=model_key, organization_id=organizationId)
        print('Traing done with randomforest')
    except Exception as e:
        print(e)


def ml_svm_training(model_key, machineIds, machineName, organizationId, dataframe):
    try:
        X_train, X_test, y_train, y_test = dataPrefrocessing(
            dataframe=dataframe)
        clf = svm.SVC(kernel='linear')
        clf.fit(X_train, y_train)
        
        saveModel(best_model=clf, X_test=X_test, y_test=y_test,
                  model_key=model_key, organization_id=organizationId)
        print('Traing done with svm')
    except Exception as e:
        print(e)

def ml_knn_training(model_key, machineIds, machineName, organizationId, dataframe):
    try:
        X_train, X_test, y_train, y_test = dataPrefrocessing(
            dataframe=dataframe)
        knn = KNeighborsClassifier(n_neighbors=3)
        knn.fit(X_train, y_train)
        
        saveModel(best_model=knn, X_test=X_test, y_test=y_test,
                  model_key=model_key, organization_id=organizationId)
        print('Traing done with knn')
    except Exception as e:
        print(e)

def ml_knn_training(model_key, machineIds, machineName, organizationId, dataframe):
    try:
        X_train, X_test, y_train, y_test = dataPrefrocessing(
            dataframe=dataframe)
        knn = KNeighborsClassifier(n_neighbors=3)
        knn.fit(X_train, y_train)
        
        saveModel(best_model=knn, X_test=X_test, y_test=y_test,
                  model_key=model_key, organization_id=organizationId)
        print('Traing done with knn')
    except Exception as e:
        print(e)


def dataPrefrocessing(dataframe):
    X = dataframe.drop(columns=["label"])
    Y = dataframe["label"]
    return train_test_split(X, Y, test_size=0.22, random_state=42)


def saveModel(best_model, model_key, X_test, y_test, organization_id):
    y_pred = best_model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    model_binary = pickle.dumps(best_model)

    with connection.cursor() as cursor:
        query = "UPDATE MlModels SET model = %s, accuracy = %s WHERE modelKey = %s"
        cursor.execute(query, (model_binary, accuracy, model_key))

        query = "SELECT Organizations.message FROM Organizations WHERE Organizations.id = %s"
        cursor.execute(query, (organization_id))
        row = cursor.fetchone()
        new_message = "Model is trained at " + str(datetime.datetime.now())
        if len(row[0]) > 0:
            new_message = row[0] + "," + new_message
        query = "UPDATE Organizations SET Organizations.message = %s WHERE Organizations.id = %s"
        cursor.execute(query, (new_message, organization_id))
