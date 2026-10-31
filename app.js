
const QUIZ_KEY = "pavan_advanced_quiz";
const PASSWORD_KEY = "pavan_advanced_password";
const RESULT_KEY = "pavan_advanced_result";

const defaultQuestions = [
  {
    question: "What makes you happiest when we talk? 💙",
    options: ["Your smile 😊", "Your funny jokes 😂", "Your sweet words 💌", "Everything about you 🥰"],
    answer: 3
  },
  {
    question: "What is your favourite way to spend time together?",
    options: ["Going outside 🌷", "Watching movies 🎬", "Talking for hours 💬", "Playing games 🎮"],
    answer: 2
  },
  {
    question: "What makes a relationship beautiful?",
    options: ["Trust 🤝", "Love ❤️", "Understanding 🫶", "All of these 💙"],
    answer: 3
  },
  {
    question: "What would you choose for a perfect day?",
    options: ["A long conversation 💌", "A cute surprise 🎁", "A fun adventure 🌈", "A peaceful day ☁️"],
    answer: 0
  },
  {
    question: "When there is a misunderstanding, what should we do?",
    options: ["Talk calmly 💬", "Listen to each other 👂", "Say sorry when needed 🥹", "Understand each other 💙"],
    answer: 3
  },
  {
    question: "Which little thing is most special?",
    options: ["Good morning message 🌞", "A sweet compliment 🌸", "A surprise call 📞", "Remembering little details 💗"],
    answer: 3
  },
  {
    question: "What is the most important thing between us?",
    options: ["Honesty 💎", "Respect 🌷", "Trust 💙", "All of these 🥰"],
    answer: 3
  },
  {
    question: "What would you do if I had a bad day?",
    options: ["Make me laugh 😂", "Listen to me 💬", "Give me encouragement 🌟", "Stay beside me 💙"],
    answer: 3
  },
  {
    question: "Which memory would you like to create?",
    options: ["A beautiful trip ✈️", "A special celebration 🎂", "A fun day together 🎡", "Many happy memories 📸"],
    answer: 3
  },
  {
    question: "What do you wish for our future?",
    options: ["More happiness 🌈", "More understanding 🫶", "More beautiful memories 📸", "All of these forever 💙"],
    answer: 3
  }
];

let quiz = loadQuiz();
let currentQuestion = 0;
let answers = [];
let isOwner = false;

const $ = id => document.getElementById(id);

function loadQuiz() {
  try {
    const saved = localStorage.getItem(QUIZ_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      if (Array.isArray(data) && data.length) return data;
    }
  } catch (error) {
    console.error("Quiz loading error:", error);
  }
  return JSON.parse(JSON.stringify(defaultQuestions));
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function saveQuiz() {
  localStorage.setItem(QUIZ_KEY, JSON.stringify(quiz));
}

function showPartner() {
  isOwner = false;
  $("partnerPage").classList.remove("hidden");
  $("ownerPage").classList.add("hidden");
  renderQuestion();
}

function showOwner() {
  isOwner = true;
  $("partnerPage").classList.add("hidden");
  $("ownerPage").classList.remove("hidden");
  renderOwner();
  renderOwnerResult();
}

$("ownerTab").addEventListener("click", () => {
  $("loginPassword").value = "";
  $("loginError").textContent = "";
  $("loginModal").classList.remove("hidden");
  $("loginPassword").focus();
});

$("cancelLoginBtn").addEventListener("click", () => {
  $("loginModal").classList.add("hidden");
});

$("loginForm").addEventListener("submit", event => {
  event.preventDefault();

  const password = localStorage.getItem(PASSWORD_KEY) || "lali";

  if ($("loginPassword").value === password) {
    $("loginModal").classList.add("hidden");
    showOwner();
  } else {
    $("loginError").textContent = "Wrong password! Try again 💙";
    $("loginPassword").value = "";
  }
});

$("logoutBtn").addEventListener("click", showPartner);

// PARTNER QUIZ

function renderQuestion() {
  const container = $("partnerQuestions");
  const question = quiz[currentQuestion];

  if (!question) return;

  const progress = Math.round((currentQuestion / quiz.length) * 100);

  $("progressText").textContent =
    `Question ${currentQuestion + 1} of ${quiz.length}`;

  $("progressPercent").textContent = progress + "%";
  $("progressBar").style.width = progress + "%";

  $("previousBtn").disabled = currentQuestion === 0;

  $("nextBtn").classList.toggle(
    "hidden",
    currentQuestion === quiz.length - 1
  );

  $("submitBtn").classList.toggle(
    "hidden",
    currentQuestion !== quiz.length - 1
  );

  $("partnerResult").classList.add("hidden");

  const stickers = ["🧸", "☁️", "🌷", "⭐", "🐻‍❄️", "🦋", "💌", "🌈", "🐣", "💙"];
  const sticker = stickers[currentQuestion % stickers.length];

  container.innerHTML = `
    <div class="question-card" key="${currentQuestion}">
      <div class="question-sticker">${sticker}</div>
      <div class="question-number">
        QUESTION ${currentQuestion + 1} ✨
      </div>
      <div class="question-title">
        ${escapeHTML(question.question)}
      </div>

      ${(question.options || []).map((option, index) => `
        <label class="option">
          <input
            type="radio"
            name="currentAnswer"
            value="${index}"
            ${answers[currentQuestion] === index ? "checked" : ""}
          >
          <span>${escapeHTML(option)}</span>
        </label>
      `).join("")}
    </div>
  `;

  container.querySelectorAll('input[name="currentAnswer"]')
    .forEach(input => {
      input.addEventListener("change", () => {
        answers[currentQuestion] = Number(input.value);
        createHearts(3);
      });
    });
}

function checkAnswer() {
  if (answers[currentQuestion] === undefined) {
    alert("Choose one cute answer first! 💙");
    return false;
  }
  return true;
}

$("nextBtn").addEventListener("click", () => {
  if (!checkAnswer()) return;
  currentQuestion++;
  renderQuestion();
});

$("previousBtn").addEventListener("click", () => {
  if (currentQuestion > 0) {
    currentQuestion--;
    renderQuestion();
  }
});

$("submitBtn").addEventListener("click", () => {
  if (!checkAnswer()) return;

  if (answers.filter(answer => answer !== undefined).length !== quiz.length) {
    alert("Please answer every question first! 💌");
    return;
  }

  const correct = quiz.reduce((total, question, index) => {
    return total + (
      answers[index] === Number(question.answer) ? 1 : 0
    );
  }, 0);

  const percentage = Math.round((correct / quiz.length) * 100);

  const resultData = {
    correct,
    total: quiz.length,
    percentage,
    date: new Date().toLocaleString()
  };

  localStorage.setItem(RESULT_KEY, JSON.stringify(resultData));

  showResult(resultData);
});

function showResult(data) {
  const result = $("partnerResult");

  const messages = [
    {
      min: 100,
      title: "PERFECT MATCH!",
      message: "Wow! Every answer matches! You are amazing! 💙",
      sticker: "👑💑"
    },
    {
      min: 80,
      title: "AMAZING!",
      message: "You know these answers so well! Keep shining! ✨",
      sticker: "🧸🌟"
    },
    {
      min: 50,
      title: "SUPER CUTE!",
      message: "Lovely effort! More beautiful memories await! 🌷",
      sticker: "🐻💌"
    },
    {
      min: 0,
      title: "KEEP SMILING!",
      message: "Every answer is a new chance to understand each other! 💙",
      sticker: "☁️🦋"
    }
  ];

  const message = messages.find(item => data.percentage >= item.min);

  result.className = "result";
  if (data.percentage === 100) result.classList.add("perfect");

  result.innerHTML = `
    <div class="result-sticker">${message.sticker}</div>
    <h3>${message.title}</h3>
    <div id="animatedScore" class="score">0%</div>
    <p><strong>${data.correct} / ${data.total}</strong> answers matched.</p>
    <p>${message.message}</p>
    <div class="result-sticker">💙 ☁️ ⭐ 🧸</div>
    <button id="retryBtn" class="primary-button full-button">
      Play Again ↻
    </button>
  `;

  result.classList.remove("hidden");
  $("progressBar").style.width = "100%";
  $("progressPercent").textContent = "100%";

  $("nextBtn").classList.add("hidden");
  $("submitBtn").classList.add("hidden");

  $("animatedScore").textContent = "0%";

  animateScore(data.percentage);
  createConfetti(data.percentage === 100 ? 100 : 45);
  createHearts(data.percentage === 100 ? 30 : 12);

  $("retryBtn").addEventListener("click", () => {
    answers = [];
    currentQuestion = 0;
    renderQuestion();
    result.classList.add("hidden");
    $("progressBar").style.width = "0%";
    $("progressPercent").textContent = "0%";
    $("partnerPage").scrollIntoView({ behavior: "smooth" });
  });

  result.scrollIntoView({ behavior: "smooth", block: "center" });
}

function animateScore(target) {
  const element = $("animatedScore");
  const duration = 1600;
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    const value = Math.round(target * eased);

    element.textContent = value + "%";

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// OWNER DASHBOARD

function renderOwner() {
  $("ownerQuestions").innerHTML = quiz.map((question, index) => `
    <div class="owner-question" data-index="${index}">
      <label>Question ${index + 1}</label>
      <input class="question-input"
        maxlength="180"
        value="${escapeHTML(question.question)}"
        placeholder="Enter your question">

      <label>Four answer options</label>
      <div class="answer-choice">
        ${(question.options || []).map((option, optionIndex) => `
          <div class="choice-item">
            <input class="option-input"
              data-option="${optionIndex}"
              maxlength="100"
              value="${escapeHTML(option)}"
              placeholder="Option ${optionIndex + 1}">

            <label>
              <input class="correct-radio"
                type="radio"
                name="correct${index}"
                value="${optionIndex}"
                ${Number(question.answer) === optionIndex ? "checked" : ""}>
              My answer 💙
            </label>
          </div>
        `).join("")}
      </div>

      <button type="button" class="delete-button" data-delete="${index}">
        🗑 Delete Question
      </button>
    </div>
  `).join("");

  $("ownerQuestions").querySelectorAll("[data-delete]")
    .forEach(button => {
      button.addEventListener("click", () => {
        if (quiz.length <= 1) {
          alert("Keep at least one question.");
          return;
        }

        if (confirm("Delete this question?")) {
          quiz.splice(Number(button.dataset.delete), 1);
          renderOwner();
        }
      });
    });
}

function collectQuestions() {
  const cards = document.querySelectorAll(".owner-question");
  const updated = [];

  for (const card of cards) {
    const question = card.querySelector(".question-input").value.trim();

    const options = [
      ...card.querySelectorAll(".option-input")
    ].map(input => input.value.trim());

    const selected = card.querySelector('input[type="radio"]:checked');

    if (!question || options.length !== 4 || options.some(item => !item)) {
      alert("Please fill in the question and all four options.");
      return null;
    }

    if (!selected) {
      alert("Please select your answer for every question.");
      return null;
    }

    updated.push({
      question,
      options,
      answer: Number(selected.value)
    });
  }

  return updated;
}

$("addQuestionBtn").addEventListener("click", () => {
  const updated = collectQuestions();
  if (!updated) return;

  quiz = updated;

  quiz.push({
    question: "Write your new question here 💙",
    options: ["Option 1 🌷", "Option 2 ⭐", "Option 3 🧸", "Option 4 💌"],
    answer: 0
  });

  renderOwner();
});

$("saveQuizBtn").addEventListener("click", () => {
  const updated = collectQuestions();
  if (!updated) return;

  quiz = updated;
  saveQuiz();

  answers = [];
  currentQuestion = 0;

  alert("Your questions are saved! 💙");
  renderOwner();
});

$("changePasswordBtn").addEventListener("click", () => {
  const password = $("newPassword").value.trim();

  if (password.length < 6) {
    alert("Use at least 6 characters for your new password.");
    return;
  }

  localStorage.setItem(PASSWORD_KEY, password);
  $("newPassword").value = "";
  alert("Password changed in this browser! 🔐");
});

function renderOwnerResult() {
  const box = $("ownerResult");

  try {
    const data = JSON.parse(localStorage.getItem(RESULT_KEY));

    if (!data) {
      box.textContent = "No result yet.";
      return;
    }

    box.innerHTML = `
      <p><strong>${data.percentage}% match 💙</strong></p>
      <p>${data.correct} out of ${data.total} answers matched.</p>
      <p class="small-note">Submitted: ${escapeHTML(data.date)}</p>
    `;
  } catch {
    box.textContent = "No result available.";
  }
}

$("clearResultBtn").addEventListener("click", () => {
  if (confirm("Clear the saved result?")) {
    localStorage.removeItem(RESULT_KEY);
    renderOwnerResult();
  }
});

// CELEBRATION ANIMATIONS

function createHearts(amount) {
  const layer = $("celebrationLayer");
  const stickers = ["💙", "💕", "🩵", "✨", "🌷"];

  for (let i = 0; i < amount; i++) {
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = stickers[Math.floor(Math.random() * stickers.length)];
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = (15 + Math.random() * 20) + "px";
    heart.style.animationDelay = Math.random() * 1.5 + "s";

    layer.appendChild(heart);
    setTimeout(() => heart.remove(), 5500);
  }
}

function createConfetti(amount) {
  const layer = $("celebrationLayer");
  const pieces = ["💙", "⭐", "✨", "🩵", "🌸", "🎀", "✦"];

  for (let i = 0; i < amount; i++) {
    const piece = document.createElement("span");
    piece.className = "celebration-piece";
    piece.textContent = pieces[Math.floor(Math.random() * pieces.length)];
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.fontSize = (12 + Math.random() * 17) + "px";
    piece.style.animationDelay = Math.random() * 1.2 + "s";

    layer.appendChild(piece);
    setTimeout(() => piece.remove(), 5000);
  }
}

// START WEBSITE
showPartner();