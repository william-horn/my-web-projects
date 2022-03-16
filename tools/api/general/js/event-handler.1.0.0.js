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

-   Add support for jQuery --DONE
-   Add pause/resume functionality to events --DONE
-   Generalize the retrieval of data from a map/array (maybe as a new utility for gutil?) with a callback
-   Debating use of classes for main EventHandler module

==================================================================================================================================
*/

import DynamicState from "./dystates-1.0.0.js";

// jQuery support for events
const isJQ = window.jQuery;
const eventConnectorName = isJQ? "on" : "addEventListener";
const eventDisconnectorName = isJQ? "off" : "removeEventListener";

const eventHandlerStates = {
    "listening": "listening",
    "paused": "paused"
}

// bypass jQuery wrapper
function getRawObject(object) {
    return isJQ? object.get(0) : object;
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

    disconnect() {
        this.obj[eventDisconnectorName](this.name, this.handler);
    }
}

export default class EventHandler extends Listener {
    constructor() {
        super();
        delete this.disconnect; // don't inherit
        this.connections = new Map();
    }

    pauseAll() {
        this.setState("paused");
    }

    resumeAll() {
        this.setState("listening");
    }

    setAllStates(eventName, object, newState) {
        if (object) {
            // args are: eventName=String, object=HTML Element, newState=String
            const eventData = this.connections.get(getRawObject(object));
            const selectAll = eventName === "all";

            if (!eventData) return;

            eventData.forEach(listener => {
                if (listener.name === eventName || selectAll) {
                    listener.setState(newState);
                }
            })
        } else {
            // args are: eventName=Listener, object=undefined, newState=String
            const listener = eventName;
            listener.setState(newState);
        }
    }

    pause(eventName, object) {
        this.setAllStates(eventName, object, "paused");
    }

    resume(eventName, object) {
        this.setAllStates(eventName, object, "listening");
    }

    removeAll() {
        for (let pair of this.connections) {
            const [rawObj, eventData] = pair;
            eventData.forEach(listener => listener.disconnect());
            this.connections.delete(rawObj);
        }
    }

    // create utility functions for this later
    remove(eventName, object) {
        let rawObj;
        let eventData;

        if (object) {
            rawObj = getRawObject(object);
            eventData = this.connections.get(rawObj); 
            const selectAll = eventName === "all";

            for (let i in eventData) {
                const listener = eventData[i];
                if (listener.name === eventName || selectAll) {
                    listener.disconnect();
                    eventData.splice(i, 1);
                }
            }
        } else {
            const listener = eventName;
            rawObj = getRawObject(listener.obj);
            eventData = this.connections.get(rawObj);

            for (let i in eventData) {
                if (listener === eventData[i]) {
                    listener.disconnect();
                    eventData.splice(i, 1);
                }
            }
        }

        if (eventData.length === 0) {
            this.connections.delete(rawObj);
        }
    }

    add(eventName, object, func) {
        const rawObj = getRawObject(object);
        let eventData = this.connections.get(rawObj);

        // event data for a given object
        if (!eventData) {
            eventData = [];
            this.connections.set(rawObj, eventData);
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
    
        // add js listener
        object[eventConnectorName](eventName, funcHandler);
        return localListener;
    }
}
