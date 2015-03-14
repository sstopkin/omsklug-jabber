function log(msg) 
{
    $('#log').append('<div></div>').append(document.createTextNode(msg));
}

function send(msg){
	chrome.extension.sendRequest({method: "send",text:msg},function(response){
			console.log("Sending");
		});
}

	if (!localStorage["password"]){
		chrome.browserAction.setPopup({popup : "pass.html"});
		chrome.tabs.getSelected(null, function(tab) {
			chrome.tabs.update(tab.id, { selected: true } )
		});
	}
	chrome.extension.sendRequest({method: "resetUnread"}, function(response) {
		console.log("Resetting");
	});  
chrome.extension.sendRequest({method: "parser"},function(response) {
		console.log("Appending");
		$('#messagelist').prepend(response.string);
});

$(document).ready(function () {
	$('#post').bind('click', function () {
			send($('#message').get(0).value);
		});
	});
//});

$(function() {
    var total_tabs = 0;

    // Инициализируем первую закладку
    total_tabs++;
    addtab(total_tabs);

    $("#addtab, #litab").click(function() {
        total_tabs++;
        $("#tabcontent p").hide();
        addtab(total_tabs);
        return false;
    });

    function addtab(count) {
        var closetab = '<a href="" id="close'+count+'" class="close">&times;</a>';
        $("#tabul").append('<li id="t'+count+'" class="ntabs">Закладка №'+count+'&nbsp;&nbsp;'+closetab+'</li>');
        $("#tabcontent").append('<p id="c'+count+'">Содержание закладки № '+count+'</p>');

        $("#tabul li").removeClass("ctab");
        $("#t"+count).addClass("ctab");

        $("#t"+count).bind("click", function() {
            $("#tabul li").removeClass("ctab");
            $("#t"+count).addClass("ctab");
            $("#tabcontent p").hide();
            $("#c"+count).fadeIn('slow');
        });

        $("#close"+count).bind("click", function() {
            // Активируем предыдущую закладку
            $("#tabul li").removeClass("ctab");
            $("#tabcontent p").hide();
            $(this).parent().prev().addClass("ctab");
            $("#c"+count).prev().fadeIn('slow');

            $(this).parent().remove();
            $("#c"+count).remove();
            return false;
        });
    }
});
