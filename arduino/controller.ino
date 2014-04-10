int sensorPin = A0;

void setup(){
  Serial.begin(9600);
}

void loop(){
  Serial.println(analogRead(sensorPin));
  delay(30);
}