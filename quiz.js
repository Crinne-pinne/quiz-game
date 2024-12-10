let questions = [];
let currentQuestionIndex = 0;
let score = 0;

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




function checkAnswer(selectedIndex, button) {
    const feedbackElement = document.querySelector('.feedback');
    const currentQuestion = questions[currentQuestionIndex];
    const optionsButtons = document.querySelectorAll('.options button');

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

        optionsButtons[currentQuestion.correct].classList.add('correct');
    }

    currentQuestionIndex++;
    setTimeout(showQuestion, 1500); 
}

function showSummary() {
    const quizContainer = document.getElementById('quiz');
    const summaryElement = document.querySelector('.summary');
    const summaryText = document.getElementById('summary-text');
    const progressBar = document.querySelector('.progress');


    progressBar.style.width = "100%";

    quizContainer.style.display = 'none';
    summaryElement.style.display = 'block';
    summaryText.innerHTML = `
        Du svarade rätt på <strong>${score}</strong> av <strong>${questions.length}</strong> frågor.
    `;
}


function restartQuiz() {
    showRestartingScreen();

    setTimeout(() => {
        currentQuestionIndex = 0;
        score = 0;

        document.querySelector('.progress').style.width = '0%';
        document.querySelector('.summary').style.display = 'none';
        document.getElementById('quiz').style.display = 'block';

        hideRestartingScreen();

        showQuestion();
    }, 2000); 
}

function showRestartingScreen() {
    let restartingScreen = document.createElement('div');
    restartingScreen.classList.add('restarting-screen');
    restartingScreen.textContent = 'Startar om...';
    document.body.appendChild(restartingScreen);
    setTimeout(() => (restartingScreen.style.display = 'flex'), 10); 
}

function hideRestartingScreen() {
    const restartingScreen = document.querySelector('.restarting-screen');
    if (restartingScreen) {
        restartingScreen.style.display = 'none';
        document.body.removeChild(restartingScreen);
    }
}

loadQuestions();
