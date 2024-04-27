from flask import Flask, render_template, jsonify, request
from utils.character_data import CharacterData

app = Flask(__name__)
CD = CharacterData()

@app.route('/')
def index():
    return render_template('index.html')
    
@app.route('/get_characters', methods=['GET'])
def get_characters():
    data = CD.load_characters()
    return jsonify(data)

@app.route('/load_character_stats', methods=['POST'])
def load_character_stats():
    data = request.json
    character = data['Character']
    return jsonify(CD.load_character_stats(character))

@app.route('/guess', methods=['POST'])
def guess():
    data = request.json
    answer = data['Answer']
    guess = data['Guess']

    return jsonify(CD.character_guess(answer, guess))


if __name__ == '__main__':
    app.run(debug=True)
