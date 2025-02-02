// Google Sheets API Data Fetch
function loadSheetData() {
    const API_KEY = 'AIzaSyDFwX0FkvILpL_tCJhS6eWyrQ2NeJFBdCE';  // তোমার Google API Key
    const SHEET_ID = '12vn4eNjbNu3S91pF_Q-KyvTRlcEB4Gxmv4PCO3LysRM';  // তোমার Google Sheet ID
    const RANGE = 'Sheet1!A2:D1000';  // তোমার Google Sheet এর রেঞ্জ

    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
        if (!data.values) {
            console.error("No data found in sheet.");
            return;
        }
        renderRankingList(data.values);
    })
    .catch(error => console.error('Error fetching data:', error));
}

// ডাটা ওয়েবসাইটে দেখানোর ফাংশন
function renderRankingList(data) {
    const rankingList = document.getElementById("ranking-list");
    rankingList.innerHTML = '';

    data.forEach(entry => {
        const card = document.createElement("div");
        card.classList.add("ranking-card");

        card.innerHTML = `
            <img src="${entry[3]}" alt="${entry[0]}"> <!-- প্রোফাইল ছবি -->
            <h3>${entry[0]}</h3> <!-- নাম -->
            <div class="vote-count">ভোট: ${entry[1]}</div> <!-- ভোট সংখ্যা -->
            <div class="rank-tag">চাপরি ${entry[2]}</div> <!-- র‍্যাঙ্ক -->
        `;

        rankingList.appendChild(card);
    });
}

// Load Data on Page Load
window.onload = function () {
    loadSheetData();
};