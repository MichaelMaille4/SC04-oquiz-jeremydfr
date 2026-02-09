// Tableau = Array
const fruits = ["kiwi", "banane", "mangue"]; // Type implicite
const vegetables: string[] = ["brocoli", "eggplant", "carrot"]; // Type explicite
const flavors: Array<string> = ["sweet", "salty", "spicy"];

vegetables.push("cauliflower"); // ✅
// vegetables.push(42);          // ❌ Argument of type 'number' is not assignable to parameter of type 'string'.

// Tableau hybride (rare)
const stuffs = ["hello", 42, true]; // (string | number | boolean)[]
const things: Array<number | string> = [42, -10, "hello", 3.14];

// Union de type
type Thing = number | string | boolean; // Créer un nouveau TYPE
const things2: Thing[] = [true, "false", 42];

type Condiment = "salt" | "pepper" | "chilly" | "mustard"; // Type "enum" (de string)
const curry: Condiment[] = ["salt", "chilly"];

// const curry: Condiment[] = ["salt", "toto"];   // Type '"toto"' is not assignable to type 'Condiment'.

// ==== Exemple ====

type Theme = "dark" | "light";
function changeTheme(theme: Theme) {
  console.log("On fait du code front..."); // Changement dans le DOM
}

changeTheme("dark"); // ✅
// changeTheme("blue"); // ❌
