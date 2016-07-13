
function main() {
	
}

function score_toggle() {
	var displaying_time = document.getElementById("minutes") != null;
	var time_button_checked = document.getElementById("time").checked == true;

	if (displaying_time && !time_button_checked) {
		// Switch to displaying the distance input

	} else if (!displaying_time && time_button_checked) {
		// Switch to displaying the time input

	}
	return false;
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
});
