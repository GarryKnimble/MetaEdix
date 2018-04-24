const remote = require('electron').remote
const dialog = remote.dialog;
var content;
var byte_data = [];
var fs = require('fs');
var bytes = [];
var focusByte;
var menuSelect = 0;
var altSelect = 0;
var currentFile = "";
var MAX_BYTE_SIZE = 256;
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
				var val = getDecimalFromParse(document.getElementById("editText").value);
				console.log(val);
				if(val < MAX_BYTE_SIZE){
					focusByte.innerText = formatHex(val.toString(16).toUpperCase());
					byte_data[focusByte.getAttribute("data-index")] = val;
					focusByte.classList.add("modified");
					status("Ready");
				}
				else{
					error("Input value for byte larger than MAX BYTE SIZE(255)");
				}
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
		fs.readFile(filename[0], 'utf8', 'rb', function (err, data){
			if(err) return console.log(err);
			document.getElementById("win-title").innerText = "MetaEdix - " + filename[0];
			document.title = "MetaEdix - " + filename[0];
			var container = document.getElementsByClassName("content")[0];
			container.innerHTML = "";
			bytes = [];
			byte_data = [];
			content = data;
			for(var i = 0; i < data.length; i++){
				var hex = content.charCodeAt(i).toString(16);
				if(hex.length < 2){
					hex = "0" + hex;
				}
				bytes.push(hex.toUpperCase());
				byte_data.push(content.charCodeAt(i));
			}
			console.log(byte_data);
			for(var i = 0; i < bytes.length; i++){
				container.innerHTML += "<div class='byteBlock' onclick='byteEvent(this)' onmouseover='updateLine(this)' data-index='" + i + "'>" + bytes[i] + "</div>";
			}
		});
	});
}

function saveFile(){
	dialog.showSaveDialog({properties: ['saveFile']}, 
	function(filename){
		var content = "";
		const byte_array = new Uint8Array(byte_data.length);
		byte_array.set(byte_data);
		byte_array.forEach(function(element, index, array){
			console.log(element);
			content += String.fromCharCode(element);
		});
		fs.writeFile(filename, content, 'utf8', '0o666', 'wb', function(err){
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
	document.getElementById("editText").disabled = false;
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
		menuSelect = 0;
	}
	else{
		menuSelect = 1;
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

function menuItemHover(item){
	if(menuSelect == 1){
		if(contains(item.classList, "selected") == false){
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
	}
}

function closeAllMenus(){
	var menuItems = document.getElementById("menuBar").getElementsByClassName("menuItem");
	for(var i = 0; i < menuItems.length; i++){
		menuItems[i].classList.remove("selected");
		menuItems[i].getElementsByClassName("dropdown")[0].classList.remove("open");
	}
	menuSelect = 0;
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

function getDecimalFromParse(input){
	if(input.split(" ").length > 1){
		return convertBinToDec(input.split(" ")[0] + input.split(" ")[1]);
	}
	else if(input.match(/[0-9]+D/) != null){
		return parseInt(input.split("D")[0]);
	}
	else{
		return parseInt(input, 16);
	}
}

function formatHex(str){
	while(str.length < 2){
		str = "0" + str;
	}
	return str;
}

function convertBinToDec(bin){
	var result = 0;
	for(var i = bin.length - 1; i >= 0; i--){
		result += parseInt(bin.charAt(i))*Math.pow(2,  (bin.length - 1) - i); 
	}
	return result;
}

function status(val){
	var statusLabel = document.getElementById("status");
	statusLabel.style.color = "#FFFFFF";
	statusLabel.innerText = val;
}

function error(val){
	var statusLabel = document.getElementById("status");
	statusLabel.style.color = "#FF2A2A";
	statusLabel.innerText = val;
}