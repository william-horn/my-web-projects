
# Ocean Framework Documentation

## Query Selectors
```javascript
// find first element with id of 'selector-0'
const el_0 = fishFor('#selector-0'); 

// different version of above example
const el_1 = document.fishFor('#selector-0');

// get first element inside of 'el_0' with id of 'selector-1'
const el_2 = el_0.fishFor('#selector-1');
```

