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
const eventConnectorName = isJQ ? "on" : "addEventListener";
const eventDisconnectorName = isJQ ? "off" : "removeEventListener";

const eventHandlerStates = {
    "listening": "listening",
    "paused": "paused"
}

// Listener - object
// EventHandler - object

/* api:
EventHandler.add("click", "name", object, function)
EventHandler.add("click", object, function)

EventHandler.remove/pause/resume("click")
EventHandler.remove/pause/resume("click", "name")
EventHandler.remove/pause/resume("click", object)
EventHandler.remove/pause/resume("click", "name", object)
EventHandler.remove/pause/resume(ListenerObject)
*/

class Listener extends DynamicState {
    constructor() {
        super(eventHandlerStates);
        this.setState("listening");

        this.alias = ""; // arbitrary, optional event name alias
        this.objRef = ""; // actual reference to the object
        this.callback = ""; // callback function given by the developer
        this.handler = "" // handler function that wraps the callback function
    }  
}

class EventHandler extends Listener {
    constructor() {
        super();

        /* 
            this.connections [ListenerObject] = {
                "eventName" [ListenerObject]: [
                    ListenerObject,
                    ListenerObject,
                    ListenerObject,
                ]
            }
        */
        this.connections = {}; 
    }

    add(
}


