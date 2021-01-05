// Event-1: pageAction is clicked
browser.pageAction.onClicked.addListener(() => {
  console.log("[1] Page action clicked!");
  // add Listener, will trigger download upon message from content script
  browser.runtime.onMessage.addListener(download);
  browser.tabs.query({
    currentWindow: true,
    active: true
  }).then(requestMovieUrl).catch(onError);
});

// Event-2: trigger content script to find and return mp4 URL
function requestMovieUrl(tabs) {
  console.log("[2] Request mp4 URL via content script");
  for (let tab of tabs) {
    //console.log("tab id: " + tab.id);
    browser.tabs.sendMessage(
      tab.id,
      {greeting: "Send movie URL, please!"}).then(response => {
        console.log("[4] Answer from content script: " + response.answer);
      }).catch(onError);
  }
}

function onError(error) {
  console.error(`Error: ${error}`);
}

/* Event-4: receive mp4 URL from content script and
   a) display URL as notification
   b) download file from URL
*/
function download(message) {
  console.log("[6] download URL received: " + message.url);
  browser.notifications.create({
    "type": "basic",
    "title": "Movie link:",
    "message": message.url
  });
  browser.downloads.download({
    url : message.url,
    filename : 'testdl.mp4',
    conflictAction : 'overwrite'
  });
}
