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

Quiz.addQuestion(
    new TextboxQuestion("What is 3+3?")
        .setRightAnswers("6")
        .setMaxAttempts(2)
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


Quiz.setDuration(5);
Quiz.onQuestionCompleted.connect((q) => {
    console.log("QUESTION COMPLETED WITH STATE: " + q.state + ".");
});
Quiz.onQuizFinish.connect(thing => {
    console.log("the quiz has finished! state: ", thing, " score:", Quiz.getFormattedScore());
});
Quiz.onAnswerSubmit.connect(q => {
    console.log("answer submitted: ", q);
});
Quiz.start();

Quiz.getNextQuestion(); // correct = 2, attempts = 1
Quiz.submitAnswer("2"); // correct

Quiz.getNextQuestion(); // correct = 4, attempts = 9
Quiz.submitAnswer("3"); // unanswered

Quiz.getNextQuestion(); // correct = 6, attempts = 2
Quiz.submitAnswer("100");
Quiz.submitAnswer("6");

Quiz.getNextQuestion();
Quiz.getNextQuestion();
Quiz.getNextQuestion();
Quiz.getNextQuestion();


 

setTimeout(() => {
    Quiz.start();

    const question = Quiz.getNextQuestion();
    console.log("First question: ", question.title);
    Quiz.submitAnswer("2");
    
    Quiz.getNextQuestion();
    Quiz.submitAnswer("3");
    
    Quiz.getNextQuestion();
    Quiz.submitAnswer("asd");
    Quiz.submitAnswer("6");

    Quiz.getNextQuestion();
}, 10000);


$(".intro-screen button").click(() => startQuiz());
