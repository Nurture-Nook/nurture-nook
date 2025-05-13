import random
import string

ADJECTIVES = ["Silent", "Misty", "Bright", "Quiet", "Gentle", "Wild", "Serene", "Sparkling", "Ethereal", "Windswept", "Lush", "Silken"]
NOUNS = ["Fern", "Stream", "Cloud", "Pine", "Breeze", "Stone", "Waterfall", "Brook", "Sky", "Star", "Shrub", "Blossom"]

def generate_alias(existing_aliases: set) -> str:
    while True:
        alias = f"{random.choice(ADJECTIVES)} {random.choice(NOUNS)} {''.join(random.choices(string.digits, k=6))}"
        if alias not in existing_aliases:
            return alias
