// Copyright (c) 2012 OmskLUG (Рилиан Ла Тэ)
//
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.



function send(msg, jid) {
    chrome.extension.sendRequest({method: "send", text: msg, jid: jid}, function (response) {
        console.log("Sending");
    });
}

function requestMessagesTable(nick) {
    $("#messages").append(buildTable(nick));
}

function requestMessages(nick) {
    $("#messagelist-" + escape(nick).split("%").join("-")).html(localStorage[nick]);
}

function reconnect() {
    chrome.extension.getBackgroundPage().window.location.reload();
}

function logout() {
    localStorage.removeItem("password");
    chrome.browserAction.setPopup({popup: "pass.html"});
    chrome.tabs.getSelected(null, function (tab) {
        chrome.tabs.update(tab.id, {selected: true})
    });
}

if (!localStorage["password"]) {
    chrome.browserAction.setPopup({popup: "pass.html"});
    chrome.tabs.getSelected(null, function (tab) {
        chrome.tabs.update(tab.id, {selected: true})
    });
}
function updateUnread() {
    chrome.extension.sendRequest({method: "resetUnread"}, function (response) {
        console.log("Resetting");
    });
}

$(document).ready(function () {
    localStorage["unread-conference"] = 0;
    updateUnread();
    $(".private-msg").remove();
    $("#messagelist-conference").html(localStorage[localStorage["ROOM_NAME"]]);
    $('#jids').html(localStorage["JIDs"]);
    $('#users-list').html(localStorage["JIDs"]);
    $('#post').bind('click', function () {
        send($('#message').get(0).value, $("#jids").val());
        $('#message').get(0).value = "";
    });
    $('#reconnect').bind('click', function () {
        reconnect();
    });
    $('#logout').bind('click', function () {
        logout();
    });
    $('#message').bind("keydown", function (e) {
        if (e.keyCode === 10 || e.keyCode == 13 && e.ctrlKey) {
            send($('#message').get(0).value, $("#jids").val());
            $('#message').get(0).value = "";
        }
    });
    $("#jids").bind("change", function () {
        $("#messages div").hide();
        console.log($("#jids").val())
        console.log(localStorage["ROOM_NAME"])
        if ($("#jids").val().toLocaleString() === localStorage["ROOM_NAME"].toLocaleString()) {
            $("#messagelist-conference").fadeIn();
            console.log("asd")
        } else {
            requestMessagesTable($("#jids").val());
            requestMessages($("#jids").val());
            $("#messagelist-" + escape($("#jids").val()).split("%").join("-")).fadeIn();
            localStorage["unread-" + $("#jids").val()] = 0;
            updateUnread();
        }
    });
});