from CodingChallenges import ChallengeManager, CodingChallenge, Difficulty

def load_challenges():
    manager = ChallengeManager()
    # Define some example challenges
    easy_challenge = CodingChallenge({"description": "Basic recursion"}, Difficulty.EASY, 0)
    medium_challenge = CodingChallenge({"description": "List manipulation"}, Difficulty.MEDIUM, 0)
    hard_challenge = CodingChallenge({"description": "Complex mapping"}, Difficulty.HARD, 0)

    # Add challenges to the manager
    manager.add_challenge(easy_challenge)
    manager.add_challenge(medium_challenge)
    manager.add_challenge(hard_challenge)
    return manager

challenge_manager = load_challenges()