chrome.app.runtime.onLaunched.addListener(function() {
	chrome.app.window.create('window.html', {
		id: 'main',
		bounds: {width: 515, height: 400},
		resizable: false,
		frame: {
			type: "chrome",
			color: "#008080"
		}
	});
});
