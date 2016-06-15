// ==UserScript==
// @name         HFST
// @namespace    HFST
// @version      0.1.1
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

    /**
     * Append the CSS styles for the quick scan feature
    */
    appendCSS: function() {
        var css = ".hfst-quickScan a { cursor: pointer; color: #FFF; }";
        $("body").append("<style>" + css + "</style>");
    },

    /**
     * Append each post on a thread with the quick scan link
    */
    appendEachPost: function() {
        var uid;
        $(".post_author").each(function(i) {
            uid = $(this).find("a").attr("href").substr(52);
            $(this).append("<br><span class='hfst-quickScan'><a data-uid='" + uid + "'>Quick Scan</a></span>");
        });
    },

    /**
     * Bind the doScan function to the link appended in the appendEachPost function
    */
    bindEvents: function() {
        $("body").on("click", ".hfst-quickScan a", function() {
            quickScan.doScan($(this).attr("data-uid"));
        });
    },

    /**
     * Get the quick scan of a user, loading via GET method the trustscan page
     *
     * @param  int   uid  UID of the scanned user
    */
    doScan: function(uid) {
        var url = "http://hackforums.net/trustscan.php?uid=" + uid;
        $.get(url, function(data) {
            data = $(data).find("table:eq(1)");
            quickScan.displayScan(data.html(), uid);
        });
    },

    /**
     * Display the quick scan
    */
    displayScan: function(data, uid) {
        //alert(data);
        //$("a[data-uid='" + uid + "']").html("Quick Scan -- Done for " + uid);
        $("a[data-uid='" + uid + "']").html(data);
    },

};


var contactALion = {

    /**
     * Append the CSS styles for the contact a Red Lion feature
    */
    appendCSS: function() {
        var css = ".contactALion { cursor: pointer; font-size: 11px; } #popup_contactALion { background-color: rgb(51, 51, 51); bottom: auto; border: 1px solid rgb(0, 0, 0); height: 30%; left: 182px; margin: 0px; max-height: 95%; max-width: 95%; opacity: 1; overflow: auto; padding: 0px; position: fixed; right: auto; top: 128px; width: 75%; z-index: 999; display: none; } .onlineMember { cursor: pointer; } .onlineMember-active { color: red; } #contactbox_problem { width: 70%; }";
        $("body").append("<style>" + css + "</style>");
    },

    /**
     * Append the contact box for the contact a Red Lion feature
    */
    appendContactBox: function() {
        var contactBox = "<div id='popup_contactALion'><h3>You can contact a member of the prestigious Red Lions group from here.</h3><div>Online members: (click on one)<br><span class='contactbox_online'>...</span></div><br><div class='pm_template'>What do you need help with?<br><input type='text' id='contactbox_problem'/></div><br><br><div class='contact_btn'><button class='button cancel_contact'>Cancel and close</button> <button class='button send_contact'>Send!</button></div></div>";

        $("#content .navigation").prepend("<div class='contactALion'>I need help!</div>");
        $("body").append(contactBox);
    },

    /**
     * Bind two main events
     * Event to open and close the popup via buttons on the popup itself and a link at the top of the page
     * Event to set the clicked member as chosen
    */
    bindEvents: function() {
        $("body").on("click", ".contactALion", function() {
            $("#popup_contactALion").show();
            contactALion.fetchOnlineMembers();
        });

        $("body").on("click", ".onlineMember", function() {
            contactALion.setMember($(this));
        });

        $("body").on("click", ".cancel_contact", function() {
            contactALion.removePopup();
        });
        
        $("body").on("click", ".send_contact", function() {
            contactALion.sendPM("guy chosen", $("#contactbox_problem").val());
        });
    },

    /**
     * Retrieve online Red Lions members by searching through a thread where they posted
    */
    fetchOnlineMembers: function() {
        var members  = {}, 
            username = "", 
            status   = "", 
            thread   = "http://hackforums.net/showthread.php?tid=5283802";

        $.get(thread, function(data) {

            $(data).find(".post_author").each(function() {
                username = $(this).find("span.largetext a[href*='member.php'] span[class*='group']").html();
                status = $(this).find("img[alt*='line']").attr("alt");
                members[username] = status;
            });
            contactALion.updateContactBox(members);
        });
    },

    /**
     * Remove the contact popup, along with removing the list of online Red Lions and the issue the user had
    */
    removePopup: function() {
        $(".contactbox_online").empty();
        $("#contactbox_problem").val("");
        $("#popup_contactALion").hide();
    },

    /**
     * Set the clicked member as chosen
     *
     * @param  object  member  Selected element that represents the member
    */
    setMember: function(member) {
        $(".onlineMember").attr("class", "onlineMember");
        $(member).toggleClass("onlineMember-active");
    },

    sendPM: function() {


    },

    /**
     * Update the contact box with the list of online members. THis function is the callback of fetchOnlineMembers
     *
     * @param  object  members  Object representing all the members who posted on the thread and their current status
    */
    updateContactBox: function(members) {
        var onlineMembers = "";

        $.each(members, function(index, value) {
            if (value === "Online")
                onlineMembers = onlineMembers + "<span class='onlineMember'>" + index + "</span> - ";
        });
        onlineMembers = onlineMembers.substr(0, onlineMembers.length - 3);

        $(".contactbox_online").empty();
        $(".contactbox_online").append(onlineMembers);
    },
};

$(document).ready(function() {

    if(cpage=="showthread") {

        quickScan.appendCSS();
        quickScan.appendEachPost();
        quickScan.bindEvents();
    }

    contactALion.appendCSS();
    contactALion.appendContactBox();
    contactALion.bindEvents();

});
