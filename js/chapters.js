/* =========================
   SmartSpark Chapters Page
   Renders chapters dynamically
   ========================= */

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initChaptersPage();
});

/* ---------- MAIN RENDER ---------- */
function initChaptersPage() {
  const year = AppState.get("year");
  const subject = AppState.get("subject");

  const container = document.getElementById("chapters-container");
  const title = document.getElementById("page-title");
  const subtitle = document.getElementById("page-subtitle");

  // Safety check
  if (!year || !subject) {
    container.innerHTML = `
      <div style="text-align:center; padding:2rem;">
        <h2>⚠️ Missing selection</h2>
        <p>Please go back and select Year and Subject.</p>
        <button onclick="window.location.href='index.html'">Go Home</button>
      </div>
    `;
    return;
  }

  const subjectData = Curriculum?.[year]?.[subject];

  if (!subjectData) {
    container.innerHTML = `<p>No data found for this subject.</p>`;
    return;
  }

  // Page title
  if (title) {
    title.textContent = `${subjectData.title} - Year ${year}`;
  }

  if (subtitle) {
    subtitle.textContent = "Pick a chapter to start learning 📘";
  }

  renderChapters(year, subject, subjectData.chapters, container);
}

/* ---------- RENDER CHAPTER CARDS ---------- */
function renderChapters(year, subject, chapters, container) {
  container.innerHTML = "";

  Object.entries(chapters).forEach(([chapterKey, chapter]) => {
    const card = document.createElement("div");
    card.className = "chapter-card";

    card.innerHTML = `
      <div class="chapter-title">${chapter.title}</div>
      <div class="chapter-desc">${chapter.description}</div>

      <div class="chapter-meta">
        <span>📚 ${chapter.flashcards.length} Flashcards</span>
        <span>🧠 ${chapter.quiz.length} Questions</span>
      </div>

      <button class="chapter-btn">Start Learning ⚡</button>
    `;

    card.addEventListener("click", () => {
      goToChapter(year, subject, chapterKey);
    });

    container.appendChild(card);
  });
}

/* ---------- NAVIGATION ---------- */
function goToChapter(year, subject, chapter) {
  AppState.set("chapter", chapter);

  window.location.href = `learn.html?year=${year}&subject=${subject}&chapter=${chapter}`;
}

/* ---------- BACK BUTTON HELP ---------- */
function goBackToSubjects() {
  window.location.href = `subjects.html?year=${AppState.year}`;
}