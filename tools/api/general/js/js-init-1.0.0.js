
let mainCall;
const jsinit = init => {mainCall = init}

document.addEventListener("readystatechange", function onReady() {
    document.removeEventListener("readystatechange", onReady);
    mainCall();
});

export default jsinit;
