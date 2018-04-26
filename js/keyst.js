var key_strokes = {"SHIFT":0, "ENTER":0, "CTRL":0, "KEY_F":0, "LMB":0, "RMB":0};
function setKeyValsDown(e){
	if(e.keyCode == 16){
		key_strokes["SHIFT"] = 1
	}
	if(e.keyCode == 13){
		key_strokes["ENTER"] = 1
	}
	if(e.keyCode == 70){
		key_strokes["KEY_F"] = 1;
	}
	if(e.keyCode == 17){
		key_strokes["CTRL"] = 1;
	}
}
function setKeyValsUp(e){
	if(e.keyCode == 16){
		key_strokes["SHIFT"] = 0
	}
	if(e.keyCode == 13){
		key_strokes["ENTER"] = 0
	}
	if(e.keyCode == 70){
		key_strokes["KEY_F"] = 0;
	}
	if(e.keyCode == 17){
		key_strokes["CTRL"] = 0;
	}
}
function setLMBValsDown(){
	key_strokes["LMB"] = 1;
}
function setLMBValsUp(){
	key_strokes["LMB"] = 0;
}