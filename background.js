chrome.app.runtime.onLaunched.addListener(function() {
	chrome.app.window.create('window.html', {
		id: 'main',
		bounds: {width: 550, height: 400},
		resizable: false,
		frame: {
			type: "chrome",
			color: "#008080"
		}
	});
});
