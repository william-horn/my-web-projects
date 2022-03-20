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

- Methods 

* quiz state requirement: "inactive"
* ----------------------------------

Quiz.setQuizTimed([boolean] state)
QUiz.setDuration([number] time length)
Quiz.randomizeQuestions()
Quiz.addQuestion([Question Object] question info)
Quiz.removeQuestion([number] index)
Quiz.start()

* quiz state requirement: "active"
* ----------------------------------

Quiz.getCurrentQuestion()
Quiz.getNextQuestion()
Quiz.submitAnswer([string] user input)
Quiz.setTimeLeft([number] new time left)
Quiz.addTime([number] time added to time left)
Quiz.subtractTime([number] time subtracted from time left)
Quiz.finish()

* quiz state requirement: any state
* ----------------------------------

addGui([string] gui name, [Object] gui object)
removeGui([string] gui name)
getGui([string] gui name)
getQuestions()
getGui([string] gui name)
getScreenFromName([string] gui name) -- private
getCorrectAnswers()
getIncorrectAnswers()
getQuestionNumber)
getFormattedScore()
getTimeLeft()
addListener([string] event name, [string] gui name, [function] callback function)
pauseListener([string] event name, [string] gui name)
resumeListener([string] event name, [string] gui name)
removeListener([string] event name, [string] gui name)
pauseListening()
resumeListening()
removeAllListeners()


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
import EventHandler from "../../general/js/event-handler.1.0.0.js";

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

function handleErr(condition, ...args) {
    if (condition) console.error("QuizBuilder: ", ...args);
}

export class QuizBuilder extends DynamicState {
    constructor() {
        // call superclass constructor
        super(quizStates);
        this.setState("inactive");

        // objects
        this.questions = [];
        this.guis = {}; // BETA
        this.listener = new EventHandler(); // BETA

        // primitives
        this.questionIndex = 0;
        this.questionNumber = 1;
        this.duration = 0;
        this.timeLeft = 0;
        this.score = 0;
        this.correctAnswers = 0;

        this.isTimed = false;
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
            this.finish();
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
            this.finish();
        }
    }

    setQuizTimed(state) {
        if (this.isState("active")) return;
        this.isTimed = state;
    }

    // BETA
    addGui(guiName, gui) {
        handleErr(this.guis[guiName], "Cannot add GUI with name '" + guiName + "' (already exists)");
        this.guis[guiName] = gui;
    }

    // BETA 
    removeGui(guiName) {
        handleErr(!this.guis[guiName], "Cannot remove GUI with name '" + guiName + "' (does not exist)");
        delete this.guis[guiName];
    }

    // state-specific method criteria: "inactive"
    setDuration(time) {
        if (!this.isState("inactive")) return;
        this.duration = time;
        this.timeLeft = time;
    }

    // state-specific method criteria: "active"
    setTimeLeft(amount) {
        if (!this.isState("active")) return;
        this.timeLeft = Math.min(this.duration, Math.max(0, amount));
        if (this.timeLeft === 0) {
            this.setState("incomplete");
            this.finish();
        }
    }

    // state-specific method criteria: "inactive"
    addQuestion(question) {
        if (!this.isState("inactive")) return;
        this.questions.push(question);
    }

    // state-specific method criteria: "inactive"
    removeQuestion(index) {
        if (!this.isState("inactive")) return;
        this.questions.splice(index, 1);
    }

    // state-specific method criteria: "inactive"
    clearQuestions() {
        if (!this.isState("inactive")) return;
        this.questions.length = 0; // clear questions array
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
    addListener(eventName, guiName, func) {
        const gui = this.guis[guiName];
        handleErr(!gui, "Cannot add listener to GUI '" + guiName + "' (does not exist)");
        this.listener.add(eventName, gui, func);
    }

    // BETA
    pauseListener(eventName, guiName) {
        const gui = this.guis[guiName];
        handleErr(!gui, "Cannot pause listener, GUI name does not exist");
        this.listener.pause(eventName, gui);
    }

    // BETA
    resumeListener(eventName, guiName) {
        const gui = this.guis[guiName];
        handleErr(!gui, "Cannot resume listener, GUI name does not exist");
        this.listener.resume(eventName, gui);
    }

    // BETA
    removeListener(eventName, guiName) {
        const gui = this.guis[guiName];
        handleErr(!gui, "Cannot remove listener, GUI name does not exist");
        this.listener.remove(eventName, gui);
    }

    // BETA
    pauseListening() {
        this.listener.pauseAll();
    }

    // BETA
    resumeListening() {
        this.listener.resumeAll();
    }

    // BETA
    removeAllListeners() {
        this.listener.removeAll();
    }

    start() {
        if (!this.isState("inactive")) return;
        this.setState("active");

        if (this.isTimed) {
            this.timeLeft = this.duration;
            this.onTimerUpdate.fire(this.getTimeLeft()); // fire initial timer update event
            this.timerRoutine = setInterval(() => {
                this.subtractTime(1);
                this.onTimerUpdate.fire(this.getTimeLeft()); // fire timer update every interval
            }, 1000);
        }
    }

    finish() {
        if (!this.isState("active")) return;
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

        // disconnect all event listeners
        this.removeAllListeners();

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
        let choices = gutil.shallowCopyArray(this.choices);
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



