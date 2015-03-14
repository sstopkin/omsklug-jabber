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

function buildMessage(nick, msg, classes){
	classes= classes ? classes : "";
// 	return "<tr class=\"message "+classes+"\"><td><span class=\"label label-info\">"+nick+": </span></td><td>"+msg+"</td></tr>";
 	return "<tr class=\"message "+classes+"\"><td><span>"+nick+": </span></td><td>"+msg+"</td></tr>";
}

function buildNick(nick){
	return "<option class=nick id=\""+nick+"\">"+nick+"</option>";
}

function buildTable(nick){
	return "<table class=\"table table-hover table-condensed private-msg\" id=\"messagelist-"+escape(nick).split("%").join("-")+"\"><tbody></tbody></table>";
}

function buildLabel(msg){
	return "<span class=\"label label-warning\">"+msg+"</span>";
}

function countUnread(object){
	var returnie=0;
	$(object).each(function(each){
		if (localStorage["unread-"+$(this).text()]){
			returnie+=localStorage["unread-"+$(this).text()]*1;
		}
	});
	return (returnie+localStorage["unread-conference"]*1) > 0 ? returnie+localStorage["unread-conference"]*1 : "";
}

function log(msg) 
{
//    $('#log').append('<div></div>').append(document.createTextNode(msg));
	console.log(msg);
}