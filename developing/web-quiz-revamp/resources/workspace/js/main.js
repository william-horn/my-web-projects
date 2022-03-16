/*
? @document-start
======================
| MAIN PROGRAM LOGIC |
==================================================================================================================================

? @author:                 William J. Horn
? @document-name:          main.js
? @document-created:       03/14/2022
? @document-modified:      03/15/2022

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
// get quizbuilder api
import {
    QuizBuilder, 
    ChoiceQuestion,
    TextboxQuestion
} from "../../../../../tools/api/dedicated/js/quiz-builder-2.0.0.js";

import EventHandler from "../../../../../tools/api/general/js/event-handler.1.0.0.js";

/* ----------------------------- */
/* Get Global Element References */
/* ----------------------------- */
const introScreen = $(".intro-screen");
const questionScreen = $(".question-screen");

/* -------------- */
/* Program States */
/* -------------- */
let currentScreen = introScreen;
let prevScreen = introScreen;

/* ----------------- */
/* Quiz Construction */
/* ----------------- */
const Quiz = new QuizBuilder();

// add questions to quiz
Quiz.addQuestion(
    new ChoiceQuestion("What is 1+1?")
        .setChoices("3", "5", "9")
        .setRightAnswers("2")
        .setMaxAttempts(1)
);

Quiz.addQuestion(
    new ChoiceQuestion("What is 2+2?")
        .setChoices("3", "12", "6")
        .setRightAnswers("4")
        .setMaxAttempts(9)
);


/* ----------------- */
/* Utility Functions */
/* ----------------- */

// switch between chapter screens
function switchScreen(newScreen) {
    // hide previous screen
    $(currentScreen).hide();
    prevScreen = currentScreen;

    // show new screen & new screen parent
    $(newScreen).show();
    $(newScreen).parent().show();
    currentScreen = newScreen;

    // if all children in previous screen are hidden, then hide the parent
    let prevChildren = prevScreen.parent().children();
    for (let i = 0; i < prevChildren.length; i++) {
        let child = prevChildren[i];
        if ($(child).css("display") !== "none") return; // exit 
    }

    // hide parent when all children are hidden
    $(prevScreen).parent().hide();
}

function getNextQuestion() {
    
}

function startQuiz() {
    switchScreen(questionScreen);

    const handler = new EventHandler();

    handler.add("click", questionScreen, function() {
        console.log("hi")
    });

    handler.pauseAll()

    setTimeout(() => {
        console.log("paused global");
        handler.pause();
    }, 4000);


}




$(".intro-screen button").click(() => startQuiz());
