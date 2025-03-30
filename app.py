from flask import Flask, render_template, request, jsonify, redirect, url_for, session
from flask_cors import CORS
import os
import json
import re
from google import genai
from google.genai import types
import google.oauth2.credentials
import google_auth_oauthlib.flow
import googleapiclient.discovery

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

CLIENT_SECRETS_FILE = "credentials.json"
SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']
API_SERVICE_NAME = 'calendar'
API_VERSION = 'v3'

app = Flask(__name__)
app.secret_key = 'YOUR_SECRET_KEY'  # Replace with your secret key
CORS(app)

# Gemini API configuration (your existing endpoints)
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "AIzaSyDC58Z7RvyyBDrmuSucPYMzLdclinkMR8A")
MODEL = "gemini-2.0-flash"  # Adjust this if needed

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/admin', methods=['GET', 'POST'])
def admin():
    return render_template('admin.html')

@app.route('/aiemail')
def aiemail():
    return render_template('aiemail.html')

@app.route('/research', methods=['GET', 'POST'])
def research():
    if request.method == 'POST':
        data = request.get_json()
        query = data.get('query', '')
        if not query:
            return jsonify({"results": []})
        
        # Create Gemini client
        client = genai.Client(api_key=GEMINI_API_KEY)
        
        # Construct prompt with instruction for one title and summary (20-30 words each)
        prompt = (
            f"Provide a JSON object with keys 'title' and 'summary'. Both should be between 20-30 words describing the research query: {query}"
        )
        contents = [
            types.Content(
                role="user",
                parts=[types.Part.from_text(text=prompt)]
            )
        ]
        generate_content_config = types.GenerateContentConfig(
            response_modalities=["text"],
            response_mime_type="text/plain"
        )
        
        result_text = ""
        try:
            # Stream the response from Gemini
            for chunk in client.models.generate_content_stream(
                model=MODEL,
                contents=contents,
                config=generate_content_config,
            ):
                if chunk.text:
                    result_text += chunk.text.strip()
            
            # Debug print of raw response
            print("Raw Gemini response:", result_text)
            
            # Remove markdown code fences if present.
            result_text = re.sub(r"^```(?:json)?\s*|```$", "", result_text).strip()
            
            # Now parse the cleaned string as JSON
            try:
                result_obj = json.loads(result_text)
                if "title" in result_obj and "summary" in result_obj:
                    results = [{"title": result_obj["title"], "summary": result_obj["summary"]}]
                else:
                    results = [{"title": "Error", "summary": "Output JSON did not contain expected keys."}]
            except Exception as parse_error:
                results = [{
                    "title": "Error",
                    "summary": f"Failed to parse Gemini response as JSON: {str(parse_error)}. Raw response: {result_text}"
                }]
            
            return jsonify({"results": results})
        except Exception as e:
            print("Error calling Gemini API:", e)
            return jsonify({"results": [], "error": str(e)}), 500
    else:
        return render_template('research.html')

######################################
# Google Calendar API Integration Code
######################################

@app.route('/calendar')
def calendar_view():
    # If we don't have credentials, redirect to the authorization endpoint
    if 'credentials' not in session:
        return redirect(url_for('authorize'))
    
    # Load credentials from the session.
    credentials = google.oauth2.credentials.Credentials(**session['credentials'])
    service = googleapiclient.discovery.build(API_SERVICE_NAME, API_VERSION, credentials=credentials)
    
    # Fetch the next 10 events from the primary calendar.
    events_result = service.events().list(calendarId='primary', maxResults=10, singleEvents=True,
                                          orderBy='startTime').execute()
    events = events_result.get('items', [])
    
    # Debug print events to the console
    for event in events:
        print("Event:", event.get('summary', 'No Title'))
    
    # Save the credentials back to the session in case they were refreshed.
    session['credentials'] = credentials_to_dict(credentials)
    
    # Render the calendar template, passing in events.
    return render_template('calendar.html', events=events)

@app.route('/authorize')
def authorize():
    # Create the flow using the client secrets file.
    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE, scopes=SCOPES)
    flow.redirect_uri = url_for('oauth2callback', _external=True)

    # Generate the authorization URL and state.
    authorization_url, state = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true')
    
    # Store the state in the session.
    session['state'] = state
    return redirect(authorization_url)

@app.route('/oauth2callback')
def oauth2callback():
    state = session.get('state')
    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE, scopes=SCOPES, state=state)
    flow.redirect_uri = url_for('oauth2callback', _external=True)
    
    # Use the authorization response to fetch the token.
    authorization_response = request.url
    flow.fetch_token(authorization_response=authorization_response)
    
    # Store credentials in the session.
    credentials = flow.credentials
    session['credentials'] = credentials_to_dict(credentials)
    
    return redirect(url_for('calendar_view'))

def credentials_to_dict(credentials):
    return {
        'token': credentials.token,
        'refresh_token': credentials.refresh_token,
        'token_uri': credentials.token_uri,
        'client_id': credentials.client_id,
        'client_secret': credentials.client_secret,
        'scopes': credentials.scopes
    }

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('home'))

######################################

if __name__ == '__main__':
    app.run()
