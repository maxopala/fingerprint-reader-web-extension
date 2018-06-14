var bt_start_reader = document.getElementById("btStart");
bt_start_reader.onclick = function() {
	try {
		var sending = browser.runtime.sendMessage({ action: 'start_fingerprint_reader', dedo: '1' });
		sending.then(
			function(message) {
				if (message.error) {
					console.log(message.error);
				} else {
					try {
						var fingerprint = document.getElementById('fingerprint');
						fingerprint.src = 'data:image;base64,' + message.fingerprint;
					} catch (e) {
						console.log(e);
					}
				}
			},
			function(error) {
				console.log(error);
			}
		);
	} catch (e) {
		console.log(e);
	}
	return false;
};

var bt_stop_reader = document.getElementById("btStop");
bt_stop_reader.onclick = function() {
	try {
		browser.runtime.sendMessage({ action: 'stop_fingerprint_reader' });
	} catch (e) {
		console.log(e);
	}
	return false;
};
