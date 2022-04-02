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


==================================================================================================================================
*/

import gutil from './gutil-1.0.0.js';
import StateController from './statecontroller-2.0.0.js';

const connectionTypes = {
    'none': 'not connected', // connection not made yet
    'factory': 'factory', // immutable event (cannot disconnect)
    'strong': 'strong', // mutable event; requires override
    'weak': 'weak' // mutable event; does not require override
}

const eventStates = [
    {name: 'listening-weak'},
    {name: 'listening-strong'},
    {name: 'paused-weak'},
    {name: 'paused-strong'},
]

// private methods of PseudoEvent
// ! delete after re-implementation
// function disconnector(key) {
//     this.connections.splice(key, 1);
// }

// function pauser(key) {
//     this.connections[key].setState('paused-weak');
// }

// function resumer(key) {
//     this.connections[key].setState('listening');
// }

// read-only object
// contains connection information
class Connection extends StateController {
    constructor(connectionType, name, func) { // connectionType='type', name*='name', func=func
        [name, func] = [
            func ? name : undefined,
            func ? func : name
        ]

        // call super constructor
        super(eventStates);

        // compute if a single connection is active
        this._computeState = () => {
            if (this._connection_type === 'factory') return true; // factory connections should always fire
            if (this.isState('paused-strong')) return false; // paused-strong states will not allow any firing
    
            return this._connection_type === 'strong'
                && (this.isState('listening-strong') || this.isState('paused-weak'))
                || this._connection_type === 'weak'
                && (this.isState('listening-strong') || this.isState('listening-weak'));
        }

        this._connection_type = connectionTypes[connectionType] 
            || connectionTypes.none;

        // set initial state
        this.setState('listening-strong');

        // this._active = true; // default
        this.className = 'Connection';
        this.name = name;
        this.source = func;
    }

    isActive() {
        return this.getComputedState().value;
    }
}

export default class PseudoEvent extends StateController {
    constructor(eventName, eventParent) {
        // arrange args
        const typeof_eventName = typeof eventName;
        [eventName, eventParent] = [
            typeof_eventName === 'object'
                ? undefined : eventName,

            eventParent
                ? eventParent : (typeof_eventName === 'object') 
                ? eventName : undefined
        ]

        // call superclass
        super(eventStates);

        // add event to parent child list if parent exists
        if (eventParent) 
            eventParent.childEvents.push(this);

        // initialize 
        this.setState('listening-strong');

        this.className = 'PseudoEvent';
        this.name = eventName; // the name of this event
        this.parentEvent = eventParent; // the parent of this event

        this._connections = [];
        this.childEvents = [];
    }

    getOverrideState(name, override) {
        const state = name + (override ? '-strong' : '-weak');
        if (!this.hasState(state)) return;
        return state;
    }

    // disconnect all weak connections (and strong connections if override is given)
    disconnectAll(override) {
        gutil.arrayRemoveAllOf(
            this._connections, 
            val => val.isMutable(override)
        );
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
        let isFunc_connectionFunc = typeof connectionFunc === 'function';
        let isFunc_connectionName = typeof connectionName === 'function';

        const connections = this._connections;

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

        // data types AFTER conversion
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
        // return gutil.getAllOf(this._connections, val => {
        //     return val.isMutable(override)
        //         && (connectionName ? val.name === connectionName : true)
        //         && (connectionFunc ? val.source === connectionFunc : true)
        // });

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
        this.applyFilter(name, func, override, disconnector);
    }

    pause(name, func, override) {
        this.applyFilter(name, func, override, pauser);
    }

    resume(name, func, override) {
        this.applyFilter(name, func, override, resumer);
    }

    // fire a single Connection object
    fire(conn, ...args) {
        if (conn.isActive()) conn.source(...args);
    }

    // todo: maybe add a setting that lets the user fire all child event listener connections too?
    trigger(...args) {
        const connections = this._connections;
        // if the pseudo event has no permission to fire, then gather all non-weak events
        // and fire them if needed
        if (this.isActive()) {

            return;
        };

        // fire all eligible connections
        for (let i = 0; i < connections.length; i++)
            this.fire(connections[i]);
    }

    // private
    connectState(state, name, func) {
        const connection = new Connection(state, name, func);
        this._connections.push(connection);
        return connection;
    }

    // create weak connection
    connect(name, func) {
        return this.connectState(connectionTypes.weak, name, func);
    }

    // create strong connection
    strongConnect(name, func) {
        return this.connectState(connectionTypes.strong, name, func);
    }

    // create factory connection
    factoryConnect(name, func) {
        return this.connectState(connectionTypes.factory, name, func);
    }
}