
import pandas as pd
import os

class CharacterData:
    def __init__(self):
        current_dir = os.path.dirname(os.path.abspath(__file__))
        path = os.path.join(current_dir, 'data', 'character_info.csv')
        self.df = pd.read_csv(path)
        
    def load_characters(self):
        return self.df['Character'].tolist()
    
    def load_character_stats(self, character):
        character_df = self.df[self.df['Character'] == character]
        return character_df.iloc[0].to_dict()
    
    def character_guess(self, answer, guess):
        #GUESS WILL BE True WHEN CORRECT
        #GUESS WILL BE False WHEN INCORRECT
        #ATTRIBUTES FOR COLUMNS CAN BE ['correct', 'incorrect', 'partial']
        data = {}
        answer = self.df[self.df['Character'] == answer].iloc[0].to_dict()
        guess = self.df[self.df['Character'] == guess].iloc[0].to_dict()

        data['Guess'] = 'correct' if answer['Character'] == guess['Character'] else 'incorrect'
        data['Race'] = checkPartial(answer['Race'], guess['Race'])
        data['Gender'] = 'correct' if answer['Gender'] == guess['Gender'] else 'incorrect'
        data['Elemental Affinity'] = checkPartial(answer['Elemental Affinity'], guess['Elemental Affinity'])
        data['Authority'] = 'correct' if answer['Authority'] == guess['Authority'] else 'incorrect'
        data['Height'] = 'correct' if answer['Height'] == guess['Height'] else 'incorrect'
        data['Afiliation'] = 'correct' if answer['Afiliation'] == guess['Afiliation'] else 'incorrect'
        data['Divine Protection'] = 'correct' if answer['Divine Protection'] == guess['Divine Protection'] else 'incorrect'
        data['Age'] = 'correct' if answer['Age'] == guess['Age'] else 'incorrect'
        return data

        
# Used for Race, Elemental Affinity
def checkPartial(answer, guess):
    answer = {a.strip() for a in answer.split(",")}
    guess = {b.strip() for b in guess.split(",")}

    if (answer == guess):
        return 'correct'
    if (answer & guess):
        return 'partial'
    return 'incorrect'

# c = CharacterData()
# print(c.character_guess('Subaru Natsuki', 'Felix Argyle'))
# c.load_character_stats('Subaru Natsuki')
# print(c.load_characters())