
import pandas as pd
import os
import re
import random
import datetime
import linecache

class CharacterData:
    def __init__(self):
        self.current_dir = os.path.dirname(os.path.abspath(__file__))
        path = os.path.join(self.current_dir, 'data', 'character_info.csv')
        self.df = pd.read_csv(path)
        
    def load_characters(self):
        return self.df['Character'].tolist()
    
    def load_character_stats(self, character):
        character_df = self.df[self.df['Character'] == character]
        stats = {k:str(v) for k,v in character_df.iloc[0].to_dict().items()}
        if stats['Elemental Affinity'] == 'nan':
            stats['Elemental Affinity'] = 'N/A'
        return stats
    
    def character_guess(self, answer, guess):
        #GUESS WILL BE True WHEN CORRECT
        #GUESS WILL BE False WHEN INCORRECT
        #ATTRIBUTES FOR COLUMNS CAN BE ['correct', 'incorrect', 'partial']
        data = {}
        answer = self.df[self.df['Character'] == answer].iloc[0].to_dict()
        guess = self.df[self.df['Character'] == guess].iloc[0].to_dict()

        answer = {k:str(v).strip() for k,v in answer.items()}
        guess = {k:str(v).strip() for k,v in guess.items()}

        data['Guess'] = 'correct' if answer['Character'] == guess['Character'] else 'incorrect'
        data['Race'] = checkPartial(answer['Race'], guess['Race'])
        data['Gender'] = 'correct' if answer['Gender'] == guess['Gender'] else 'incorrect'
        data['Elemental Affinity'] = checkPartial(answer['Elemental Affinity'], guess['Elemental Affinity'])
        data['Authority'] = 'correct' if answer['Authority'] == guess['Authority'] else 'incorrect'
        data['Height'] = 'correct' if answer['Height'] == guess['Height'] else 'incorrect'
        data['Afiliation'] = 'correct' if answer['Afiliation'] == guess['Afiliation'] else 'incorrect'
        data['Divine Protection'] = 'correct' if answer['Divine Protection'] == guess['Divine Protection'] else 'incorrect'
        data['Age'] = 'correct' if answer['Age'] == guess['Age'] else 'incorrect'

        data['AgeArrow'] = compareNumb(answer['Age'], guess['Age'])
        data['HeightArrow'] = compareNumb(answer['Height'], guess['Height'])

        return data
    
    def generate_daily_answers(self):
        CYCLES = 25
        path = os.path.join(self.current_dir, 'data', 'answers.txt')
        valid_characters = self.df.loc[self.df['Priority'] == 'T', 'Character'].tolist()

        if os.path.exists(path):
            os.remove(path)

        with open(path, 'w') as f:
            for _ in range(CYCLES):
                random.shuffle(valid_characters)
                for character in valid_characters:
                    f.write(f'{character}\n')

    def get_daily_character(self):
        path = os.path.join(self.current_dir, 'data', 'answers.txt')
        line_number = getCurrentDay()
        character = linecache.getline(path, line_number)
        return character.strip()

def getCurrentDay():
    start = datetime.date(2024, 4, 28)
    today = datetime.date.today()
    return ((today - start).days + 1) % 1850

def compareNumb(answer, guess):
    answer = re.sub(r'\D', '', answer)
    guess = re.sub(r'\D', '', guess)

    print(answer, guess)

    if answer == guess:
        return 'correct'
    if not answer or not guess:
        return 'undefined'
    if int(answer) > int(guess):
        return 'higher'
    if int(guess) > int(answer):
        return 'lower'
    return 'correct'

# Used for Race, Elemental Affinity
def checkPartial(answer, guess):
    answer = {a.strip() for a in answer.split(",")}
    guess = {b.strip() for b in guess.split(",")}

    if (answer == guess):
        return 'correct'
    if (answer & guess):
        return 'partial'
    return 'incorrect'

current_time = datetime.datetime.now().time()
formatted_time = current_time.strftime("%I:%M:%S %p")
print("Current time:", formatted_time)

# c = CharacterData()
# print(c.get_daily_character())
# c.generate_daily_answers()
# print(c.character_guess('Subaru Natsuki', 'Felix Argyle'))
# c.load_character_stats('Subaru Natsuki')
# print(c.load_characters())