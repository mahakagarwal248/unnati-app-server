import sys
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import log_loss
import numpy as np
import pickle
import os.path
path = "d:/Unnati App/server/FeedbackSheet1.csv"
# print(os.path.dirname(path))

df=pd.read_csv(path)
df.Feedback=df.Feedback.map({'Satisfied':0,'Unsatisfied':1,'Poor':2,'Nice':3,'Amazing':4,'Not good':5,'Very Poor':6,'Fantastic':7,'Pleased':8,'Disappointed':9,'Bad':10,'Stunning':11,'Fine':12,'Terrible':13,'Annoying':14,'Grateful':15,'Glad':16,'Tremendous':17,'Remarkable':18,'Affordable':19})
df

X=df.iloc[:,:-1].values 
y=df.iloc[:,-1].values  
model=LogisticRegression()
model.fit(X,y)

# print(sys.argv)
Feedback=sys.argv[1]
if(Feedback=='Satisfied'): 
    Feedback=0
elif(Feedback=='Unsatisfied'):
    Feedback=1
elif(Feedback=='Poor'):
    Feedback=2
elif(Feedback=='Nice'):
    Feedback=3
elif(Feedback=='Amazing'):
    Feedback=4
elif(Feedback=='Not Good'):
    Feedback=5
elif(Feedback=='Very Poor'):
    Feedback=6
elif(Feedback=='Fantastic'):
    Feedback=7
elif(Feedback=='Pleased'):
    Feedback=8
elif(Feedback=='Disappointed'):
    Feedback=9
elif(Feedback=='Bad'):
    Feedback=10
elif(Feedback=='Stunning'):
    Feedback=11
elif(Feedback=='Fine'):
    Feedback=12
elif(Feedback=='Terrible'):
    Feedback=13
elif(Feedback=='Annoying'):
    Feedback=14
elif(Feedback=='Grateful'):
    Feedback=15
elif(Feedback=='Glad'):
    Feedback=16
elif(Feedback=='Tremendous'):
    Feedback=17
elif(Feedback=='Remarkable'):
    Feedback=18
elif(Feedback=='Affordable'):
    Feedback=19
else:
    print("Invalid Value")
print(model.predict([[Feedback]]))

# pickle.dump(model,open('model1.pkl','wb'))
# model=pickle.load(open('model1.pkl','rb'))

