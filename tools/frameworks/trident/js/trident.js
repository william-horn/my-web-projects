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
    - Triton
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
    todo: create element wrapper  --DONE (for now)
    todo: lookinto 'Object.defaultProperties' and 'new Proxy()'

==================================================================================================================================
*/

/* ----------------------- */
/* Internal Program States */
/* ----------------------- */

// export
let ref;
let trident;

// local
{
    // trident package
    trident = {
        _env: {},
        _delegations: {},
        _wrapper_cache: new Map(),
        _wrapper: {
            baseWrapper: {
                // sample: {value: 10, writable: true}
            }
        },
    }

    const wrapper = trident._wrapper.baseWrapper;

    /* ---------------------- */
    /* General Util Functions */
    /* ---------------------- */
    // wraps new properties/methods around a given element
    function wrap(element) {
        Object.defineProperties(element, wrapper);
        return element
    }

    // query select an element
    wrapper.ref = {
        value: function(selector) {
            // if function is called as a method, use 'this', otherwise use document
            const thisEl = this === window ? document : this;
            const query = selector.trim();
            const thatEl = thisEl.querySelector(query);

            if (trident._wrapper_cache.get(thatEl)) {
                console.log('getting cached wrapper', thatEl);
                return thatEl;
            }

            // could do /^\^/.exec(query), but query[0] is probably faster
            trident._wrapper_cache.set(thatEl, true);
            return wrap(thatEl);
        }
    }

    // get children of element
    wrapper.getChildren = {
        value: function(el=this) {
            return el.children;
        }
    }

    wrapper.empty = {
        value: function(el=this) {
            const nodes = this.getChildren(el);
            for (let i = nodes.length - 1; i >= 0; i--) {
                nodes[i].remove();
            }
        }
    }

    wrapper.delegate = {
        value: function(targets) {

        }
    }

    wrapper.test = {
        value: function() {
            console.log('obj:', this); // the element itself
            console.log('func: ', this.clientHeight); // searches in the element's custom properties, then legacy properties
        }
    }

    ref = wrapper.ref.value;

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
