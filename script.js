const cardsEasy = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D']; // 4 pares
const cardsMedium = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F']; // 6 pares
const cardsHard = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H']; // 8 pares
let shuffledCards = [];
let selectedCards = [];
let errors = 0;
let matchedPairs = 0;
let timerInterval;
let seconds = 0;
let minutes = 0;

const gameBoard = document.getElementById('game-board');
const errorsDisplay = document.getElementById('errors');
const timerDisplay = document.getElementById('timer');
const victoryScreen = document.getElementById('victory-screen');
const victoryMessage = document.getElementById('victory-message');
const gameArea = document.getElementById('game-area');
const difficultySelect = document.getElementById('difficulty');

document.getElementById('solo-mode').addEventListener('click', startGame);
document.getElementById('duo-mode').addEventListener('click', () => {
    // Implementar o modo de dois jogadores aqui
});

function startGame() {
    const difficulty = difficultySelect.value;
    switch (difficulty) {
        case 'facil':
            shuffledCards = shuffleArray([...cardsEasy]);
            break;
        case 'medio':
            shuffledCards = shuffleArray([...cardsMedium]);
            break;
        case 'dificil':
            shuffledCards = shuffleArray([...cardsHard]);
            break;
    }

    resetGame();
    gameBoard.innerHTML = '';
    const gridSize = Math.sqrt(shuffledCards.length);
    gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 100px)`;
    
    shuffledCards.forEach(card => {
        let cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.value = card;
        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });
    gameArea.classList.remove('hidden');
    document.getElementById('menu').classList.add('hidden');
}

function flipCard() {
    if (selectedCards.length < 2 && !this.classList.contains('flipped')) {
        this.textContent = this.dataset.value;
        this.classList.add('flipped');
        selectedCards.push(this);

        if (selectedCards.length === 2) {
            checkForMatch();
        }
    }
}

function checkForMatch() {
    let [firstCard, secondCard] = selectedCards;
    if (firstCard.dataset.value === secondCard.dataset.value) {
        matchedPairs++;
        selectedCards = [];
        if (matchedPairs === shuffledCards.length / 2) {
            endGame();
        }
    } else {
        setTimeout(() => {
            firstCard.textContent = '';
            secondCard.textContent = '';
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            selectedCards = [];
            errors++;
            errorsDisplay.textContent = `Erros: ${errors}`;
        }, 1000);
    }
}

function endGame() {
    clearInterval(timerInterval);
    victoryMessage.textContent = `Tempo: ${minutes}:${seconds < 10 ? '0' + seconds : seconds}, Erros: ${errors}`;
    victoryScreen.classList.remove('hidden');
    gameArea.classList.add('hidden');
}

function startTimer() {
    timerInterval = setInterval(() => {
        seconds++;
        if (seconds === 60) {
            minutes++;
            seconds = 0;
        }
        timerDisplay.textContent = `Tempo: ${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }, 1000);
}

function resetGame() {
    errors = 0;
    matchedPairs = 0;
    seconds = 0;
    minutes = 0;
    errorsDisplay.textContent = 'Erros: 0';
    timerDisplay.textContent = 'Tempo: 00:00';
    clearInterval(timerInterval);
    startTimer();
}

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

document.getElementById('menu-btn').addEventListener('click', () => {
    victoryScreen.classList.add('hidden');
    document.getElementById('menu').classList.remove('hidden');
});
