// ==UserScript==
// @name         arte-dl
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  download mp4 files from arte.tv
// @author       FvW
// @match        *://www.arte.tv/*/videos/*
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// ==/UserScript==

(function() {
    'use strict';
    var url = document.URL,
        urlParts = url.split("/"),
        vid = urlParts[urlParts.indexOf("videos")+1],
        langCode = urlParts[urlParts.indexOf("videos")-1],
        langDict = {
            "de" : "de_DE",
            "en" : "en_GB",
            "es" : "en_ES",
            "fr" : "fr_FR",
            "it" : "it_IT",
            "pl" : "pl_PL"
        },
        strArr = new Array(), // button labels: info strings
        urlArr = new Array(), // download URLs, info for button click
        divArr = new Array(), // div DOM elements
        btn1Arr = new Array(), // link button DOM elements
        btn2Arr = new Array(); // download button DOM elements
    // fetch and read json file
    var jsonUrl = "https://api.arte.tv/api/player/v1/config/"
                + langCode + "/"
                + vid
                + "?autostart=1&lifeCycle=1&amp;"
                + "lang=" + langDict[langCode]
                + "&amp;config=arte_tvguide";
    console.log("jsonUrl: " + jsonUrl);
    window.fetch(jsonUrl).then(res => res.json()).then((json) => {
        for (let k in json.videoJsonPlayer.VSR) {
            console.log("key: " + k);
            var id = json.videoJsonPlayer.VSR[k].id,
                quality = json.videoJsonPlayer.VSR[k].quality,
                width = json.videoJsonPlayer.VSR[k].width,
                height = json.videoJsonPlayer.VSR[k].height,
                bitrate = json.videoJsonPlayer.VSR[k].bitrate,
                mediatype = json.videoJsonPlayer.VSR[k].mediaType,
                lang = json.videoJsonPlayer.VSR[k].versionLibelle,
                langSh = json.videoJsonPlayer.VSR[k].versionShortLibelle,
                url = json.videoJsonPlayer.VSR[k].url;
            // store only mp4 formats
            if (mediatype == "mp4") {
                urlArr.push(url);
                var infoStr = langSh + ", size: " + width + " x " + height + ", rate: " + bitrate;
                strArr.push(infoStr);
                divArr.push(document.createElement("div"));
                btn1Arr.push(document.createElement("BUTTON"));
                btn2Arr.push(document.createElement("BUTTON"));
            }
        }
        // attach download info below video title
        var qStr = "#next_main > section:nth-child(1) > div > section.program-section.margin-bottom-s > h1 > span";
        /*
        // needed if element loads slowly, e.g. avp-content
        var checkExist = setInterval(function() {
            if ($(qStr).length) {
                console.log("DOM element to attach buttons appeared...");
                clearInterval(checkExist);
            }
        }, 100); // check every 100 ms
        */
        $(qStr).append('<div id="dl-buttons" style="font-size:medium"> arte-dl: </div>');
        var loc = document.getElementById("dl-buttons");
        //console.log("loc: " + loc);
        // number of movie files
        var nElem = strArr.length;
        for (let k=0; k<nElem; k++) {
            var url_k = urlArr[k];
            console.log("url_k: " + url_k);
            divArr[k].setAttribute("id", k.toString());
            divArr[k].setAttribute("style", "display: inline-block;");
            divArr[k].setAttribute("style", "text-align: center;");
            divArr[k].setAttribute("style", "padding: 15;");
            divArr[k].setAttribute("style", "margin: 10;");
            loc.appendChild(divArr[k]);
            btn1Arr[k].innerHTML = "&nbsp; URL &nbsp;";
            btn2Arr[k].innerHTML = "&nbsp; &#x25B6; &nbsp;";
            btn1Arr[k].style.color = "white";
            btn2Arr[k].style.color = "white";
            btn1Arr[k].addEventListener("click", getBtnEvent1(urlArr[k]), false);
            btn2Arr[k].addEventListener("click", getBtnEvent2(urlArr[k],vid), false);
            divArr[k].appendChild(btn1Arr[k]);
            divArr[k].appendChild(btn2Arr[k]);
            let divText = document.createTextNode(strArr[k]);
            divArr[k].appendChild(divText);
            divArr[k].style.color = "white";
        }
    }).catch(err => { console.log(err) });
})();

function getBtnEvent1(url) {
    function f() {
      console.log("URL button clicked: " + url);
      // we only want to notify the URL, most code handles Chrome Notification permissions
      if (!("Notification" in window)) {
          alert("This browser does not support desktop notification");
      }
      // ask user permission
      else if (Notification.permission === "granted") {
          //var notification = new Notification("URL: " + url);
          var notification = new Notification('Download link:', {
              body: url,
          });
      }
      // ... else, ask for permission
      else if (Notification.permission !== 'denied') {
          Notification.requestPermission(function (permission) {
              // store the information
              if(!('permission' in Notification)) {
                  Notification.permission = permission;
              }
              // create a notification
              if (permission === "granted") {
                  //var notification = new Notification("URL: " + url);
                  var notification = new Notification('Download link:', {
                      body: url,
                  });
              }
          });
      } else {
          alert(`Permission is ${Notification.permission}`);
      }
    }
    return f;
}

function getBtnEvent2(url,vid) {
    function f() {
        console.log("Download button clicked: " + url);
        var link = document.createElement("a");
        //link.setAttribute('download', '');
        link.setAttribute('target', '_blank');
        link.href = url;
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
    return f;
}
