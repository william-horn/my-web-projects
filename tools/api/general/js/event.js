/*
? @document-start
=====================
| EVENT MAKER CLASS |
==================================================================================================================================

? @author:                 William J. Horn
? @document-name:          event.js
? @document-created:       03/08/2022
? @document-modified:      03/15/2022
? @document-version:       v1.0.0

==================================================================================================================================

? @document-info
==================
| ABOUT DOCUMENT |
==================================================================================================================================

- Coming soon

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

/*
Event.connect("click", () => {}))           // can disconnect with: Event.disconnect("click")
Event.connect(() => {})                     // can only disconnect with: Event.disconnectAll()

Event.strongConnect("click", () => {})      // can only disconnect with: Event.disconnect("click", true)
Event.strongConnect(() => {})               // can only disconnect with: Event.disconnectAll(true)

Event.factoryConnect("click", () => {})     // cannot disconnect once set
Event.factoryConnect(() => {})              // cannot disconnect once set
*/

import DynamicState from "./dynamicstate.js";

const connectionStates = {
    "factory": "factory", // immutable event (cannot disconnect)
    "strong": "strong", // mutable event; requires override
    "weak": "weak" // mutable event; does not require override
}

class Connection extends DynamicState {
    constructor(name, func=name) {
        super(connectionStates);
        this.name = name;
        this.source = func;
    }

    isMutable(override) {
        return this.isState("weak") || override && !this.isState("factory");
    }
}

export default class Event {
    constructor() {
        this.connections = [];
    }

    disconnectAll(override) {
        const connections = this.connections;
        for (let i in connections) {
            const connection = connections[i];
            if (connection.isMutable(override)) {
                /*
                delete if: 
                    state is weak
                    OR state is strong and has override
                    AND state is not factory
                */
                connections.splice(i, 1);
                console.log("disconnected all: ", connection.name, connection);
            }
        }
    }

    disconnect(name, override) {
        const connections = this.connections;
        for (let i in connections) {
            const connection = connections[i];
            if (connection.name === name && connection.isMutable(override)) {
                connections.splice(i, 1);
                console.log("disconnected event name: ", name, connection);
            } else {
                console.log("could not disconnect event: ", connection);
            }
        }
    }

    fire(...args) {
        const connections = this.connections;
        for (let i = 0; i < connections.length; i++) {
            connections[i].source(...args);
        }
    }


    // create weak connection
    connect(name, func) {
        const connection = new Connection(name, func);
        connection.setState("weak");
        this.connections.push(connection);
        console.log("connected: ", connection);
    }

    // create strong connection
    strongConnect(name, func) {
        const connection = new Connection(name, func);
        connection.setState("strong");
        this.connections.push(connection);
    }

    // create factory connection
    factoryConnect(name, func) {
        const connection = new Connection(name, func);
        connection.setState("factory");
        this.connections.push(connection);
    }
}
