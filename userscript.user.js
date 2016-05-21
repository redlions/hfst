// ==UserScript==
// @name         HFST
// @namespace    HFST
// @version      0.1
// @description  HackForums Safe Trader
// @author       Red Lions
// @require      https://code.jquery.com/jquery-2.2.4.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_log
// @include      *hackforums.net/*
// ==/UserScript==

/* --User Configuration-- */
var debug = true;

/* --User Configuration-- */

/* --Constructs-- */
if(debug){ GM_listValues().forEach(function(unst){ GM_deleteValue(unst); }); }
var cpage = window.location.pathname.split('/')[1].split('.php')[0];
/* --Constructs-- */

/* --User Information-- */
if(!GM_getValue("uid")) { GM_setValue("uid", $("#panel").find('a').attr('href').replace(/[^0-9]/g, '')); }
if(!GM_getValue("uname")) { GM_setValue("uname", $("#panel a").first().text()); }
/* --User Information-- */

(function() {
    if(cpage=="showthread"){
        var pb_ids = [];
        $(".post_author .largetext").each(function(){
            pb_ids.push($(this).find('a').attr('href').replace(/[^0-9]/g, ''));
        });
        $(".post_author").each(function(x){
            $(this).prepend("<a name='#"+pb_ids[x]+"'></a>"); //page scrolls, needs fixed.
            $(this).append("<br><span id='hfst-quickScan'><a href='#"+pb_ids[x]+"' id='"+pb_ids[x]+"'>Quick Scan</a></span>");
        });
        $("#hfst-quickScan a").click(function(){
            var sRes = quickScan($(this).attr('id'));
            $(this).append(" -- Scan for: "+$(this).attr('id'));
        });
       //GM_log(getURI(""+pb[0]));
    }
    if(cpage=="usercp"){
        alert('user cp');
    }
})();
function quickScan(uid){
    trs = [];
    var sRes = getPage("http://hackforums.net/trustscan.php?uid="+uid);
    $(sRes).find('table:eq(1) tr td').each(function(){ trs.push = $(this); GM_log($(this)[0]); });
    GM_log(trs);
    alert(trs);
    return sRes;
}
function pre(obj) {
    var out = '';
    for (var i in obj) {
        out += i + ": " + obj[i] + "\n";
    }
    GM_log(out);
}
function sleepFor( sleepDuration ){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ }
}
function getPage(url) {
    try {
        var r = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
        r.open("GET", url, 0);
        r.send(null);
        var parser = new DOMParser();
        return parser.parseFromString(r.responseText, "text/html");
    } catch (e) {
        return null;
    }
}
