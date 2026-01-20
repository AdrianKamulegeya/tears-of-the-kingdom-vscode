"""
Tears of the Kingdom Theme Demo - Python Example
A simple shrine management system
"""

from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass
from enum import Enum
import json


class ShrineType(Enum):
    """Types of shrines in the game"""
    COMBAT = "combat"
    PUZZLE = "puzzle"
    BLESSING = "blessing"
    TEST = "test"


@dataclass
class Location:
    """Represents a location in Hyrule"""
    x: float
    y: float
    region: str

    def distance_to(self, other: 'Location') -> float:
        """Calculate Euclidean distance to another location"""
        dx = self.x - other.x
        dy = self.y - other.y
        return (dx ** 2 + dy ** 2) ** 0.5


@dataclass
class Shrine:
    """Represents a shrine in the game"""
    id: str
    name: str
    location: Location
    shrine_type: ShrineType
    completed: bool = False
    rewards: List[str] = None

    def __post_init__(self):
        if self.rewards is None:
            self.rewards = ["Spirit Orb"]

    def complete(self) -> None:
        """Mark shrine as completed"""
        self.completed = True
        print(f"✅ Shrine {self.name} completed!")

    def to_dict(self) -> Dict:
        """Convert shrine to dictionary"""
        return {
            "id": self.id,
            "name": self.name,
            "location": {
                "x": self.location.x,
                "y": self.location.y,
                "region": self.location.region
            },
            "type": self.shrine_type.value,
            "completed": self.completed,
            "rewards": self.rewards
        }


class ShrineManager:
    """Manages all shrines in the game"""
    
    def __init__(self):
        self.shrines: List[Shrine] = []
        self._completed_count = 0

    def add_shrine(self, shrine: Shrine) -> None:
        """Add a new shrine to the manager"""
        self.shrines.append(shrine)
        if shrine.completed:
            self._completed_count += 1

    def find_nearest(self, location: Location) -> Optional[Shrine]:
        """Find the nearest shrine to a given location"""
        if not self.shrines:
            return None
        
        return min(
            self.shrines,
            key=lambda s: s.location.distance_to(location)
        )

    def filter_by_type(self, shrine_type: ShrineType) -> List[Shrine]:
        """Get all shrines of a specific type"""
        return [s for s in self.shrines if s.shrine_type == shrine_type]

    def get_incomplete(self) -> List[Shrine]:
        """Get all incomplete shrines"""
        return [s for s in self.shrines if not s.completed]

    @property
    def completion_rate(self) -> float:
        """Calculate completion percentage"""
        if not self.shrines:
            return 0.0
        return (self._completed_count / len(self.shrines)) * 100

    def export_to_json(self, filename: str) -> None:
        """Export shrines to JSON file"""
        data = {
            "total": len(self.shrines),
            "completed": self._completed_count,
            "completion_rate": self.completion_rate,
            "shrines": [s.to_dict() for s in self.shrines]
        }
        
        with open(filename, 'w') as f:
            json.dump(data, f, indent=2)
        
        print(f"📁 Exported {len(self.shrines)} shrines to {filename}")


def main():
    """Main function to demonstrate the shrine system"""
    manager = ShrineManager()
    
    # Create sample shrines
    shrines_data = [
        ("shrine_001", "Oman Au", Location(100.5, 200.3, "Central Hyrule"), ShrineType.COMBAT),
        ("shrine_002", "Ja Baij", Location(150.2, 180.7, "Central Hyrule"), ShrineType.PUZZLE),
        ("shrine_003", "Keh Namut", Location(95.8, 220.1, "Hebra Mountains"), ShrineType.BLESSING),
    ]
    
    for shrine_id, name, location, shrine_type in shrines_data:
        shrine = Shrine(shrine_id, name, location, shrine_type)
        manager.add_shrine(shrine)
    
    # Complete first shrine
    manager.shrines[0].complete()
    
    # Find nearest shrine
    current_location = Location(110.0, 205.0, "Central Hyrule")
    nearest = manager.find_nearest(current_location)
    if nearest:
        print(f"📍 Nearest shrine: {nearest.name}")
    
    # Print statistics
    print(f"🎯 Completion rate: {manager.completion_rate:.1f}%")
    print(f"⏳ Incomplete shrines: {len(manager.get_incomplete())}")


if __name__ == "__main__":
    main()
