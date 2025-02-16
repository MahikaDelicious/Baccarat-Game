const bettorsContainer = document.getElementById('bettors-container');
const setBettorsButton = document.getElementById('setBettors');
const dealButton = document.getElementById('deal');

setBettorsButton.addEventListener('click', () => {
    const numberOfBettors = parseInt(document.getElementById('numBettors').value) || 2;
    bettorsContainer.innerHTML = ''; // Clear existing bettors
    for (let i = 1; i <= numberOfBettors; i++) {
        addBettor(i);
    }
    dealButton.disabled = false; // Enable deal button
});

function addBettor(index) {
    const bettorDiv = document.createElement('div');
    bettorDiv.classList.add('bettor');
    bettorDiv.innerHTML = `
        Bettor ${index} Name: <input type="text" class="bettor-name" placeholder="Enter name" aria-label="Bettor ${index}'s name">
        <select class="bet" data-bettor="${index}" aria-label="Bettor ${index}'s bet">
            <option value="player">Player</option>
            <option value="banker">Banker</option>
            <option value="tie">Tie</option>
        </select>
        <button class="remove-bettor">Remove</button>
    `;
    bettorsContainer.appendChild(bettorDiv);

    // Add event listener for remove button
    bettorDiv.querySelector('.remove-bettor').addEventListener('click', () => {
        bettorsContainer.removeChild(bettorDiv);
    });
}

// Card game logic remains unchanged
const cardValues = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6,
    '7': 7, '8': 8, '9': 9, '10': 0, 'J': 0,
    'Q': 0, 'K': 0, 'A': 1
};

function calculateHandValue(hand) {
    return hand.reduce((sum, card) => sum + cardValues[card], 0) % 10;
}

function drawCard(deck) {
    return deck.splice(Math.floor(Math.random() * deck.length), 1)[0];
}

dealButton.addEventListener('click', () => {
    // Validation: Check if all bettors have a name
    const names = Array.from(document.querySelectorAll('.bettor-name')).map(input => input.value.trim());
    for (const name of names) {
        if (name === '') {
            alert('Please enter a name for all bettors.');
            return; // Stop further execution if a name is missing
        }
    }

    const deck = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    let playerHand = [drawCard(deck), drawCard(deck)];
    let bankerHand = [drawCard(deck), drawCard(deck)];

    let playerScore = calculateHandValue(playerHand);
    let bankerScore = calculateHandValue(bankerHand);

    // Drawing rules for Player
    if (playerScore <= 5) playerHand.push(drawCard(deck));
    // Drawing rules for Banker
    if (bankerScore <= 2) bankerHand.push(drawCard(deck));

    playerScore = calculateHandValue(playerHand);
    bankerScore = calculateHandValue(bankerHand);

    // Determine the winner
    const winner = playerScore > bankerScore ? 'Player' : bankerScore > playerScore ? 'Banker' : 'Tie';

    const results = [];
    const bets = Array.from(document.querySelectorAll('.bet')).map(select => select.value);

    bets.forEach((bet, index) => {
        results.push(bet === winner.toLowerCase() ? `${names[index]} wins!` : `${names[index]} loses.`);
    });

    // Show results
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <h3>PLAYER'S HAND: </h3>
        <h5>${playerHand.join(', ')} (Score: ${playerScore})</h5>
        <br>
        <h3>BANKER'S HAND: </h3>
        <h5>${bankerHand.join(', ')} (Score: ${bankerScore})</h5>
        <br>
        <h3>The winner is: ${winner}</h3>
        <br>
        <h3>Results:</h3>
        <ul>${results.map(res => `<li>${res}</li>`).join('')}</ul>
    `;
    resultDiv.style.display = 'block'; // Show results after dealing
});
