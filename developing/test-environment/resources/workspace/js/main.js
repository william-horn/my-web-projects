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

Coming soon

==================================================================================================================================

? @document-todo
=================
| DOCUMENT TODO |
==================================================================================================================================

-   

==================================================================================================================================
*/

/* ---------------- */
/* Import Libraries */
/* ---------------- */
import PseudoEvent from '../../../../../tools/api/general/js/pseudo-events-2.1.0.js';

let el_0 = ref('.class-0-0-0'); // master container
let el_1 = el_0.ref('.class-2-0-1'); // click target
let el_2 = el_0.ref('.class-1-0-0'); // control

el_0.addEventListener('click', function(e) {
    console.log('master container clicked');
})

el_1.addEventListener('click', function(e) {
    console.log('target clicked');
})

el_2.addEventListener('click', function(e) {
    console.log('random thing clicked');
})

const ev = new PseudoEvent();

const f_0 = () => console.log('func 1');
const f_1 = () => console.log('func 2');
const f_2 = () => console.log('func 3');

ev.connect('bob', f_0);
ev.connect('bob', f_1);
ev.strongConnect('harold', f_2);

ev.pause(f_2, true)
console.log(ev);

ev.trigger();

// el_0.delegate('click', [
//     {target: el_1, metadata: {type: true}},
//     {target: el_2, metadata: {type: true}},
//     {target: el_3, metadata: {type: true}},
// ]);

// delegate(el_0, [el_1]).click();
// el_1.click();


// delegate(el_0, [el_1]);
// el_0.click();



/* ------------------------- */
/* Global Element References */
/* ------------------------- */

/* ----------------------- */
/* Internal Program States */
/* ----------------------- */


/* ---------------------- */
/* General Util Functions */
/* ---------------------- */

/* ------------------------ */
/* Dedicated Util Functions */
/* ------------------------ */

/* ------------------------ */
/* Event Callback Functions */
/* ------------------------ */


/* -------------------------- */
/* Connect Js Event Listeners */
/* -------------------------- */
