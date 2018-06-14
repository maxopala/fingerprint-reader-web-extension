function verify() {
	try {
		return document.head.querySelector("[property='br_com_maxopala-fingerprint_reader']").content == "true";
	} catch (e) {}
	
	return false;
}

if (verify()) {
	console.log("Loading Fingerprint Reader Web Extension loaded")
	browser.runtime.sendMessage({ action: 'load_extension' });
}
