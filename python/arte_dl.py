#!/usr/bin/python3
# -*- coding: utf-8 -*-
# download ARTE videos
# FvW 01/2018

import datetime, os, requests, sys, urllib


def url2name(url):
    """Create movie name from arte url."""
    url_parts = url.split("/")
    mov_id = url_parts[url_parts.index('videos')+1]
    d = datetime.datetime.now()
    name = "{:s}_{:d}-{:02d}-{:02d}T{:02d}-{:02d}-{:02d}{:s}".format(\
    mov_id, d.year, d.month, d.day, d.hour, d.minute, d.second, ".mp4")
    return name


def fetch_json(url):
    """Get json url from movie url."""
    url_parts = url.split("/")
    i = url_parts.index('videos')
    mov_id = url_parts[i+1]
    lang_code = url_parts[i-1]
    lang_dict = {
        "de" : "de_DE",
        "en" : "en_GB",
        "es" : "en_ES",
        "fr" : "fr_FR",
        "it" : "it_IT",
        "pl" : "pl_PL"
    }
    json_url = ("https://api.arte.tv/api/player/v1/config/{:s}/{:s}?autostart=1"
    "&lifeCycle=1&amp;lang={:s}&amp;config=arte_tvguide").format(lang_code, \
    mov_id, lang_dict[lang_code])
    print("\n[+] Get video URLs from JSON file:\n    {:s}".format(json_url))
    j = requests.get(json_url).json()
    return j


def fetch_mp4url(json_dict):
    urls = []
    ks = json_dict["videoJsonPlayer"]["VSR"].keys()
    print("\n[+] Video links:")
    #vid = json_dict["videoJsonPlayer"]["VID"];
    m = 0
    for i, k in enumerate(ks):
        id      = json_dict["videoJsonPlayer"]["VSR"][k]["id"]
        qual    = json_dict["videoJsonPlayer"]["VSR"][k]["quality"]
        width   = json_dict["videoJsonPlayer"]["VSR"][k]["width"]
        height  = json_dict["videoJsonPlayer"]["VSR"][k]["height"]
        brate   = json_dict["videoJsonPlayer"]["VSR"][k]["bitrate"]
        type    = json_dict["videoJsonPlayer"]["VSR"][k]["mediaType"]
        lang    = json_dict["videoJsonPlayer"]["VSR"][k]["versionLibelle"]
        lang_sh = json_dict["videoJsonPlayer"]["VSR"][k]["versionShortLibelle"]
        url     = json_dict["videoJsonPlayer"]["VSR"][k]["url"]
        if type == "mp4":
            m += 1
            urls.append(url)
            print("\n\t[{:d}] {:s}".format(m, url))
            print("\t    Language: {:s}".format(lang))
            print("\t    Quality : {:s} (bitrate: {:d}, w x h: {:d} x {:d})"\
                  .format(qual, brate, width, height))
            print("\t    Format  : {:s}".format(type))
    try:
        c = input("\n[+] Choose link index ({:d}-{:d}): ".format(1,len(urls)))
        m = int(c)-1 # convert char to int, correct counting from 1
        url = urls[m]
    except:
        url = None
    #print("[+] movie link:\n\t{:s}".format(url))
    return url


def dump(src,dst):
    if src:
        print("\n[+] Source:\n    {:s}".format(src))
        print("[+] Download to:\n    {:s}".format(dst))
        try:
            urllib.request.urlretrieve(src,dst)
        except:
            pass
    else:
        print("\n[+] no download URL provided, sorry...")


def fetch_dump(url,dst):
    j = fetch_json(url)
    link = fetch_mp4url(j)
    dump(link,dst)


if __name__ == "__main__":
    try:
        url = sys.argv[1]
        dst_path = os.getcwd()
        dst = os.path.join(dst_path, url2name(url))
        fetch_dump(url,dst)
    except:
        sys.exit()
