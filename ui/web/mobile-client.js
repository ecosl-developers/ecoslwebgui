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

function itemClicked(obj, id) {
    obj.style.backgroundColor = "#FFFFCC"
    if (obj.childNodes[0].src.match('images/balloon.png')) {
        obj.childNodes[0].src = 'images/accept.png'
        obj.style.textDecoration = 'line-through'
        
        // Move checked item to end of list according to sort value
        obj.parentNode.appendChild(obj)
        var s = obj.previousSibling
        do {
            if (s && s.style.textDecoration == 'line-through' && s.getAttribute('sort') > obj.getAttribute('sort')) {
                obj.parentNode.insertBefore(obj,s)
                s = obj.previousSibling
            } else {
                if (s) { s = s.previousSibling }
            }
        } while (s)
        
    } else {
        // Move unchecked item to end of list according to sort value

        obj.childNodes[0].src = 'images/balloon.png'
        obj.style.textDecoration = 'none'

        var s = obj.previousSibling
        
        do {
            if (s && s.style.textDecoration == 'line-through') {
                obj.parentNode.insertBefore(obj,s)
                s = obj.previousSibling
            } else if (s.getAttribute('sort') > obj.getAttribute('sort')) {
                obj.parentNode.insertBefore(obj,s)
                s = obj.previousSibling
            } else {
                if (s) { s = s.previousSibling }
            }
        } while (s)		
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
            var items = xml.getElementsByTagName('item')
            var list = document.getElementById("myDiv")
            list.innerHTML = "";
            
            for (var i=0; i<items.length; i++) {                
                var id = trimNodeValue(items[i].getElementsByTagName("id")[0].firstChild.nodeValue)
                var title = trimNodeValue(items[i].getElementsByTagName("name")[0].firstChild.nodeValue)
                
                var newItem = document.createElement('div')
                newItem.setAttribute('id', id)
                newItem.setAttribute('sort', id)
                newItem.setAttribute('class', 'list-item')
                newItem.setAttribute('onClick', 'itemClicked(this, " + id + ")')
                newItem.setAttribute('onMouseDown', 'this.style.backgroundColor = "gray"')
                newItem.setAttribute('onMouseOut', 'this.style.backgroundColor = "#FFFFCC"')
                newItem.innerHTML = "<img class=list-icon src=images/balloon.png> " + id + " " + title + "</div>"
                list.appendChild(newItem)
            }
        }
    }

    xmlhttp.open("GET", getParam(), true);
    xmlhttp.send();

//    auto-refresh:
//    setTimeout("refreshItems()", 2000)
}

refreshItems()

