/*
Name: split_calc.js

Author: Aaron Lim

Date: July 8, 2016

Description: Given a time and distance in meters, this
			 function gives the time/500m.

Args:
	minute (number): minutes part of time (minute:second.decimal)
	second (number): seconds part of time (minute:second.decimal)
	distance (number): distance traveled in meters
	weight (number): users weight in lbs

Outputs:
	split (String): the split per 500m in the form minute:second.decimal\
	wa_split (String): the weight adjusted split, time, and distance
*/

function getSplit(time, distance) {
	var div_factor = distance/500;
	var split_in_sec = time/div_factor;
	var split_minute = Math.floor(split_in_sec/60);
	var split_second = (split_in_sec - (split_minute*60)).toFixed(3);

	var split_str = "Split: " + split_minute + ":";
	
	if(split_second < 10) {
		split_str = split_str + "0";
	}
	return split_str + split_second + " /500m";

}

function weight_adjust(weight, score_type, score) {
	var norm = document.getElementById("norm8").checked ? 270:170;
	var wa_factor = Math.pow((weight / norm), 0.222);

	if(score_type == "time") {
		var wa_time = wa_factor*Number(score);
		var wa_min = Math.floor(wa_time/60);
		var wa_sec = (wa_time - (wa_min*60)).toFixed(3);
		var wa_time_str = wa_min + ":";
		if(wa_sec < 10) { wa_time_str += "0"; }
		wa_time_str += wa_sec;
		document.getElementById("weight_adjusted").innerHTML = "WA Time: " + wa_time_str;
	} else if(score_type == "distance") {
		var wa_distance = (Number(score)/wa_factor).toFixed(3);
		document.getElementById("weight_adjusted").innerHTML = "WA Distance: " + String(wa_distance) + " m";
	} else if(score_type == "all") {
		var minutes = Number(document.getElementById("minutes").value);
		var seconds = Number(document.getElementById("seconds").value);
		var distance = Number(document.getElementById("distance").value);
		var time_in_sec = (minutes*60) + Number(seconds);
		
		var wa_time = wa_factor*time_in_sec;
		var wa_minute = Math.floor(wa_time/60);
		var wa_second = (wa_time - (wa_minute*60)).toFixed(3);
		var wa_time_str = wa_minute + ":";
		if(wa_second < 10) { wa_time_str += "0"; }
		wa_time_str += String(wa_second);
		var wa_distance = (distance/wa_factor).toFixed(3);

		document.getElementById("weight_adjusted").innerHTML = "WA " + getSplit(wa_time, wa_distance) + "<br/><br/>" +
															"WA Time: " + wa_time_str + "<br/><br/>" +
															"WA Distance: " + wa_distance + " m";
	}
}

function cellError() {
	document.getElementById("weight_adjusted").innerHTML = "";
	document.getElementById("split").innerHTML =  "ERROR: Empty or incorrect cells!";
	document.getElementById("split").style.color = "lightcoral";
}

function main() {
	if (document.getElementById("split").style.color == "lightcoral") {
		document.getElementById("split").style.color = "slategrey";
	}
	
	// Collect user data
	
	var minute = document.getElementById("minutes").value;
	var seconds = document.getElementById("seconds").value;
	var distance = document.getElementById("distance").value;
	var wadj = document.getElementById("weight_adjust_button").checked;
	var time_in_sec = (minute*60) + Number(seconds);
	var split_str;

	// ERROR CHECKING //
	if(minute < 0) {cellError(); return event.preventDefault();}
	else if (seconds < 0 || seconds > 59.999) {cellError(); return event.preventDefault();}
	else if (distance < 0) {cellError(); return event.preventDefault();}

	// Don't worry about weight adjustment.
	if (!wadj) {
		if(!distance) {cellError();}
		else {
			document.getElementById("split").innerHTML =  getSplit(time_in_sec, distance);
			document.getElementById("weight_adjusted").innerHTML = "";
		}
	} else {
		// Now we worry about weight adjustment.
		var weight = document.getElementById("weight").value;

		// Not given a weight -> error
		if(!weight) {cellError();}
		// All cells are empty -> error
		else if(!minute && !seconds && !distance){cellError();}
		// Given a time but no distance
		else if((minute || seconds) && !distance){
			document.getElementById("split").innerHTML = "";
			weight_adjust(weight, "time", time_in_sec);
		}
		// Given a distance but no time
		else if ((!minute || !seconds) && distance) {
			document.getElementById("split").innerHTML = "";
			weight_adjust(weight, "distance", distance);
		}
		// Given both a time and distance
		else if((minute || second) && distance) {
			document.getElementById("split").innerHTML = "Raw " + getSplit(time_in_sec, distance);
			weight_adjust(weight, "all", 0);
		}
		// Else...um...I don't know just throw an error
		else {
			cellError();
		}
	}

	return event.preventDefault();
}

function wa_toggle() {
	r_on = document.getElementById("weight_adjust_button").checked;
	weight_visible = document.getElementById("weight_cell").style.display;
	if (r_on && (weight_visible == 'none')) {
		document.getElementById("weight_adjust_button").checked = true;
		document.getElementById("weight").disabled = false;
		document.getElementById("norm8").disabled = false;
		document.getElementById("norm4").disabled = false;
		$("#weight_cell").fadeIn("fast");
		$("#normalization").fadeIn("fast");
	} else {
		document.getElementById("weight_adjust_button").checked = false;
		document.getElementById("weight").value = "";
		document.getElementById("weight").disabled = true;
		document.getElementById("norm8").disabled = true;
		document.getElementById("norm4").disabled = true;
		$("#weight_cell").fadeOut("fast");
		$("#normalization").fadeOut("fast");
	}
}

function reset_window() {
	if(document.getElementById("minutes").value != null) {
		document.getElementById("minutes").value = "";
	}
	if(document.getElementById("seconds").value != null) {
		document.getElementById("seconds").value = "";
	}
	if(document.getElementById("distance") != null) {
		document.getElementById("distance").value = "";
	}
	if (document.getElementById("weight_adjust_button").checked) {
		if(document.getElementById("weight").value != null) {
		document.getElementById("weight").value = "";
		}
	}
	document.getElementById("split").style.color = "slategrey";
	document.getElementById("split").innerHTML = "Split:";
	document.getElementById("weight_adjusted").innerHTML = "";
	return event.preventDefault();
}

function handle_keypress(e) {
	var key = e.which || e.keyCode;
	if (key === 13) {
		// Enter Key	
		return main();
	}
	return false;
}

// Once page has loaded listen for button events.
$(document).ready(function() {
	
	document.getElementById("weight_cell").style.display = 'none';

	document.getElementById("calc_button").addEventListener("click", function() {
		document.getElementById("calc_button").blur();
		return main();
	});
	document.getElementById("reset_button").addEventListener("click", function() {
		document.getElementById("reset_button").blur();
		return reset_window();
	});
	document.getElementById("weight_adjust_button").addEventListener("click", wa_toggle);

	document.getElementById("compare_button").addEventListener("click", function() {
		chrome.app.window.create('compare.html', {
			id: "compare",
			bounds: {width: 515, height: 400},
			resizable: false,
			frame: {
				type: "chrome",
				color: "#008080"
			}
		});
	});

	var data = document.getElementsByName("data");
	for(i=0; i < data.length; i++) {
		data[i].addEventListener("keypress", function(e) {
			return handle_keypress(e);
		});
	}
});
