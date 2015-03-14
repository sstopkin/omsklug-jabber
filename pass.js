$(document).ready(function () {
    $('#store').bind('click', function () {
	var button = $('#store').get(0);
	localStorage["JID"]=$('#jid').get(0).value;
	localStorage["password"]=$('#pass').get(0).value;
	localStorage["nick"]=$('#nick').get(0).value;
	chrome.browserAction.setPopup({popup : "popup.html"});
	chrome.extension.sendRequest({method: "connect"}, function(response) {
	});  
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.update(tab.id, { selected: true } )
	});
    });
});
