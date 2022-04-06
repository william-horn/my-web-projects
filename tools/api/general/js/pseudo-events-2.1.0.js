/*
? @document-start
======================
| PSEUDO EVENT CLASS |
==================================================================================================================================

? @author:                 William J. Horn
? @document-name:          pseudo-events.js
? @document-created:       03/08/2022
? @document-modified:      04/01/2022
? @document-version:       v3.1.0
==================================================================================================================================

? @document-info
==================
| ABOUT DOCUMENT |
==================================================================================================================================

Coming soon

==================================================================================================================================

? @document-api
=============
| ABOUT API |
==================================================================================================================================

See documentation

==================================================================================================================================

? @document-todo
=================
| DOCUMENT TODO |
==================================================================================================================================

-   Make 'this' inside the Event.fire() callback refer to the object that the Event object is inside of
-   Allow Connection object to be passed to 'disconnect' as a literal for individual disconnections --DONE
-   Add hierarchical event bubbling
-   Currently 'pauseAll' and 'resumeAll' will not affect strongly-connected events. Implement an override
    feature for these methods in the future. Maybe add 'paused-strong' state?
-   Replace 'strong'/'weak' events with priority id that can be arbitrarily defined


==================================================================================================================================
*/

import StateController from './statecontroller-2.0.0.js';

/*
Combination of event states can be represented as a system of equations:

case #1: if no parent event exists, return state of self
case #2: if child and parent states are equivalent, return the mutual state
case #3: if sum(parentState, childState) is < 0, then at least one state is paused-strong, so return paused-strong
else:

SYSTEM => {
    eq_0 =>     P(a) + C(b) = a      (unique)
    eq_1 =>     P(c) + C(b) = a      (common, same as eq_0)
    eq_2 =>     P(b) + C(a) = a      (common, same as eq_0)
    eq_3 =>     P(b) + C(c) = c      (unique)
    eq_4 =>     P(c) + C(a) = b      (unique)
    eq_5 =>     P(a) + C(c) = b      (common, same as eq_4)
}

WHERE:
    a = listening-weak
    b = listening-strong
    c = paused-weak
    P(s) = Parent event with state 's'
    C(s) = Child event with state 's'

Removing the common equations, we get:

REDUCED SYSTEM => {
    eq_0 =>     P(a) + C(b) = a
    eq_1 =>     P(b) + C(c) = c
    eq_2 =>     P(c) + C(a) = b
}

note:
    in general, the sum of two states can be any value S, such that S ∉ {O(s)}-{s}, so that each equation (combination of states) can 
    be distinguished and we can decern what combination of states resulted in that sum. Therefore, a useful generalization
    of this system could be represented as such:

GENERAL SYSTEM => {
    eq_0 =>     a + b = s       (s + 0 = listening-weak)
    eq_1 =>     b + c = s + 1   (s + 1 = paused-weak)
    eq_2 =>     c + a = s + 2   (s + 2 = paused-strong)
}

WHERE:
    's' can be any value.

Given a value of 's', we can reduce this system using gaussian elimination to conclude that: 

    a = b + 1

Therefore, 

    a + b = s
    =>  b + 1 + b = s
    =>  2b + 1 = s
    =>  b = (1/2)s - 1/2

In conclusion:

    for any value 's' in the general system, the solutions for unknowns a, b, and c, are:
        a = (1/2)s + 1/2
        b = (1/2)s - 1/2
        c = (1/2)s + 3/2
    
    Or more simply, when using these variables in the general system equations you can factor out the common (1/2)s term
    which will result in:
        a = 1/2
        b = -1/2
        c = 3/2

*/

// !warning: ordering of items in this array matters
const eventStates = [
    {name: 'listening-weak', weight: 0.5},      // index 0 when sum(parentWeight, childWeight) === 0
    {name: 'paused-weak', weight: 1.5},         // index 1 when sum(parentWeight, childWeight) === 1
    {name: 'paused-strong', weight: -2},        // index 2 when sum(parentWeight, childWeight) === 2 (weight = -2 to ensure sum will always be < 0)
    {name: 'listening-strong', weight: -0.5},
]

export default class PseudoEvent extends StateController {
    // private
    #connections = {
        factory: [],
        strong: [],
        weak: [],
    };

    // public
    // inherits:
        // states => StateController
        // onStateChanged => StateController
    className = 'PseudoEvent';
    childEvents = [];

    constructor(eventName, parentEvent) {
        // arrange args
        {
            const typeof_eventName = typeof eventName;
            [eventName, parentEvent] = [
                typeof_eventName === 'object'
                    ? undefined : eventName,

                parentEvent
                    ? parentEvent : (typeof_eventName === 'object') 
                    ? eventName : undefined
            ]
        }

        // call superclass
        super(eventStates);
        this.name = eventName; // the name of this event
        this.parentEvent = parentEvent; // the parent of this event

        // add event to parent child list if parent exists
        if (parentEvent) parentEvent.childEvents.push(this);

        // initialize 
        this.setState('listening-strong');
    }

    // private
    #connectByType(type, name, func) {
        [name, func] = [
            func ? name : undefined,
            func ? func : name
        ]

        // get private connection data
        const connections = this.#connections;

        const connection = {
            source: func, // callback function
            name: name, // arbitrary name of connection
            type: type, // type of connection (factory | strong | weak)
            enabled: true, // whether the connection may trigger
        }

        connections[type].push(connection);
        return connection;
    }

    // public
    computeStates() {
        const thisState = this.getStateData();
        const parentEvent = this.parentEvent;
        const childEvents = this.childEvents;

        // ! should not be using 'return' here
        // case #1: if event has no parent, set it's computed state to it's desired state
        if (!parentEvent) return; // return undefined (computed state is already set to desired state)

        // case #2: if the parent event and child event share the same state, then set that state to the child
        const parentComputedState = parentEvent.getComputedState().value;
        if (parentComputedState === thisState) return this.setComputedState(thisState); // return undefined

        // case #3: if the sum of states is less than 0, then one of the states are 'paused-strong', so return that
        const sumStateWeight = parentComputedState.weight + this.getStateWeight();
        if (sumStateWeight < 0) return this.setComputedState(this.findState('paused-strong'));

        // else: set the computed state from the 'eventStates' object based on the sum of the two states
        this.setComputedState(eventStates[sumStateWeight]);

        // recursively update computed state to descendant events
        for (let i = 0; i < childEvents.length; i++) {
            const child = childEvents[i];
            child.computeStates();
        }
    }

    setState(state) {
        super.setState(state);
        this.computeStates();
    }

    getOverrideState(name, override) {
        const state = name + (override ? '-strong' : '-weak');
        if (!this.hasState(state)) return;
        return state;
    }

    // disconnect all weak connections (and strong connections if override is given)
    disconnectAll(override) {
        // ! re-implement
    }

    // todo: implement override pause/resume all mechanic
    pauseAll(override) {
        this.setState(this.getOverrideState('paused', override));
    }

    resumeAll(override) {
        if ((this.isState('paused-strong') || this.isState('listening-weak')) && !override)
            return this.setState('listening-weak');
        this.setState('listening-strong');
    }

    applyFilter(connectionName, connectionFunc, override, action) {
        // data types BEFORE conversion
        {
            let isFunc_connectionFunc = typeof connectionFunc === 'function';
            let isFunc_connectionName = typeof connectionName === 'function';

            // arrange arguments to their intended values
            // todo: there's probably a better, more generalized way to do this. think of it later.
            // @note maybe use arrays to sort by type?
            [connectionName, connectionFunc, override] = [
                isFunc_connectionName
                    ? undefined : connectionName,

                isFunc_connectionName
                    ? connectionName : isFunc_connectionFunc
                    ? connectionFunc : undefined,

                connectionFunc === true 
                    ? connectionFunc : override
            ];
        }

        // data types AFTER conversion
        const connections = this.#connections;
        const typeof_connectionName = typeof connectionName;
        const isObj_connectionName = typeof_connectionName === 'object';
        const isStr_connectionName = typeof_connectionName === 'string';

        // the above logic will produce:
        //
        // args:                                         connectionName  connectionFunc  override
        //
        // applyFilter(connection, true)         =>      connection,     undefined,      true
        // applyFilter('eventName', true)        =>      'eventName',    undefined,      true
        // applyFilter(f, true)                  =>      undefined,      f,              true
        // applyFilter('eventName', f, true)     =>      'eventName',    f,              true
        // applyFilter(connection)               =>      connection,     undefined,      undefined
        // applyFilter('eventName')              =>      'eventName',    undefined,      undefined
        // applyFilter('eventName', f)           =>      'eventName',    f,              undefined
        // applyFilter(f)                        =>      undefined,      f,              undefined

        // return filtered-out array of connections by name/function
        // return gutil.getAllOf(this.#connections, val => {
        //     return val.isMutable(override)
        //         && (connectionName ? val.name === connectionName : true)
        //         && (connectionFunc ? val.source === connectionFunc : true)
        // });

        // ! re-implement
        // todo: this is slow and unintuitive. just use for loops. refactor this later.
        // * connectionName can be a string OR an object
        gutil.generalIteration(
            connections,
            val => val.isMutable(override)
                    && (isStr_connectionName ? val.name === connectionName : true)
                    && (connectionFunc ? val.source === connectionFunc : true)
                    && (isObj_connectionName ? (connectionName === val) : true),

            result => result, 
            key => action.call(this, key)
        );
    }

    // todo: get rid of generalIteration, replace with for loops later
    // disconnect a weak connection (or a strong connection if override is given)
    disconnect(name, func, override) {
        // ! re-implement
    }

    pause(name, func, override) {
        // ! re-implement
    }

    resume(name, func, override) {
        // ! re-implement
    }

    // fire a single Connection object
    fire(conn, ...args) {
        if (conn.isActive()) conn.source(...args);
    }

    // todo: maybe add a setting that lets the user fire all child event listener connections too?
    trigger(...args) {
        const connections = this.#connections;
        //const connections = {};

        if (checkComputedStateHere) {

            return;
        };

        // fire all connections
        for (let connType in connections) {
            const connCategory = connections[connType];
            for (let i = 0; i < connCategory.length; i++) {
                this.fire(connCategory[i], ...args);
            }
        }
    }

    // create weak connection
    connect(name, func) {
        return this.#connectByType('weak', name, func);
    }

    // create strong connection
    strongConnect(name, func) {
        return this.#connectByType('strong', name, func);
    }

    // create factory connection
    factoryConnect(name, func) {
        return this.#connectByType('factory', name, func);
    }
}