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

    bindEvents: function() {
        $("body").on("click", ".hfst-quickScan a", function() {
            quickScan.doScan($(this).attr("data-uid"));
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


var contactALion = {

    appendCSS: function() {
        var css = ".contactALion { cursor: pointer; font-size: 11px; } #popup_contactALion { background-color: rgb(51, 51, 51); bottom: auto; border: 1px solid rgb(0, 0, 0); height: 30%; left: 182px; margin: 0px; max-height: 95%; max-width: 95%; opacity: 1; overflow: auto; padding: 0px; position: fixed; right: auto; top: 128px; width: 75%; z-index: 999; display: none; }";
        $("body").append("<style>" + css + "</style>");
    },

    appendContactBox: function() {
        var contactBox = "<div id='popup_contactALion'><h3>You can contact a member of the prestigious Red Lions group from here.</h3><div>Online members: <span class='contactbox_online'>...</span> (click on one)</div><br><div class='pm_template'>What do you need help with?<br><input type='text' id='contactbox_problem'/></div><br><br><div class='contact_btn'><button class='button cancel_contact'>Cancel and close</button> <button class='button send_contact'>Send!</button></div></div>";

        $("#content .navigation").prepend("<div class='contactALion'>I need help!</div>");
        $("body").append(contactBox);
    },

    bindEvents: function() {
        $("body").on("click", ".contactALion", function() {
            $("#popup_contactALion").css("display", "block");
        });

        $("body").on("click", ".cancel_contact", function() {
            $("#popup_contactALion").css("display", "none");
        });

        $("body").on("click", ".send_contact", function() {
            contactALion.sendPM("guy chosen", $("#contactbox_problem").val());
        });
    },


    fetchOnlineMembers: function() {

        

    },


    sendPM: function() {


    },

};

(function() {
    if(cpage=="showthread") {
        /* Actions */
        quickScan.appendCSS();
        quickScan.appendEachPost();
        quickScan.bindEvents();
    }


    contactALion.appendCSS();
    contactALion.appendContactBox();
    contactALion.bindEvents();


})();