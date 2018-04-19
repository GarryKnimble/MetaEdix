function DialogBox (title, message, OKEvent, CancelEvent){
	this.title = title;
	this.message = message;
	this.messageBox = document.createElement("div");
	this.btnOKEvent = OKEvent;
	this.btnCancelEvent = CancelEvent;
	this.show = showDialog;
	this.close = closeDialog;
}

function showDialog(){
	this.messageBox.classList.add("messagebox");
	
	var messageTitle = document.createElement("div");
	messageTitle.classList.add("message-title");
	var title = document.createElement("span");
	title.classList.add("mtitle");
	var titleText = document.createTextNode(this.title);
	title.appendChild(titleText);
	messageTitle.appendChild(title);
	
	var messageContent = document.createElement("div");
	messageContent.classList.add("message-content");
	var content = document.createTextNode(this.message);
	messageContent.appendChild(content);
	
	var messageControls = document.createElement("div");
	messageControls.classList.add("message-controls");
	var OKBtn = document.createElement("button");
	OKBtn.classList.add("btn-ok");
	OKBtn.innerText = "OK";
	var CancelBtn = document.createElement("button");
	CancelBtn.classList.add("btn-default");
	CancelBtn.innerText = "Cancel";
	messageControls.appendChild(OKBtn);
	messageControls.appendChild(CancelBtn);
	
	this.messageBox.appendChild(messageTitle);
	this.messageBox.appendChild(messageContent);
	this.messageBox.appendChild(messageControls);
	
	document.body.appendChild(this.messageBox);
	CancelBtn.onclick = this.btnCancelEvent;
	OKBtn.onclick = this.btnOKEvent;
}

function closeDialog(){
	document.body.removeChild(this.messageBox);
}