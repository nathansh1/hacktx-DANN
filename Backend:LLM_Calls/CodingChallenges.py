from enum import Enum

class Difficulty(Enum):
    Easy = 1
    Medium = 2
    Hard = 3

class CodingChallenges:
    def __init__(self, props, difficulty, attempts):
        self.props = props
        self.difficulty = difficulty
        self.attempts = attempts
    
    
class ChallengeManager:
    def __init__(self):
        self.challenges = {
            Difficulty.EASY: [],
            Difficulty.MEDIUM: [],
            Difficulty.HARD: []
        }

    def add_challenge(self, challenge):
        self.challenges[challenge.difficulty].append(challenge)

    def get_challenge(self, difficulty):
        # Fetch a challenge based on the specified difficulty
        return self.challenges[difficulty][0] if self.challenges[difficulty] else None