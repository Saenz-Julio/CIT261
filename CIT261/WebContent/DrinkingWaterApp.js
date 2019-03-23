function onload() {
	// Element transition via triggered CSS
	document.getElementById("h2").style.color = "white";
	document.getElementById("h2").style.transition = "all 5s";
	// Hides elements before calculation
	document.getElementById("loading").style.display = "none";
	document.getElementById("recommendation").style.display = "none";
	document.getElementById("canvas").style.display = "none";
	document.getElementById("results").style.display = "none";
	document.getElementById("video").style.display = "none";
	document.getElementById("audio").style.display = "none";
}

// Pulls JSON from openwathermap.org API via AJAX call
var city = "Texas";
var weather = new XMLHttpRequest();
weather.open("GET", "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&APPID=311323dccd32343d1ef03de7a7f5777e", 'true');
weather.send();			
		
function calculate() {	
	var vloa = document.getElementById("loading");
	var vrec = document.getElementById("recommendation");
	var vcan = document.getElementById("canvas");
	var vres = document.getElementById("results");
	var vvid = document.getElementById("video");
	var vaud = document.getElementById("audio");
	if (vrec.style.display === "none") {
	    vrec.style.display = "block";
	    vcan.style.display = "block";
	    vres.style.display = "block";
	    vvid.style.display = "block";
	    vaud.style.display = "block";
	    vloa.style.display = "block";
	}	
	
	// Creates an empty array to take in values from local storage
	var array = [];				
	var associativeArray = [];	
	
	// Parses JSON code retrieved from openwathermap.org
	var res = weather.response;
	var obj = JSON.parse(res);
	var tem = obj.main.temp;
	var hum = obj.main.humidity;	
	var nam = obj.name;	
		
	// Sets value in local storage
	if (typeof(Storage) !== "undefined") {
		localStorage.setItem("localTem", tem);
		localStorage.setItem("localHum", hum);
		localStorage.setItem("localNam", nam);
	} else {
	  	document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
	}
	// Pushes local storage values to associative array.
    associativeArray["tem"] = localStorage.getItem("localTem");    
    associativeArray["hum"] = localStorage.getItem("localHum");  
    associativeArray["nam"] = localStorage.getItem("localNam");  	
	
	// Gets user entered values
	var age = document.getElementById('age').value;
	var wei = document.getElementById('wei').value;
	var hei = document.getElementById('hei').value;
	var wat = document.getElementById('wat').value;
	
	// Create an object from entered values
	var item = new calc(age, wei, hei, wat);
	
	// Creates new list element and appends values from array and object.
	var line = document.createElement("LI");
    var node = document.createTextNode(
    	// gets values from associative array
    	"Current Temperature: " + associativeArray["tem"] + "  " + 
    	"humidity = " + associativeArray["hum"] + ", " +
    	"city name = " + associativeArray["nam"] + ", " +
    	// gets values from object
    	"age = " + item.age + ", " +
    	"weight = " + item.wei + ", " +
    	"height = " + item.hei + ", " +
    	"water dranked = " + item.wat);
    line.appendChild(node);
    document.getElementById("history").appendChild(line);			    
   	
    // Transforms loading image
    rotateAnimation("loading", 20);   
   
    // Calculates and displays water amounts
    var calcBase = Number(calcWater(item.age, item.wei, item.hei));
    var calcExtr = Number(calcExtra(associativeArray["tem"]) * calcBase);
    var calcTota = parseInt(calcBase + calcExtr);
 	var calcComp = Number(calcCompare(calcTota, item.wat).toFixed(0));
 	var calcPerc;
 				 				    
 	document.getElementById("calc").innerHTML = calcBase;
 	document.getElementById("calc2").innerHTML = " ounces (Recommended water amount to drink per day)";
    document.getElementById("temp").innerHTML = calcExtr.toFixed(0);
    document.getElementById("temp2").innerHTML = " ounces (Additional water to drink based " + associativeArray["tem"] + "&deg F in " + associativeArray["nam"] + ")";
    
    if (calcComp <= 0) {
    	document.getElementById("comp").innerHTML = calcComp * -1;
    	document.getElementById("comp2").innerHTML = " ounces (Additional water amount to drink based on " + wat + " ounces already consummed)";
    	calcPerc = (1 - (calcComp / calcTota * -1)) * 100;
    } else {
    	document.getElementById("comp").innerHTML = "0";
    	document.getElementById("comp2").innerHTML = " ounces (Additional water amount to drink based on " + wat + " ounces already consummed)";
    	calcPerc = 100;
    }
    
    // Element animation via triggered CSS
    var elem = document.getElementById("animate");   
    var width = 0;
    var id = setInterval(frame, 20);
    function frame() {
      if (width >= calcPerc) {
        clearInterval(id);
      } else {
        width++; 
        elem.style.width = width - 1 + '%'; 
        elem.innerHTML = width * 1  + '%';
      }
    }  
    // Progress bar transition via triggered CSS
    document.getElementById("myCanvas").style.backgroundColor = "#ddd";
	document.getElementById("myCanvas").style.transition = "all 5s";
}

// calculates the amount of water that should be consumed per day
function calcWater(age, wei, hei) {
	var ageMultiplier;	
	var heiMultiplier;	
	var waterAmount;
 		
	switch (true) {
 	case age >= 55:
  		ageMultiplier = 30;
    	break;
  	case age >= 30:
  		ageMultiplier = 35;
   		break;
  	case age >= 1:
  		ageMultiplier = 40;
   		break;
	}	
  		
	switch (true) {
  	case hei >= 78:
  		heiMultiplier = 1.1;
    	break;
  	case hei >= 68:
  		heiMultiplier = 1.05;
   		break;
  	case hei >= 1:				  		
  		heiMultiplier = 1;
   		break;
	}	
 
	waterAmount = wei /2.2 * ageMultiplier / 28.3 * heiMultiplier;
	return waterAmount.toFixed(0);
}	
	
// calculates the amount of water that should be consumed per day
// sets background color for transition in onload() function
function calcExtra(tem) {
	var temMultiplier;			 		
	
	switch (true) {
	case tem >= 90:
  		temMultiplier = .3;
		document.getElementById("temp").style.backgroundColor = "red";		
		document.getElementById("temp2").style.backgroundColor = "red";
		document.getElementById("temp").style.transition = "all 7s";
		document.getElementById("temp2").style.transition = "all 7s";
    	break;
	case tem >= 83:
  		temMultiplier = .2;
		document.getElementById("temp").style.backgroundColor = "orange";		
		document.getElementById("temp2").style.backgroundColor = "orange";
		document.getElementById("temp").style.transition = "all 7s";
		document.getElementById("temp2").style.transition = "all 7s";
    	break;
  	case tem >= 75:
  		temMultiplier = .1;
  		document.getElementById("temp").style.backgroundColor = "yellow";
  		document.getElementById("temp2").style.backgroundColor = "yellow";
  		document.getElementById("temp").style.transition = "all 7s";
		document.getElementById("temp2").style.transition = "all 7s";
   		break;
  	case tem >= 1:				  		
  		temMultiplier = 0;				  		
   		break;
	}	
	return temMultiplier;
}	

// calculates the difference between the amount recommended vs. amount dranked
function calcCompare(calcTota, wat) {			 			
	return wat - calcTota;
}

// Create an object
function calc(age, wei, hei, wat) {
  	this.age = age;
  	this.wei = wei;
  	this.hei = hei;
  	this.wat = wat;
}

// Clears all nodes in paragraph elements
function reset() {
	var list = document.getElementById("calc");
	while (list.hasChildNodes()){
		list.removeChild(list.firstChild);
	}	
	var list = document.getElementById("calc2");
	while (list.hasChildNodes()){
		list.removeChild(list.firstChild);
	}	
	var list = document.getElementById("temp");
	while (list.hasChildNodes()){
		list.removeChild(list.firstChild);
	}
	var list = document.getElementById("temp2");
	while (list.hasChildNodes()){
		list.removeChild(list.firstChild);
	}
	var list = document.getElementById("comp");
	while (list.hasChildNodes()){
		list.removeChild(list.firstChild);
	}
	var list = document.getElementById("comp2");
	while (list.hasChildNodes()){
		list.removeChild(list.firstChild);
	}	
	var list = document.getElementById("history");
	while (list.hasChildNodes()){
		list.removeChild(list.firstChild);
	}
}	

//Anymates loading image by using transform to rotate it
var looper;
var degrees = 0;
function rotateAnimation(el, speed) {
	
	var elem = document.getElementById(el);
	elem.style.transform = "rotate("+degrees+"deg)";
	looper = setTimeout('rotateAnimation(\''+el+'\','+speed+')',speed);
	degrees++;
	if(degrees > 359){
		degrees = 1;
	}
}