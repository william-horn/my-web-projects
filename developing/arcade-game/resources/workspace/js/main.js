/*
? @document-start
======================
| MAIN PROGRAM LOGIC |
==================================================================================================================================

? @author:                 William J. Horn
? @document-name:          main.js
? @document-created:       
? @document-modified:      
? @document-version:       v0.0.0

==================================================================================================================================

? @document-info
==================
| ABOUT DOCUMENT |
==================================================================================================================================

Coming soon

==================================================================================================================================

? @document-changelog
======================
| DOCUMENT CHANGELOG |
==================================================================================================================================

* If there is a 'changelog' folder within this file directory then information on it's contents can be found here:
https://github.com/william-horn/my-coding-conventions/blob/main/document-conventions/about-changelog.txt

==================================================================================================================================

? @document-todo
=================
| DOCUMENT TODO |
==================================================================================================================================

-

==================================================================================================================================
*/

const $gameGraphicsDisplay = document.querySelector("#main-game-window canvas");
const gameGraphics = $gameGraphicsDisplay.getContext("2d");

function drawLine(fromX, fromY, toX, toY) {
    gameGraphics.beginPath();
    gameGraphics.moveTo(fromX, fromY);
    gameGraphics.lineTo(toX, toY);
    gameGraphics.closePath();
    gameGraphics.stroke();
}

function rad(deg) {
    return (deg*Math.PI)/180;
}

let radius = 100;
let counter = 0;
let parts = 200;
let routine = setInterval(() => {
    let theta = rad((1 - counter/parts)*90);
    let x = Math.cos(theta)*radius;
    let y = Math.sin(theta)*radius;
    drawLine(0, 0, x, y);
    counter++;
    if (counter > parts) {
        clearInterval(routine);
    }
}, 100)

