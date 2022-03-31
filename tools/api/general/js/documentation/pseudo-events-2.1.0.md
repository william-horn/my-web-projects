
# Pseudo Events

## Connecting & Triggering Events
```javascript
// create new pseudo event with no arguments
const event = new PseudoEvent();

function onEventFired() {
    console.log("Event fired!");
}

event.connect(onEventFired);    // connect onEventFired to event
event.trigger();                // trigger the event
```

##
    => Event fired!

## Connect Parameters
```javascript
// connect with an (arbitrary) event name
event.connect( "eventName_0", () => console.log("Event_0 fired!") );

// connect without an event name
event.connect( () => console.log("Event_1 fired!") );

// trigger the event
event.trigger();
```

##
    => Event_0 fired!
    => Event_1 fired!


## Connection Object
```javascript
// '.connect' returns a connection object 
const connectionOne = event.connect( "eventName_1", () => {} );
const connectionTwo = event.connect( () => {} );

console.log(connectionOne);
console.log(connectionTwo);
```

## 
    => Connection Object
    => Connection Object


## Methods for Disconnecting
```javascript
const event = new PseudoEvent();

function onEventFired() {
    console.log("Event fired!");
}
const conn = event.connect("eventName_0", onEventFired);

// equivalent methods for disconnection

event.disconnect(onEventFired); // disconnect by function literal
event.disconnect("eventName_0"); // disconnect by event name
event.disconnect("eventName_0", onEventFired); // disconnect by event name AND function literal
event.disconnect(conn); // disconnect Connection literal
```
```javascript
event.disconnectAll(); // disconnect all connections
```

## Methods for Pausing/Resuming
```javascript
// same as disconnect
event.pause(onEventFired);
event.pause("eventName_0");
event.pause("eventName_0", onEventFired);
event.pause(conn);
event.pauseAll(); // pause all connections

event.resume(onEventFired);
event.resume("eventName_0");
event.resume("eventName_0", onEventFired);
event.resume(conn);
event.resumeAll() // resume all connections
```

## Parent/Child Events

```javascript
// instantiation
const parentEvent = new PseudoEvent();
const childEvent = new PseudoEvent(parentEvent); // child event is now inside of parent event and is affected by parent behavior
```
Parent/child behavior
```javascript
childEvent.connect(() => console.log("Fired!"));

parentEvent.pauseAll(); // pause parent event

// child event will not trigger because parent event is paused
childEvent.trigger();
```
Notion extends to ancestors/descendants
```javascript
const greatGrandparentEvent = new PseudoEvent();
const grandparentEvent = new PseudoEvent(greatGrandparentEvent);
const parentEvent = new PseudoEvent(grandparentEvent);
const childEvent = new PseudoEvent(parentEvent);

greatGrandparentEvent.pauseAll(); // pause great grandparent
childEvent.trigger(); // child will not trigger
```