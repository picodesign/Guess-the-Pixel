// Variables globales
const cubeWidth = 200;
let guess;
let adjustedGuess;
const maxLives = 7;
let lives;
let isNight = false;
let gameEnded = false;

// Fonction pour générer un chiffre aléatoire
function generateRandomGuess() {
    return Math.floor(Math.random() * 200);
}

// Fonction pour mettre à jour l'espacement des cubes
function updateCubeSpacing(spacing) {
    const cubeContainer = document.getElementById('cubeContainer');
    cubeContainer.style.width = spacing + 2 * cubeWidth + 'px';
}

// Fonction pour désactiver les éléments du jeu
function disableGameElements() {
    document.getElementById('userGuess').disabled = true;
    document.querySelector('button').disabled = true;
    document.getElementById('cube1').style.pointerEvents = 'none';
    document.getElementById('cube2').style.pointerEvents = 'none';
}

// Fonction pour terminer le jeu
function endGame() {
    disableGameElements();
    gameEnded = true;
}

// Fonction pour gérer l'événement de pression de touche
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        checkGuess();
    }
}

// Fonction principale pour vérifier la devinette
function checkGuess() {
    if (gameEnded) {
        return;
    }

    const userGuess = document.getElementById('userGuess').value;
    const result = document.getElementById('result');
    const livesContainer = document.getElementById('lives-container');

    if (userGuess === '') {
        result.textContent = 'Veuillez entrer un nombre.';
    } else {
        const spacingGuess = parseInt(userGuess);

        if (spacingGuess < guess) {
            result.textContent = '⬆︎ Trop bas !';
        } else if (spacingGuess > guess) {
            result.textContent = '⬇︎ Trop haut !';
        } else {
            result.textContent = '🎊 Bravo ! Vous avez deviné ! 🎉';
            guess = generateRandomGuess();
            localStorage.setItem('dailyGuessDate', getCurrentDate());
            localStorage.setItem('dailyGuess', guess.toString());
            adjustedGuess = guess - cubeWidth;
            updateCubeSpacing(adjustedGuess);
            endGame();
            return;
        }

        const proximityToGuess = Math.abs(spacingGuess - guess);

        if (proximityToGuess <= 5) {
            result.textContent += ' 🥵';
        } else if (proximityToGuess <= 15) {
            result.textContent += ' 🔥';
        }

        lives--;

        const heartSVG = isNight ? 'icon/hearth_1.svg' : 'icon/hearth_2.svg';
        livesContainer.innerHTML = '';
        for (let i = 0; i < lives; i++) {
            livesContainer.innerHTML += `<img src="${heartSVG}" alt="heart">`;
        }

        if (lives > 0) {
            result.textContent += ` Il vous reste ${lives} vies.`;
        } else {
            result.textContent = '😢 Vous avez épuisé toutes vos vies. Réessayez !';
            endGame();
        }
    }
}

// Fonction pour obtenir la date actuelle
function getCurrentDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

// Fonction exécutée lorsque la fenêtre est chargée
window.onload = function () {
    const currentHour = new Date().getHours();
    isNight = currentHour >= 19 || currentHour < 7;

    if (isNight) {
        document.body.classList.add('night-theme');
        document.querySelector('.container').classList.add('night-theme');
        document.querySelector('#cube1').classList.add('night-theme');
        document.querySelector('#cube2').classList.add('night-theme');
        document.querySelector('#result').classList.add('night-theme');
        document.querySelector('#userGuess').classList.add('night-theme');
        document.querySelector('button').classList.add('night-theme');
        document.querySelector('p').classList.add('night-theme');
    }

    const storedDate = localStorage.getItem('dailyGuessDate');
    const currentDate = getCurrentDate();

    if (storedDate === currentDate) {
        guess = parseInt(localStorage.getItem('dailyGuess'));
        lives = parseInt(localStorage.getItem('dailyLives'));
    } else {
        guess = generateRandomGuess();
        localStorage.setItem('dailyGuessDate', currentDate);
        localStorage.setItem('dailyGuess', guess.toString());
        lives = maxLives;
        localStorage.setItem('dailyLives', lives.toString());
    }

    adjustedGuess = guess - cubeWidth;
    updateCubeSpacing(adjustedGuess);

    const livesContainer = document.getElementById('lives-container');
    const heartSVG = isNight ? 'icon/hearth_1.svg' : 'icon/hearth_2.svg';
    livesContainer.innerHTML = '';
    for (let i = 0; i < lives; i++) {
        livesContainer.innerHTML += `<img src="${heartSVG}" alt="heart">`;
    }

    const userGuessInput = document.getElementById('userGuess');
    userGuessInput.addEventListener('keypress', handleKeyPress);
};
