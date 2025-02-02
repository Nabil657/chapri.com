// Google API Client ID
const CLIENT_ID = '938617948462-7anmb3ipkvtnlq7n2f2vuto048r2e7ft.apps.googleusercontent.com.apps.googleusercontent.com'; // তোমার Client ID এখানে বসাও
const API_KEY = 'AIzaSyDFwX0FkvILpL_tCJhS6eWyrQ2NeJFBdCE'; // তোমার API Key এখানে বসাও
const SHEET_ID = '12vn4eNjbNu3S91pF_Q-KyvTRlcEB4Gxmv4PCO3LysRM'; // তোমার Google Sheet ID এখানে বসাও

// OAuth2 Authentication
function authenticate() {
    return gapi.auth2.getAuthInstance()
        .signIn({ scope: "https://www.googleapis.com/auth/spreadsheets.readonly" })
        .then(() => {
            console.log("Successfully signed in.");
        }, (error) => {
            console.error("Error signing in", error);
        });
}

// Load Google Sheets API
function loadClient() {
    gapi.client.setApiKey(API_KEY);
    return gapi.client.load("https://sheets.googleapis.com/$discovery/rest?version=v4")
        .then(() => {
            console.log("Google Sheets API loaded");
        }, (error) => {
            console.error("Error loading API", error);
        });
}

// Fetch Data from Google Sheets
function fetchData() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: "Sheet1!A2:C", // Range of the data (adjust as necessary)
    }).then((response) => {
        const data = response.result.values;
        if (data.length > 0) {
            data.forEach(row => {
                const profile = {
                    name: row[0],
                    image: row[1],
                    votes: parseInt(row[2], 10)
                };
                loadProfiles(profile); // Add profile to list
            });
        } else {
            console.log("No data found.");
        }
    }, (error) => {
        console.error("Error fetching data", error);
    });
}

// Load profiles dynamically
function loadProfiles(profile) {
    const profileCard = `
        <div class="profile-card">
            <img src="${profile.image}" alt="${profile.name}">
            <div class="name">${profile.name}</div>
            <div class="rank">চাপরি #${profile.votes}</div>
            <div class="votes">Votes: ${profile.votes}</div>
            <button class="vote-btn" onclick="vote('${profile.name}')">Vote</button>
        </div>
    `;
    document.getElementById('profiles-list').innerHTML += profileCard;
}

// Initialize Google API
function start() {
    gapi.load("client:auth2", () => {
        gapi.auth2.init({ client_id: CLIENT_ID });
    });
}

window.onload = start;