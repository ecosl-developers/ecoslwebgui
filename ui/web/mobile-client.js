/*
* 
* This file is part of Ecological Shopping List II (ecosl).
* 
* Copyright (C) 2012  Jussi Passi
* 
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Lesser General Public License as published by
* the Free Software Foundation, version 3 of the License.
* 
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Lesser General Public License for more details.
* 
* You should have received a copy of the GNU Lesser General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
*
* Icons by http://dryicons.com
* http://dryicons.com/terms/#free-license
*/

function getParam() {
    var url = "" + window.location 
    var i = url.indexOf('?')
    return (url.substring(i+1, window.location.length))
}

function trimNodeValue(str) {
    str = str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    return str.replace(/(\r\n|\n|\r)/gm,"")
}

function refreshClicked() {
    document.getElementsByClassName('refresh-icon')[0].style.backgroundColor = 'transparent'
    refreshItems()
}


function sortItems(item, up) {
	
	var s = item.previousSibling
	
	if (up) {
		do {
			if (s && s.style.textDecoration == 'line-through' && s.getAttribute('sort') > item.getAttribute('sort')) {
				item.parentNode.insertBefore(item,s)
				s = item.previousSibling
			} else {
				if (s) { s = s.previousSibling }
			}
		} while (s)
	} else {        
		do {
			if (s && s.style.textDecoration == 'line-through') {
				item.parentNode.insertBefore(item,s)
				s = item.previousSibling
			} else if (s && s.getAttribute('sort') > item.getAttribute('sort')) {
				item.parentNode.insertBefore(item,s)
				s = item.previousSibling
			} else {
				if (s) { s = s.previousSibling }
			}
		} while (s)			
	}
}

function itemClicked(obj, id) {
    obj.style.backgroundColor = "#FFFFCC"
    if (obj.childNodes[0].firstChild.src.match('images/balloon.png')) {
        obj.childNodes[0].firstChild.src = 'images/accept.png'
        obj.style.textDecoration = 'line-through'
        
        // Move checked item to end of list according to sort value
        obj.parentNode.appendChild(obj)
	sortItems(obj, true)
    } else {
        // Move unchecked item to end of list according to sort value
        obj.childNodes[0].firstChild.src = 'images/balloon.png'
        obj.style.textDecoration = 'none'
	sortItems(obj, false)
    }
}

function markPicked(id, checked) {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp=new XMLHttpRequest();
    } else {
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState==4 && xmlhttp.status==200) {
            // var text = xmlhttp.responseText
        } else {
            // error occurred
        }
    }


    // TODO: url to check/unchek item 
    // xmlhttp.open("GET","cgi-bin/ecoslbe?" + checked, false);
    xmlhttp.send();
}

function refreshItems()
{
    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp=new XMLHttpRequest();
    } else {
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState==4 && xmlhttp.status==200) {
            var xml = xmlhttp.responseXML
		
	    var title = xml.getElementsByTagName('shoppinglist')[0].getAttribute('title')
	    if (title) { document.getElementById('listTitle').innerHTML = title } 
		
            var items = xml.getElementsByTagName('item')
            var list = document.getElementById("myDiv")
            list.innerHTML = "";
            
            for (var i=0; i<items.length; i++) {                
                var id = trimNodeValue(items[i].getElementsByTagName("id")[0].firstChild.nodeValue)
                var title = trimNodeValue(items[i].getElementsByTagName("translation")[0].firstChild.nodeValue)
                var amount = trimNodeValue(items[i].getElementsByTagName("amount")[0].firstChild.nodeValue)
                var bought = trimNodeValue(items[i].getElementsByTagName("bought")[0].firstChild.nodeValue)
                var price = trimNodeValue(items[i].getElementsByTagName("price")[0].firstChild.nodeValue)
                
                var newItem = document.createElement('tr')
                newItem.setAttribute('id', id)
                newItem.setAttribute('sort', id)
                newItem.setAttribute('class', 'list-item')
                newItem.setAttribute('onClick', 'itemClicked(this, " + id + ")')
                newItem.setAttribute('onMouseDown', 'this.style.backgroundColor = "gray"')
                newItem.setAttribute('onMouseOut', 'this.style.backgroundColor = "#FFFFCC"')
                newItem.innerHTML = "<td class=list-icon><img src=" + (bought==0?"images/balloon.png":"images/accept") 
		    + "></td><td class=item-amount>" + amount 
		    + "</td><td class=item-title>" + title + "</td><td class=item-price>" + price*amount + "&euro;<br>" 
		    + (amount>1?"<span class=a-price>(&agrave; " + price + "&euro;)</span>":"") + "</td></tr>";
		if (bought!=0) newItem.style.textDecoration = 'line-through'

                list.appendChild(newItem)
		    
		sortItems(newItem, false)
	
            }
        }
    }

    xmlhttp.open("GET", getParam(), true);
    xmlhttp.send();

//    auto-refresh:
//    setTimeout("refreshItems()", 2000)
}

refreshItems()

