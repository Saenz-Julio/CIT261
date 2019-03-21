// Creates an empty array to take in values from local storage
var array = [];				
var associativeArray = [];	
var city = "Texas";

// Pulls JSON from openwathermap.org API via AJAX call
var weather = new XMLHttpRequest();
weather.open("GET", "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&APPID=311323dccd32343d1ef03de7a7f5777e", 'true');
weather.send();			
		
function calculate() {					
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
   	    
    // Calculates and displays water amounts
    var calcBase = Number(calcWater(item.age, item.wei, item.hei));
    var calcExtr = Number(calcExtra(associativeArray["tem"]) * calcBase);
    var calcTota = calcBase + calcExtr;
 	var calcComp = Number(calcCompare(calcBase, item.wat).toFixed(0));
 	var calcPerc;
 				 				    
    document.getElementById("calc").innerHTML = calcBase + " ounces (Recommended amount of water per day)";
    document.getElementById("temp").innerHTML = calcExtr + " ounces (Additional amount to drink based on the current temperature of " + associativeArray["tem"] + "&deg F in " + associativeArray["nam"] + ")";
    
    if (calcComp <= 0) {
    	document.getElementById("comp").innerHTML = calcComp * -1 + " ounces (Additional amount to drink based on " + wat + " ounces already consummed)";
    	calcPerc = (1 - (calcComp / calcTota * -1)) * 100;
    } else {
    	document.getElementById("comp").innerHTML = "0 ounces (Additional amount to drink based on " + wat + " ounces already consummed)";
    	calcPerc = 100;
    }
    
    // Element transform via triggered CSS
    // document.getElementById("recommendation").style.transform = "translate(100px)";         

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
function calcExtra(tem) {
	var temMultiplier;			 		
	
	switch (true) {
	case tem >= 100:
  		temMultiplier = .3;
		document.getElementById("temp").style.backgroundColor = "red";
    	break;
	case tem >= 90:
  		temMultiplier = .2;
		document.getElementById("temp").style.backgroundColor = "orange";
    	break;
  	case tem >= 80:
  		temMultiplier = .1;
  		document.getElementById("temp").style.backgroundColor = "yellow";
   		break;
  	case tem >= 1:				  		
  		temMultiplier = 0;				  		
   		break;
	}	
	return temMultiplier.toFixed(0);
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
	var list = document.getElementById("temp");
	while (list.hasChildNodes()){
		list.removeChild(list.firstChild);
	}
	var list = document.getElementById("comp");
	while (list.hasChildNodes()){
		list.removeChild(list.firstChild);
	}	
}	

// Element transition via triggered CSS
function transition() {			 			
	document.getElementById("recommendation").style.transition = "all 5s";
}

function onload() {
	document.getElementById("h1").style.color = "white";
	document.getElementById("h1").style.transition = "all 5s";
}