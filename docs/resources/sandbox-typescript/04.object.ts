const harry = {
  firstname: "Harry",
  lastname: "Potter",
  age: 10,
  hobbies: ["jouer aux échecs", "parler aux serpents"],
};
// Ici, c'est typé implicitement

// Interface = Type pour un objet
// (Note : on peut utiliser aussi `type` qu'on a vu tout à l'heure => préférer les interfaces)

interface User {
  firstname: string;
  lastname: string;
  age?: number; // Propriété optionnelle
  hobbies?: string[]; // Propriété optionnelle
}

const hermione: User = {
  firstname: "Hermione",
  lastname: "Granger",
  age: 11,
  hobbies: ["répondre aux questions", "lecture"],
};

function getFullName(myUser: User) {
  // Avantage 1 : on sait ce qu'il faut fournir à la fonction (consommation de la fonction)
  return `${myUser.firstname} ${myUser.lastname.toUpperCase()}`; // Avantage 2 : on profite de l'auto-complétion (écriture de la fonction)
}

function getFullName2(myUser: { firstname: string; lastname: string }) {
  // Type moins contraignant (le type est défini au niveau de la fonction, sans lui donner de nom)
  return `${myUser.firstname} ${myUser.lastname.toUpperCase()}`;
}

function getFullName3(myUser: { firstname: string; lastname?: string }) {
  // Type moins contraignant (le type est défini au niveau de la fonction, sans lui donner de nom)
  if (myUser.lastname) {
    return `${myUser.firstname} ${myUser.lastname.toUpperCase()}`;
  } else {
    return myUser.firstname;
  }
}

const bob: User = {
  firstname: "Bob",
  lastname: "Eponge",
};

getFullName(bob);

// ===============================================================
// ===============================================================
// ===============================================================

// Héritage d'interface

type House = "Gryffondor" | "Serdaigle" | "Poufsouffle" | "Serpentard"; // CONVENTION : nom de TYPE et INTERFACE avec une MAJUSCULE
type Spell = "expeliarmus" | "accios" | "wingardium leviosa";

interface Wizard extends User {
  house: House;
  knownSpells: Spell[];
  greetings: () => void;
  dealDamage: () => number;
}

const voldy: Wizard = {
  firstname: "Tom",
  lastname: "Jedusor",
  house: "Serpentard",
  knownSpells: ["accios", "wingardium leviosa"],
  greetings: () => {
    console.log("Te voila enfin");
  },
  dealDamage: () => {
    return 1000;
  },
};

const dumbledor: Wizard = {
  firstname: "Albus",
  lastname: "Dumbledor",
  house: "Gryffondor",
  knownSpells: ["expeliarmus", "accios", "wingardium leviosa"],
  greetings: () => {
    console.log("10 points pour Gryffondor");
  },
  dealDamage: () => {
    return 2000;
  },
};
