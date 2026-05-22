from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)

def init_db():
    conn = sqlite3.connect("scores.db")
    c = conn.cursor()

    c.execute("""
    CREATE TABLE IF NOT EXISTS scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        best_score INTEGER
    )
    """)

    c.execute("SELECT COUNT(*) FROM scores")
    if c.fetchone()[0] == 0:
        c.execute("INSERT INTO scores (best_score) VALUES (0)")

    conn.commit()
    conn.close()

init_db()

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/highscore")
def highscore():
    conn = sqlite3.connect("scores.db")
    c = conn.cursor()

    c.execute("SELECT best_score FROM scores WHERE id=1")
    score = c.fetchone()[0]

    conn.close()
    return jsonify({"best_score": score})

@app.route("/save_score", methods=["POST"])
def save_score():
    data = request.get_json()
    new_score = data["score"]

    conn = sqlite3.connect("scores.db")
    c = conn.cursor()

    c.execute("SELECT best_score FROM scores WHERE id=1")
    current = c.fetchone()[0]

    if new_score > current:
        c.execute("UPDATE scores SET best_score=? WHERE id=1", (new_score,))

    conn.commit()
    conn.close()

    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(debug=True)