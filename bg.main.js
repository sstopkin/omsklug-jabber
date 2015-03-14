var connection=null;
var unread=0;
localStorage['BOSH_SERVICE']= "http://jabber.ru/http-bind";
localStorage['ROOM_NAME'] = "omsklug@conference.jabber.ru";
function reset(){
}
function log(msg) 
{
//    $('#log').append('<div></div>').append(document.createTextNode(msg));
	console.log(msg);
}

function onConnect(status)
{
	if (status == Strophe.Status.CONNECTED) {
		localStorage["extension"]="";
		connection.send($pres().tree());
		connection.muc.join(localStorage["ROOM_NAME"],localStorage["nick"],onMessage);
	} else if (status == Strophe.Status.CONNFAIL) {
//		localStorage.removeItem("password");
//		chrome.browserAction.setPopup({popup : "pass.html"});
	}
}

function updateUnread(text) {
    chrome.browserAction.setBadgeText({
        text: text.toString()
    });
}
function onMessage(msg) {
    var to = msg.getAttribute('to');
    var from = msg.getAttribute('from');
    var type = msg.getAttribute('type');
    var elems = msg.getElementsByTagName('body');
    if (type == "groupchat" && elems.length > 0) {
	if (!localStorage["extension"]) localStorage["extension"]="";
	var nick=msg.getAttribute('from').toString().replace(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}\//, '');
	var body=elems[0];
	var bodytxt=Strophe.getText(body);
	var str=localStorage["extension"];
	str="<li><span id='nick'>"+nick+": </span> "+bodytxt+"</li>"+str;
	localStorage["extension"]=str;
	var popups = chrome.extension.getViews({type: "popup"});
	if (popups.length == 0) {
		unread++;
		updateUnread((unread).toString() + '');
	} else {
		var popup=popups[0];
		popup.$('#messagelist').prepend("<li><span id='nick'>"+nick+": </span> "+bodytxt+"</li>");
	}
    }
    var reply = $pres({to: localStorage["ROOM_NAME"], from: localStorage["JID"]}).c("body").t("");
	connection.send(reply.tree());
    return true;
}

function connect(){
	connection=new Strophe.Connection(localStorage['BOSH_SERVICE']);
	connection.rawInput = function (data) { log('RECV: ' + data); };
	connection.rawOutput = function (data) { log('SEND: ' + data); };
	connection.connect(localStorage["JID"],localStorage["password"],onConnect);
}

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.method == "connect") {
        connect();
    } else if (request.method == "parser") {
	var str= localStorage["extension"];
	sendResponse({ string: localStorage["extension"] });
    } else if (request.method == "resetUnread"){
	unread=0;
	updateUnread('');
    } else if (request.method == "send"){
    var reply = $msg({to: localStorage["ROOM_NAME"], from: localStorage["JID"], type: 'groupchat'}).c("body").t(request.text);
	connection.send(reply.tree());
	sendResponse({ string: localStorage["extension"] });
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
