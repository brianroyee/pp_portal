from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, db
from datetime import datetime
from werkzeug.utils import secure_filename
from supabase import create_client
import os, uuid
from dotenv import load_dotenv
import os
load_dotenv()

SUPABASE_URL = os.getenv('SUPABASE_URL')  
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
app = Flask(__name__)
#CORS(app,origins=["http://localhost:3000", "http://127.0.0.1:3000",os.getenv("CORS_ORIGIN")])
CORS(app)
app.secret_key = os.getenv("SECRET_KEY")

# Firebase setup
cred = credentials.Certificate('firebase_config.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://prompted-pastures-default-rtdb.firebaseio.com/'
})


def load_users():
    ref = db.reference('otps')
    users_dict = ref.get()
    if not users_dict:
        return []
    e = list(users_dict.values())
    return e


@app.route('/login', methods=['GET', 'POST', 'OPTIONS'])
def index():
    if request.method == 'OPTIONS':
        return '', 204
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        print(f"Login attempt: {username} / {password}")
        users = load_users()

        user_found = False
        for user in users:
#            print(f"Checking: {user.get('username')}")
            if user.get('username') == username:
                user_found = True
                if user.get('otp') == password:
                    session['username'] = username
                    session['email'] = user.get('email')
                    session['name'] = user.get('name')
                    email_key = user.get('email').replace('@', '_').replace('.', '_')
                    session['email_key'] = email_key
                    flash('Login successful!', 'success')
                    return redirect(url_for('submissions'))
                else:
                    flash('Incorrect password.', 'danger')
                    break
        if not user_found:
            flash('Username not found.', 'danger')
    return render_template('index.html')

@app.route('/submit', methods=['POST'])
def submit():
    if 'username' not in session:
        return redirect(url_for('index'))

    prompt = request.form.get('text')
    file = request.files.get('image')
    image_url = None

    if file:
        ext = file.filename.rsplit('.', 1)[-1].lower()
        filename = secure_filename(f"{uuid.uuid4()}.{ext}")


        supabase.storage.from_('submissions').upload(filename, file.read())
        image_url = supabase.storage.from_('submissions').get_public_url(filename)

#realtime database
    email_key = session['email_key']
    db.reference(f"otps/{email_key}").update({
        'prompt': prompt,
        'image_url': image_url,
        'submitted_at': datetime.utcnow().isoformat() + 'Z'
    })

    flash('Submission successful!', 'success')
    return redirect(url_for('submissions'))


@app.route('/submissions')
def submissions():
    if 'username' not in session:
        return redirect(url_for('index'))

    email_key = session['email_key']
    user_data = db.reference(f"otps/{email_key}").get()

    return render_template('submissions.html',
        username=session['username'],
        email=session['email'],
        name=session['name'],
        prompt=user_data.get('prompt'),
        image_url=user_data.get('image_url'))




if __name__ == '__main__':
    app.run(debug=True)

