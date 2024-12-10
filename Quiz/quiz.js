let questions = [];
let currentQuestionIndex = 0;
let score = 0;

// Ladda frågor från JSON
async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        questions = await response.json();
        showQuestion();
    } catch (error) {
        console.error("Kunde inte ladda frågor:", error);
    }
}

function showQuestion() {
    const quizContainer = document.getElementById('quiz');
    const questionElement = quizContainer.querySelector('.question');
    const optionsElement = quizContainer.querySelector('.options');
    const feedbackElement = quizContainer.querySelector('.feedback');
    const progressBar = document.querySelector('.progress');

    if (currentQuestionIndex >= questions.length) {
        showSummary();
        return;
    }

    const currentQuestion = questions[currentQuestionIndex];

    // Uppdatera progress-bar tills sista frågan är besvarad
    const progressWidth = ((currentQuestionIndex / questions.length) * 100) + "%";
    progressBar.style.width = progressWidth;

    questionElement.textContent = currentQuestion.question;
    optionsElement.innerHTML = '';
    feedbackElement.textContent = '';

    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.onclick = () => checkAnswer(index, button);
        optionsElement.appendChild(button);
    });
}



// Kontrollera svaret
function checkAnswer(selectedIndex, button) {
    const feedbackElement = document.querySelector('.feedback');
    const currentQuestion = questions[currentQuestionIndex];
    const optionsButtons = document.querySelectorAll('.options button');

    // Inaktivera knappar efter att användaren svarat
    optionsButtons.forEach(btn => btn.disabled = true);

    if (selectedIndex === currentQuestion.correct) {
        button.classList.add('correct');
        feedbackElement.textContent = 'Rätt svar!';
        feedbackElement.style.color = 'green';
        score++;
    } else {
        button.classList.add('incorrect');
        feedbackElement.textContent = 'Fel svar.';
        feedbackElement.style.color = 'red';

        // Visa det rätta svaret
        optionsButtons[currentQuestion.correct].classList.add('correct');
    }

    currentQuestionIndex++;
    setTimeout(showQuestion, 1500); // Vänta innan nästa fråga visas
}

function showSummary() {
    const quizContainer = document.getElementById('quiz');
    const summaryElement = document.querySelector('.summary');
    const summaryText = document.getElementById('summary-text');
    const progressBar = document.querySelector('.progress');

    // Sätt progress-baren till 100%
    progressBar.style.width = "100%";

    quizContainer.style.display = 'none';
    summaryElement.style.display = 'block';
    summaryText.innerHTML = `
        Du svarade rätt på <strong>${score}</strong> av <strong>${questions.length}</strong> frågor.
    `;
}


// Starta om quizet
function restartQuiz() {
    // Visa en "startar om"-skärm med animation
    showRestartingScreen();

    // Vänta lite innan quizet återställs
    setTimeout(() => {
        // Återställ variabler
        currentQuestionIndex = 0;
        score = 0;

        // Återställ UI-element
        document.querySelector('.progress').style.width = '0%';
        document.querySelector('.summary').style.display = 'none';
        document.getElementById('quiz').style.display = 'block';

        // Göm "startar om"-skärmen
        hideRestartingScreen();

        // Starta quizet från början
        showQuestion();
    }, 2000); // Väntar 2 sekunder innan omstart
}

// Visa "startar om"-skärmen
function showRestartingScreen() {
    let restartingScreen = document.createElement('div');
    restartingScreen.classList.add('restarting-screen');
    restartingScreen.textContent = 'Startar om...';
    document.body.appendChild(restartingScreen);
    setTimeout(() => (restartingScreen.style.display = 'flex'), 10); // Visa med kort delay för smidig övergång
}

// Göm "startar om"-skärmen
function hideRestartingScreen() {
    const restartingScreen = document.querySelector('.restarting-screen');
    if (restartingScreen) {
        restartingScreen.style.display = 'none';
        document.body.removeChild(restartingScreen);
    }
}

// Starta spelet
loadQuestions();