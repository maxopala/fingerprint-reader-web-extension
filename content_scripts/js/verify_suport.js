function verify() {
	try {
		return document.head.querySelector("[property='mgo-fingerprint']").content == "true";
	} catch (e) {}
	
	return false;
}

if (verify()) {
	console.log("Loading Fingerprint Reader Web Extension loaded")
	browser.runtime.sendMessage({ action: 'load_extension' });
}
