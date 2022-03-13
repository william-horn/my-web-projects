/*
? @document-start
========================
| NOISY SEARCH PROGRAM |
==================================================================================================================================

? @author:                 William J. Horn
? @document-name:          main.js
? @document-created:       03/02/2022
? @document-modified:      03/04/2022
? @document-version:       v0.0.0

==================================================================================================================================

? @document-info
==================
| ABOUT DOCUMENT |
==================================================================================================================================

This program is responsible for the main functionality of the search function and user input.

==================================================================================================================================

? @document-changelog
======================
| DOCUMENT CHANGELOG |
==================================================================================================================================

* If this program supports changelog records then there should be a 'changelog' folder within the same directory as this program
file. Learn more about the changelog system here: 
https://github.com/william-horn/my-coding-conventions/blob/main/document-conventions/about-changelog.txt

==================================================================================================================================

? @document-todo
=================
| DOCUMENT TODO |
==================================================================================================================================

-   Fix bug with button hover effects and and changing background colors
-   Implement a JavaScript scheduler using 'yield' for more efficient wait time simulations and task switching
-   Break apart heavy-duty functions into utility functions + main logic
-   Fix issue with calculated probability displaying incorrect numbers for large values

==================================================================================================================================
*/

/* ------------ */
/* Program Init */
/* ------------ */




// global constants
const MAX_STRING_LENGTH = 200;
const MAX_WORD_LENGTH = 15;
const DEFAULT_GEN_SPEED = 100; // ms

const DEBUG_PRINT_ON = true;

// program memory (don't change)
let IS_GENERATING = false;

// get html elements refs
const $searchOutput = document.querySelector("#search-output");
const $outputDisplayContainer = document.querySelector("#output-display-container");
const $wordInput = document.querySelector("#word-input");
const $stringLengthInput = document.querySelector("#length-input");
const $generateSearchButton = document.querySelector("#generate-search-btn");
const $probabilityInfoContainer = document.querySelector("#probability-info");
const $defaultStatsContainer = document.querySelector("#hide-default-stats");
const $theoStatsContainers = document.querySelector("#theo-stats-display");
const $expStatsContainer = document.querySelector("#exp-stats-display");
const $genSpeedInput = document.querySelector("#gen-speed");
const $cancelGenerateBtn = document.querySelector("#cancel-generate-btn");

// assign settings to elements
$wordInput.setAttribute("maxlength", MAX_WORD_LENGTH);

// store default css property states
let savedElementPropertyDefaults = {};




/* ----------------- */
/* Utility Functions */
/* ----------------- */




// hacky sleep stuff, replace with a scheduler later
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// debounce callback (is there a better way to do this?)
function debounce(func, delay) {
    let gate = true;
    return function(...args) {
        if (gate === true) {
            gate = false;
            func(...args);
            setTimeout(() => {
                gate = true
            }, delay)
        }
    }
}

// get weak copy of object (attributes only)
function weakObjectClone(obj) {
    let newObj = {};
    for (key in obj) newObj[key] = obj[key];
    return newObj;
}


// return a random integer ranging from min to max
function randomInt(min, max) {
    if (!max) {
        max = min;
        min = 0;
    }

    const rand = Math.random();
    return Math.floor(min*(1 - rand) + rand*max);
}

function debugPrint(...args) {
    if (DEBUG_PRINT_ON === true) {
        console.log(...args);
    }
}




/* ------------------- */
/* Dedicated Functions */
/* ------------------- */



// retrieve properties from default
function getDefaultProperties(element) {
    return savedElementPropertyDefaults[element];
}

// retrieve a default property
function getDefaultElementProperty(element, property) {
    let defEl = savedElementPropertyDefaults[element];
    return defEl[property] || defEl.style[property];
}

// set an element back to it's default state
function setElementPropertyToDefault(element, property) {
    let defEl = savedElementPropertyDefaults[element];
    element[property] ? element[property] = defEl[property] : element.style[property] = defEl.style[property];
}

// update the generate button with an input validation error message
function invalidSearchMessage(message, displayTime) {
    $generateSearchButton.textContent = message;
    $generateSearchButton.style.backgroundColor = "var(--theme-error-background-color)";

    setTimeout(function() {
        setElementPropertyToDefault($generateSearchButton, "backgroundColor");
        setElementPropertyToDefault($generateSearchButton, "textContent");
    }, displayTime ? displayTime*1000 : 1500);
}

// generate random lower-case letters from ASCII code
function getRandomLetterLower() {
    return String.fromCharCode(randomInt(97, 122));
}

// work on better decimal-to-string conversion
function calcInvertDecimal() {

}

// calculate theoretical probability of word generation based on word length and generated string length
function calcProbability(wordLength, genStrLength, truncFrac) {
    let prob = genStrLength/Math.pow(26, wordLength);
    console.log("change: ",prob);
    return {
        frac: truncFrac ? /[0\.]+[^0.]/.exec(prob)[0] : prob,
        int: Math.round(1/prob)
    };
}

function beginSearch() {
    IS_GENERATING = true;
    $generateSearchButton.style.display = "none";
    $cancelGenerateBtn.style.display = "block";
}

function cancelSearch() {
    IS_GENERATING = false
    $generateSearchButton.style.display = "block";
    $cancelGenerateBtn.style.display = "none";
}

// generate text to a container
function generateDynamicTextTo(parent, textData) {
    // clear existing children
    const parentChildren = parent.children;
    for (let i = 0; i < parentChildren.length; i++) {
        parentChildren[i].remove();
    }

    // create parent text object
    const $textEl = document.createElement("p");
    parent.appendChild($textEl);

    // generate text children
    for (let i = 0; i < textData.length; i++) {
        const info = textData[i];
        const $subtext = document.createElement("span");

        $subtext.textContent = info.content;
        if (info.style) $subtext.setAttribute("style", info.style);

        $textEl.append($subtext);
    }

    // return text children
    return $textEl.children;
}

// todo: partition 'generateSearch' into smaller functions
function generateSearch() {

    // debounce condition
    if (IS_GENERATING === true) return;

    const wordInputValue = $wordInput.value;
    let genSpeedValue = parseInt($genSpeedInput.value);
    let genStringLength = parseInt($stringLengthInput.value);

    // handle no word input or no length input
    if (!wordInputValue || isNaN(genStringLength) || isNaN(genSpeedValue)) {
        invalidSearchMessage("Incomplete data. Try again.");
        return;
    } else if (genStringLength > MAX_STRING_LENGTH) {
        invalidSearchMessage(`String length must be <= ${MAX_STRING_LENGTH}.`);
        return;
    }

    // begin search and set debounce
    beginSearch();

    // update text info when successful generation starts
    genStringLength = Math.max(wordInputValue.length, genStringLength);
    $stringLengthInput.value = genStringLength;

    // hide the default probability info text and display the generated text
    $defaultStatsContainer.style.display = "none";
    $theoStatsContainers.style.display = "block";
    $expStatsContainer.style.display = "block";

    // calculate the theoretical probability
    const probability = calcProbability(wordInputValue.length, genStringLength, true);

    // generate 
    const numberStyle = "color: #bd5959";
    const percentStyle = "color: #ab9163";
    generateDynamicTextTo($theoStatsContainers, [
        {content: "Your search is "},
        {content: "1", style: numberStyle},
        {content: " in "},
        {content: probability.int.toLocaleString("en-US"), style: numberStyle},
        {content: " chance of being generated "},
        {content: `(~${probability.frac}%).`, style: percentStyle},
    ]);


    // generate logic
    let strOutput;
    let matchData;
    let iterations = 0;

    const wordPattern = new RegExp(wordInputValue);

    let genText = generateDynamicTextTo($outputDisplayContainer, [
        {content: ""},
    ])[0];

    let iterationDisplay = generateDynamicTextTo($expStatsContainer, [
        {content: ""},
    ])[0];

    async function startLoop() {
        while (IS_GENERATING) {

            // generate random string
            strOutput = "";
            iterations++;

            for (let i = 0; i < genStringLength; i++) {
                strOutput += getRandomLetterLower();
            }

            // if a match is found then exit loop
            matchData = wordPattern.exec(strOutput);
            if (matchData) break;

            // else keep updating the text
            genText.textContent = strOutput
            iterationDisplay.textContent = "Iterations: " + iterations;
            await sleep(genSpeedValue);
        }

        if (!matchData) return;

        const matchIndex = matchData.index;
        const chunk0 = strOutput.substring(0, matchIndex);
        const chunk1 = strOutput.substring(matchIndex, matchIndex + wordInputValue.length);
        const chunk2 = strOutput.substring(matchIndex + wordInputValue.length, strOutput.length);
    
        genText = generateDynamicTextTo(
            $outputDisplayContainer, [
                {content: chunk0},
                {content: chunk1, style: `color: #00ff1f`},
                {content: chunk2}
            ]
        );
    
        setElementPropertyToDefault($generateSearchButton, "textContent"); // obsolete now
        cancelSearch(); // reset debounce
    }

    startLoop();
}

// load default css properties into 'savedElementPropertyDefaults'
function loadElementPropertyDefaults() {
    debugPrint(">> storing default style settings...");

    savedElementPropertyDefaults[$generateSearchButton] = {
        textContent: $generateSearchButton.textContent,
        style: weakObjectClone(getComputedStyle($generateSearchButton))
    }

    debugPrint("<< default style settings have been stored.");
}

function initPageElementDefaults() {
    debugPrint(">> setting page first impression...");

    $wordInput.value = "hello";
    $stringLengthInput.value = $wordInput.value.length;
    $genSpeedInput.value = "100";
    $generateSearchButton.textContent = "Generate Search!";

    generateDynamicTextTo($outputDisplayContainer, [
        {content: "Somethingstrangeis"},
        {content: "afoot", style: "color: #00ff1f"}
    ]);

    debugPrint("<< page first impression setup complete!");
}

// invoke css default property loader once the page loads
document.addEventListener("readystatechange", () => {
    if (document.readyState === "complete") {
        debugPrint("page loaded!");
        initPageElementDefaults();
        loadElementPropertyDefaults();
    }
})

// generate search click listener //
// const generateSearchDebounce = debounce(generateSearch, 2000);
$generateSearchButton.addEventListener("click", generateSearch);
$cancelGenerateBtn.addEventListener("click", cancelSearch);

