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

-   Add support for multiple question attempts --DONE
-   Add support for multiple right answers --DONE
-   Finish 'getNextQuestion' function --DONE
-   Finish 'submitAnswer' function --DONE

-   Add a built-in api for interacting with GUI quiz components --NOT DONE [BETA]
-   Add skippable questions --NOT DONE
-   Add quiz mode where each question has a time limit --NOT DONE
-   Add more options to TextboxQuestion class --NOT DONE
-   Add build-in localstorage api --NOT DONE
-   Add quiz results analytics -- NOT DONE

-   It looks like allowing the Question objects to have mutable states may not be necessary or optimal. I will have to reset
    these Question states at the beginning of the quiz since they have changed from last quiz session. It may be more 
    advantageous to just temporarily store the CURRENT question data within the quiz object itself. --REMINDER

==================================================================================================================================
*/

import gutil from "../../general/js/gutil-1.0.0.js";
import PseudoEvent from "../../general/js/pseudo-events-2.0.0.js";
import DynamicState from "../../general/js/dystates-1.0.0.js";

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
        this.eventListeners = new Map(); // BETA
        this.guis = {}; // BETA

        // primitives
        this.questionIndex = 0;
        this.questionNumber = 1;
        this.duration = 0;
        this.timeLeft = 0;
        this.score = 0;
        this.correctAnswers = 0;

        this.currentQuestion = undefined;

        // events
        this.onQuizFinish = new PseudoEvent(); // fires when quiz finishes
        this.onTimerUpdate = new PseudoEvent(); // fires every timer tick interval
        this.onAnswerSubmit = new PseudoEvent(); // fires when an answer is submitted
        this.onQuestionCompleted = new PseudoEvent(); // fires when a question has completed
    }

    // ** Getters **
    getQuestions() {
        return this.questions;
    }

    // BETA
    getGui(name) {
        return this.guis[name];
    }

    // BETA
    getScreenFromName(name) {
        return typeof(name) === "string" ? this.guis[name] : name;
    }

    getIncorrectAnswers() {
        return this.questions.length - this.correctAnswers;
    }

    getCorrectAnswers() {
        return this.correctAnswers;
    }

    getQuestionNumber() {
        return this.questionNumber;
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
        return this.currentQuestion;
    }

    // state-specific method criteria: "active"
    getNextQuestion() {
        if (!this.isState("active")) return;

        const prevQuestion = this.currentQuestion;
        const currentQuestion = this.questions[this.questionIndex];

        if (prevQuestion && prevQuestion.isState("unanswered")) {
            this.onQuestionCompleted.fire(prevQuestion);
        }

        // if no next question, reset the quiz
        if (this.questionIndex >= this.questions.length) {
            this.setState("complete");
            this.reset();
            return;
        }

        // update new question
        this.currentQuestion = currentQuestion;
        this.questionIndex++;
        this.questionNumber = Math.min(this.questions.length, this.questionNumber + 1);

        return currentQuestion;
    }

    // ** Setters **
    // state-specific method criteria: "active"
    submitAnswer(input) {
        if (!this.isState("active")) return;

        // get the current submitted question
        const question = this.getCurrentQuestion();
        const quizLength = this.questions.length;

        // if the question is answered, then exit
        if (!question.isState("unanswered")) return;

        // fire answer submitted event
        question.addAttempt();

        // handle if answer is right
        if (question.isRightAnswer(input)) { // user is correct
            question.setState("correct");
            this.correctAnswers++;

        } else if (question.isMaxAttempts()) { // user is wrong and is out of attempts
            question.setState("incorrect");

        } else { // question is wrong but has more attempts
            this.onAnswerSubmit.fire(question);
            return;
        }

        // when the question has completed
        this.score = this.correctAnswers/quizLength*100;
        this.onAnswerSubmit.fire(question);
        this.onQuestionCompleted.fire(question);

        // if this was the last question, reset the quiz with a state of "complete"
        if (this.questionNumber >= quizLength) {
            this.setState("complete");
            this.reset();
        }
    }

    // BETA
    setGui(name, gui) {
        this.guis[name] = gui;
    }

    // state-specific method criteria: not "active"
    setDuration(time) {
        if (this.isState("active")) return;
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

    // BETA
    listen(eventName, screen, func) {
        screen = this.getScreenFromName(screen); 

        // get event data
        const eventListeners = this.eventListeners;
        const eventData = eventListeners.get(screen);

        // if old event data doesn't exist, create new data
        if (!eventData) {
            eventData = [/* {gui: screen, eventName: "", func: () => {}} */];
            eventListeners.set(screen, eventData);
        }

        // update existing event data with new listener
        eventData.push({
            gui: screen,
            eventName: eventName,
            func: func
        });

        // add listener to object
        screen.addEventListener(eventName, func);
    }

    // BETA
    stopListening(eventName, screen, func) {
        screen = this.getScreenFromName(screen);

        // get event data
        const eventListeners = this.eventListeners;
        const eventData = eventListeners.get(screen);

        if (!eventData) return; // exit if no data exists

        // remove event listeners that match event name, screen, and function literal
        for (let i in eventData) {
            const listener = eventData[i];
            if (listener.eventName === eventName && listener.func === func) {
                screen.removeEventListener(eventName, func);
                eventData.splice(i, 1);
            }
        }

        // if no event listeners exist remove screen from map
        if (eventData.length === 0) {
            eventListeners.delete(screen);
        }
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
        this.timerRoutine = null; // this line is no longer necessary but will keep in case future use is needed

        // reset quiz properties
        this.questionIndex = 0;
        this.questionNumber = 1;
        this.correctAnswers = 0;
        this.score = 0;
        this.currentQuestion = undefined;

        // reset question objects... "meh" solution
        const questions = this.questions;
        for (let i = 0; i < questions.length; i++) {
            questions[i].reset();
        }
    }
}

class Question extends DynamicState {
    constructor(questionTitle) {
        super(questionStates);
        this.setState("unanswered");

        this.type = "primitive";

        this.userAnswers = [];
        this.rightAnswers = [];

        this.title = questionTitle;
        this.maxAttempts = 1;
        this.attempts = 0;
    }

    isRightAnswer(input) {
        return this.rightAnswers.find(ans => input === ans) ? true : false;
    }

    isMaxAttempts() {
        return this.attempts >= this.maxAttempts;
    }

    setMaxAttempts(max) {
        this.maxAttempts = Math.max(1, max);
        return this;
    }

    setRightAnswers(...args) {
        this.rightAnswers = [...args];
        return this;
    }

    addAttempt() {
        if (this.isMaxAttempts()) return;
        this.attempts = Math.min(this.maxAttempts, this.attempts + 1);
    }

    reset() {
        this.setState("unanswered");
        this.attempts = 0;
    }
}

export class ChoiceQuestion extends Question {
    constructor(questionTitle) {
        super(questionTitle);

        this.choices = [];
        this.type = "choice";
    }

    setChoices(...args) {
        this.choices = [...args];
        return this;
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
}

export class TextboxQuestion extends Question {
    constructor(questionTitle) {
        super(questionTitle);

        this.type = "textbox";
    }
}



