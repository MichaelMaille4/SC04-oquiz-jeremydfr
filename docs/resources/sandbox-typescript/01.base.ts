const message: string = "Bonjour"; // Ici, j'ai précisé le type de ma variable

const username = "Alice"; // TypeScript INFÈRE le type de la variable (string, plus précisement la string "Alice")

const isAdmin = true;

// ==> La majorité du temps, on laisse TypeScript inféré le type de nos variables

let age: number; // TS infère que age est "any" --> c'est le type "fourre-tout". => je ne sais pas le type de la variable ! => reviens à faire du JS

// ❌ age = "toto"; // TS interdit cette affectation : Type 'string' is not assignable to type 'number'.
age = 42;

// Autocomplétion
const pi: number = 3.1415;
const fixedPi = pi.toFixed(1);

const containsTheNumberThree = fixedPi.includes("3"); // true
console.log(containsTheNumberThree);

// Null
const rien = null;

// Any
let anything: any; // On évite ce type autant que possible !
// anything.toto(); // ❌ Ce code plantera au runtime !

let person: unknown = { id: 1, name: "Bob", job: "Cuisinier" }; // Imaginons que cette VALEUR provienne d'une API

// On vérifie le format de cette variable unknown avant de la manipuler
if (typeof person !== "object") {
  throw new Error("person should be an object");
}
if (person === null) {
  throw new Error("person should be an object");
}
if (!("job" in person)) {
  throw new Error("person should have a job property");
}

console.log(person.job);

// CLASSES

const today = new Date(); // On a un TYPE pour chaque Classe
const regex = new RegExp(/Hello/);

// Avantage : on profite de l'autocomplétion
today.getMonth(); // 11
regex.test("HelloWorld"); // true
