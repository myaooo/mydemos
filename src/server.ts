import { sayHello } from "./utils/greet";
import * as ag from "./algorithms/algebra"

function showHello(divName: string, name: string) {
    const elt = document.getElementById(divName);
    elt.innerText = sayHello(name);
}

showHello("greeting", "TypeScript");
let a = new ag.Vector([123,423,23,123]);
let b = new ag.Vector(a);
a[3] = 4;
a.dot(2);
console.log(a);
console.log(b);

