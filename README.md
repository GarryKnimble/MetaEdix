<p align="center">
<img src="https://github.com/JohnPhilosopher/MetaEdix/blob/master/logo.png?raw=true"/>
</p>

# MetaEdix
MetaEdix is a Hex editor with the intent of making file-byte editing a breeze. The philosophy employed by the hex editor is all grids. All bytes are on a grid-like structure and are edited as such. This application intends to provide ways to edit bytes in files with efficiency in mind.

![enter image description here](https://raw.githubusercontent.com/JohnPhilosopher/MetaEdix/develop/MetaEdix.png)
## Getting Started
To run MetaEdix, npm must be installed. <a href="https://www.npmjs.com/get-npm" target="_blank">Here</a> is a link to installation guide for npm.
Next, install Electron. <a href="https://electronjs.org/docs/tutorial/installation" target="_blank">This</a> guide can show the ways to install Electron. It is preferred that Electron is installed globally for the rest of the instructions.
After installing Electron, clone the MetaEdix repository into any folder. After doing so, go into the MetaEdix repository folder and do the following command:
```
npm start
```
And there you go! Start testing with MetaEdix and see what you can do.

### Features
 - Selecting multiple bytes via holding SHIFT key and clicking
 - Editing individual bytes
 - Bringing back focus on selected byte via F key
 - Grid-editor environment
 - Edited byte blocks revealed
 - Saving file after editing
 - Grid-editor environment
 - Editing byte blocks via decimal, binary, or hexadecimal values
 - If selected multiple byte blocks and user selects without SHIFT key, asks whether to deselect other byte blocks or not.
### Upcoming Features
 - Saving projects for file editing
 - Loading byte blocks when scrolling rather than at once
 - Search capabilities
 - Edit capabilities(undo, redo, copy, paste, cut...)
 - Settings
 - Multiple windows for different stuff
 - Tools
 - Different byte column size editing

### Ideas
 - State machine implementation for file editing
 - Storing objects of byte block compositions for various features, such as searching and modification
 - Other ideas that might come about
 - Plugins made in Python 3
## Known Issues
- Selecting the first byte with multiple selection method doesn't select first byte in select phase
## License
MetaEdix is licensed under the [GNU General Public License v3.0](https://github.com/JohnPhilosopher/MetaEdix/blob/master/LICENSE). 
Other libraries used in MetaEdix have their own respective licenses and fall under those licenses.
