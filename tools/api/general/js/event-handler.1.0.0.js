/*
? @document-start
========================
| EVENT HANDLER MODULE |
==================================================================================================================================

? @author:                 William J. Horn
? @document-name:          event-handler.js
? @document-created:       03/16/2022
? @document-modified:      03/16/2022
? @document-version:       v1.0.0

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

Coming soon

==================================================================================================================================

? @document-todo
=================
| DOCUMENT TODO |
==================================================================================================================================

-  Add pause/resume functionality to events

==================================================================================================================================
*/

import DynamicState from "./dystates-1.0.0.js";

const eventHandlerStates = {
    "listening": "listening",
    "paused": "paused"
}

class Listener extends DynamicState {
    constructor(eventName, object, func, funcHandler) {
        super(eventHandlerStates)
        this.setState("listening");

        this.name = eventName;
        this.obj = object;
        this.func = func;
        this.handler = funcHandler;
    }

    pause() {
        this.setState("paused");
    }

    resume() {
        this.setState("listening");
    }
}

export default class EventHandler extends Listener {
    constructor() {
        super();
        this.connections = new Map();
    }

    pauseAll() {
        super.pause();
    }

    resumeAll() {
        super.resume();
    }

    setAllStates(eventName, object, newState) {
        const eventData = this.connections.get(object);
        const selectAll = eventName === "all";

        if (!eventData) return;

        eventData.forEach(function(listener) {
            if (listener.name === eventName || selectAll) {
                listener.setState(newState);
            }
        })
    }

    pause(eventName, object) {
        this.setAllStates(eventName, object, "paused");
    }

    resume(eventName, object) {
        this.setAllStates(eventName, object, "listening");
    }

    getListener(object) {
        return this.connections.get(object);
    }

    add(eventName, object, func) {
        let eventData = this.connections.get(object);

        // event data for a given object
        if (!eventData) {
            eventData = [];
            this.connections.set(object, eventData);
        }

        // new individual event listener data
        const localListener = new Listener(
            eventName,
            object,
            func,
            funcHandler
        )

        // add listener data to event data
        eventData.push(localListener);
    
        const that = this; // EventHandler object
        function funcHandler(jsEvent) {
            console.log("global: ", that.state, " local: ", localListener.state);
            if (that.isState("listening") && localListener.isState("listening")) {
                func(jsEvent);
            }
        }
    
        if (window.jQuery) {
            object.on(eventName, funcHandler); // if jQuery library is used
        } else {
            object.addEventListener(eventName, funcHandler); // if vanilla js is used
        }
    }
}