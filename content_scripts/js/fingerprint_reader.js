function flipVerticalBase64(imageBase64, callback) {
    var canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    var img = new Image();
    img.width = 320;
    img.height = 480;
    img.src = 'data:image;base64,' + imageBase64;
    
    canvas.width  = img.width;
    canvas.height = img.height;
    
    ctx.translate(0,img.height);
    ctx.scale(1,-1);
    setTimeout(()=>{
	    ctx.drawImage(img,0,0);
	    var s = canvas.toDataURL();
	    callback(s.split(',')[1]);
    }, 200);
}

function fingerprintReaderStartListener(evtFrom) {
	try {
		const trigger = this;
		browser.runtime.sendMessage({ action: 'start_fingerprint_reader', dedo: 1 }).then(
			function(message) {
				if (message.error) {
					console.log(message.error);
				} else {
					console.log('message.fingerprint', message.fingerprint);
					flipVerticalBase64(message.fingerprint, (imageFlipped)=>{
						console.log('imageFlipped', imageFlipped);
						var imagSrc = imageFlipped;
						var evt = new CustomEvent('mgo-fingerprint-capture-event', { detail: imagSrc });
						trigger.dispatchEvent(evt);
					});
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

function fingerprintReaderStopListener(evt) {
	try {
		const trigger = this;
		var sending = browser.runtime.sendMessage({ action: 'stop_fingerprint_reader' });
		sending.then(
			function(message) {
				try {
					var evt = new CustomEvent('mgo-fingerprint-stop-event', { detail: '' });
					trigger.dispatchEvent(evt);
				} catch (e) {
					console.log(e);
				}
			},
			function(error) {
				try {
					var evt = new CustomEvent('mgo-fingerprint-stop-event', { detail: '' });
					trigger.dispatchEvent(evt);
				} catch (e) {
					console.log(e);
				}
			}
		);
	} catch (e) {
		console.log(e);
	}
}

function load_events_extension() {
	try {
		var trigger = document.createElement('mgo-fingerprint-load-triggers');
		trigger.addEventListener("click", (evt) => {
			var elements = document.getElementsByClassName('mgo-fingerprint-tg-start');
			for (var i = 0; i < elements.length; i++) {
				elements[i].removeEventListener("click", fingerprintReaderStartListener);
				elements[i].addEventListener("click", fingerprintReaderStartListener);
			}
			
			elements = document.getElementsByClassName('mgo-fingerprint-tg-stop');
			for (var i = 0; i < elements.length; i++) {
				elements[i].removeEventListener("click", fingerprintReaderStopListener);
				elements[i].addEventListener("click", fingerprintReaderStopListener);
			}
		});
		
		var evt = new CustomEvent('mgo-fingerprint-trigger-load', { detail: trigger });
		document.dispatchEvent(evt);
	} catch (e) {
		console.log(e);
	}
}

load_events_extension();

