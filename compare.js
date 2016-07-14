
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
}

function compare() {
	return preventDefault();
}

$(document).ready(function() {

	document.getElementById("time").addEventListener("click", score_toggle);
	document.getElementById("distance").addEventListener("click", score_toggle);

	var data = document.getElementsByName("data");
	for(i=0; i<data.length; i++) {
		data[i].addEventListener("keypress", function(e) {
			var key = e.which || e.keyCode;
			if (key === 13) {
				return main();
			} else {
				return false;
			}
		});
	}

	document.getElementById("reset_button").addEventListener("click", reset);

	document.getElementById("help_button").addEventListener("click", function() {
		document.getElementById("results").innerHTML = "HELP:<br/>" + 
													"Give the weight and raw score of Rower1.<br/>" +
													"Then give the weight of Rower2.<br/>" +
													"This program will output the raw score needed for " +
													"Rower2 to beat Rower1 weight adjusted.";
	});
});
