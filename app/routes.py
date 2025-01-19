from flask import render_template, request, jsonify
from app import app
from app.game_logic import shuffle_books

@app.route('/')
def index():
    shuffled_books, correct_order = shuffle_books()
    return render_template('index.html', books=shuffled_books, correct_order=correct_order)

@app.route('/check_order', methods=['POST'])
def check_order():
    user_order = request.json.get('order', [])
    correct_order = request.json.get('correct_order', [])
    incorrect_indices = [i for i, (u, c) in enumerate(zip(user_order, correct_order)) if u.lower() != c.lower()]

    print('User Order:', user_order)
    print('Correct Order:', correct_order)
    print('Incorrect Indices:', incorrect_indices)

    return jsonify(incorrect_indices=incorrect_indices)
