from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/admin', methods=['GET', 'POST'])
def admin():
    return render_template('admin.html')

@app.route('/aiemail')
def aiemail():
    return render_template('aiemail.html')

@app.route('/sample')
def sample():
    return render_template('sample.html')

@app.route('/Calander')
def Calander():
    return render_template('Calendar.html') 

@app.route('/logout')
def logout():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)