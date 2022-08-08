import serial		
import pymysql	
from datetime import datetime
	

port = serial.Serial("/dev/ttyACM0", "9600")

db = pymysql.connect(host="sungwon-project-test.c66wldgkg6f0.ap-northeast-2.rds.amazonaws.com", user="sungwon", password="sungwon185646", db="sungwon", charset='utf8')
curs = db.cursor()

print("DB connected")
#potId = "202204130001"
#result = 1
while True:
	
	try:
            data = port.readline()
            data = data.decode('utf-8')	
            data = data.split(':')
            
            if(len(data) == 3):
            	now = datetime.now()
            	now = now.strftime('%Y-%m-%d %H:%M:%S')
            	print(now)
            	
            	#potId = str(data[0])
            	potId = "202204130001"
            	temp = data[1]
            	hum = data[2]
            	
            	print(len(data))
            	print(potId)
            	print(temp) 
            	print(hum)  
            	
            	ins_sql = "INSERT INTO potStatus (temp, hum, potId, time) VALUES (%s, %s, %s, %s)"
            	curs.execute(ins_sql, (temp, hum, potId, now))
            	
            	db.commit()
            	
            	sel_sql = "SELECT * FROM pots WHERE id = %s"
            	curs.execute(sel_sql, potId)
            	result = curs.fetchone()
            	result = list(result)
            	print(result[3])
            	print(result[4])
            	result = str(result[3]) + ":" + str(result[4])
            	print(result)
            	port.write(result.encode())
            	
            	
            	
            else: #data length is short// for pass
            	print("so short or long");
            	
	except KeyboardInterrupt:
                break

                
port.close()
db.close()
