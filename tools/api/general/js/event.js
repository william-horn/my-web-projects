/*
? @document-start
=====================
| EVENT MAKER CLASS |
==================================================================================================================================

? @author:                 William J. Horn
? @document-name:          event.js
? @document-created:       03/08/2022
? @document-modified:      03/08/2022
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

export default class Event {
    constructor() {
        this.connections = {};
    }

    unbind(name) {
        delete this.connections[name];
    }

    bind(name, func) {
        if (this.connections[name]) {
            console.log("Event Class: Event name \"" + name + "\" already exists. Overwritting it with new entry.");
            this.unbind(name);
        }
        this.connections[name] = func;
    }

    fire(...args) {
        for (let eventName in this.connections) {
            this.connections[eventName](...args);
        }
    }

    unbindAll() {
        for (let eventName in this.connections) {
            delete this.connections[eventName];
        }
    }
}
