var appReader = {
	appName: 'br.com.maxgontijo.fingerprint_reader',
	port: null,
	start: function(request, sendResponse) {
		this.stop(() => {
			var p = browser.runtime.sendNativeMessage(this.appName, "start");
			p.then(
					(response)=>{
						try {
							var fingerprint64 = drawArray(_base64ToArrayBuffer(response), 8);
							sendResponse({ dedo: request.dedo, fingerprint: fingerprint64 });
						} catch (e) {
							appReader.sendResponseError(sendResponse, e);
						}
					},
					(error)=>{
						appReader.sendResponseError(sendResponse, error);
					}
			);
		});
	},
	stop: function(callback) {
		try {
			var p = browser.runtime.sendNativeMessage(appReader.appName, "stop");
			if (callback) {
				p.then(callback,callback);
			}
		} catch (e) {
			console.log(e);
			if (callback) {
				callback();
			}
		}
	},
	log: function(msg) {
		console.log(msg);
	},
	sendResponseError: function(sendResponse, msg) {
		this.log(msg);
		sendResponse({error: msg})
	}
};

function _base64ToArrayBuffer(base64) {
    var binary_string =  window.atob(base64);
    var len = binary_string.length;
    var bytes = [];
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
}

function drawArray(arr, depth) {
  var offset, height, width, data;

  function conv(size) {
    return String.fromCharCode(size&0xff, (size>>8)&0xff, (size>>16)&0xff, (size>>24)&0xff);
  }

  offset = depth <= 8 ? 54 + Math.pow(2, depth)*4 : 54;
  height = 480;
  width = 320;

  // BMP Header
  data  = 'BM';                          // ID field
  data += conv(offset + arr.length);     // BMP size
  data += conv(0);                       // unused
  data += conv(offset);                  // pixel data offset
  
  // DIB Header
  data += conv(40);                      // DIB header length
  data += conv(width);                   // image height
  data += conv(height);                  // image width
  data += String.fromCharCode(1, 0);     // colour panes
  data += String.fromCharCode(depth, 0); // bits per pixel
  data += conv(0);                       // compression method
  data += conv(arr.length);              // size of the raw data
  data += conv(1890);                    // horizontal print resolution
  data += conv(2835);                    // vertical print resolution
  data += conv(0);                       // colour palette, 0 == 2^n
  data += conv(0);                       // important colours
  
  // Grayscale tables for bit depths <= 8
  if (depth <= 8) {
    data += conv(0);
    
    for (var s = Math.floor(255/(Math.pow(2, depth)-1)), i = s; i < 256; i += s)  {
      data += conv(i + i*256 + i*65536);
    }
  }
  
  // Pixel data
  data += String.fromCharCode.apply(String, arr);

  return btoa(data);
}

function start_fingerprint_reader(request, sender, sendResponse) {
	try {
		appReader.start(request, sendResponse);
	} catch (e) {
		appReader.sendResponseError(sendResponse, e);
	}
	return true;
};

function stop_fingerprint_reader(request, sender, sendResponse) {
	appReader.stop();
	sendResponse({});
	return true;
};

browser.runtime.onMessage.addListener((msg, sender, sendResponse) => {
	if (msg.action == 'load_extension') {
		browser.tabs.executeScript(sender.tab.id, {
			file: '/content_scripts/js/fingerprint_reader.js'
		});
	} else if (msg.action == 'start_fingerprint_reader') {
		return start_fingerprint_reader(msg, sender, sendResponse);
	} else if (msg.action == 'stop_fingerprint_reader') {
		return stop_fingerprint_reader(msg, sender, sendResponse);
	} else {
		console.log('Invalid action: ', msg);
	}
});