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


const ev_0 = new PseudoEvent();
const ev_1 = new PseudoEvent(ev_0);
const ev_2 = new PseudoEvent(ev_1);
const ev_3 = new PseudoEvent(ev_2);

const f_0 = () => console.log('func 1');
const f_1 = () => console.log('func 2');
const f_2 = () => console.log('func 3');

ev_0.connect(f_0);
ev_1.connect(f_0);
ev_2.connect(f_0);
ev_3.connect(f_0);

// ev_0.pauseAll(true); // pause-strong
// ev_0.resumeAll(); // listening-weak
// ev_1: // listening-strong
ev_0.pauseAll(true); // paused-strong
ev_0.resumeAll(); // listening-weak
ev_1.pauseAll() // paused-weak
ev_1.resumeAll() // listening-strong
ev_0.resumeAll(true);
console.log(ev_0);

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
