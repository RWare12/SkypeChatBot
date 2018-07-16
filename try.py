import re
import datetime

# Bagani (OT)«  on: October 19, 2016, 06:31:11 PM »

# month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

# testString = "Downey, Allen B (Version 1.6.6 - may 2012). Think Python: How to Think Like a Computer Scientist. ISBN 978-0-521-72596-5."
# regex = re.compile("\S+, \S+ \S \(Version \d+.\d+.\d+ - (?:Jan|Feb|mar|Apr|may|Jun|Jul|Aug|Sep|Oct|Nov|Dec) 20\d{2}\)\. [^.]*\. ISBN \d{3}-\d-\d{3}-\d{5}-\d\.")
# testString = ['Re: Alamat« Reply #1 on: October 2, 2016, 09:51:01 AM »','Re: Alamat« Reply #1 on: May 12, 2016, 09:51:01 AM »']
# regex = month[4] + " \d{1,2}, \d{4}"

# pattern = re.compile(regex)
# string = ''
# matches = pattern.finditer(testString[1])
# for match in matches:
#     string = match
    # print(match)

# a = 'a b c d e'
# a.split(" ")
# print(a[0])

# url = 'http://forums.abs-cbn.com/welasdsa!/introduce-yourselves!-(ot)/'

# urls = re.findall('https?://forums.abs-cbn.com+/(?:[-\w.!()]|(?:%[.]))+/(?:[-\w.!()]|(?:%[.]))+', url)

# if len(urls) is not 0:
#     print("in if urls")
#     print(urls)
# else:
#     print("false")

# print(len(urls))
# print(string.group())

# string = "5:59 pm"
# if 'pm' in string:
#     new = string
#     hour = new[:1]
#     tempTime = int(new[:1]) + 12
#     finalTime = new.replace(hour,str(tempTime),1)
#     print(new)
#     print(finalTime)
#     print(new[:1])


# start of trafficflow
###############################################################################
import os
import json
import trafficParser
import saveCsvFile

mmdaTrafficFiles = []
streetName = ['QUEZON AVE','ORTIGAS','ESPAA','C5','EDSA','SLEX','COMMONWEALTH','ROXAS BLVD','MARCOS HIGHWAY']
northOrSouth = ''

# getting files from the directory of .json
for files in os.listdir('./mmda-traffic-scrapped/out'):
    if files.endswith(".json"):
        mmdaTrafficFiles.append(files)

# getting direction whether north or south
while True:
    northOrSouth = input('n = northbound / s = southbound: ')
    if 'n' in northOrSouth:
        northOrSouth = 'northbound'
        break
    elif 's' in northOrSouth:
        northOrSouth = 'southbound'
        break
    else:
        print('Invalid Input')

for sName in range(len(streetName)):
    print(sName+1,'-'+streetName[sName])

# getting specific street
while True:
    try:
        streetChoice = int(input('Enter Road[1-9]: '))
        if(streetChoice > 9):
            print('Invalid Input')
        elif(streetChoice < 1):
            print('Invalid Input')
        else:
            break
    except:
        print('Invalid Input!')

tempAdd = []
# getting address
for count in range(len(mmdaTrafficFiles)):
    with open('./mmda-traffic-scrapped/out/'+mmdaTrafficFiles[count],"r") as f:
        if f.mode == "r":
            contents = f.read()
            if contents:
                tempStreet = streetName[streetChoice-1].replace(" AVE","").replace(" BLVD","").replace(" HIGHWAY","")
                tempAdd.append(trafficParser.getAddress(mmdaTrafficFiles[count],tempStreet))

# merging list of address
myListAddress = []
for x in range(len(tempAdd)):
    myListAddress = myListAddress + tempAdd[x]

# getting unique addresses
finalListAddress = list(set(myListAddress))

for x in range(len(finalListAddress)):
    print(x+1, '-',finalListAddress[x])

while True:
    try:
        roadChoice = int(input('Enter Street: '))
        if(roadChoice > len(finalListAddress)):
            print('Invalid Input')
            print(roadChoice)
        elif(roadChoice < 1):
            print('Invalid Input')
        else:
            break
    except:
        print('Invalid Input!')

csvHeader = ['5 Minutes','Lane 1 Flow (Veh/5 Minutes)','Lane Points','% Observed']
tempData = []
tempData.append(csvHeader)
tryString = '5 Minutes,Lane 1 Flow (Veh/5 Minutes),Lane Points,% Observed\n'
# to be process for parsing
for count in range(len(mmdaTrafficFiles)):
    with open('./mmda-traffic-scrapped/out/'+mmdaTrafficFiles[count],"r") as f:
        if f.mode == 'r':
            contents = f.read()
            if contents:
                tempData.append(trafficParser.parseFile(mmdaTrafficFiles[count],northOrSouth,finalListAddress[roadChoice-1]))
            else:
                print('json object is empty')

print(type(tempData))
print(tempData)
saveCsvFile.saveFile(tempData,northOrSouth,finalListAddress[roadChoice-1].replace(' ','_').replace('.','').lower())