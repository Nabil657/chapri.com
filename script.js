// Initialize Google API client
function initClient() {
    gapi.client.init({
        apiKey: 'AIzaSyDFwX0FkvILpL_tCJhS6eWyrQ2NeJFBdCE',  // API Key
        clientId: '938617948462-7anmb3ipkvtnlq7n2f2vuto048r2e7ft.apps.googleusercontent.com',  // Client ID from Google Cloud Console
        scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
        discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
    }).then(function () {
        loadSheetData();
    });
}

// Load data from Google Sheets
function loadSheetData() {
    const spreadsheetId = '12vn4eNjbNu3S91pF_Q-KyvTRlcEB4Gxmv4PCO3LysRM'; // Replace with your Google Sheets ID
    const range = 'Sheet1!A1:D100'; // Sheet name and range

    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: range,
    }).then(function (response) {
        const data = response.result.values;
        renderRankingList(data);
    }, function (error) {
        console.error('Error retrieving data from Google Sheets: ', error);
    });
}

// Render Ranking List
function renderRankingList(data) {
    const rankingList = document.getElementById("ranking-list");

    data.forEach(entry => {
        const card = document.createElement("div");
        card.classList.add("ranking-card");

        card.innerHTML = `
            <img src="${entry[3]}" alt="${entry[0]}"> <!-- Image URL in Column D -->
            <h3>${entry[0]}</h3> <!-- Name in Column A -->
            <div class="vote-count">ভোট: ${entry[1]}</div> <!-- Votes in Column B -->
            <div class="rank-tag">চাপরি ${entry[2]}</div> <!-- Rank in Column C -->
        `;

        rankingList.appendChild(card);
    });
}

// Search Functionality
document.getElementById("search-bar").addEventListener("input", function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredData = data.filter(entry => entry[0].toLowerCase().includes(searchTerm));
    document.getElementById("ranking-list").innerHTML = ''; // Clear current list
    filteredData.forEach(entry => {
        const card = document.createElement("div");
        card.classList.add("ranking-card");

        card.innerHTML = `
            <img src="${entry[3]}" alt="${entry[0]}">
            <h3>${entry[0]}</h3>
            <div class="vote-count">ভোট: ${entry[1]}</div>
            <div class="rank-tag">চাপরি ${entry[2]}</div>
        `;
        
        document.getElementById("ranking-list").appendChild(card);
    });
});

// Load the client after the page has loaded
window.onload = function () {
    gapi.load("client:auth2", initClient);
};