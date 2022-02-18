
// event selectors
const $hit = $('#btn-hit');
const $stand = $('#btn-stand');
const $playerPts = $('#player-points');
const $dealerPts = $('#dealer-points');
const $gameResult = $('#game-result');

// initial setup
$hit.prop('disabled', 'true');
$hit.css('backgroundColor', 'grey');
$stand.prop('disabled', 'true');
$stand.css('backgroundColor', 'grey');
$stand.css('color', 'white');

// player
let player = {
    pointsSpan: '#player-points',
    div: '#player-side',
    points: 0,
    hasAce: 0,
    subtractAce: 0,
    };

// dealer
let dealer = {
    pointsSpan: '#dealer-points',
    div: '#dealer-side',
    points: 0,
    hasAce: 0,
    subtractAce: 0,
};

// game variables
let wins = 0;
let losses = 0;
let draws = 0;

// deck
let suits = ['Spades', 'Hearts', 'Clubs', 'Diamonds'];
let values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

let card;
const getCardName = (suit, value) => {
    card = value + suit[0]
};

// functions

function randomCard() {
    let currentSuit = suits[Math.floor(Math.random() * suits.length)];
    let currentValue = values[Math.floor(Math.random() * values.length)];
    return getCardName(currentSuit, currentValue)
}

function dealCard(activePlayer) {
    if (activePlayer.points <= 21) {
        randomCard();
        let cardImg = document.createElement('img');
        cardImg.src = `cards.jpg/${card}.jpg`
        document.querySelector(activePlayer.div).appendChild(cardImg);
    }
}

function hit() {
    dealCard(player); 
    let cardValue = card.slice(0, -1);
    updatePoints(cardValue, player);
    showPoints(player);
    if (player.points >= 21) {
        dealDealer();
        dealersTurn();
        $stand.css('backgroundColor', 'grey');
        $stand.css('color', 'white');
    }
}

function dealDealer() {
    dealCard(dealer);
    let cardValue = card.slice(0, -1);
    updatePoints(cardValue, dealer);
    showPoints(dealer);
}

function stand() {
    $hit.prop('disabled', 'true');
    $hit.css('backgroundColor', 'grey');
    $stand.prop('disabled', 'true');
    $stand.css('backgroundColor', 'grey');
    $stand.css('color', 'white');
    dealDealer();
    dealersTurn();
}

function dealersTurn() {
    for (i = 0; player.points > dealer.points && player.points <=21 && dealer.points < 21; i++) {
        dealDealer();
    }
    showResult(computeWinner());
}

function updatePoints(cardValue, activePlayer) {
    if (cardValue === 'A') {
        activePlayer.points += 11;
        activePlayer.hasAce ++;
    } else if (cardValue === 'J' || cardValue === 'Q' || cardValue === 'K') {
        activePlayer.points += 10;
    } else {
        activePlayer.points += parseInt(cardValue);
    }
    hasAceInHand(activePlayer);
}

function hasAceInHand(activePlayer) {
    if (activePlayer.points > 21 && activePlayer.hasAce >= 1 && activePlayer.hasAce > activePlayer.subtractAce) {
        activePlayer.points -= 10;
        activePlayer.subtractAce ++;
    }
}

function showPoints(activePlayer) {
    if (activePlayer.points < 21) {
        document.querySelector(activePlayer.pointsSpan).textContent = activePlayer.points;
    } else if (activePlayer.points > 21) {
        document.querySelector(activePlayer.pointsSpan).textContent = activePlayer.points + ' (BUST)';
        document.querySelector(activePlayer.pointsSpan).style.color = 'red';
        $hit.prop('disabled', 'true');
        $hit.css('backgroundColor', 'grey');
    } else {
        document.querySelector(activePlayer.pointsSpan).textContent = activePlayer.points;
        document.querySelector(activePlayer.pointsSpan).style.color = 'yellow';
        $hit.prop('disabled', 'true');
        $hit.css('backgroundColor', 'grey');
    }
}

function computeWinner() {
    let winner;
    if (player.points <= 21) {
        if (player.points > dealer.points || dealer.points > 21) {
            winner = player;
            wins++;
        } else if (dealer.points > player.points) {
            winner = dealer;
            losses++
        } else if (player.points === dealer.points) {
            draws++
        }
    } else if (player.points > 21 && dealer.points <= 21) {
        winner = dealer;
        losses++
    } else {
        draws++
    }
    return winner;
}

function showResult(winner) {
    if (winner === player) {
        $('#wins').text(wins);
        $gameResult.text('You WON!');
        $gameResult.css('color', 'green');
        $gameResult.css('fontSize', '30px');
        winnerSound.play();
    } else if (winner === dealer) {
        $('#losses').text(losses);
        $gameResult.text('You LOST!');
        $gameResult.css('color', 'red');
        $gameResult.css('fontSize', '30px');
        loserSound.play();
    } else {
        $('#draws').text(draws);
        $gameResult.text('You DREW');
        $gameResult.css('color', 'orange');
        $gameResult.css('fontSize', '30px');
        drawSound.play();
    }
}

function newGame() {
    resetData();
    // 1st cards for player side
    hit();
    // wait.. card for the dealer side
    setTimeout(dealDealer, 250);
    // wait.. 2nd card for player side
    setTimeout(hit, 500);
}

function resetData() {
    // points
    player.points = 0;
    player.hasAce = 0;
    player.subtractAce = 0;
    dealer.points = 0;
    dealer.hasAce = 0;
    dealer.subtractAce = 0;
    $playerPts.css('color', 'white');
    $dealerPts.css('color', 'white');
    // button
    $hit.removeAttr('disabled');
    $stand.removeAttr('disabled');
    $hit.css('backgroundColor', '#097bfe');
    $stand.css('backgroundColor', '#fec109');
    $stand.css('color', 'black');
    // text
    $gameResult.text("Let's have some fun!");
    $gameResult.css('color', 'black');
    $gameResult.css('fontSize', '24px');
    // cards
    let playerCards = $('#player-side img');
    for (let i = 0; i < playerCards.length; i++) {
        playerCards[i].remove();
    }
    let dealerCards = $('#dealer-side img');
    for (let i = 0; i < dealerCards.length; i++) {
        dealerCards[i].remove();
    }
}

// audio files
let loserSound = new Audio('sounds/aww.mp3');
let winnerSound = new Audio('sounds/cash.mp3');
let drawSound = new Audio('sounds/You drew!.mp3');
