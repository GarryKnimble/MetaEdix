const remote = require('electron').remote
const dialog = remote.dialog;
var content;
var fs = require('fs');
var byte_data = [];
var bytes = [];
var focusByte;
var altSelect = 0;
var currentFile = "";
openFile();
document.onclick = function(e){
	if(!contains(e.target.classList, "menuItem")){
		closeAllMenus();
	}
}
window.onkeydown = function(e){
	if(e.keyCode == 16){
		altSelect = 1;
	}
	if(e.keyCode == 13){
		if(document.getElementById("editText") === document.activeElement){
			if(focusByte.innerText != document.getElementById("editText").value.toUpperCase()){
				focusByte.innerText = document.getElementById("editText").value.toUpperCase();
				focusByte.classList.add("modified");
			}
		}
	}
	if(e.keyCode == 70){
		$('.container').animate({
			scrollTop: focusByte.offsetTop-350}, 800);
	}
}
window.onkeyup = function(e){
	if(e.keyCode == 16){
		altSelect = 0;
	}
}
function openFile(){
	dialog.showOpenDialog({properties: ['openFile']}, 
	function(filename){
		currentFile = filename[0];
		fs.readFile(filename[0], 'ascii', function (err, data){
			if(err) return console.log(err);
			content = data;
			for(var i = 0; i < data.length; i++){
				var hex = content.charCodeAt(i).toString(16);
				if(hex.length < 2){
					hex = "0" + hex;
				}
				bytes.push(hex.toUpperCase());
				byte_data.push(content.charCodeAt(i));
			}
			var container = document.getElementsByClassName("content")[0];
			for(var i = 0; i < bytes.length; i++){
				container.innerHTML += "<div class='byteBlock' onclick='byteEvent(this)' onmouseover='updateLine(this)' data-index='" + i + "'>" + bytes[i] + "</div>";
			}
			saveFile();
		});
	});
}

function saveFile(){
	dialog.showSaveDialog({properties: ['saveFile']}, 
	function(filename){
		var content = "";
		for(var i = 0; i < byte_data.length; i++){
			content += String.fromCharCode(byte_data[i]);
		}
		fs.writeFile(filename, content, 'ascii', function(err){
			if(err) return console.log(err);
		});
	});
}

function byteEvent(item){
	var index = item.getAttribute("data-index");
	var row = 0;
	var col = index % 16;
	var colStr = col.toString(16);
	var rowStr = (Math.floor(index/16) * 16).toString(16);
	while(rowStr.length < 8){
		rowStr = "0" + rowStr;
	}
	if(colStr.length < 2){
		colStr = "0" + colStr;
	}
	document.getElementById("row-col").innerText = "Offset: " + rowStr.toUpperCase() + " - " + colStr.toUpperCase();
	document.getElementById("editText").value = item.innerText;
	var byteBlocks = document.getElementsByClassName('byteBlock');
	if(altSelect == 0){
		if($(".active").length > 1){
			$(".wrapper").animate({'opacity': 0.4}, 300);
			var dialogBox = new DialogBox("Warning", "There are bytes currently selected. Deselect them?", function(){
				dialogBox.close();
				$(".wrapper").animate({'opacity': 1}, 300);
				for(var i = 0; i < byteBlocks.length; i++){
					byteBlocks[i].classList.remove("active");
				}
			}, function(){
				dialogBox.close();
				$(".wrapper").animate({'opacity': 1}, 300);
			});
			dialogBox.show();
		}
		else{
			for(var i = 0; i < byteBlocks.length; i++){
				byteBlocks[i].classList.remove("active");
			}
		}
	}
	for(var i = 0; i < byteBlocks.length; i++){
		byteBlocks[i].classList.remove("focused");
	}
	item.classList.toggle("active");
	item.classList.toggle("focused");
	focusByte = item;
}

function updateLine(item){
	var index = item.getAttribute("data-index");
	var row = 0;
	var col = index % 16;
	var colStr = col.toString(16);
	var rowStr = (Math.floor(index/16) * 16).toString(16);
	while(rowStr.length < 8){
		rowStr = "0" + rowStr;
	}
	if(colStr.length < 2){
		colStr = "0" + colStr;
	}
	document.getElementById("coords").innerText = rowStr.toUpperCase() + ":" + colStr.toUpperCase();
}

function menuItemClick(item){
	var menuItems = document.getElementById("menuBar").getElementsByClassName("menuItem");
	var reset = false;
	if(contains(item.classList, "selected")){
		item.classList.remove("selected");
		item.getElementsByClassName("dropdown")[0].classList.remove("open");
		reset = true;
	}
	for(var i = 0; i < menuItems.length; i++){
		menuItems[i].classList.remove("selected");
		menuItems[i].getElementsByClassName("dropdown")[0].classList.remove("open");
	}
	if(!reset){
		item.classList.add("selected");
		item.getElementsByClassName("dropdown")[0].classList.add("open");
	}
}

function closeAllMenus(){
	var menuItems = document.getElementById("menuBar").getElementsByClassName("menuItem");
	for(var i = 0; i < menuItems.length; i++){
		menuItems[i].classList.remove("selected");
		menuItems[i].getElementsByClassName("dropdown")[0].classList.remove("open");
	}
}

function minimizeApp(){
	remote.getCurrentWindow().minimize();
}

function maximizeApp(){
	remote.getCurrentWindow().maximize();
}

function exitApp(){
	remote.getCurrentWindow().close();
}

function contains(arr, item){
	for(var i = 0; i < arr.length; i++){
		if(arr[i] == item){
			return true;
		}
	}
	return false;
}