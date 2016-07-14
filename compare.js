/*
 * Name: compare.js
 *
 * Description: This file handles the weight adjusted comparison function
 * 		in the Ergo Split Calculator
 *
 * Author: Aaron Lim
*/

// I split these into seperate functions in order to use the
// setTimeout() method to add a pause between fadIn and fadeOut
function switch_to_time() {
		document.getElementById("score1").innerHTML = '<label for="time1">Time 1: </label>' +
					'<input type="number" id="minutes" min="0" max="120" name="data" placeholder="min" align="left" />' +
					'<font size="4"> : </font>' +
					'<input type="number" id="seconds" min="0" max="59.99" name="data" placeholder="sec" align="left" />';

}

function switch_to_distance() {
		document.getElementById("score1").innerHTML = "<label for='distance1'>Distance 1 (meters): </label>" +
												"<input type='number' id='distance1' name='data' min='0'" +
												" placeholder='Dist' align='left' />";

}

function score_toggle() {
	var displaying_time = document.getElementById("minutes") != null;
	var time_button_checked = document.getElementById("time").checked == true;

	if (displaying_time && !time_button_checked) {
		// Switch to displaying the distance input
		$("#score1").fadeOut("fast");
		setTimeout(switch_to_distance, 150);
		$("#score1").fadeIn("fast");
	} else if (!displaying_time && time_button_checked) {
		// Switch to displaying the time input
		$("#score1").fadeOut("fast");
		setTimeout(switch_to_time, 150);
		$("#score1").fadeIn("fast");
	}
	return false;
}

function reset() {
	document.getElementById("weight1").value = "";
	if (document.getElementById("minutes") != null) {
		document.getElementById("minutes").value = "";
		document.getElementById("seconds").value = "";
	} else {
		document.getElementById("distance1").value = "";
	}
	document.getElementById("weight2").value = "";
	document.getElementById("results").innerHTML = "";
	document.getElementById("results").color = "slategrey";
}

function cellError() {
	document.getElementById("results").style.color = "lightcoral";
	document.getElementById("results").innerHTML = "ERROR:<br/>" +
					"Empty or incorrect cells.";
}

function compare_score(weight1, weight2, score, score_type) {
	var normalization = document.getElementById("norm8").checked ? 270:170;
	var wa_factor1 = Math.pow((weight1/normalization), 0.222);
	var wa_factor2 = Math.pow((weight2/normalization), 0.222);
	var score_to_beat = wa_factor1*score;

	var score_needed = 0
	if (score_type == "time") {
		while ((score_needed*wa_factor2) < score_to_beat) {
			score_needed += 0.001;
		}
	} else {
		while ((score_needed/wa_factor2) < score_to_beat) {
			score_needed += 0.001;
		}
	}
	return score_needed;
}

function compare() {
	// If returning from an error message, change color back to normal
	if (document.getElementById("results").style.color == "lightcoral") {
		document.getElementById("results").style.color = "slategrey";
	}

	displaying_time = document.getElementById("time").checked;
	weight1 = document.getElementById("weight1").value;
	weight2 = document.getElementById("weight2").value;

	// ERROR CHECKING //
	if (!weight1 || !weight2) {cellError(); return event.preventDefault();}
	else if (displaying_time) {
		if (!document.getElementById("minutes").value || !document.getElementById("seconds").value) {
			cellError();
			return event.preventDefault();
		} else if (!document.getElementById("distance1").value) {cellError(); return event.preventDefault();}
	}

	if (displaying_time) {
		// Comparing time or split
		minutes = Math.floor(document.getElementById("minutes").value);
		seconds = document.getElementById("seconds").value;
		time_in_sec = (60*minutes) + Number(seconds);
		score_to_beat = compare_score(weight1, weight2, time_in_sec, "time");
		new_minute = Math.floor(score_to_beat/60);
		new_second = (score_to_beat - (new_minute*60)).toFixed(3);
		score_str = new_minute.toString() + ":";
		if (new_second < 10) {
			score_str += "0";
		}
		score_str += new_second.toString();
		document.getElementById("results").innerHTML = "In order to beat Rower1 weight adjusted you must pull a raw score faster than:<br/><br/>" + score_str;
		
	} else {
		// Comparing distance
		distance = document.getElementById("distance1").value;
		score_to_beat = compare_score(weight1, weight2, distance, "distance").toFixed(3).toString();
		document.getElementById("results").innerHTML = "In order to beat Rower1 weight adjusted you must pull a raw score greater than:<br/><br/>" + score_to_beat;
	}

	return event.preventDefault();
}

// PROBLEM //
// KEEP REPLACING THE TIME CELL AND DISTANCE CELL
// WHICH CANCELS THE EVENT LISTENER
// NEED TO KEEP BOTH ON SCREEN AND JUST FADE THEM IN AND OUT

$(document).ready(function() {

	document.getElementById("time").addEventListener("click", score_toggle);
	document.getElementById("distance").addEventListener("click", score_toggle);
	document.getElementById("compare_button").addEventListener("click", compare);

	var data = document.getElementsByName("data");
	for(i=0; i<data.length; i++) {
		data[i].addEventListener("keypress", function(e) {
			var key = e.which || e.keyCode;
			if (key === 13) {
				return compare();
			} else {
				return false;
			}
		});
	}

	document.getElementById("reset_button").addEventListener("click", reset);

	document.getElementById("help_button").addEventListener("click", function() {
		document.getElementById("results").style.color = "slategrey";
		document.getElementById("results").innerHTML = "HELP:<br/>" + 
							"Give the weight and raw score of Rower1.<br/>" +
							"Then give the weight of Rower2.<br/>" +
							"This program will output the raw score needed for " +
							"Rower2 to beat Rower1 weight adjusted.";
	});
});
