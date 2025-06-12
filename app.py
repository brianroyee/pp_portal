from flask import Flask, render_template, request, redirect, url_for, flash, session
import firebase_admin
from firebase_admin import credentials, db

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'

# Firebase setup
cred = credentials.Certificate('firebase_config.json')  # path to your JSON key
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://techiepedia-prompted-pastures-default-rtdb.firebaseio.com/'  # Replace this!
})


def load_users():
    ref = db.reference('otps')
    users_dict = ref.get()
    if not users_dict:
        return []
    e = list(users_dict.values())
    return e


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        print(f"Login attempt: {username} / {password}")
        users = load_users()

        user_found = False
        for user in users:
            print(f"Checking: {user.get('username')}")
            if user.get('username') == username:
                user_found = True
                if user.get('otp') == password:
                    session['username'] = username
                    session['email'] = user.get('email')
                    session['name'] = user.get('name')
                    flash('Login successful!', 'success')
                    return redirect(url_for('submissions'))
                else:
                    flash('Incorrect password.', 'danger')
                    break
        if not user_found:
            flash('Username not found.', 'danger')
    return render_template('index.html')


@app.route('/submissions')
def submissions():
    if 'username' not in session:
        return redirect(url_for('index'))
    username = session['username']
    email = session.get('email', 'Not provided')
    name = session.get('name', 'Not provided')
    print(f"User {username} logged in with email {email} and name {name}")
    return render_template('submissions.html', username=username, email=email, name=name)


if __name__ == '__main__':
    app.run(debug=True)

