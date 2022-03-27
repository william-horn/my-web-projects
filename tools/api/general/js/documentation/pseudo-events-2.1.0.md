
# Pseudo Events


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


```javascript
const event = new PseudoEvent();

function onEventFired() {
    console.log("Event fired!");
}

event.connect(onEventFired);
event.pause(onEventFired); // pause an event (won't be fired)

event.trigger();
```

## 
    => [No Output]

