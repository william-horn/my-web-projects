/*
? @document-start
=====================
| DYNAMIC STATE API |
==================================================================================================================================

? @author:                 William J. Horn
? @document-name:          statecontroller.js
? @document-created:       03/15/2022
? @document-modified:      04/02/2022
? @document-version:       v2.0.0

==================================================================================================================================

? @document-info
==================
| ABOUT DOCUMENT |
==================================================================================================================================

Old document name: dynamicstate.js

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

==================================================================================================================================
*/

// weak implementation of PseudoEvent
// todo: Find a way to re-implement 'onStateChanged' without causing stack loop with pseudo-events
class Event {
    #connections = [];

    constructor() {
        //this._connections = [];
    }

    connect(func) {
        this.#connections.push(func);
    }

    trigger(...args) {
        const connections = this.#connections;
        for (let i = 0; i < connections.length; i++) {
            connections[i](...args);
        }
    }
}

export default class StateController { 
    // private
    #states;
    #computedState = {value: undefined};

    // public
    className = 'StateController';
    state = {name: 'initial', id: 0, weight: 0}; // default state
    onStateChanged = new Event();

    constructor(states) {
        this.#states = states;

        // assign default state values
        for (let i = 0; i < states.length; i++) {
            const stateData = states[i];
            stateData.id = i + 1;
            stateData.weight = stateData.weight || 0;
        }

        this.heaviestState = this.getHeaviestState();
    }

    // getHeaviestState(['state1', 'state2', ...])
    getHeaviestState(stateList=this.#states) {
        let heavy = stateList[0];
        for (let i = 1; i < stateList.length; i++) {
            const compState = stateList[i];
            if (compState.weight > heavy.weight) heavy = compState;
        }
    }

    getStateWeight() {
        return this.state.weight;
    }

    getComputedState() {
        return this.#computedState;
    }

    getStateId() {
        return this.state.id;
    }

    getStateData() {
        return this.state;
    }

    getStateName() {
        return this.state.name;
    }

    getState() { // ! deprecated, use getStateName() instead !
        return this.state.name;
    }

    hasState(state) {
        const result = Boolean(this.findState(state));
        if (!result) console.warn(`State: ${state} is not a recognized state`);
        return result;
    }

    findState(state) {
        return this.#states.find(realState => realState.name === state);
    }

    setComputedState(state) {
        this.#computedState.value = state;
    }

    setState(newState) {
        const foundState = this.findState(newState);
        const oldState = this.state;

        // if passed state does not exist, then exit
        if (!foundState) 
            return console.error(`DynamicState Class: '${newState}' is not a valid state`);

        // don't do anything if the new state is the old state
        if (oldState === foundState) return;

        // update state info
        this.state = foundState;
        this.setComputedState(foundState);
        this.onStateChanged.trigger(oldState, foundState);
    }

    isState(state) {
        return this.state.name === state;
    }
}