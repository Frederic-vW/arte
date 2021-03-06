## arte - easy download
If you can't access [arte TV](https://www.arte.tv/) at your current location, this repo may help. It contains three *independent* tools:  
- a Python-3 command line script
- a Firefox extension
- a Chromium/Chrome script (Tampermonkey)

The simple idea is that, although the URL you are browsing, for instance

<pre>
https://www.arte.tv/de/videos/<b>034047-000-A</b>/maradona-der-goldjunge/
</pre>

may not offer you a webplayer in your country, the substring 034047-000-A (a parameter called VID), is sufficient to construct the URL of the JSON file

<pre>
https://api.arte.tv/api/player/v1/config/de/<b>034047-000-A</b>?autostart=1&lifeCycle=1&amp;lang=de_DE&amp;config=arte_tvguide
</pre>

that contains the URLs of all the media (.mp4) files.  
The design principle is minimal. If you hit an unavailable site while browsing, or want to download a video for later use, these tools should give you access with a terminal one-liner (Python) or a single browser click (Firefox extension).


### Python
Run the Python script from the command line with the movie URL as its only argument:

```shell
python3 arte_dl.py https://www.arte.tv/de/videos/034047-000-A/maradona-der-goldjunge/
```

<details><summary>Command line-1</summary>
<p align="center">
<img width="900" height="41" src="img/arte_dl_1.png">
</p>
</details>

It will first output the URL of the JSON file

<details><summary>Command line-2</summary>
<p align="center">
<img width="900" height="83" src="img/arte_dl_2.png">
</p>
</details>

followed by a numbered list of mp4 resources, with some additional info (language, video size, bitrate).  
Tell the terminal which index you want to download

<details><summary>Command line-3</summary>
<p align="center">
<img width="900" height="184" src="img/arte_dl_3.png">
</p>
</details>

and the file will be downloaded into your current working directory, using a file name made from the VID substring and the current date and time:

<details><summary>Command line-4</summary>
<p align="center">
<img width="900" height="142" src="img/arte_dl_4a.png">
</p>
</details>

Done.


### Firefox extension
If you don't use Python and the terminal, there is a browser extension (Firefox) in the mozilla subfolder.

#### Steps
1. Install the arte_dl.zip extension in Firefox (or make your own zip file, compressing the following files from the mozilla folder: manifest.json, popup.js, background.js, index.html, and the icons subfolder).  
To give it a try, the extension can be installed temporarily by selecting the zip file, or the manifest.json file when using the uncompressed files:

<details><summary>Click: how to install a temporary Firefox extension? </summary>
<p align="center">
<img width="1011" height="689" src="img/moz_ext_1a.png">
</p>
</details>

2. The extension is programmed as a 'pageAction', and becomes active only when visiting an URL matching the pattern: "*://*.arte.tv/*"  
The extension can be run if the arte symbol appears next to the URL bar.
<img align="right" width="48" height="48" src="mozilla/icons/arte_c48.png">

Click the symbol and a popup will list the available mp4 files.  

<details><summary>Click: the running extension</summary>
<p align="center">
<img width="965" height="271" src="img/moz_ext_3.png">
</p>
</details>

Each file has 2 options:
1. URL: get a notification with the URL of the .mp4 file (see image below). You can open the movie in another tab, watch it, download it manually, or use the URL otherwise.
2. Download (symbol: "&#9660;"): download the .mp4 file into your default Downloads folder. The file name will contain the VID substring and the current date and time. 

<details><summary>Click: the URL notification</summary>
<p align="center">
<img width="984" height="278" src="img/moz_ext_4.png">
</p>
</details>


### Chromium / Chrome script (Tampermonkey)
For Chromium/Chrome, the [tampermonkey script](https://github.com/Frederic-vW/arte/blob/main/chrome/arte-dl.user.js) should work. It prints a list of links directly below the video title. The URL button activates a popup containing the (clickable) movie URL, the right arrow button (symbol: "&#x25B6;") opens the movie in a new tab, from where it can be downloaded via a right click: "Save video as..." (Ctrl+S), or simply be watched, even if blocked in your country.  
Tampermonkey is available in the [chrome web store](https://chrome.google.com/webstore/) and at the [Tampermonkey](https://www.tampermonkey.net/) website.


### References
Others solutions for the same problem: 
- https://github.com/GuGuss/ARTE-7-Downloader
- https://github.com/sbonaime/ARTE-7-Playground
- https://github.com/known-as-bmf/plugin.video.arteplussept
- https://github.com/solsticedhiver/arteVIDEOS
- https://mediathekview.de/
- ...


### Feedback
Feedback is always welcome, please report any issues.
