// ==UserScript==
// @name         HFST
// @namespace    HFST
// @version      0.0.1
// @description  HackForums Safe Trader
// @author       Red Lions - Lrr, Hash G.,
// @require      https://code.jquery.com/jquery-2.2.4.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_log
// @include      *hackforums.net*
// ==/UserScript==

/* --User Configuration-- */
var debug = true;
/* --User Configuration-- */

/* --Constructs-- */
if (debug) 
    GM_listValues().forEach(function (unst) { GM_deleteValue(unst); });
var cpage = window.location.pathname.split('/')[1].split('.php')[0];
/* --Constructs-- */

/* --User Information-- */
if(!GM_getValue("uid"))
    GM_setValue("uid", $("#panel").find('a').attr('href').replace(/[^0-9]/g, ''));
if(!GM_getValue("uname")) 
    GM_setValue("uname", $("#panel a").first().text());
/* --User Information-- */




var quickScan = {

    appendCSS: function() {
        var css = ".hfst-quickScan a { cursor: pointer; color: #FFF; }";
        $("body").append("<style>" + css + "</style>");
    },

    appendEachPost: function() {
        var uid;
        $(".post_author").each(function(i) {
            uid = $(this).find("a").attr("href").substr(52);
            $(this).append("<br><span class='hfst-quickScan'><a data-uid='" + uid + "'>Quick Scan</a></span>");
        });

    },

    doScan: function(uid) {
        var url = "http://hackforums.net/trustscan.php?uid=" + uid;
        $.get(url, function(data) {
            data = $(data).find("table:eq(1)");
            quickScan.displayScan(data.html(), uid);
        });
    },

    displayScan: function(data, uid) {
        alert(data);
        $("a[data-uid='" + uid + "']").html("Quick Scan -- Done for " + uid);
    },

};

(function() {
    if(cpage=="showthread") {
        /* Actions */
        quickScan.appendCSS();
        quickScan.appendEachPost();

        /* Events binds */
        $(".hfst-quickScan a").click(function() {
            quickScan.doScan($(this).attr("data-uid"));
        });
    }
})();