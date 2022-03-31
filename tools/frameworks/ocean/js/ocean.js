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

ocean.env.useInheritance = function() {
    Node.prototype.fishFor = fishFor;
    Node.prototype.release = release;
}


/*
notes:

if you put something inside of obj.__proto__, then it will act like a Lua __index metamethod.
ex: 

    const obj = {};
    obj.__proto__.key = 'value';

    obj.key // => 'value'

... however, we DON'T want to do this. this will add fields to the global __proto__ chain links.

creating a constructor function allows you to use the 'prototype' property which
enables inheritance locally. 'prototype' is ONLY a property of functions (typically functions used as constructors)
ex:

    function construct() {
        this.name = 'William Horn';
    }

    construct.prototype.shared = 'shared!'; // this will be inherited by objects who's __proto__ points to this prototype

Use 'construct' as a constructor like this:

    const obj = new construct(); 
    console.log(obj.shared) // => 'shared!'


This is an example of inheritance (from my testing): 

    function construct_0() {
        this.first = 'first';
    }

    construct_0.prototype.level_0 = 'level-0';

    function construct_1() {
        this.second = 'second';
    }

    construct_1.prototype = new construct_0();

    const second = new construct_1();
    console.log(second)
    console.log(second.first) // => 'first'
    console.log(second.second) // => 'second'
    console.log(second.level_0) // => both objects reference the same property (level_0)


*/
