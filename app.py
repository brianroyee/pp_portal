from flask import Flask, render_template, request, url_for, session, flash, redirect
import json
import os


app = Flask(__name__)

def load_users():
    with open(os.path.join(os.path.dirname(__file__), './as/user.json')) as f:
        data = json.load(f)
    return data['users']


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        print(f"Login attempt: {username} / {password}")
        users = load_users()
        print(f"Loaded users: {users}")
        user_found = False
        for user in users:
            print(f"Checking user: {user}")
            if user['username'] == username:
                user_found = True

                if user['password'] == password:
                    session['username'] = username
                    flash('Login successful!', 'success')
                    return redirect(url_for('submissions'))
                else:
                    print("Password mismatch for user:", username)
                    flash('Incorrect password.', 'danger')
                    break
        if not user_found:
            print("Username not found:", username)
            flash('Username not found.', 'danger')
    return render_template('index.html')


@app.route('/submissions', methods=['GET', 'POST'])
def submissions():
    if 'username' not in session:
        return redirect(url_for('index'))
    return render_template('submissions.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
