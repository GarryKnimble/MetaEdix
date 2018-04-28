const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');


function createWindow(){
	win = new BrowserWindow({width: 1000, height: 786, frame: false});
	win.setMenu(null);
	win.webContents.openDevTools();
	win.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}));
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if(process.platform !== 'darwin'){
		app.quit();
	}
});

app.on('activate', () => {
	if (win === null){
		createWindow();
	}
});
