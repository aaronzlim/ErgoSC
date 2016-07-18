/*
Name: split_calc.js

Author: Aaron Lim

Date: July 8, 2016

Description: Given a time and distance in meters, this
			 function gives the time/500m. Given a time
			 and split, this function gives the distance
			 traveled. Given a split and distance this
			 function gives the time interval it took to
			 cover that distance.
*/

// *** FUNCTIONS TO FORMAT DATA *** //

function seconds_to_time(time_in_sec) {
	var minutes = Math.floor(time_in_sec/60);
	var seconds = (time_in_sec - (60*minutes)).toFixed(3);
	return minutes + ":" + (seconds < 10 ? "0":"") + seconds;
}

function getSplit(time_in_sec, distance) {
	var div_factor = distance/500;
	return time_in_sec/div_factor;
}

function getDistance(split_in_sec, time_in_sec) {
	return (time_in_sec/split_in_sec)*500;
}

function getTime(split_in_sec, distance) {
	return (split_in_sec*distance)/500;
}

function weight_adjust(weight, score_type, score) {
	var norm = document.getElementById("norm8").checked ? 270:170;
	var wa_factor = Math.pow((weight / norm), 0.222);

	if(score_type == "time") {
		var wa_time_in_sec = wa_factor*Number(score);
		return wa_time_in_sec;
	} else if(score_type == "distance") {
		return (Number(score)/wa_factor).toFixed(3);
	}
}

function cellError() {
	document.getElementById("weight_adjusted").innerHTML = "";
	document.getElementById("output").innerHTML =  "ERROR: Empty or incorrect cells!";
	document.getElementById("output").style.color = "lightcoral";
	return event.preventDefault();
}

// *** FUNCTIONS TO HANDLE THE WINDOW INTERFACE *** //

function wa_toggle() {
	var r_on = document.getElementById("weight_adjust_button").checked;
	var weight_visible = document.getElementById("weight_cell").style.display;
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
	return false;
}

function reset_window() {
	var data = document.getElementsByName("data");
	for (i=0; i<data.length; i++) {
		if (data[i] != null) {
			data[i].value = "";
		}
	}
	document.getElementById("output").style.color = "slategrey";
	document.getElementById("output").innerHTML = "Results:";
	document.getElementById("weight_adjusted").innerHTML = "";
	return false;
}

function handle_keypress(e) {
	var key = e.which || e.keyCode;
	if (key === 13) {
		// Enter Key	
		return main();
	}
	return false;
}

// *** MAIN *** //

function main() {
	if (document.getElementById("output").style.color == "lightcoral") {
		document.getElementById("output").style.color = "slategrey";
	}
	
	// Collect user data
	
	var minute = document.getElementById("minutes").value;
	var seconds = document.getElementById("seconds").value;
	var distance = document.getElementById("distance").value;
	var split_minute = document.getElementById("split_minute").value;
	var split_second = document.getElementById("split_second").value;
	var wadj = document.getElementById("weight_adjust_button").checked;
	var weight = wadj ? document.getElementById("weight").value:"";
	var time_in_sec = (minute*60) + Number(seconds);
	var split_in_sec = (split_minute*60) + Number(split_second);

	// ERROR CHECKING //
	if(minute < 0 || seconds < 0 || seconds > 59.999) {cellError(); return event.preventDefault();}
	else if (distance < 0) {cellError(); return event.preventDefault();}
	else if (split_minute < 0 || split_second < 0 || split_second > 59.999) {
		cellError();
		return event.preventDefault();	
	} else if (wadj && !weight) {cellError(); return event.preventDefault();}
	else if (weight < 0) {cellError(); return event.preventDefault();}

	// Don't worry about weight adjustment.
	if (!wadj) {
		document.getElementById("weight_adjusted").innerHTML = "";
	}
	if(distance && (minute || seconds) && (!split_minute && !split_second)) {
	// Calculate split
		var calculated_split = getSplit(time_in_sec, distance);
		if(!wadj) {
			document.getElementById("output").innerHTML = "Split: " + seconds_to_time(calculated_split) + " /500m";
			document.getElementById("weight_adjusted").innerHTML = "";
		}
		else {
			var wa_split_in_sec = weight_adjust(weight, "time", calculated_split);
			var wa_time_in_sec = weight_adjust(weight, "time", time_in_sec);
			var wa_distance = weight_adjust(weight, "distance", distance);
			document.getElementById("output").innerHTML = "RAW Split: " + seconds_to_time(calculated_split);
			document.getElementById("weight_adjusted").innerHTML = "WA Split: " + 
														seconds_to_time(wa_split_in_sec) + " /500m" +
														"<br/><br/>WA Time: " +
														seconds_to_time(wa_time_in_sec) +
														"<br/><br/>WA Distance: " +
														wa_distance + "m";
		}
	} else if (!distance && (minute || seconds) && (split_minute || split_second))  {
		// Calculate distance
		var calculated_distance = getDistance(split_in_sec, time_in_sec);
		if(!wadj) {
			document.getElementById("output").innerHTML = "Distance: " + calculated_distance.toFixed(3) + "m";
			document.getElementById("weight_adjusted").innerHTML = "";
		} else {
			var wa_split_in_sec = weight_adjust(weight, "time", split_in_sec);
			var wa_time_in_sec = weight_adjust(weight, "time", time_in_sec);
			var wa_distance = weight_adjust(weight, "distance", calculated_distance);
			document.getElementById("output").innerHTML = "RAW Distance: " + calculated_distance.toFixed(3) + "m";
			document.getElementById("weight_adjusted").innerHTML = "WA Distance: " +
														wa_distance + "m" +
														"<br/><br/>WA Time: " +
														seconds_to_time(wa_time_in_sec) +
														"<br/><br/>WA Split: " +
														seconds_to_time(wa_split_in_sec) + " /500m";
		}
	} else if (distance && (!minute && !seconds) && (split_minute || split_second)) {
		// Calculate time
		var calculated_time = getTime(split_in_sec, distance);
		if (!wadj) {
			document.getElementById("output").innerHTML = "Time: " + seconds_to_time(calculated_time);
			document.getElementById("weight_adjusted").innerHTML = "";
		} else {
			var wa_split_in_sec = weight_adjust(weight, "time", split_in_sec);
			var wa_time_in_sec = weight_adjust(weight, "time", calculated_time);
			var wa_distance = weight_adjust(weight, "distance", distance);
			document.getElementById("output").innerHTML = "RAW Time: " + seconds_to_time(calculated_time);
			document.getElementById("weight_adjusted").innerHTML = "WA Time: " +
														seconds_to_time(wa_time_in_sec) +
														"<br/><br/>WA Distance: " +
														wa_distance + "m" +
														"<br/><br/>WA Split: " +
														seconds_to_time(wa_split_in_sec) + " /500m";
		}
	} else {
		// All three are empty or full -> throw an error
		cellError();
	}
	return event.preventDefault();
}

// INIT //

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
	
	document.getElementById("weight_adjust_button").addEventListener("click", function(e) {
		setTimeout(wa_toggle, 25);
	});

	document.getElementById("compare_button").addEventListener("click", function() {
		chrome.app.window.create('compare.html', {
			id: "compare",
			bounds: {width: 550, height: 400},
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
