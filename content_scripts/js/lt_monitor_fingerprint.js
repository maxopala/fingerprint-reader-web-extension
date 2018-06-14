function fingerprintReaderStartListener(evtFrom) {
	try {
		const div = this;
		browser.runtime.sendMessage({ action: 'start_fingerprint_reader', dedo: 1 }).then(
			function(message) {
				if (message.error) {
					console.log(message.error);
				} else {
					var evt = new CustomEvent('start_fingerprint_reader_callback_event', { detail: message.fingerprint });
					div.dispatchEvent(evt);
				}
			},
			function(error) {
				console.log(error);
			}
		);
	} catch (e) {
		console.log(e);
	}
}

function fingerprintReaderStopListener() {
	try {
		var sending = browser.runtime.sendMessage({ action: 'stop_fingerprint_reader' });
		sending.then(
			function(message) {
				try {
					var evt = document.createEvent('Event');
					evt.initEvent('fecharModalBiometriaEvent', true, false);
					document.dispatchEvent(evt);
				} catch (e) {
					console.log(e);
				}
			},
			function(error) {
				try {
					var evt = document.createEvent('Event');
					evt.initEvent('fecharModalBiometriaEvent', true, false);
					document.dispatchEvent(evt);
				} catch (e) {
					console.log(e);
				}
			}
		);
	} catch (e) {
		console.log(e);
	}
}

function adicionarEventos() {
	try {
		var elements = document.getElementsByClassName('br_com_maxopala-fingerprint_reader-trigger-start');
		for (var i = 0; i < elements.length; i++) {
			elements[i].removeEventListener("click", fingerprintReaderStartListener);
			elements[i].addEventListener("click", fingerprintReaderStartListener);
		}
		
		elements = document.getElementsByClassName('br_com_maxopala-fingerprint_reader-trigger-stop');
		for (var i = 0; i < elements.length; i++) {
			elements[i].removeEventListener("click", fingerprintReaderStopListener);
			elements[i].addEventListener("click", fingerprintReaderStopListener);
		}
	} catch (e) {
		console.log(e);
	}
}

adicionarEventos();
