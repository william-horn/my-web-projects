/*
? @document-start
======================
| MAIN PROGRAM LOGIC |
==================================================================================================================================

? @author:                 William J. Horn
? @document-name:          main.js
? @document-created:       03/24/2022
? @document-modified:      03/24/2022
? @document-version:       v1.0.0

==================================================================================================================================

? @document-info
==================
| ABOUT DOCUMENT |
==================================================================================================================================

Handle Weather Dashboard logic

==================================================================================================================================

? @document-changelog
======================
| DOCUMENT CHANGELOG |
==================================================================================================================================

==================================================================================================================================

? @document-todo
=================
| DOCUMENT TODO |
==================================================================================================================================

==================================================================================================================================
*/

/* ---------------- */
/* Import Libraries */
/* ---------------- */
import datastore from "../../../../../tools/api/general/js/datastore-1.0.0.js";
import PseudoEvent from "../../../../../tools/api/general/js/pseudo-events-2.1.0.js";

// working link: https://api.openweathermap.org/data/2.5/weather?q=Raleigh&APPID=19eecb01033710945577be8f1d9f7976
// my api key: 594655f7cc53f85edac45ab1fd9d4a8a

async function getRequest(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

const data = getRequest("https://api.openweathermap.org/data/2.5/weather?q=Raleigh,NC,US&appid=594655f7cc53f85edac45ab1fd9d4a8a");
data.then(data => {
    console.log("finally: ", data);
})


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
