/*
runs as soon as popup is opened by clicking on the pageAction icon
1) get tab URL
2) construct URL for JSON with source file info
3) parse JSON file
4) dynamically populate popup html with file info + buttons
*/
getActiveTab().then((tabs) => {
  var url = tabs[0].url;
  var urlParts = url.split("/");
  var mov_id = urlParts[urlParts.indexOf("videos")+1];
  var langCode = urlParts[urlParts.indexOf("videos")-1];
  var langDict = {
    "de" : "de_DE",
    "en" : "en_GB",
    "es" : "en_ES",
    "fr" : "fr_FR",
    "it" : "it_IT",
    "pl" : "pl_PL"
  };
  // Arrays for:
  var strArr = new Array(); // button labels: info strings
  var urlArr = new Array(); // download URLs, info for button click
  var divArr = new Array(); // div DOM elements
  var btn1Arr = new Array(); // link button DOM elements
  var btn2Arr = new Array(); // download button DOM elements
  // fetch and read json file
  var jsonUrl = "https://api.arte.tv/api/player/v1/config/"
              + langCode + "/"
              + mov_id
              + "?autostart=1&lifeCycle=1&amp;"
              + "lang=" + langDict[langCode]
              + "&amp;config=arte_tvguide";
  //console.log("jsonUrl: " + jsonUrl);
  window.fetch(jsonUrl).then(res => res.json()).then((json) => {
    // number of movie files
    var nElem = Object.keys(json.videoJsonPlayer["VSR"]).length;
    var loc = document.getElementById("buttons");
    var vid = json.videoJsonPlayer["VID"];
    for (var k in json.videoJsonPlayer["VSR"]) {
      var id = json.videoJsonPlayer["VSR"][k]["id"];
      var quality = json.videoJsonPlayer["VSR"][k]["quality"];
      var width = json.videoJsonPlayer["VSR"][k]["width"];
      var height = json.videoJsonPlayer["VSR"][k]["height"];
      var bitrate = json.videoJsonPlayer["VSR"][k]["bitrate"];
      var mediatype = json.videoJsonPlayer["VSR"][k]["mediaType"];
      var lang = json.videoJsonPlayer["VSR"][k]["versionLibelle"];
      var langSh = json.videoJsonPlayer["VSR"][k]["versionShortLibelle"];
      var url = json.videoJsonPlayer["VSR"][k]["url"];
      // store only mp4 formats
      if (mediatype == "mp4") {
        urlArr.push(url);
        var infoStr = "  Language: " + lang + " (" + langSh + ")"
                    + " | Quality: " + quality
                    + " | Size: " + width + " x " + height
                    + " | Bitrate: " + bitrate
                    + " | Format: " + mediatype;
        strArr.push(infoStr);
        divArr.push(document.createElement("div"));
        btn1Arr.push(document.createElement("BUTTON"));
        btn2Arr.push(document.createElement("BUTTON"));
      }
    }
    // create button array
    for (var k=0; k<nElem; k++) {
      var url_k = urlArr[k];
      divArr[k].setAttribute("id", k.toString());
      divArr[k].setAttribute("style", "display: inline-block;");
      divArr[k].setAttribute("style", "text-align: center;");
      divArr[k].setAttribute("style", "padding: 15;");
      divArr[k].setAttribute("style", "margin: 10;");
      loc.appendChild(divArr[k]);
      btn1Arr[k].innerHTML = "URL";
      btn2Arr[k].innerHTML = "&#9660;"; // "&#11015;"; // "&#8681;";
      btn1Arr[k].addEventListener("click", getBtnEvent1(urlArr[k]), false);
      btn2Arr[k].addEventListener("click", getBtnEvent2(urlArr[k],vid), false);
      divArr[k].appendChild(btn1Arr[k]);
      divArr[k].appendChild(btn2Arr[k]);
      let divText = document.createTextNode(strArr[k]);
      divArr[k].appendChild(divText);
    }
  }).catch(err => { console.log(err) });
});

function getActiveTab() {
  return browser.tabs.query({active: true, currentWindow: true});
}

// Button-1 click event: show notification with URL
function getBtnEvent1(url) {
    function f() {
      console.log("URL button clicked: " + url);
      browser.notifications.create({
        "type": "basic",
        "title": "Movie link:",
        "message": url
      });
    }
    return f;
}

/*
Button-2 click event: download URL
needs to run in background script: if performed here, download stops as soon as
popup loses focus
background script is informed via browser.runtime.sendMessage
*/
function getBtnEvent2(url,vid) {
    function f() {
      console.log("Download button clicked: " + url);
      browser.runtime.sendMessage({"url": url, "vid": vid});
    }
    return f;
}
