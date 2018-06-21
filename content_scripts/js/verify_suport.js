function verify() {
	try {
		return document.head.querySelector("[property='mgo-fingerprint']").content == "true";
	} catch (e) {}
	return false;
}

if (verify()) {
	console.log("Loading Fingerprint Reader Web Extension loaded");
	
	var url = browser.extension.getURL("/web_accessible_resources/mgo-fingerprint-reader.js");
	var script = document.createElement('script');
	script.setAttribute('src', url);
	script.setAttribute('type', 'text/javascript');
	document.getElementsByTagName('head')[0].appendChild(script);
	
	browser.runtime.sendMessage({ action: 'load_extension' });
}
