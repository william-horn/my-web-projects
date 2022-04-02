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
    constructor() {
        this._connections = [];
    }

    connect(func) {
        this._connections.push(func);
    }

    trigger(...args) {
        const connections = this._connections;
        for (let i = 0; i < connections.length; i++) {
            connections[i](...args);
        }
    }
}

export default class StateController { 
    constructor(states) {
        this.className = 'StateController';
        this._states = states;
        this._computedState = {value: undefined};
        this._onStateChanged = new Event();
        this.state = {name: 'initial', id: 0, weight: 0}; // default state

        // assign default state values
        for (let i = 0; i < states.length; i++) {
            const stateData = states[i];
            stateData.id = i + 1;
            stateData.weight = stateData.weight || 0;
        }

        this.heaviestState = this.getHeaviestState();
    }

    // _computeState() {
    //     ...
    // }

    // getHeaviestState(['state1', 'state2', ...])
    getHeaviestState(stateList=this._states) {
        let heavy = stateList[0];
        for (let i = 1; i < stateList.length; i++) {
            const compState = stateList[i];
            if (compState.weight > heavy.weight)
                heavy = compState;
        }
    }

    getStateWeight() {
        return this.state.weight;
    }

    getComputedState() {
        return this._computedState;
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

    // ! deprecated, use getStateName() instead !
    getState() {
        return this.state.name;
    }
    // ! -------------------------------------- !

    hasState(state) {
        const result = Boolean(this.findState(state));
        if (!result) console.warn(`State: ${state} is not a recognized state`);
        return result;
    }

    findState(state) {
        return this._states.find(realState => realState.name === state);
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
        if (this._computeState) this._computedState.value = this._computeState();
        this._onStateChanged.trigger(oldState, foundState);
    }

    isState(state) {
        return this.state.name === state;
    }
}