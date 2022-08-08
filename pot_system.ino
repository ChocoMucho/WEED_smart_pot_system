#include <Wire.h>//온도 측정 센서 사용을 위한 라이브러리
#include <OneWire.h>//온도 측정 센서 사용을 위한 라이브러리 -> sketch -> library maniging -> searching and install
#include <LiquidCrystal_I2C.h>//LCD 사용하기 위한 라이브러리
#include <DallasTemperature.h>//온도 측정 센서 사용을 위한 라이브러리 -> sketch -> library maniging -> searching and 

#define ONE_WIRE_BUS 2

LiquidCrystal_I2C lcd(0x27,20,4);//LCD 주소 값
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

int pad = 7;//열선패드 디지털 7번
int motor = 6;//워터펌프 디지털 6번
int motorState = 0;//펌프 상태 0은 정지 1은 작동

unsigned long previousTime = 0;
unsigned long pumpPreviousTime = 0;

void setup() {
  Serial.begin(9600);
  Serial.setTimeout(50);//readStringUntil 할 시에 지연 값 0.1초
  sensors.begin();
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0,0);
  lcd.print("~Pot On~");
  lcd.init();
  pinMode(pad, OUTPUT);//모스펫 7번 열선패드 설정
  pinMode(6, OUTPUT);
}

String potnumber = "202204130001";//화분 아이디
String a="empty";
String recep;
float tem = 50;//센서에서 받아 올 온도 값 (정수)
int humi = 50;//센서에서 받아 올 토양습도 값 (실수)
float setTem = 0;//DB에서 받아 올 설정 온도 값 (실수) 
int setHumi = 0;//DB에서 받아 올 설정 토양습도 값 (정수) 

String splitTest = "13:27";

void loop() {
  unsigned long currentTime = millis();//현재 밀리 세컨드
  humi=hum();
  tem=temp();
  if(currentTime>previousTime+5000)//5초가 지났다면
  {    
    previousTime = currentTime;//시간 값 현재 밀리세컨드로 리셋
    
    String sum = potnumber + ":" + String(tem) + ":" + String(humi);
    lcd.setCursor(0,2);
    lcd.print("SETTMP:");
    lcd.setCursor(7,2);
    lcd.print(setTem,2);

    lcd.setCursor(0,3);
    lcd.print("SETHUM:");
    lcd.setCursor(7,3);
    lcd.print(setHumi);
    Serial.println(sum);//DB에 보낼 프로토콜 문장      
  }
  
  if(Serial.available()>0){//시리얼값 수신 시
    String recep = Serial.readStringUntil(';');
    Split(recep, ":");
    
    //Split(recep,":");
  }
}

float temp(){// 기온 측정
    sensors.requestTemperatures(); // Send the command to get temperature readings 
    float val = sensors.getTempCByIndex(0);
    lcd.setCursor(0,0);
    lcd.print("TMP:");
    lcd.setCursor(4,0);
    lcd.print(val,1);
    if(val<setTem) // 상온 25도 기준
   {
      digitalWrite(pad,HIGH);//기준 온도 미만일 경우 열선 패드 작동
      lcd.setCursor(9,0);
      lcd.print("PADON ");
   }
   else
   {
     digitalWrite(pad,LOW);//기준 온도 초과일 경우 열선 패드 미작동
     lcd.setCursor(9,0);
      lcd.print("PADOFF");
   }
    return val;//온도 값 리턴
}

int hum(){//토양 습도 값에 따른 모터 조절
    int value = analogRead(A0);//토양습도 센서 값 받음
    int humPer = map(value, 270, 550, 100, 0);//260 520
    lcd.setCursor(4,1);
    lcd.print("   ");
    lcd.setCursor(0,1);
    lcd.print("HUM:");
    
    lcd.setCursor(4,1);
    lcd.print(humPer);

    unsigned long CurrentTime = millis();//현재 시간
    if(CurrentTime>pumpPreviousTime+5000)//5초가 지났을 경우
    {
        pumpPreviousTime = CurrentTime;
        if (setHumi > humPer)//측정 값이 세팅 값보다 낮을 경우
        {
          motorState = 1;//모터 켜짐 표시
          digitalWrite(6,HIGH);
          lcd.setCursor(9,1);
          lcd.print("MOT ON");
        }
        else
        {
          motorState = 0;//모터 꺼짐표시
          digitalWrite(6,LOW);
          lcd.setCursor(9,1);
          lcd.print("MOTOFF");
        }
    }
    if((motorState == 1)&&(CurrentTime>pumpPreviousTime+2000))//모터가 켜져있고 2초가 지났는가?
    {
      motorState = 0;//모터 꺼짐 표시
      digitalWrite(6,LOW);
    }
    
    return humPer;//습도 백분율 리턴
}



//문자열 잘라주는 함수
//"sData"에 전체 문자열, "cSeparator"에 구분자
void Split(String sData, String cSeparator) 
{  
  int nCount = 0;//작성자가 왜 넣은지 모르겠다.
  int nGetIndex = 0;//위치값 넣을 변수
  float ntemp = 0;//기온을 저장할 변수
  int nhum = 0;//습도를 저장할 변수
  
  //임시저장
  String sTemp = "";//자를 때마다 가져울 문자열

  //원본 복사
  String sCopy = sData;

  while(true)
  {
    //구분자 찾기
    nGetIndex = sCopy.indexOf(cSeparator);//내가 지정한 문자가 있는 위치값을 대입
    
    //리턴된 인덱스가 있나?
    if(-1 < nGetIndex)
    {
      //있다.
      //임시 변수에 빼낼 값을 잘라낸다.
      //설정 온도에 값을 넣는다.
      sTemp = sCopy.substring(0, nGetIndex);
      setTem = sTemp.toFloat();

      //뺀 데이터는 잘라낸다.
      sCopy = sCopy.substring(nGetIndex + 1);
    }
    else
    {
      //없으면 나머지 값을 가지고 마무리 한다.
      //설정 습도에 값을 넣는다.
      setHumi = sCopy.toInt();
      break;
    }

    //다음 문자로~
    nCount++;
  }

}
