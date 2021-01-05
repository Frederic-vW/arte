/*
- receive download messages from download buttons in popup
- needs to run in background script bc popup scripts terminate when popup
  loses focus (download would be canceled when popup window is closed)
*/
browser.runtime.onMessage.addListener(download);

// make filename from video id (vid) and current date & time
function urlToName(vid) {
  var date = new Date(); // Date.now()
  var tz = date.getTimezoneOffset() * 60000; // [msec]
  var now = (new Date(date-tz)).toISOString().split('.')[0].replace(/:/g,"-");
  var fname = vid + "_" + now + '.mp4';
  return fname
}

// perform download
function download(message) {
  console.log("Download URL received: " + message.url);
  var filename = urlToName(message.vid);
  browser.downloads.download({
    url : message.url,
    filename : filename,
    conflictAction : 'uniquify'
  });
}
