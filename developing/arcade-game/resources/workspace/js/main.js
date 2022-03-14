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
$gameGraphicsDisplay.parentElement.style.position = "relative";
$gameGraphicsDisplay.style.position = "absolute";


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

let r = 100;
let i = 0;
let d = 50;

Math.mod

let routine = setInterval(() => {
    let theta = rad((1 - i/d)*90);
    let x = Math.cos(theta)*r;
    let y = Math.sin(theta)*r;

    drawLine(0, 0, x, y);
    i++;

    if (i > d) {
        clearInterval(routine);
    }
}, 100)
