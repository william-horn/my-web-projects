
# Triton Framework Documentation

## Query Selectors
```javascript
// find first element with id of 'selector-0'
const el_0 = fish('#selector-0'); 
// and
const el_1 = el_0.fish('#selector-1');
```

## Fetch Requests
```javascript
const asyncRequest = surf('url', unpackedData => {
    ...
}
```

## Event Delegation
```javascript
const el_0 = fish('#selector-0'); 

// delegate array of elements to a single container element for event handling
const groupEvent = el_0.delegate('newGroup', [
    element_1,
    element_2,
    ...
]);

// create listener on container that looks for the given element array items as a target
groupEvent.click(func);
```

## Remove Elements
```javascript
const koi = fish('#selector-0');

koi.vortex(); // clear all children
koi.release() // remove self
```