// Example TypeScript file to showcase the Tears of the Kingdom theme

/**
 * A simple class to demonstrate syntax highlighting
 * Comments are styled in secondary text color
 */
class Hero {
  // Properties with type annotations
  private name: string;
  private health: number;
  private stamina: number;

  constructor(name: string, health: number = 100, stamina: number = 100) {
    this.name = name;
    this.health = health;
    this.stamina = stamina;
  }

  // Method demonstrating keywords and functions
  public attack(target: Hero): void {
    const damage = Math.floor(Math.random() * 20) + 5;
    target.takeDamage(damage);
    console.log(`${this.name} attacks ${target.getName()} for ${damage} damage!`);
  }

  private takeDamage(amount: number): void {
    this.health -= amount;
    if (this.health < 0) {
      this.health = 0;
    }
  }

  public getName(): string {
    return this.name;
  }

  public isAlive(): boolean {
    return this.health > 0;
  }
}

// Constants
const STARTING_HEALTH = 100;
const MAX_STAMINA = 150;

// Creating instances
const link = new Hero("Link", STARTING_HEALTH, MAX_STAMINA);
const ganondorf = new Hero("Ganondorf", 200, 100);

// String interpolation
console.log(`Battle begins! ${link.getName()} vs ${ganondorf.getName()}`);

// Control flow with keywords
while (link.isAlive() && ganondorf.isAlive()) {
  if (Math.random() > 0.5) {
    link.attack(ganondorf);
  } else {
    ganondorf.attack(link);
  }
}

// Array and modern JavaScript features
const inventory = ["Master Sword", "Hylian Shield", "Paraglider"];
const powerfulItems = inventory.filter(item => item.includes("Master") || item.includes("Shield"));

// Async/await example
async function fetchQuestData(questId: number): Promise<void> {
  try {
    const response = await fetch(`/api/quests/${questId}`);
    const data = await response.json();
    console.log("Quest data:", data);
  } catch (error) {
    console.error("Failed to fetch quest data:", error);
  }
}

// Export
export { Hero, STARTING_HEALTH, MAX_STAMINA };
