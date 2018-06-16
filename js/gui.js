const remote = require('electron').remote
const dialog = remote.dialog;
var content;
var byte_data = [];
var fs = require('fs');
var bytes = [];
var selectedBytes = [];
var copyBytes = [];
var prefabs = new Map();
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
	setKeyValsDown(e);
	if(key_strokes["SHIFT"] == 1){
		altSelect = 1;
	}
	if(key_strokes["CTRL"] == 1){
		if(key_strokes["KEY_C"] == 1){
			copyByteBlocks();
		}
		else if(key_strokes["KEY_V"] == 1){
			pasteByteBlocks();
		}
		else if(key_strokes["KEY_P"] == 1){
			addPrefab();
		}
	}
	if(key_strokes["KEY_R"] == 1){
		var byt = parseInt(bytes[focusByte.getAttribute("data-index")], 16);
		// If revealed
		if(!contains(focusByte.classList, "revealed")){
			console.log(byt);
			if(byt > 31 && byt < 127){
				if(byt > 32){
					focusByte.innerText = String.fromCharCode(parseInt(focusByte.innerText, 16));
				}
				else{
					focusByte.innerText = "\\s"
				}
				focusByte.classList.add("revealed");
				status("Ready");
			}
			else{
				error("Character not viewable");
			}
		}
		// Otherwise
		else{
			focusByte.innerText = formatHex(byt.toString(16));
			focusByte.classList.remove("revealed");
			status("Ready");
		}
	}
	if(key_strokes["ENTER"] == 1 && key_strokes["SHIFT"] == 1){
		if(document.getElementById("editText") === document.activeElement){
			if(!contains(selectedBytes, focusByte)){
				selectedBytes.push(focusByte);
			}
			for(var i = 0; i < selectedBytes.length; i++){
				if(selectedBytes[i].innerText != document.getElementById("editText").value.toUpperCase()){
					var val = getDecimalFromParse(document.getElementById("editText").value);
					if(val < MAX_BYTE_SIZE){
						selectedBytes[i].innerText = formatHex(val.toString(16).toUpperCase());
						byte_data[selectedBytes[i].getAttribute("data-index")] = val;
						selectedBytes[i].classList.add("modified");
						status("Ready");
					}
					else{
						error("Input value for byte larger than MAX BYTE SIZE(255)");
					}
				}
			}
		}
	}
	else if(key_strokes["ENTER"] == 1 && key_strokes["CTRL"] == 1){
		altSelect = 1;
		if(document.getElementById("editText") === document.activeElement){
			if(focusByte.innerText != document.getElementById("editText").value.toUpperCase()){
				var val = getDecimalFromParse(document.getElementById("editText").value);
				if(val < MAX_BYTE_SIZE){
					focusByte.innerText = formatHex(val.toString(16).toUpperCase());
					byte_data[focusByte.getAttribute("data-index")] = val;
					focusByte.classList.add("modified");
					status("Ready");
					for(var i = 0; i < selectedBytes.length; i++){
						if(selectedBytes[i] == focusByte){
							byteEvent(selectedBytes[(i+1)%selectedBytes.length]);
							break;
						}						
					}
				}
				else{
					error("Input value for byte larger than MAX BYTE SIZE(255)");
				}
			}
		}
		altSelect = 0;
	}
	else{
		if(key_strokes["ENTER"] == 1){
			if(document.getElementById("editText") === document.activeElement){
				if(focusByte.innerText != document.getElementById("editText").value.toUpperCase()){
					var val = getDecimalFromParse(document.getElementById("editText").value);
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
	}
	if(key_strokes["KEY_F"] == 1){
		$('.container').animate({
			scrollTop: focusByte.offsetTop-350}, 800);
	}
}

window.onkeyup = function(e){
	setKeyValsUp(e);
	if(e.keyCode == 16){
		altSelect = 0;
	}
}

window.onmousedown = function(){
	setLMBValsDown();
}

window.onmouseup = function(){
	setLMBValsUp();
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
			for(var i = 0; i < bytes.length; i++){
				container.innerHTML += "<div class='byteBlock' onclick='byteEvent(this)' onmouseover='updateLine(this);showprefab(this);if(key_strokes[\"SHIFT\"] == 1 && key_strokes[\"LMB\"] == 1){ byteEvent(this); }' data-index='" + i + "'>" + bytes[i] + "</div>";
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
				selectedBytes = [];
				$(".wrapper").css("pointer-events", "initial");
			}, function(){
				dialogBox.close();
				$(".wrapper").animate({'opacity': 1}, 300);
				$(".wrapper").css("pointer-events", "initial");
			});
			$(".wrapper").css("pointer-events", "none");
			dialogBox.show();
		}
		else{
			for(var i = 0; i < byteBlocks.length; i++){
				byteBlocks[i].classList.remove("active");
			}
		}
	}
	else{
		selectedBytes.push(item);
		selectedBytes.sort(function(a, b){
			return a.getAttribute("data-index") - b.getAttribute("data-index");
		});
		console.log(selectedBytes);
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
	if(remote.getCurrentWindow().isMaximized()){
		remote.getCurrentWindow().unmaximize();
	}	
	else{
		remote.getCurrentWindow().maximize();
	}
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
	else if(input.match(/[0-9]+Dec/) != null){
		return parseInt(input.split("Dec")[0]);
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

function about(){
	$(".wrapper").animate({'opacity': 0.4}, 300);
	var dialogBox = new DialogBox("About", "MetaEdix is grid-based hex editor.", function(){
				dialogBox.close();
				$(".wrapper").animate({'opacity': 1}, 300);
				$(".wrapper").css("pointer-events", "initial");
			}, function(){
				dialogBox.close();
				$(".wrapper").animate({'opacity': 1}, 300);
				$(".wrapper").css("pointer-events", "initial");
			});
			$(".wrapper").css("pointer-events", "none");
	dialogBox.show();
}

function search(){
	$(".wrapper").animate({'opacity': 0.4}, 300);
	var dialogBox = new TextDialogBox("Search for Byte", "Enter the byte to search for", function(){
				dialogBox.close();
				$(".wrapper").animate({'opacity': 1}, 300);
				$(".wrapper").css("pointer-events", "initial");
				var byteBlock = document.getElementsByClassName("byteBlock");
				for(var i = 0; i < byte_data.length; i++){
					if(byte_data[i] == getDecimalFromParse(dialogBox.textBox.value)){
						var foundbyte = byteBlock[i];
						selectedBytes.push(foundbyte);
						foundbyte.classList.add("active");
					}
				}
			}, function(){
				dialogBox.close();
				$(".wrapper").animate({'opacity': 1}, 300);
				$(".wrapper").css("pointer-events", "initial");
			});
			$(".wrapper").css("pointer-events", "none");
	dialogBox.show();
}

function searchWord(){
	$(".wrapper").animate({'opacity': 0.4}, 300);
	var dialogBox = new TextDialogBox("Search for Word", "Enter the word to search for(separate by ',')", function(){
				dialogBox.close();
				$(".wrapper").animate({'opacity': 1}, 300);
				$(".wrapper").css("pointer-events", "initial");
				var byteBlock = document.getElementsByClassName("byteBlock");
				var byteList = dialogBox.textBox.value.split(",");
				for(var i = 0; i < byte_data.length; i++){
					if((byteList.length + i) > (byteBlock.length - 1)) break;
					var wordSelect = [];
					for(var k = 0; k < byteList.length; k++){
						if(byte_data[i + k] == getDecimalFromParse(byteList[k])){
							wordSelect.push(i+k);
						}
						else{
							wordSelect = [];
							break;
						}
					}
					for(var j = 0; j < wordSelect.length; j++){
						var foundbyte = byteBlock[wordSelect[j]];
						selectedBytes.push(foundbyte);
						foundbyte.classList.add("active");
					}
				}
			}, function(){
				dialogBox.close();
				$(".wrapper").animate({'opacity': 1}, 300);
				$(".wrapper").css("pointer-events", "initial");
			});
			$(".wrapper").css("pointer-events", "none");
	dialogBox.show();
}

function addPrefab(){
	if(selectedBytes.length > 0){
		if(checkValidSelection()){
			$(".wrapper").animate({'opacity': 0.4}, 300);
			var dialogBox = new TextDialogBox("Add Prefab", "Enter the name of the prefab", function(){
						dialogBox.close();
						$(".wrapper").animate({'opacity': 1}, 300);
						$(".wrapper").css("pointer-events", "initial");
						prefabs.set(dialogBox.textBox.value, Array.from(selectedBytes));
						for(var i = 0; i < selectedBytes.length; i++){
							selectedBytes[i].classList.add("prefab");
							selectedBytes[i].setAttribute("data-prefab", dialogBox.textBox.value);
						}
					}, function(){
						dialogBox.close();
						$(".wrapper").animate({'opacity': 1}, 300);
						$(".wrapper").css("pointer-events", "initial");
					});
					$(".wrapper").css("pointer-events", "none");
			dialogBox.show();
		}
		else{
			error("Selected bytes contain bytes already part of a prefab.");
		}
	}
	else{
		error("Need to select bytes to create a prefab.");
	}
}

function removePrefab(name){
	var prefab = prefabs.get(name);
	for(var i = 0; i < prefab.length; i++){
		prefab[i].classList.remove("prefab");
		prefab[i].setAttribute("data-prefab", null);
		prefabs.delete(name);
	}
}

function removePrefabClick(){
	$(".wrapper").animate({'opacity': 0.4}, 300);
	var dialogBox = new ComboDialogBox("Remove Prefab", "Select a prefab structure to remove", Array.from(prefabs.keys()), function(){
		dialogBox.close();
		$(".wrapper").animate({'opacity': 1}, 300);
		$(".wrapper").css("pointer-events", "initial");
		removePrefab(dialogBox.comboBox.value);
	}, function(){
		dialogBox.close();
		$(".wrapper").animate({'opacity': 1}, 300);
		$(".wrapper").css("pointer-events", "initial");
	});
	$(".wrapper").css("pointer-events", "none");
	dialogBox.show();
}

function searchPrefab(){
	$(".wrapper").animate({'opacity': 0.4}, 300);
	var dialogBox = new ComboDialogBox("Search for Prefab", "Select a prefab structure to search for", Array.from(prefabs.keys()), function(){
		dialogBox.close();
		$(".wrapper").animate({'opacity': 1}, 300);
		$(".wrapper").css("pointer-events", "initial");
		// TODO
	}, function(){
		dialogBox.close();
		$(".wrapper").animate({'opacity': 1}, 300);
		$(".wrapper").css("pointer-events", "initial");
	});
	$(".wrapper").css("pointer-events", "none");
	dialogBox.show();
}

function showprefab(block){
	var prefabName = block.getAttribute("data-prefab");
	if(prefabName != null){
		status("<prefab: " + prefabName + ">");
	}
	else{
		status("Ready");
	}
}

function checkValidSelection(){
	for(var i = 0; i < selectedBytes.length; i++){
		if(selectedBytes[i].getAttribute("data-prefab") != null){
			return false;
		}
	}
	return true;
}

function copyByteBlocks(){
	if(selectedBytes.length > 0){
		copyBytes = selectedBytes;
	}
	else{
		copyBytes = [focusByte];
	}
}

function pasteByteBlocks(){
	if(copyBytes.length == selectedBytes.length){
		for(var i = 0; i < copyBytes.length; i++){
			var val = getDecimalFromParse(copyBytes[i].innerText);
			selectedBytes[i].innerText = copyBytes[i].innerText;
			byte_data[copyBytes[i].getAttribute("data-index")] = val;
			selectedBytes[i].classList.add("modified");
			status("Ready");
		}
	}
	else if(selectedBytes.length == 0 && copyBytes.length == 1){
		var val = getDecimalFromParse(copyBytes[0].innerText);
		focusByte.innerText = copyBytes[0].innerText;
		byte_data[copyBytes[0].getAttribute("data-index")] = val;
		focusByte.classList.add("modified");
		status("Ready");
	}
	else if (copyBytes.length == 0){
		error("Nothing has been copied.");
	}
	else{
		error("There are " + copyBytes.length + " bytes in the copy data. You have " + (selectedBytes.length + 1) + " bytes selected.");
	}
}