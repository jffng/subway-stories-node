int zoomPin = A0;
int velocityPin = A1;

void setup(){
  Serial.begin(9600);
}

void loop(){
	Serial.print(analogRead(zoomPin));
	Serial.print(',');
	Serial.println(analogRead(velocityPin));
	delay(30);
}
