# Fingerprint Reader Web Extension
A Web Extension to integrate web applications with fingerprint readers.

Currently, only the folowing readers are supported:

 - Futronic FS88
 - Futronic FS88H

---

## 1. How to install the extension
For install the extension, it's necessary install the [web extension](https://addons.mozilla.org/en-US/firefox/addon/fingerprint-reader/) on browser and install the native component on computer.

### 1.1. Installing the web extension
Just access the [web extension page](https://addons.mozilla.org/en-US/firefox/addon/fingerprint-reader/) and install it!

### 1.1.1. Building the web extension
If You preffer, You can checkout the project and build yourself using the following command from the root repository directory:

```
web-ext build --ignore-files "build.sh" "build/*" "demo/*" -o -a "build"
```
After that, You can install the generated zip file on your browser.

### 1.2. Insalling the native component
Because the fingerprint reader needs native drivers, it's necessary access native resources on computer. Because of security reasons, web extensions can't access native resources directly. However, it's possible to do this by web extensions native connections. So, it's necessary install the native componet.

Currently, its avaible only Linux amd64 native version.
If it's your case, download and install the last version of the **DEB package** or the **RPM package** from this [link](https://github.com/maxopala/fingerprint-reader-web-extension/releases).

## 2. How developers can use the extension on web applications
Since web applications can't access web extensions directly, it's necessary add some lines on your page. But it's easy! Actually, it's need just three steps! The full demo can be viewed [here](https://github.com/maxopala/fingerprint-reader-web-extension/blob/master/demo/fingerprint-reader-demo.html).

### 2.1. Step 1 - First, add in `head` the following `meta` information:
```
<head>
   ...
   <meta property="mgo-fingerprint" content="true" />
   ...
</head>
```
That meta information says to the web extension that page must be inspected for trigger components.
### 2.2. Step 2 - Trigger components must be marked by trigger classes
After web extension found the `mgo-fingerprint` meta information, it starts search by trigger components. The trigger components are html components for invoke reader actions.

The actions are described as follow:

#### 2.2.1. Start fingerprint reader
This action is for commands the fingerprint to read. The css class for anchor some html component to perform the action is `mgo-fingerprint-tg-start`. See the example:

```
<button id="bt-start" type="button" class="mgo-fingerprint-tg-start">Start</button>
```
The example shows a button with the class `mgo-fingerprint-tg-start`, but could be any other html element with click event suport.

#### 2.2.2. Stop fingerprint reader
If necessary, the developer can anchor another html element to stop the fingerprint reader. The css class of this is `mgo-fingerprint-tg-stop`. See the example:

```
<button id="bt-stop"  type="button" class="btn mgo-fingerprint-tg-stop">Stop</button>
```
### 2.3. Step 3 - Add callback listener events
After the action was performed, the web extension dispatch an event to source trigger. That event can be captured. In the fingerprint capture case, that even should be captured. So, add the listener with name `mgo-fingerprint-capture-event` to the start trigger component and the `mgo-fingerprint-stop-event` to the stop trigger component.

```
var btn_start = document.getElementById('bt-start');
btn_start.addEventListener('mgo-fingerprint-capture-event', (evt) => {
   console.log('Fingerprint base64', evt.detail)
   // Do something else
});
```
The `mgo-fingerprint-capture-event` listener's argument has the fingerprint as an encoded in base64 string. That fingerprint can be used as the developer wish. For instance, the captured fingerprint can be showed as an HTML image, like this:
```
var img = document.getElementById('fingerprint-image');
img.src = 'data:image;base64,' + evt.detail;
```

The `mgo-fingerprint-stop-event` listener can be captured as the same.
```
var btn_stop = document.getElementById('bt-stop');
btn_stop.addEventListener('mgo-fingerprint-stop-event', (evt) => {
   console.log('Fingerprint reader was stoped')
   // Do something else
});
```

If the developer doesn't want do nothing after stop the reader, the `mgo-fingerprint-stop-event` listener don't need be implemented.

### Icon credits
App icon made by [Freepik](http://www.freepik.com) from [www.flaticon.com](http://www.flaticon.com) is licensed by [CC 3.0 BY](http://creativecommons.org/licenses/by/3.0/)
