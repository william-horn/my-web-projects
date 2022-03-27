
# Dolphin Framework

```javascript
dolphin.init();

// query select single
fish("#id-selector");
fish(".class-selector");
fish(".parent-class .child-class");

// query select all
fish("^#id-selector");
fish("^.class-selector");
fish("^p");


fish("div").sonar("click")

sonar("click", 

const gui_0 = fish("p");
const gui_1 = fish("^p:nth-child(2) div + label");


// generate buttons

// put buttons in group
link("buttons", [
    button_0,
    button_1,
    button_2
]);

dolphin.chain("searchButton", [button]);


dolphin.getGroup("buttons").add(button_3);
dolphin.getGroup("buttons").click()

```

