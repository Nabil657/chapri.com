// Google Sheets API setup
const API_KEY = 'AIzaSyDFwX0FkvILpL_tCJhS6eWyrQ2NeJFBdCE';  // Replace with your actual API key
const SPREADSHEET_ID = '12vn4eNjbNu3S91pF_Q-KyvTRlcEB4Gxmv4PCO3LysRM'; // Replace with your actual Google Sheets ID
const RANGE = 'Sheet1!A2:F'; // Adjust this if necessary

function loadCategory(category) {
    document.getElementById('loading').style.display = 'block';
    fetchGoogleSheetData(category);
}

function fetchGoogleSheetData(category) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayData(data.values, category);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('loading').style.display = 'none';
        });
}

function displayData(data, category) {
    const contentContainer = document.getElementById('content-container');
    contentContainer.innerHTML = '';
    
    data.forEach(entry => {
        if (entry[2] === category) {  // Filter by category
            const card = document.createElement('div');
            card.classList.add('content-card');
            
            const image = document.createElement('img');
            image.src = entry[3];  // Assuming the image URL is in column D
            
            const details = document.createElement('div');
            details.classList.add('details');
            details.innerHTML = `
                <h3>${entry[0]}</h3>  <!-- Name in column A -->
                <p>${entry[4]}</p>    <!-- Description in column E -->
                <p class="rank">${entry[5]}</p> <!-- Rank in column F -->
                <button class="vote-btn" onclick="vote('${entry[0]}')">Vote</button>
                <div class="vote-count" id="vote-count-${entry[0]}">0 votes</div>
            `;
            
            card.appendChild(image);
            card.appendChild(details);
            contentContainer.appendChild(card);
        }
    });
    
    document.getElementById('loading').style.display = 'none';
}

function vote(name) {
    const voteCountElement = document.getElementById(`vote-count-${name}`);
    let currentVoteCount = parseInt(voteCountElement.innerText);
    currentVoteCount += 1;
    voteCountElement.innerText = `${currentVoteCount} votes`;
    
    // Update the Google Sheet or your backend server to record the vote
    updateVoteCount(name, currentVoteCount);
}

function updateVoteCount(name, newVoteCount) {
    // You can integrate here an API to update the Google Sheet with the new vote count
    console.log(`Vote updated for ${name}: ${newVoteCount}`);
}