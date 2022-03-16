
import Event from "./event.js";

export default class DynamicState {
    constructor(states) {
        this.states = states;
        this.state = "initial"; // default state

        // events
        this.onStateChanged = new Event();
    }

    getState() {
        return this.state;
    }

    setState(state) {
        if (!this.states[state]) {
            console.error("DynamicState Class: '" + state + "' is not a valid state");
            return;
        }

        const oldState = this.state;
        this.state = this.states[state];

        if (oldState != state) {
            this.onStateChanged.fire(this.state);
        }
    }

    isState(state) {
        return this.state === state;
    }
}

