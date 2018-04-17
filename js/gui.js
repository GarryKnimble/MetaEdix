const remote = require('electron').remote
const dialog = remote.dialog;
var content;
var fs = require('fs');
var byte_data = [];
var bytes = [];
var focusByte;
var altSelect = 0;
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
function deselectMBox(){
	$(".wrapper").animate({'opacity': 0.6}, 300);
	$(".wrapper").attr('disabled', 'disabled');
	$(".messagebox").removeClass('hidden');
}
dialog.showOpenDialog({properties: ['openFile']}, 
function(filename){
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
	});
});

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
			deselectMBox();
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

function minimizeApp(){
	remote.getCurrentWindow().minimize();
}

function maximizeApp(){
	remote.getCurrentWindow().maximize();
}

function exitApp(){
	remote.getCurrentWindow().close();
}