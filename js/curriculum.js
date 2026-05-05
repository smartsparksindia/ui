/* =========================
   SmartSpark Curriculum Data
   Year → Subject → Chapters → Content
   ========================= */

const Curriculum = {
  "6": {
    science: {
      title: "Science",
      icon: "🔬",
      chapters: {
        "food-and-health": {
          title: "Food & Health",
          description: "Learn about nutrients, digestion and balanced diet",
          flashcards: [
            { front: "What are nutrients?", back: "Substances in food that help us grow and stay healthy." },
            { front: "What is a balanced diet?", back: "A diet containing all nutrients in correct proportions." },
            { front: "What is digestion?", back: "Process of breaking food into simpler substances." }
          ],
          quiz: [
            {
              q: "Which nutrient gives us energy?",
              options: ["Proteins", "Carbohydrates", "Vitamins", "Minerals"],
              answer: 1,
              explanation: "Carbohydrates are the main energy source."
            },
            {
              q: "Which organ helps in digestion?",
              options: ["Heart", "Lungs", "Stomach", "Brain"],
              answer: 2,
              explanation: "Stomach breaks down food using acids."
            }
          ]
        },

        "motion-and-measurement": {
          title: "Motion & Measurement",
          description: "Understanding movement and units",
          flashcards: [
            { front: "What is motion?", back: "Change in position of an object over time." },
            { front: "What is SI unit of length?", back: "Metre (m)" }
          ],
          quiz: [
            {
              q: "SI unit of length is?",
              options: ["Kg", "Metre", "Second", "Litre"],
              answer: 1,
              explanation: "Metre is the standard unit of length."
            }
          ]
        }
      }
    },

    maths: {
      title: "Mathematics",
      icon: "🔢",
      chapters: {
        "whole-numbers": {
          title: "Whole Numbers",
          description: "Understanding natural numbers and operations",
          flashcards: [
            { front: "What are whole numbers?", back: "0, 1, 2, 3, 4..." },
            { front: "Smallest whole number?", back: "0" }
          ],
          quiz: [
            {
              q: "Which is a whole number?",
              options: ["-1", "0", "2.5", "1/2"],
              answer: 1,
              explanation: "Whole numbers start from 0."
            }
          ]
        }
      }
    },

    english: {
      title: "English",
      icon: "📚",
      chapters: {
        "nouns": {
          title: "Nouns",
          description: "Learn about naming words",
          flashcards: [
            { front: "What is a noun?", back: "A naming word for person, place or thing." }
          ],
          quiz: [
            {
              q: "Which is a noun?",
              options: ["Run", "Happy", "Delhi", "Quickly"],
              answer: 2,
              explanation: "Delhi is a place, so it's a noun."
            }
          ]
        }
      }
    }
  },

  "7": {
    science: {
      title: "Science",
      icon: "🔬",
      chapters: {
        "heat": {
          title: "Heat",
          description: "Basics of temperature and heat transfer",
          flashcards: [
            { front: "What is heat?", back: "A form of energy that raises temperature." }
          ],
          quiz: [
            {
              q: "Heat flows from?",
              options: ["Cold to hot", "Hot to cold", "Random", "Doesn't flow"],
              answer: 1,
              explanation: "Heat flows from hot to cold objects."
            }
          ]
        }
      }
    }
  },

  // You will keep extending this:
  // 8, 9, 10, 11, 12...
};

/* =========================
   Helper Functions
   ========================= */

function getSubjects(year) {
  if (!Curriculum[year]) return {};
  return Curriculum[year];
}

function getChapters(year, subject) {
  return Curriculum?.[year]?.[subject]?.chapters || {};
}

function getChapterData(year, subject, chapter) {
  return Curriculum?.[year]?.[subject]?.chapters?.[chapter] || null;
}

function getFlashcards(year, subject, chapter) {
  return getChapterData(year, subject, chapter)?.flashcards || [];
}

function getQuiz(year, subject, chapter) {
  return getChapterData(year, subject, chapter)?.quiz || [];
}