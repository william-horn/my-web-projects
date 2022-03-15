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
import {QuizBuilder, ChoiceQuestion} from "./libs/quizbuilder.js"; // get quizbuilder library
import Event from "../../../../../tools/api/general/js/event.js";

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
);

Quiz.addQuestion(
    new ChoiceQuestion("What is 2+2?")
        .setChoices("3", "12", "6")
        .setRightAnswers("4")
);

Quiz.addQuestion(
    new ChoiceQuestion("What is 3+3?")
        .setChoices("234", "12", "34")
        .setRightAnswers("6")
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

function startQuiz() {
    switchScreen(questionScreen);

}

/*
Quiz.setDuration(10);
Quiz.onTimerUpdate.connect("timerUpdate", (tl) => console.log(tl));
Quiz.onStateChanged.connect("statechanged", (state) => console.log("new state:", state));
Quiz.onQuizFinish.connect("done", (state) => console.log("Quiz Finished", state));

Quiz.start();

Quiz.getNextQuestion();

Quiz.submitAnswer("one") // attempt 1/3
Quiz.submitAnswer("two") // attempt 2/3
Quiz.submitAnswer("three") // attempt 3/3
Quiz.submitAnswer("four") // attempt 3/3

Quiz.getNextQuestion();

Quiz.submitAnswer("one") // attempt 1/3
Quiz.submitAnswer("two") // attempt 2/3
Quiz.submitAnswer("three") // attempt 3/3

Quiz.onAnswerSubmit() // fires when an answer is submitted
Quiz.onQuestionCompleted() // fires when a question is completed


setTimeout(() => {
    Quiz.pluckNextQuestion();
}, 3000);
*/


const event = new Event();

event.strongConnect("click", () => {
    console.log("fired")
});

event.fire();
event.disconnectAll();
event.fire();


$(".intro-screen button").click(() => startQuiz());
