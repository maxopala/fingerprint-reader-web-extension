function mgoFingerprint() {
	if (!this.apiInstance) {
		this.apiInstance =
		{
			__updateOnReady: true,
			
			__tgUpdate: null,
			
			__registredListeners:
			{
				imageCaptured: [],
				stopReader: []
			},
			
			__registerListener: function(selector, listener, listenersList) {
				var reg = null;
				for (var i = 0;i < listenersList.length;i++) {
					if (selector == listenersList[i].selector) {
						reg = listenersList[i];
						break;
					}
				}
				if (reg == null) {
					reg = {
						selector: selector,
					};
					listenersList.push(reg);
				}
				reg.listener = listener;
			},
			
			updateOnReady: function(value) {
				if (value != null && value != undefined) {
					mgoFingerprint().__updateOnReady = value;
					return value;
				} else {
					return mgoFingerprint().__updateOnReady;
				}
			},
				
			registerImageCapturedTrigger: function(selector, listener) {
				mgoFingerprint().__registerListener(selector, listener, mgoFingerprint().__registredListeners.imageCaptured);
			},
			
			registerStopReaderTrigger: function(selector, listener) {
				mgoFingerprint().__registerListener(selector, listener, mgoFingerprint().__registredListeners.stopReader);
			},
			
			__addImageCapturedListener: function(selector, listener) {
				var triggers;
				if (selector[0] == '#') {
					triggers = [];
					var tg = document.getElementById(selector.substring(1));
					if (tg) {
						triggers.push(tg);
					}
				} else if (selector[0] == '.') {
					triggers = document.getElementsByClassName(selector.substring(1));
				} else {
					triggers = document.getElementsByTagName(selector.substring(1));
				}
				
				for (var i = 0;i < triggers.length;i++) {
					if (!triggers[i].classList.contains('mgo-fingerprint-tg-start')) {
						triggers[i].classList.add('mgo-fingerprint-tg-start');
					}
					if (listener) {
						triggers[i].removeEventListener('mgo-fingerprint-capture-event', listener);
						triggers[i].addEventListener('mgo-fingerprint-capture-event', listener);
					}
				}
			},
			
			__addStopReaderListener: function(selector, listener) {
				var triggers;
				if (selector[0] == '#') {
					triggers = [];
					var tg = document.getElementById(selector.substring(1));
					if (tg) {
						triggers.push(tg);
					}
				} else if (selector[0] == '.') {
					triggers = document.getElementsByClassName(selector.substring(1));
				} else {
					triggers = document.getElementsByTagName(selector.substring(1));
				}
				
				for (var i = 0;i < triggers.length;i++) {
					if (!triggers[i].classList.contains('mgo-fingerprint-tg-stop')) {
						triggers[i].classList.add('mgo-fingerprint-tg-stop');
					}
					if (listener) {
						triggers[i].removeEventListener('mgo-fingerprint-tg-stop', listener);
						triggers[i].addEventListener('mgo-fingerprint-tg-stop', listener);
					}
				}
			},
			
			updateTriggers: function() {
				for (var i = 0;i < mgoFingerprint().__registredListeners.imageCaptured.length;i++) {
					var reg = mgoFingerprint().__registredListeners.imageCaptured[i];
					mgoFingerprint().__addImageCapturedListener(reg.selector, reg.listener);
				}
				
				for (var i = 0;i < mgoFingerprint().__registredListeners.stopReader.length;i++) {
					var reg = mgoFingerprint().__registredListeners.stopReader[i];
					mgoFingerprint().__addStopReaderListener(reg.selector, reg.listener);
				}
				
				mgoFingerprint().__tgUpdate.click();
			}
		}
	}
	return this.apiInstance;
}

var evt = new CustomEvent('mgo-fingerprint-init', { detail: mgoFingerprint() });
document.dispatchEvent(evt);

document.addEventListener('mgo-fingerprint-trigger-load', (evt) => {
	mgoFingerprint().__tgUpdate = evt.detail;
	
	if (mgoFingerprint().updateOnReady()) {
		mgoFingerprint().updateTriggers();
	}
});
