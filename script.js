const SHEET_ID = '12vn4eNjbNu3S91pF_Q-KyvTRlcEB4Gxmv4PCO3LysRM';  // Google Sheets ID
const SHEET_API_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/data?key=AIzaSyDFwX0FkvILpL_tCJhS6eWyrQ2NeJFBdCE`; // Google Sheets API URL

const categoryButtons = document.querySelectorAll('.category-btn');
const contentContainer = document.getElementById('content-container');
const loadingDiv = document.getElementById('loading');

categoryButtons.forEach(button => {
    button.addEventListener('click', function() {
        loadData(button.getAttribute('data-category'));
    });
});

function loadData(category) {
    loadingDiv.style.display = 'block';
    
    fetch(SHEET_API_URL)
        .then(response => response.json())
        .then(data => {
            loadingDiv.style.display = 'none';
            const filteredData = data.values.filter(row => category === 'all' || row[1] === category); // Filtering data based on category

            // Sorting the data by vote count (descending order)
            filteredData.sort((a, b) => b[4] - a[4]);

            contentContainer.innerHTML = '';
            
            filteredData.forEach((row, index) => {
                const card = document.createElement('div');
                card.classList.add('content-card');
                card.innerHTML = `
                    <img src="${row[2]}" alt="${row[0]}">
                    <div class="details">
                        <h3>${row[0]}</h3>
                        <p>${row[3]}</p>
                        <span class="rank">${index + 1}th Chapri</span>
                        <button class="vote-btn" data-id="${row[0]}" data-index="${index}" onclick="vote(${index}, '${row[0]}')">Vote</button>
                        <p class="vote-count">Votes: ${row[4]}</p>
                    </div>
                `;
                contentContainer.appendChild(card);
            });
        })
        .catch(error => {
            loadingDiv.style.display = 'none';
            console.error('Error loading data:', error);
        });
}

function vote(index, id) {
    const voteButton = document.querySelector(`button[data-id="${id}"]`);
    const voteCountElement = voteButton.parentElement.querySelector('.vote-count');
    let currentVoteCount = parseInt(voteCountElement.textContent.replace('Votes: ', ''));

    // Disable the button after vote
    voteButton.disabled = true;

    // Update the vote count
    currentVoteCount += 1;
    voteCountElement.textContent = `Votes: ${currentVoteCount}`;

    // Update Google Sheets with the new vote count
    updateVoteCount(id, currentVoteCount);

    // You can also update the local storage or any other storage you are using for vote persistence
    alert(`Voted for ${id} successfully!`);
}

function updateVoteCount(id, newVoteCount) {
    const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${id}?valueInputOption=RAW&key=your-api-key`;
    
    // Prepare the request body for updating the vote count in Google Sheets
    const requestBody = {
        range: id,
        majorDimension: "ROWS",
        values: [[newVoteCount]]
    };

    fetch(updateUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Vote count updated:', data);
    })
    .catch(error => {
        console.error('Error updating vote count:', error);
    });
}