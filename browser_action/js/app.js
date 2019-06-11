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
						
						flipVerticalBase64(message.fingerprint, (imageFlipped)=>{
							var imagSrc = 'data:image;base64,' + imageFlipped;
							fingerprint.src = imagSrc;
						});
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
