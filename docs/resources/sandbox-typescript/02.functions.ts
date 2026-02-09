function multiply(a: number, b: number): number {
  // Type de sortie explicite ici
  return a * b;
}

function substract(a: number, b: number) {
  // Type de sortie INFERÉ par TS qui lit le contenu de la fonction elle même
  return a - b;
}

function sayHello(firstname: string) {
  // Type de sortie : void (rien, `undefined`)
  console.log(`Bonjour ${firstname}`); // effet de bord
}

console.log(multiply(5, 8)); // 40
