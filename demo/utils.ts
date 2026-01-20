/**
 * Utility functions for the TOTK Theme Demo
 */

interface Shrine {
  id: string;
  name: string;
  location: Location;
  type: ShrineType;
  completed: boolean;
  rewards: string[];
}

interface Location {
  x: number;
  y: number;
  region: string;
}

type ShrineType = 'combat' | 'puzzle' | 'blessing' | 'test';

/**
 * Calculate distance between two locations
 */
export function calculateDistance(loc1: Location, loc2: Location): number {
  const dx = loc2.x - loc1.x;
  const dy = loc2.y - loc1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Find nearest shrine to a given location
 */
export function findNearestShrine(
  currentLocation: Location,
  shrines: Shrine[]
): Shrine | null {
  if (shrines.length === 0) return null;

  let nearest = shrines[0];
  let minDistance = calculateDistance(currentLocation, shrines[0].location);

  for (const shrine of shrines.slice(1)) {
    const distance = calculateDistance(currentLocation, shrine.location);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = shrine;
    }
  }

  return nearest;
}

/**
 * Generic result type for async operations
 */
export type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Async wrapper with error handling
 */
export async function tryCatch<T>(
  fn: () => Promise<T>
): Promise<Result<T>> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error(String(error))
    };
  }
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Constants
 */
export const REGIONS = [
  'Central Hyrule',
  'Hebra Mountains',
  'Gerudo Desert',
  'Lanayru Wetlands',
  'Akkala Highlands'
] as const;

export const MAX_INVENTORY_SIZE = 100;
export const DEFAULT_STAMINA = 100;
