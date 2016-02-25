var forecastData;
var apiKey = 'b9f4ae9fdd26cc4a1c4efba766fc5686';

var dayArray = ["SUNDAY","MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
var dayIndex ;
var dayString ;
var img;
var mouseOverButton;
var hourlyButton;



function setup() {
  createCanvas(375, 667); 
  dayIndex = new Date(forecastData.currently.time).getDay();
  dayArray[dayIndex] = "TODAY";
  dayString = dayArray[dayIndex];
  img = loadImage("images/sky.jpg");
}


function draw() {    

  // var backgroundColour = map(forecastData.currently.time, 0, 60, 0, 255);
  // background(backgroundColour);
  background(255, 255, 242);

  push();
  fill(80);
  noStroke();
  textSize(20);
  textFont("Helvetica Neue")
  text (dayString, 30, 40)
  pop();




  var moonPhase = forecastData.daily.data[dayIndex].moonPhase;


//image not working :(
//need to map images to cloud cover 
  push(); 
  image(img, 0, 0);
  pop();


//button to turn text data on and off
  push();
  if(mouseX >=320 && mouseX<=360 && mouseY >=20 && mouseY <= 40){
    mouseOverButton = true;
    cursor(HAND);
    noStroke();
  fill(180);
    text("ON", 330, 35);
  }
  else{
    mouseOverButton = false;
     cursor(ARROW);
     noStroke();
     fill(180);
     text("OFF", 330, 35);
  }
  //rect(320, 20, 40, 20, 3);
  pop();


//moon
  push();
  noStroke();
  fill(201, 237, 255);
  ellipse(100, 150, 100, 100);
  pop();

//moon eclipse
  //moonPhase = 0;
  push();
  fill(255, 255, 242);
  noStroke();
  if (Math.abs(moonPhase-0.5) < 0.02) {
    moonPhase = 0.5;
  }
  if (moonPhase>0.5) {
    var moon = map(moonPhase, 0.5, 1, 200, 100);
  }
  else {
    var moon = map(moonPhase, 0, 0.5, 100, 0);
  }
  ellipse(moon, 150, 100, 100);
  pop();



//daily max. and min. temperature
push();
var dailyMaxTemp = map(forecastData.daily.data[dayIndex].temperatureMax, 0, 100, height , 0);
var dailyMinTemp = map(forecastData.daily.data[dayIndex].temperatureMin, 0, 100, height , 0);
stroke (83, 91, 95, 200);
fill(83, 91, 95, 200);
bezier(100, height-100, width/2, dailyMaxTemp, width/2, dailyMaxTemp, width-100, height-100);
var tempLine = bezierPoint(height-100,dailyMaxTemp,dailyMaxTemp,height-100,0.5)
pop();


//pressure curve
push();
var pressureMap = map(forecastData.daily.data[dayIndex].pressure, 0, 1500, height , height/2);
stroke(97, 247, 218, 200);
fill(97, 247, 218, 200);
bezier(20, height-100, width/4, pressureMap, width/4, pressureMap, width /2, height-100);
var pressureLine = bezierPoint(height-100,pressureMap,pressureMap,height-100,0.5)
pop();


//humidity curve
push();
var humidityMap = map(forecastData.daily.data[dayIndex].humidity, 0, 1, height , height/4);
stroke(54, 61, 60, 200);
fill(54, 61, 60, 200);
bezier(200, height-100, 300, humidityMap, 290, humidityMap, width, height-100);
var humidityLine = bezierPoint(height-100,humidityMap,humidityMap,height-100,0.5)
pop();


//hourly temp. data

 push();
  fill(220, 220, 220, 100);
  noStroke();
  beginShape();
  for(var idx = 0; idx < forecastData.hourly.data.length; idx++){
    var x = map(idx, 0, forecastData.hourly.data.length - 1, 0, width);
    var y = map(forecastData.hourly.data[idx].temperature, 0, 100, height, 0);
    vertex (x, y);
    vertex (0, height-100);
    vertex (width, height-100);
  }
  endShape();
  pop();


push();
if(mouseOverButton == true){

strokeWeight(0.5);
stroke(80);
line(10, pressureLine-2, width-10, pressureLine-2);
line(10, tempLine-2, width-10, tempLine-2);
line(10, humidityLine-2, width-10, humidityLine-2);

noStroke();
fill(80);
text("Max. Temp: " + forecastData.daily.data[dayIndex].temperatureMax + " F", 120, tempLine - 6);
text("Air Pressure: " + forecastData.daily.data[dayIndex].pressure + " MB", 30, pressureLine - 6);
//text("Humidity: " + forecastData.daily.data[dayIndex].humidity , 250, humidityLine - 6);

var humidString = forecastData.daily.data[dayIndex].humidity;

if (humidString <= 0.33){
  text("Humidity: LOW", 250, humidityLine - 6);
}
else if(humidString >= 0.33 && humidString <= 0.66){
  text("Humidity: MEDIUM", 250, humidityLine - 6);
}
else {
  text("Humidity: HIGH", 250, humidityLine - 6);
}

text("Moonphase", 69, 220);
}
pop();


//button to turn hourly data on and off
push();
  if(mouseX < width/2 && mouseY > height/2){
    hourlyButton = true;
    cursor(HAND);
  }
  else{
    hourlyButton = false;
  }
pop();

push();
if(hourlyButton == true){
for(var y = height - 100; y > 280; y-= 20){
  strokeWeight(0.5);
  line(10, y, 20, y);
}
for(var x = 20; x < width; x+=15.63){
  strokeWeight(0.5);
  line(x, height-98, x, height-88);
}

}
pop();



}

function mousePressed(){
 mouseOverButton;
}


function mouseClicked(){


dayIndex++;
if (dayIndex >= 7) {
  dayIndex = 0;
}
dayString = dayArray[dayIndex];

}


//-- ignore --//

function preload() {
  if (apiKey) {
    var url = 'https://api.forecast.io/forecast/'
            + apiKey + '/42.358429,-71.059769';
    loadJSON(url, loadCallback, 'jsonp');
  }
  else {
    loadJSON('cachedForecastForBoston.json', loadCallback);
  }
}

function loadCallback(data) {
  forecastData = data;
  
  // Reformat current date
  if (forecastData.currently) {
    forecastData.currently.time =
      formatTime(forecastData.currently.time);
  }
  
  // Reformat minute date
  if (forecastData.minutely && forecastData.minutely.data) {
    for (minuteIdx = 0; minuteIdx < forecastData.minutely.data.length; minuteIdx++) {
      forecastData.minutely.data[minuteIdx].time = 
        formatTime(forecastData.minutely.data[minuteIdx].time);
    }
  }
  
  // Reformat hourly date
  if (forecastData.hourly && forecastData.hourly.data) {
    for (hourIdx = 0; hourIdx < forecastData.hourly.data.length; hourIdx++) {
      forecastData.hourly.data[hourIdx].time = 
        formatTime(forecastData.hourly.data[hourIdx].time);
    }
  }
  
  // Reformat daily date
  if (forecastData.daily && forecastData.daily.data) {
    var dailyData = forecastData.daily.data
    for (dayIdx = 0; dayIdx < dailyData.length; dayIdx++) {
      dailyData[dayIdx].time = 
        formatTime(dailyData[dayIdx].time);
      
      // sunrise
      if (dailyData[dayIdx].sunriseTime) {
        dailyData[dayIdx].sunriseTime =
          formatTime(dailyData[dayIdx].sunriseTime);
      }
      
      // sunset
      if (dailyData[dayIdx].sunsetTime) {
        dailyData[dayIdx].sunsetTime =
          formatTime(dailyData[dayIdx].sunsetTime);
      }
      
      // max precipitation time
      if (dailyData[dayIdx].precipIntensityMaxTime) {
        dailyData[dayIdx].precipIntensityMaxTime = 
        formatTime(dailyData[dayIdx].precipIntensityMaxTime);
      }
      
      // min temp time
      if (dailyData[dayIdx].temperatureMinTime) {
        dailyData[dayIdx].temperatureMinTime = 
        formatTime(dailyData[dayIdx].temperatureMinTime);
      }
      
      // max temp time
      if (dailyData[dayIdx].temperatureMaxTime) {
        dailyData[dayIdx].temperatureMaxTime = 
        formatTime(dailyData[dayIdx].temperatureMaxTime);
      }
      
      // apparent min temp time
      if (dailyData[dayIdx].apparentTemperatureMinTime) {
        dailyData[dayIdx].apparentTemperatureMinTime = 
        formatTime(dailyData[dayIdx].apparentTemperatureMinTime);
      }
      
      // apparent max temp time
      if (dailyData[dayIdx].apparentTemperatureMaxTime) {
        dailyData[dayIdx].apparentTemperatureMaxTime = 
        formatTime(dailyData[dayIdx].apparentTemperatureMaxTime);
      }
    }
  }
  
  // Reformat alerts date
  if (forecastData.alerts) {
    for (alertIdx = 0; alertIdx < forecastData.alerts.length; alertIdx++) {
      forecastData.alerts[alertIdx].time = 
        formatTime(forecastData.alerts[alertIdx].time);
    }
  }
  
  // Convenience method for formatting time
  function formatTime(timeField) {
      var d = new Date();
      d.setTime(timeField*1000);
      return d;
  }
}