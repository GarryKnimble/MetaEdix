<p align="center">
<img src="https://github.com/JohnPhilosopher/MetaEdix/blob/master/logo.png?raw=true"/>
</p>

# MetaEdix
MetaEdix is a Hex editor with the intent of making file-byte editing a breeze. The philosophy employed by the hex editor is all grids. All bytes are on a grid-like structure and are edited as such.

![enter image description here](https://raw.githubusercontent.com/JohnPhilosopher/MetaEdix/master/MetaEdix.png)
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
### Ideas
 - State machine implementation for file editing
 - Storing objects of byte block compositions for various features, such as searching and modification
 - Other ideas that might come about
 - Plugins made in Python 3
## License
MetaEdix is licensed under the [GNU General Public License v3.0](https://github.com/JohnPhilosopher/MetaEdix/blob/master/LICENSE). 
Other libraries used in MetaEdix have their own respective licenses and fall under those licenses.
