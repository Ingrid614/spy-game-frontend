export type Category = "lieux" | "objets" | "metiers" | "animaux";

export type Role = "civilian" | "spy";

export interface PlayerState {
  name: string;
  role: Role;
  word: string;
}

const wordPairs: Record<Category, { civ: string; spy: string }[]> = {
  lieux: [
    { civ: "Plage", spy: "Désert" },
    { civ: "Hôpital", spy: "Clinique" },
    { civ: "Cinéma", spy: "Théâtre" },
    { civ: "École", spy: "Université" },
  ],
  objets: [
    { civ: "Voiture", spy: "Camion" },
    { civ: "Stylo", spy: "Crayon" },
    { civ: "Téléphone", spy: "Tablette" },
    { civ: "Chaise", spy: "Fauteuil" },
  ],
  metiers: [
    { civ: "Médecin", spy: "Infirmier" },
    { civ: "Policier", spy: "Détective" },
    { civ: "Boulanger", spy: "Pâtissier" },
    { civ: "Avocat", spy: "Juge" },
  ],
  animaux: [
    { civ: "Chien", spy: "Loup" },
    { civ: "Chat", spy: "Tigre" },
    { civ: "Cheval", spy: "Âne" },
    { civ: "Aigle", spy: "Faucon" },
  ],
};

export function assignRoles(
  players: string[],
  spyCount: number,
  category: Category
): Record<string, PlayerState> {
  const categoryPairs = wordPairs[category];
  const randomPairIndex = Math.floor(Math.random() * categoryPairs.length);
  const pair = categoryPairs[randomPairIndex];

  const roles: Record<string, PlayerState> = {};
  
  // Shuffle players
  const shuffledPlayers = [...players].sort(() => 0.5 - Math.random());
  
  shuffledPlayers.forEach((player, index) => {
    if (index < spyCount) {
      roles[player] = { name: player, role: "spy", word: pair.spy };
    } else {
      roles[player] = { name: player, role: "civilian", word: pair.civ };
    }
  });

  return roles;
}
