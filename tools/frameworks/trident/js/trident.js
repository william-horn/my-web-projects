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
    - Trident *
    - Neptune



oceanic function name ideas:
wash
erode
beach
splash
flip
sonar 
goFish()
findNemo()
surf -- fetch? like 'surf' the web? kinda fits
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
release



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

    todo: add jQuery support later (maybe)
    todo: create element wrapper 
    todo: lookinto 'Object.defaultProperties' and 'new Proxy()'

==================================================================================================================================
*/

/* ----------------------- */
/* Internal Program States */
/* ----------------------- */

// export
let ref;

// local
{
    // trident package
    const trident = {
        _env: {},
        _wrapper_cache: new Map(),
    }

    const baseWrapper = {
        clientHeight: {value: 'value'},
    }

    /* ---------------------- */
    /* General Util Functions */
    /* ---------------------- */
    // wraps new properties/methods around a given element
    function wrap(element) {
        Object.defineProperties(element, baseWrapper);
        return element
    }

    // query select an element
    baseWrapper.ref = {
        value: function(selector) {
            // if function is called as a method, use 'this', otherwise use document
            const thisEl = this === window ? document : this;
            const query = selector.trim();
            const thatEl = thisEl.querySelector(query);

            if (trident._wrapper_cache.get(thatEl)) {
                console.log('already has wrapper:', thatEl);
                return thatEl;
            }

            // could do /^\^/.exec(query), but query[0] is probably faster
            trident._wrapper_cache.set(thatEl, true);
            return wrap(thatEl);
        }
    }

    // get children of element
    baseWrapper.getChildren = {
        value: function(el=this) {
            return el.children;
        }
    }

    baseWrapper.empty = {
        value: function(el=this) {
            const nodes = this.getChildren(el);
            for (let i = nodes.length - 1; i >= 0; i--) {
                nodes[i].remove();
            }
        }
    }

    baseWrapper.delegate = {
        value: function(window, targets) {

        }
    }

    baseWrapper.test = {
        value: function() {
            console.log('obj:', this); // the element itself
            console.log('func: ', this.clientHeight); // searches in the element's custom properties, then legacy properties
        }
    }

    ref = baseWrapper.ref.value;

}

// function htmlel() {}
// htmlel.prototype = Node.prototype;

// class OceanWrap extends htmlel {
//     constructor(el) {
//         super();
//         this.fish = fish;
//         this.getChildren = getChildren;
//         this.destroy = destroy;
//         this.empty = empty;
//     }
// }


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
