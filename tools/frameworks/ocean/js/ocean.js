/*
? @document-start
======================
| MAIN PROGRAM LOGIC |
==================================================================================================================================

? @author:                 William J. Horn
? @document-name:          dolphin.js
? @document-created:       03/26/2022
? @document-modified:      03/26/2022
? @document-version:       v1.0.0

==================================================================================================================================

? @document-info
==================
| ABOUT DOCUMENT |
==================================================================================================================================

Project inspiration: 
    - easy DOM interaction
    - automatic event handling/delegation
    - group relevant elements with event data

Framework name ideas: 
    - Ocean
    - Fishify?
    - Fishy
    - Fishi
    - DeepC
    - DeepSea



function name ideas:
wash
erode
beach
splash
flip
sonar 
goFish()
findNemo()
surf
flounder
vortex
fishtank
pond
school
coast
swim
dock
shrimp
absorb
trench


listeners: {}
    click: PseudoEvent
        

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


/* ----------------------- */
/* Internal Program States */
/* ----------------------- */
// check for jQuery compatibility
const jq = !!window.jQuery;

// ocean package
const ocean = {
    env: {},
    schools: {},
}

/* ---------------------- */
/* General Util Functions */
/* ---------------------- */
// get children of element
function getSchool(el=this) {
    return jq ? $(el).children() : el.children;
}

// 'el=this' allows for using this function normally and as a method
// ex: release(el) && el.release();
// remove an individual element
function release(el=this) {
    if (jq) {
        $(el).remove();
    } else {
        el.remove();
    }
}

// query select an element
function fishFor(selector) {
    const el = this === window ? document : this; // if function is called as a method, use 'this', otherwise use document
    const query = selector.trim();
    return query[0] === '^' // could do /^\^/.exec(query), but query[0] is probably faster
        ? el.querySelectorAll(query.substr(1)) : el.querySelector(query);
}

function releaseAll(el) {
    const fishies = getSchool(el);
    for (let i = fishies.length - 1; i <= 0; i--) {
        release.call(fishies[i]);
    }
}

function newSchool(el, targets) {

}




const el_0 = fishFor('#selector-0');
const el_3 = el_0.fishFor('#selector-1')

el.fishFor()

el.release()

const tank = newSchool(el, [b1, b2, b3])


releaseFish(el);

ocean.env.useInheritedPrototype = function() {
    Object.prototype.fishFor = fishFor;
    Object.prototype.release = release;
}


/*

if you put something inside of obj.__proto__, then it will act like a Lua __index metamethod.
ex: 

const obj = {};
obj.__proto__.key = 'value';

obj.key // => 'value'

creating a constructor function allows you to use the 'prototype' property which
enables inheritance
ex:

function construct() {
    this.name = 'Will';
}

construct.prototype.shared = 'shared!'; // this will be inherited to objects who's __proto__ points to this prototype




*/
