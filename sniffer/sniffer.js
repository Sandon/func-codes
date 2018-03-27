'use strict';

var userAgent = window.navigator.userAgent, retDet = {};

retDet.os = {};
retDet.os.webkit = userAgent.match(/WebKit\/([\d.]+)/) ? true : false;
retDet.os.android = userAgent.match(/(Android)\s+([\d.]+)/) || userAgent.match(/Silk-Accelerated/) ? true : false;
retDet.os.androidICS = retDet.os.android && userAgent.match(/(Android)\s4/) ? true : false;
retDet.os.ipad = userAgent.match(/(iPad).*OS\s([\d_]+)/) ? true : false;
retDet.os.iphone = !retDet.os.ipad && userAgent.match(/(iPhone\sOS)\s([\d_]+)/) ? true : false;
retDet.os.ios7 = (retDet.os.ipad||retDet.os.iphone)&&userAgent.match(/7_/) ? true : false;
retDet.os.webos = userAgent.match(/(webOS|hpwOS)[\s\/]([\d.]+)/) ? true : false;
retDet.os.touchpad = retDet.os.webos && userAgent.match(/TouchPad/) ? true : false;
retDet.os.ios = retDet.os.ipad || retDet.os.iphone;
retDet.os.playbook = userAgent.match(/PlayBook/) ? true : false;
retDet.os.blackberry10 = userAgent.match(/BB10/) ? true : false;
retDet.os.blackberry = retDet.os.playbook || retDet.os.blackberry10|| userAgent.match(/BlackBerry/) ? true : false;
retDet.os.chrome = userAgent.match(/Chrome/) ? true : false;
retDet.os.opera = userAgent.match(/Opera/) ? true : false;
retDet.os.fennec = userAgent.match(/fennec/i) ? true : userAgent.match(/Firefox/) ? true : false;
retDet.os.ie = userAgent.match(/MSIE 10.0/i)||userAgent.match(/Trident\/7/i) ? true : false;
retDet.os.ieTouch = retDet.os.ie && userAgent.toLowerCase().match(/touch/i) ? true : false;
retDet.os.tizen = userAgent.match(/Tizen/i)?true:false;
retDet.os.supportsTouch = ((window.DocumentTouch && document instanceof window.DocumentTouch) || 'ontouchstart' in window);
//features
retDet.feat = {};
var head = document.documentElement.getElementsByTagName("head")[0];
retDet.feat.nativeTouchScroll = typeof(head.style["-webkit-overflow-scrolling"]) !== "undefined" && (retDet.os.ios||retDet.os.blackberry10);
retDet.feat.cssPrefix = retDet.os.webkit ? "Webkit" : retDet.os.fennec ? "Moz" : retDet.os.ie ? "ms" : retDet.os.opera ? "O" : "";
retDet.feat.cssTransformStart = !retDet.os.opera ? "3d(" : "(";
retDet.feat.cssTransformEnd = !retDet.os.opera ? ",0)" : ")";

if (retDet.os.android && !retDet.os.webkit)
    retDet.os.android = false;

var items = ["Webkit", "Moz", "ms", "O"];
for (var j = 0; j < items.length; j++){
    if (document.documentElement.style[items[j] + "Transform"] === "") {
        retDet.feat.cssPrefix=items[j];
    }
}

module.exports = retDet;