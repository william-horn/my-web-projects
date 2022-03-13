/*
? @document-start
=========================
| GENERIC API UTILITIES |
==================================================================================================================================

? @author:                 William J. Horn
? @document-name:          gutil.js
? @document-created:       03/04/2022
? @document-modified:      03/11/2022
? @document-version:       v1.0.0

==================================================================================================================================

? @document-info
==================
| ABOUT DOCUMENT |
==================================================================================================================================

This is a weird limbo state where my code that doesn't fit under any library category currently lives
until I can find it a purpose. Behold, the "general utility" library.

==================================================================================================================================

? @document-api
=============
| ABOUT API |
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

const gutil = {}

gutil.randomInt = function(min, max) {
    if (!max) { max = min; min = 0; }
    [min, max] = [Math.floor(min), Math.floor(max)];
    return min + Math.floor((max - min + 1)*Math.random());
}

gutil.randomizeArray = function(array) {
    for (let i = 0; i < array.length; i++) {
        let randIndex = this.randomInt(i, array.length - 1);
        [array[i], array[randIndex]] = [array[randIndex], array[i]];
    }
    return array;
}

gutil.weakCloneArray = function(array) {
    let newArray = [];
    for (let i = 0; i < array.length; i++) {
        newArray[i] = array[i];
    }
    return newArray;
}

gutil.getRandomIndex = function(array) {
    return array[randomInt(array.length - 1)];
}

export default gutil;