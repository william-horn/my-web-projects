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
import jsinit from "../../../../../tools/api/general/js/js-init-1.0.0.js";
import datastore from "../../../../../tools/api/general/js/datastore-1.0.0.js";

/* ------------------------- */
/* Global Element References */
/* ------------------------- */

/* ----------------------- */
/* Internal Program States */
/* ----------------------- */
const datakeys = datastore.datakeys
datakeys.saveName = "my-local-data1";

console.log("cache before: ", datastore.cache[datakeys.saveName]);
const data = datastore.get(datakeys.saveName, {});
console.log("saved data: ", data);
console.log("cache after: ", datastore.cache[datakeys.saveName]);
datastore.update(datakeys.saveName, oldData => {
    oldData.name = "hey bill";
    return oldData;
});

/* ---------------------- */
/* General Util Functions */
/* ---------------------- */

/* ------------------------ */
/* Dedicated Util Functions */
/* ------------------------ */

/* ------------------------ */
/* Event Callback Functions */
/* ------------------------ */

function init() {
    
}

/* -------------------------- */
/* Connect Js Event Listeners */
/* -------------------------- */
jsinit(init);