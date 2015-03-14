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



var connection=null;
localStorage['BOSH_SERVICE']= "http://jabber.ru/http-bind";
localStorage['ROOM_NAME'] = "omsklug@conference.jabber.ru";
localStorage['unread-conference']=0;
function reset(){
}

function onConnect(status)
{
	if (status == Strophe.Status.CONNECTED) {
		localStorage[localStorage["ROOM_NAME"]]="";
		connection.send($pres().tree());
		connection.muc.join(localStorage["ROOM_NAME"],localStorage["nick"],onMessage,onPresence);
		localStorage["JIDs"]=buildNick(localStorage["ROOM_NAME"]);
	} else if (status == Strophe.Status.CONNFAIL) {
		
	}
}



function updateUnread(text) {
    chrome.browserAction.setBadgeText({
        text: text.toString()
    });
}


function onPresence(msg) {
    var to = msg.getAttribute('to');
    var from = msg.getAttribute('from');
    var type = msg.getAttribute('type') || "available";
    var elems = msg.getElementsByTagName('body');
    var nick=msg.getAttribute('from').toString().replace(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}\//, '');
    var popups = chrome.extension.getViews({type: "popup"});
    if (type=="unavailable"){
 		localStorage["JIDs"]=localStorage["JIDs"].replace(buildNick(nick),"");
 		localStorage["table"]=localStorage["table"].replace(buildTable(nick),"");
 	if (popups.length != 0) {
 		var popup=popups[0];
 		popup.$('#'+nick).remove();
 		popup.$('#messagelist-'+escape(nick).split("%").join("-")).remove();
 	}
	//localStorage not cleaning for history support
    } else {
 	if(localStorage["JIDs"].indexOf(buildNick(nick))<0){
 		localStorage["JIDs"]+=buildNick(nick);
 		localStorage["table"]+=buildTable(nick);
 		if (popups.length != 0){
 			var popup=popups[0];
 			popup.$('#jids').append(buildNick(nick));
 			popup.$("#messages").append(buildTable(nick));
 		}
 	}
    }
	return true;
}

function onMessage(msg) {
    var to = msg.getAttribute('to');
    var from = msg.getAttribute('from');
    var type = msg.getAttribute('type');
    var elems = msg.getElementsByTagName('body');
    var nick=msg.getAttribute('from').toString().replace(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}\//, '');
    if (type == "groupchat" && elems.length > 0) {
	if (!localStorage[localStorage["ROOM_NAME"]]) localStorage[localStorage["ROOM_NAME"]]="";
	var body=elems[0];
	var bodytxt=Strophe.getText(body);
	if (bodytxt != ""){
		localStorage[localStorage["ROOM_NAME"]]=buildMessage(nick,bodytxt)+localStorage[localStorage["ROOM_NAME"]];
		var popups = chrome.extension.getViews({type: "popup"});
		if (popups.length == 0) {
			localStorage["unread-conference"]=localStorage["unread-conference"]*1+1;
			updateUnread(countUnread("#jids option"));
		} 
		else {
			var popup=popups[0];
			popup.$('#messagelist-conference').html(localStorage[localStorage["ROOM_NAME"]]);
			}
		}
	}
    if (type=="chat" && elems.length>0 ){
    if (!localStorage[nick]) localStorage[nick]="";
	var body=elems[0];
	var bodytxt=Strophe.getText(body);
	if (bodytxt != ""){
		localStorage[nick]=buildMessage(nick,bodytxt)+localStorage[nick];
		var popups = chrome.extension.getViews({type: "popup"});
		if (popups.length != 0) {
			var popup=popups[0];
			popup.$('#messagelist-'+escape(nick).split("%").join("-")).html(localStorage[nick]);
		} else {
			if (!localStorage["unread-"+nick]) localStorage["unread-"+nick]=0;
			localStorage["unread-"+nick]=localStorage["unread-"+nick]*1+1;
			updateUnread(countUnread("#jids option"));	
		}
	}
    }
    return true;
}

function connect(){
	if (!connection) connection=new Strophe.Connection(localStorage['BOSH_SERVICE']);
	connection.rawInput = function (data) { log('RECV: ' + data); };
	connection.rawOutput = function (data) { log('SEND: ' + data); };
	connection.connect(localStorage["JID"],localStorage["password"],onConnect);
}

function disconnect(){
	connection.disconnect();
	connection.reset();
}

function logout(){
		localStorage.removeItem("password");
		chrome.browserAction.setPopup({popup : "pass.html"});
}

function send(msg,nick){
	if (nick==localStorage["ROOM_NAME"]){
		connection.muc.message(localStorage["ROOM_NAME"],null,msg);
	} else {
		connection.muc.message(localStorage["ROOM_NAME"],nick,msg);
		localStorage[nick]=buildMessage(localStorage["nick"],msg)+localStorage[nick];
		var popups = chrome.extension.getViews({type: "popup"});
		if (popups.length != 0) {
			var popup=popups[0];
			popup.$('#messagelist-'+escape(nick).split("%").join("-")).prepend(buildMessage(localStorage["nick"],msg));
		} 
	}
}

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.method == "resetUnread"){
	updateUnread(countUnread("#jids option"));
    } else if (request.method == "send"){
	send(request.text,request.jid);
	sendResponse({ string: localStorage[localStorage["ROOM_NAME"]] });
    } else if (request.method == "connect"){
	connect();
    }
})


function main (){
	if (!localStorage["password"]){
		chrome.browserAction.setPopup({popup : "pass.html"});
	} else {
		connect();
		chrome.browserAction.setPopup({popup : "popup.html"});
	}
}

main();