

/*
? @document-start
====================
| QUIZ BUILDER API |
==================================================================================================================================

? @author:                 William J. Horn
? @document-name:          quizbuilder.js
? @document-created:       03/08/2022
? @document-modified:      03/15/2022
? @document-version:       v2.0.0

==================================================================================================================================

? @document-info
==================
| ABOUT DOCUMENT |
==================================================================================================================================

This file is a class module meant for creating an interface to interact with a "quiz-like" system.
- More coming soon

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

import gutil from "../../../../../../tools/api/general/js/gutil.js";
import Event from "../../../../../../tools/api/general/js/event.js";
import DynamicState from "../../../../../../tools/api/general/js/dynamicstate.js";

const quizStates = {
    "inactive": "inactive",
    "active": "active",
    "complete": "complete",
    "incomplete": "incomplete",
}

const questionStates = {
    "unanswered": "unanswered",
    "correct": "correct",
    "incorrect": "incorrect",
}

export class QuizBuilder extends DynamicState {
    constructor() {
        // call superclass constructor
        super(quizStates);
        this.setState("inactive");

        // objects
        this.questions = [];

        // primitives
        this.questionIndex = 0;
        this.questionNumber = 1;
        this.duration = 0;
        this.timeLeft = 0;
        this.score = 0;
        this.correctAnswers = 0;

        // events
        this.onQuizFinish = new Event(); // fires when quiz finishes
        this.onTimerUpdate = new Event(); // fires every timer tick interval
        this.onAnswerSubmit = new Event(); // fires when an answer is submitted
        this.onQuestionCompleted = new Event(); // fires when a question has completed
    }

    // ** Getters **
    getQuestions() {
        return this.questions;
    }

    getIncorrectAnswers() {
        return this.questions.length - this.correctAnswers;
    }

    getCorrectAnswers() {
        return this.correctAnswers;
    }

    getFormattedScore() {
        return /[^\.]+.?.?/.exec(this.score.toString()) + "%";
    }

    getTimeLeft() {
        // clamp timeLeft in case it was altered externally
        return Math.min(this.duration, Math.max(0, this.timeLeft));
    }

    // state-specific method criteria: "active"
    getCurrentQuestion() {
        if (!this.isState("active")) return;
        return this.questions[this.questionIndex];
    }

    // ** Setters **
    // state-specific method criteria: "active"
    submitAnswer(input) {
        if (!this.isState("active")) return;

        // get the current submitted question
        const question = this.getCurrentQuestion();
        const quizLength = this.questions.length;

        // handle if answer is correct
        if (question.isState("correct")) {
            this.correctAnswers++;
        }

        // update quiz score
        this.score = this.correctAnswers/quizLength*100;
        this.questionIndex = Math.min(quizLength - 1, this.questionIndex + 1);
        this.questionNumber = Math.min(quizLength, this.questionNumber + 1);

        // handle if this was the last question
        if (this.questionNumber === quizLength) {
            this.setState("complete");
            this.reset();
            return;
        }
    }

    setDuration(time) {
        this.duration = time;
        this.timeLeft = time;
    }

    // state-specific method criteria: "active"
    setTimeLeft(amount) {
        if (!this.isState("active")) return;
        this.timeLeft = Math.min(this.duration, Math.max(0, amount));
        if (this.timeLeft === 0) {
            this.setState("incomplete");
            this.reset();
        }
    }

    // state-specific method criteria: "inactive"
    addQuestion(question) {
        if (!this.isState("inactive")) return;
        this.questions.push(question);
    }

    // state-specific method criteria: "inactive"
    randomizeQuestions() {
        if (!this.isState("inactive")) return;
        return gutil.randomizeArray(this.questions);
    }

    subtractTime(amount) {
        this.setTimeLeft(this.timeLeft - amount);
    }

    addTime(amount) {
        this.setTimeLeft(this.timeLeft + amount);
    }

    start() {
        if (this.isState("active")) return;
        this.setState("active");
        this.timeLeft = this.duration;

        this.onTimerUpdate.fire(this.getTimeLeft()); // fire initial timer update event
        this.timerRoutine = setInterval(() => {
            this.subtractTime(1);
            this.onTimerUpdate.fire(this.getTimeLeft()); // fire timer update every interval
        }, 1000);
    }

    reset() {
        if (this.isState("inactive")) return;
        // fire onQuizFinish event 
        this.onQuizFinish.fire(this.state);
        this.setState("inactive");

        // clear timer interval
        clearInterval(this.timerRoutine);
        this.timerRoutine = null; // *this line is no longer necessary but will keep in case future use is needed

        this.questionIndex = 0;
        this.correctAnswers = 0;
        this.score = 0;
    }
}

export class Question extends DynamicState {
    constructor(questionTitle) {
        super(questionStates);
        this.setState("unanswered");

        this.choices = [];
        this.userAnswers = [];

        this.rightAnswer = "";
        this.title = questionTitle;
        this.maxAttempts = 1;
        this.attempts = 0;
    }

    isRightAnswer(input) {
        return input === this.rightAnswer;
    }

    setChoices(...args) {
        this.choices = [...args];
        return this;
    }

    setMaxAttempts(max) {
        this.maxAttempts = Math.min(1, max);
    }

    getRandomChoices() {
        let choices = this.getChoices();
        return gutil.randomizeArray(choices);
    }

    getChoices() {
        let choices = gutil.weakCloneArray(this.choices);
        choices.push(this.rightAnswer);
        return choices;
    }

    setRightAnswer(answer) {
        this.rightAnswer = answer;
        return this;
    }

    answer(input) {
        if (this.attempts >= this.maxAttempts) return;
        this.attempts++;
        this.userAnswers.push(input);
        this.setState(this.isRightAnswer(input) ? "correct" : "incorrect");
    }
}



