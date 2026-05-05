// ═══════════════════════════════════════════════
//  SmartSpark India — Shared State & Curriculum Data
// ═══════════════════════════════════════════════

// ── State (persisted in sessionStorage) ──
const STATE_KEY = 'ss_state';

function getState() {
  try { return JSON.parse(sessionStorage.getItem(STATE_KEY)) || {}; }
  catch { return {}; }
}

function setState(patch) {
  const s = { ...getState(), ...patch };
  sessionStorage.setItem(STATE_KEY, JSON.stringify(s));
  return s;
}

// ── Score persistence (localStorage for cross-session) ──
const SCORE_KEY = 'ss_scores';

function getScores() {
  try { return JSON.parse(localStorage.getItem(SCORE_KEY)) || {}; }
  catch { return {}; }
}

function addScore(year, subject, chapter, pts) {
  const scores = getScores();
  const key = `${year}_${subject}_${chapter}`;
  scores[key] = Math.max(scores[key] || 0, pts);
  scores._total = (scores._total || 0) + pts;
  localStorage.setItem(SCORE_KEY, JSON.stringify(scores));
}

function getTotalScore() {
  return getScores()._total || 0;
}

function getChapterScore(year, subject, chapter) {
  return getScores()[`${year}_${subject}_${chapter}`] || 0;
}

// ── Curriculum Data ──
const CURRICULUM = {
  6: {
    Science: {
      icon: '🔬', color: 'teal',
      chapters: {
        'Food & Nutrition': {
          flashcards: [
            { term: 'Nutrients', def: 'Substances in food that our body uses for energy, growth, and repair. The main nutrients are carbohydrates, proteins, fats, vitamins, and minerals.' },
            { term: 'Carbohydrates', def: 'Our body\'s main energy source. Found in rice, wheat, potatoes, and bread. They fuel our brain and muscles.' },
            { term: 'Proteins', def: 'The building blocks of the body. They help build and repair muscles and tissues. Found in dal, eggs, meat, and milk.' },
            { term: 'Vitamins', def: 'Tiny compounds the body needs in small amounts to work properly. Vitamin C (in oranges) helps immunity; Vitamin D (from sunlight) builds bones.' },
            { term: 'Balanced Diet', def: 'A diet that contains all nutrients in the right proportion. It keeps us healthy and prevents diseases.' },
          ],
          quiz: [
            { q: 'Which nutrient gives us the most energy quickly?', opts: ['Proteins', 'Vitamins', 'Carbohydrates', 'Minerals'], ans: 2, exp: 'Carbohydrates are the body\'s quickest energy source — glucose powers your brain!' },
            { q: 'Where is Vitamin C mainly found?', opts: ['Rice', 'Oranges & citrus fruits', 'Milk', 'Meat'], ans: 1, exp: 'Citrus fruits like oranges and lemons are rich in Vitamin C, which boosts immunity.' },
            { q: 'Which food group helps build and repair muscles?', opts: ['Fats', 'Carbohydrates', 'Minerals', 'Proteins'], ans: 3, exp: 'Proteins (from dal, eggs, paneer) are the body\'s building blocks.' },
            { q: 'What is a balanced diet?', opts: ['Only vegetables', 'A diet with all nutrients in right amounts', 'Only proteins', 'Only carbohydrates'], ans: 1, exp: 'A balanced diet contains all 5 nutrients in the right proportions for good health.' },
            { q: 'Which vitamin do we get from sunlight?', opts: ['Vitamin A', 'Vitamin B', 'Vitamin C', 'Vitamin D'], ans: 3, exp: 'Vitamin D is produced when sunlight hits our skin — it strengthens bones!' },
          ]
        },
        'Motion & Measurement': {
          flashcards: [
            { term: 'Motion', def: 'An object is in motion when its position changes with time relative to a fixed point. Motion can be linear, circular, or oscillatory.' },
            { term: 'Speed', def: 'The distance covered by an object in a unit of time. Formula: Speed = Distance ÷ Time. Measured in m/s or km/h.' },
            { term: 'SI Units', def: 'The International System of Units — the global standard for measurement. Examples: metre (length), kilogram (mass), second (time).' },
            { term: 'Periodic Motion', def: 'Motion that repeats itself after equal intervals of time. Example: a pendulum, the Earth orbiting the Sun.' },
            { term: 'Measurement', def: 'Comparing an unknown quantity with a known standard (unit). Accurate measurement is the foundation of all science.' },
          ],
          quiz: [
            { q: 'What is the SI unit of length?', opts: ['Kilogram', 'Second', 'Metre', 'Litre'], ans: 2, exp: 'The metre (m) is the SI unit of length — named after the Greek word "metron" meaning measure.' },
            { q: 'A car travels 100 km in 2 hours. What is its speed?', opts: ['200 km/h', '50 km/h', '100 km/h', '25 km/h'], ans: 1, exp: 'Speed = Distance ÷ Time = 100 ÷ 2 = 50 km/h.' },
            { q: 'Which of these is an example of periodic motion?', opts: ['A falling stone', 'A moving car', 'A swinging pendulum', 'A rolling ball'], ans: 2, exp: 'A pendulum repeats its swing at equal time intervals — that\'s periodic motion!' },
            { q: 'What does "motion" mean?', opts: ['A stationary object', 'Change in position with time', 'An object\'s colour', 'The weight of an object'], ans: 1, exp: 'Motion means the position of an object changes over time relative to a fixed reference point.' },
          ]
        },
        'The Living World': {
          flashcards: [
            { term: 'Cell', def: 'The basic structural and functional unit of all living organisms. Discovered by Robert Hooke in 1665 using a microscope.' },
            { term: 'Photosynthesis', def: 'The process by which plants make their own food using sunlight, water, and carbon dioxide. Produces oxygen as a byproduct.' },
            { term: 'Adaptation', def: 'Special features or habits that help a living organism survive in its environment. E.g., camels store water in their humps.' },
            { term: 'Habitat', def: 'The natural environment where an organism lives. E.g., a fish\'s habitat is water; a camel\'s habitat is a desert.' },
          ],
          quiz: [
            { q: 'Who discovered the cell?', opts: ['Charles Darwin', 'Robert Hooke', 'Louis Pasteur', 'Gregor Mendel'], ans: 1, exp: 'Robert Hooke discovered cells in 1665 while looking at cork under a microscope.' },
            { q: 'What do plants need for photosynthesis?', opts: ['Sunlight, water, CO₂', 'Sunlight, oxygen, sugar', 'Water, nitrogen, oxygen', 'Soil, rain, oxygen'], ans: 0, exp: 'Plants need sunlight + water + CO₂ to make food (glucose) and release oxygen.' },
            { q: 'What is a habitat?', opts: ['An animal\'s food', 'The body of an organism', 'The natural home of an organism', 'A type of cell'], ans: 2, exp: 'A habitat is the natural environment where an organism lives and gets everything it needs.' },
            { q: 'Why do camels have humps?', opts: ['To store water directly', 'To store fat for energy', 'To scare predators', 'To swim faster'], ans: 1, exp: 'Camel humps store fat (not water!), which is used for energy in the desert.' },
          ]
        }
      }
    },
    Maths: {
      icon: '🔢', color: 'purple',
      chapters: {
        'Fractions': {
          flashcards: [
            { term: 'Fraction', def: 'A number that represents a part of a whole. Written as a/b where a is the numerator (top) and b is the denominator (bottom).' },
            { term: 'Proper Fraction', def: 'A fraction where the numerator is less than the denominator. E.g., 3/4, 2/5. Its value is always less than 1.' },
            { term: 'Improper Fraction', def: 'A fraction where the numerator is greater than or equal to the denominator. E.g., 7/4, 5/3. Its value is ≥ 1.' },
            { term: 'Equivalent Fractions', def: 'Fractions that look different but have the same value. E.g., 1/2 = 2/4 = 4/8. Multiply or divide top and bottom by the same number.' },
            { term: 'Mixed Number', def: 'A combination of a whole number and a proper fraction. E.g., 2¾ means 2 whole parts and 3/4 more.' },
          ],
          quiz: [
            { q: 'Which is a proper fraction?', opts: ['7/4', '5/5', '3/4', '8/3'], ans: 2, exp: '3/4 is proper because the numerator (3) is less than the denominator (4).' },
            { q: 'What is equivalent to 1/2?', opts: ['2/6', '3/5', '4/8', '3/7'], ans: 2, exp: '4/8 = 4÷4 / 8÷4 = 1/2. Always divide both by the same number!' },
            { q: 'Convert 7/4 to a mixed number:', opts: ['1¾', '2¼', '1½', '3¼'], ans: 0, exp: '7 ÷ 4 = 1 remainder 3, so 7/4 = 1¾.' },
            { q: 'What does the denominator tell us?', opts: ['How many parts are taken', 'The total equal parts the whole is divided into', 'The whole number', 'The fraction\'s value'], ans: 1, exp: 'The denominator (bottom number) tells us into how many equal parts the whole is divided.' },
            { q: 'Add: 1/4 + 2/4 = ?', opts: ['3/8', '2/4', '3/4', '1/2'], ans: 2, exp: 'Same denominator — just add the numerators: 1+2 = 3. Answer: 3/4.' },
          ]
        },
        'Geometry': {
          flashcards: [
            { term: 'Point', def: 'An exact location in space with no size or dimension. Represented by a dot and named with a capital letter like A or P.' },
            { term: 'Line', def: 'A straight path that extends infinitely in both directions. Has length but no width. Named using two points: line AB.' },
            { term: 'Angle', def: 'The amount of turn between two rays sharing a common endpoint (vertex). Measured in degrees (°).' },
            { term: 'Triangle', def: 'A polygon with 3 sides and 3 angles. The sum of all interior angles is always 180°.' },
            { term: 'Perimeter', def: 'The total distance around the boundary of a shape. Found by adding all side lengths.' },
          ],
          quiz: [
            { q: 'What is the sum of angles in a triangle?', opts: ['90°', '180°', '270°', '360°'], ans: 1, exp: 'The three angles of any triangle always add up to exactly 180°!' },
            { q: 'How many sides does a pentagon have?', opts: ['4', '6', '5', '8'], ans: 2, exp: 'Penta means 5 in Greek — a pentagon has 5 sides.' },
            { q: 'A right angle measures:', opts: ['45°', '180°', '60°', '90°'], ans: 3, exp: 'A right angle is exactly 90° — like the corner of a square or book.' },
            { q: 'What is the perimeter of a square with side 5 cm?', opts: ['10 cm', '25 cm', '15 cm', '20 cm'], ans: 3, exp: 'Perimeter of square = 4 × side = 4 × 5 = 20 cm.' },
          ]
        },
        'Integers': {
          flashcards: [
            { term: 'Integer', def: 'Whole numbers including positive numbers, negative numbers, and zero. E.g., ...-3, -2, -1, 0, 1, 2, 3...' },
            { term: 'Negative Number', def: 'A number less than zero. Written with a minus sign (-). E.g., -5 means 5 units below zero. Used for temperatures, debts, etc.' },
            { term: 'Absolute Value', def: 'The distance of a number from zero, always positive. |−5| = 5 and |5| = 5.' },
            { term: 'Number Line', def: 'A visual line where numbers are placed at equal intervals. Positive numbers go right, negative numbers go left of zero.' },
          ],
          quiz: [
            { q: 'What is the value of |-8|?', opts: ['-8', '0', '8', '-1'], ans: 2, exp: 'Absolute value is always the distance from zero — so |-8| = 8.' },
            { q: 'Which is smaller: -3 or -7?', opts: ['-3', 'They are equal', '-7', 'Cannot tell'], ans: 2, exp: '-7 is further left on the number line, so -7 < -3.' },
            { q: 'What is (-4) + (+9)?', opts: ['-13', '5', '-5', '13'], ans: 1, exp: 'Start at -4, move 9 steps right: -4 + 9 = +5.' },
            { q: 'Which of these is NOT an integer?', opts: ['-100', '0', '0.5', '999'], ans: 2, exp: '0.5 is a decimal/fraction — integers are only whole numbers.' },
          ]
        }
      }
    },
    English: {
      icon: '📚', color: 'pink',
      chapters: {
        'Grammar Basics': {
          flashcards: [
            { term: 'Noun', def: 'A word that names a person, place, thing, or idea. Examples: teacher, India, book, happiness.' },
            { term: 'Verb', def: 'A word that shows action or state of being. Examples: run, write, is, seems. Every sentence needs a verb.' },
            { term: 'Adjective', def: 'A word that describes or modifies a noun. Examples: big, red, happy, three. Answers: Which? What kind? How many?' },
            { term: 'Adverb', def: 'A word that modifies a verb, adjective, or another adverb. Examples: quickly, very, well. Often ends in -ly.' },
            { term: 'Sentence', def: 'A group of words that expresses a complete thought. Must have a subject (who/what) and a predicate (what they do).' },
          ],
          quiz: [
            { q: 'Identify the noun: "The tall girl ran quickly."', opts: ['tall', 'ran', 'girl', 'quickly'], ans: 2, exp: '"Girl" is a noun — it names a person. "Tall" is an adjective, "ran" is a verb.' },
            { q: 'Which word is an adverb in: "She sings beautifully"?', opts: ['She', 'sings', 'beautifully', 'None'], ans: 2, exp: '"Beautifully" is an adverb — it describes HOW she sings.' },
            { q: 'A sentence must always have a:', opts: ['Noun and adjective', 'Subject and predicate', 'Verb and adverb', 'Pronoun and noun'], ans: 1, exp: 'Every complete sentence needs a subject (who/what) and a predicate (what they do).' },
            { q: 'In "The big red ball", which words are adjectives?', opts: ['The, ball', 'Big, red', 'Ball, red', 'The, big'], ans: 1, exp: '"Big" and "red" both describe the noun "ball" — so they are adjectives.' },
          ]
        },
        'Reading Comprehension': {
          flashcards: [
            { term: 'Main Idea', def: 'The central topic or message of a passage. Ask yourself: What is this mostly about? Usually found in the first or last sentence.' },
            { term: 'Inference', def: 'A conclusion you draw from clues in the text, even if it\'s not directly stated. "Reading between the lines."' },
            { term: 'Context Clues', def: 'Words and phrases around an unknown word that help you figure out its meaning without a dictionary.' },
            { term: 'Summary', def: 'A short retelling of the most important ideas in a passage. A good summary is short, accurate, and in your own words.' },
          ],
          quiz: [
            { q: 'The main idea of a passage is:', opts: ['A small detail', 'The title only', 'The central message', 'The last sentence always'], ans: 2, exp: 'The main idea is the central message the author wants to convey about the topic.' },
            { q: 'What is an inference?', opts: ['A direct quote', 'A word definition', 'A conclusion from clues', 'A summary'], ans: 2, exp: 'An inference is a logical conclusion drawn from evidence in the text.' },
            { q: 'Context clues help you:', opts: ['Write better', 'Understand unknown words', 'Find the main idea', 'Summarise a text'], ans: 1, exp: 'Context clues are surrounding words that help you guess the meaning of an unfamiliar word.' },
          ]
        }
      }
    },
    'Social Science': {
      icon: '🌍', color: 'amber',
      chapters: {
        'Our Earth': {
          flashcards: [
            { term: 'Globe', def: 'A spherical model of the Earth showing continents, oceans, and countries in their true proportions.' },
            { term: 'Latitude', def: 'Imaginary horizontal lines circling the Earth parallel to the equator. Measured in degrees north or south. Equator = 0°.' },
            { term: 'Longitude', def: 'Imaginary vertical lines running from North Pole to South Pole. Measured in degrees east or west. Prime Meridian = 0°.' },
            { term: 'Equator', def: 'The imaginary line at 0° latitude that divides Earth into Northern and Southern hemispheres. The hottest zone.' },
            { term: 'Continents', def: 'The 7 large landmasses on Earth: Asia, Africa, North America, South America, Europe, Australia, and Antarctica.' },
          ],
          quiz: [
            { q: 'How many continents are on Earth?', opts: ['5', '6', '7', '8'], ans: 2, exp: 'There are 7 continents: Asia, Africa, North America, South America, Europe, Australia, Antarctica.' },
            { q: 'The Equator is at which degree of latitude?', opts: ['90°', '45°', '180°', '0°'], ans: 3, exp: 'The Equator is at 0° latitude and divides Earth into Northern and Southern hemispheres.' },
            { q: 'What does latitude measure?', opts: ['Distance east or west', 'Distance north or south of equator', 'The height of mountains', 'Ocean depth'], ans: 1, exp: 'Latitude measures how far north or south a place is from the Equator.' },
            { q: 'Which is the largest continent?', opts: ['Africa', 'North America', 'Asia', 'Europe'], ans: 2, exp: 'Asia is the largest continent — it covers about 30% of Earth\'s total land area.' },
          ]
        },
        'History of India': {
          flashcards: [
            { term: 'Indus Valley Civilisation', def: 'One of the world\'s oldest civilisations (3300–1300 BCE). Located in present-day Pakistan and NW India. Famous cities: Mohenjo-daro, Harappa.' },
            { term: 'Ashoka', def: 'A great Maurya Emperor (268–232 BCE) who spread Buddhism after being deeply affected by the Kalinga War\'s destruction.' },
            { term: 'Mughal Empire', def: 'A powerful Islamic empire that ruled most of India from 1526–1857. Famous rulers: Akbar, Shah Jahan (built Taj Mahal), Aurangzeb.' },
            { term: 'Independence Day', def: 'India gained independence from British rule on 15 August 1947. Jawaharlal Nehru became the first Prime Minister.' },
          ],
          quiz: [
            { q: 'Where was the Indus Valley Civilisation located?', opts: ['South India', 'Bengal region', 'NW India & Pakistan', 'Central India'], ans: 2, exp: 'The Indus Valley Civilisation thrived in present-day Pakistan and northwestern India.' },
            { q: 'Who built the Taj Mahal?', opts: ['Ashoka', 'Akbar', 'Babur', 'Shah Jahan'], ans: 3, exp: 'Shah Jahan built the Taj Mahal in Agra as a tribute to his wife Mumtaz Mahal.' },
            { q: 'When did India gain independence?', opts: ['15 August 1947', '26 January 1950', '15 August 1950', '26 January 1947'], ans: 0, exp: 'India became independent on 15 August 1947. 26 January 1950 is Republic Day.' },
          ]
        }
      }
    }
  },
  7: {
    Science: {
      icon: '🔬', color: 'teal',
      chapters: {
        'Nutrition in Plants': {
          flashcards: [
            { term: 'Autotrophs', def: 'Organisms that make their own food using sunlight (photosynthesis). All green plants are autotrophs.' },
            { term: 'Heterotrophs', def: 'Organisms that cannot make their own food and depend on other organisms. Animals, fungi, most bacteria.' },
            { term: 'Chlorophyll', def: 'The green pigment in plant leaves that absorbs sunlight for photosynthesis. Gives plants their green colour.' },
            { term: 'Stomata', def: 'Tiny pores on leaf surfaces through which CO₂ enters and O₂ exits during photosynthesis. Controlled by guard cells.' },
            { term: 'Parasitic Plants', def: 'Plants that take nutrition from other living plants (hosts). Example: Cuscuta (Amarbel) — it has no chlorophyll.' },
          ],
          quiz: [
            { q: 'Which pigment captures sunlight in plants?', opts: ['Melanin', 'Chlorophyll', 'Haemoglobin', 'Carotene'], ans: 1, exp: 'Chlorophyll is the green pigment that absorbs sunlight for photosynthesis.' },
            { q: 'Cuscuta is an example of:', opts: ['Autotroph', 'Saprotrophic plant', 'Parasitic plant', 'Insectivorous plant'], ans: 2, exp: 'Cuscuta (Amarbel) is a parasitic plant — it wraps around host plants and steals nutrients.' },
            { q: 'What enters leaves through stomata for photosynthesis?', opts: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], ans: 2, exp: 'CO₂ enters through stomata, reacts with water using sunlight to make glucose.' },
            { q: 'Animals are called heterotrophs because they:', opts: ['Make their own food', 'Eat only plants', 'Cannot make their own food', 'Live in water'], ans: 2, exp: 'Heterotrophs cannot make food — they must eat other organisms to get nutrition.' },
            { q: 'The byproduct of photosynthesis that we breathe is:', opts: ['CO₂', 'N₂', 'H₂', 'O₂'], ans: 3, exp: 'Photosynthesis produces oxygen (O₂) as a byproduct — which all animals need to breathe!' },
          ]
        },
        'Heat': {
          flashcards: [
            { term: 'Temperature', def: 'A measure of how hot or cold something is. Measured in degrees Celsius (°C). Normal human body temperature is 37°C.' },
            { term: 'Conduction', def: 'Transfer of heat through direct contact between objects. Metals are good conductors. Wood and plastic are poor conductors (insulators).' },
            { term: 'Convection', def: 'Transfer of heat through the movement of liquids and gases. Hot fluid rises, cool fluid sinks, creating a convection current.' },
            { term: 'Radiation', def: 'Transfer of heat through electromagnetic waves, without needing any medium. The Sun heats Earth through radiation.' },
            { term: 'Thermometer', def: 'An instrument used to measure temperature. Clinical thermometers measure body temperature (35–42°C range).' },
          ],
          quiz: [
            { q: 'Heat transfer through direct contact is called:', opts: ['Radiation', 'Convection', 'Conduction', 'Reflection'], ans: 2, exp: 'Conduction happens when heat flows through direct physical contact — like a metal spoon in hot tea.' },
            { q: 'The Sun heats the Earth by:', opts: ['Conduction', 'Convection', 'Reflection', 'Radiation'], ans: 3, exp: 'Radiation is heat transfer through waves — it works even in the vacuum of space!' },
            { q: 'Normal human body temperature is:', opts: ['32°C', '40°C', '37°C', '98°C'], ans: 2, exp: 'Normal body temperature is 37°C (98.6°F). A fever is above 37.5°C.' },
            { q: 'Which material is the best conductor of heat?', opts: ['Wood', 'Plastic', 'Copper', 'Glass'], ans: 2, exp: 'Copper is an excellent heat conductor — that\'s why copper pots are used for cooking.' },
          ]
        },
        'Acids, Bases & Salts': {
          flashcards: [
            { term: 'Acid', def: 'A substance that tastes sour and turns blue litmus paper red. E.g., hydrochloric acid, vinegar (acetic acid), lemon juice (citric acid).' },
            { term: 'Base', def: 'A substance that tastes bitter and turns red litmus paper blue. E.g., sodium hydroxide, baking soda, soap.' },
            { term: 'pH Scale', def: 'A scale from 0–14 that measures how acidic or basic a solution is. pH 7 = neutral, below 7 = acidic, above 7 = basic.' },
            { term: 'Litmus', def: 'A natural dye extracted from lichens used as an acid-base indicator. Turns red in acids, blue in bases.' },
            { term: 'Neutralisation', def: 'A reaction between an acid and a base that produces salt and water. Acid + Base → Salt + Water.' },
          ],
          quiz: [
            { q: 'What does an acid do to blue litmus paper?', opts: ['Turns it blue', 'No change', 'Turns it red', 'Destroys it'], ans: 2, exp: 'Acids turn blue litmus paper red — this is the classic litmus test!' },
            { q: 'A pH of 7 indicates:', opts: ['Strongly acidic', 'Neutral', 'Strongly basic', 'Slightly acidic'], ans: 1, exp: 'pH 7 is neutral — pure water has a pH of exactly 7.' },
            { q: 'Lemon juice is:', opts: ['A base', 'Neutral', 'An acid', 'A salt'], ans: 2, exp: 'Lemon juice contains citric acid and has a pH of about 2 — very acidic and sour!' },
            { q: 'What does Acid + Base produce?', opts: ['Acid + Water', 'Salt + Acid', 'Salt + Water', 'Base + Gas'], ans: 2, exp: 'Neutralisation: Acid + Base → Salt + Water. This is how antacids work in your stomach!' },
          ]
        }
      }
    },
    Maths: {
      icon: '🔢', color: 'purple',
      chapters: {
        'Integers': {
          flashcards: [
            { term: 'Integers', def: 'The set of all whole numbers, their negatives, and zero: {..., -3, -2, -1, 0, 1, 2, 3, ...}' },
            { term: 'Adding Integers', def: 'Same signs: add and keep the sign. Different signs: subtract the smaller from larger and take the sign of the larger.' },
            { term: 'Multiplying Integers', def: 'Same signs → positive result. Different signs → negative result. E.g., (-3) × (-4) = +12; (-3) × 4 = -12.' },
            { term: 'Properties of Integers', def: 'Closure, Commutativity (a+b = b+a), Associativity ((a+b)+c = a+(b+c)), Distributivity: a(b+c) = ab+ac.' },
          ],
          quiz: [
            { q: 'What is (-6) + (+10)?', opts: ['-4', '4', '16', '-16'], ans: 1, exp: 'Different signs: 10 - 6 = 4, take the sign of the larger (positive). Answer: +4.' },
            { q: 'What is (-5) × (-3)?', opts: ['-15', '15', '-8', '8'], ans: 1, exp: 'Negative × Negative = Positive. (-5) × (-3) = +15.' },
            { q: 'Which property says a + b = b + a?', opts: ['Associative', 'Distributive', 'Closure', 'Commutative'], ans: 3, exp: 'The Commutative property — changing the order doesn\'t change the sum!' },
          ]
        },
        'Algebraic Expressions': {
          flashcards: [
            { term: 'Variable', def: 'A letter that represents an unknown number. E.g., x, y, n. Variables let us write general mathematical statements.' },
            { term: 'Algebraic Expression', def: 'A combination of variables, numbers, and operations. E.g., 3x + 5, 2y² - 7. Has no equals sign.' },
            { term: 'Like Terms', def: 'Terms with the same variable raised to the same power. E.g., 3x and 5x are like terms. They can be added: 3x + 5x = 8x.' },
            { term: 'Coefficient', def: 'The numerical part of a term. In 7x, the coefficient is 7. In -3y², the coefficient is -3.' },
          ],
          quiz: [
            { q: 'In the expression 5x + 3, what is the coefficient of x?', opts: ['3', 'x', '5', '8'], ans: 2, exp: 'The coefficient is the number multiplying the variable. In 5x, the coefficient is 5.' },
            { q: 'Simplify: 4x + 3x', opts: ['7x²', '12x', '7x', '7'], ans: 2, exp: '4x and 3x are like terms. Add their coefficients: 4 + 3 = 7, so 4x + 3x = 7x.' },
            { q: 'Which are like terms: 3x, 5y, 2x, 4x²?', opts: ['3x and 5y', '3x and 4x²', '3x and 2x', '5y and 4x²'], ans: 2, exp: '3x and 2x are like terms — same variable (x) raised to the same power (1).' },
          ]
        }
      }
    },
    English: {
      icon: '📚', color: 'pink',
      chapters: {
        'Tenses': {
          flashcards: [
            { term: 'Present Simple', def: 'Used for habits, facts, and truths. Structure: Subject + Verb (base/+s). E.g., "She reads every day."' },
            { term: 'Past Simple', def: 'Used for completed actions in the past. Regular verbs add -ed. E.g., "He walked to school." Irregular: went, ran, ate.' },
            { term: 'Future Simple', def: 'Used for future intentions and predictions. Structure: Subject + will + Verb. E.g., "I will study tomorrow."' },
            { term: 'Present Continuous', def: 'Used for actions happening right now. Structure: Subject + is/am/are + Verb-ing. E.g., "She is reading."' },
          ],
          quiz: [
            { q: '"She _____ to school every day." Which tense?', opts: ['Past Simple', 'Present Simple', 'Future Simple', 'Present Continuous'], ans: 1, exp: '"Every day" signals a habit — Present Simple: She walks to school every day.' },
            { q: 'Which sentence is in Past Simple?', opts: ['I am eating', 'She will come', 'They played cricket', 'He reads books'], ans: 2, exp: '"Played" is the past form of "play" — Past Simple is used for completed past actions.' },
            { q: 'Future Simple uses:', opts: ['is/am/are + -ing', 'Verb + -ed', 'will + base verb', 'has/have + verb'], ans: 2, exp: 'Future Simple: Subject + will + base verb. "I will go. She will eat."' },
          ]
        }
      }
    },
    'Social Science': {
      icon: '🌍', color: 'amber',
      chapters: {
        'Inside Our Earth': {
          flashcards: [
            { term: 'Crust', def: 'The outermost layer of the Earth. The continental crust is 35–70 km thick; oceanic crust is only 5–10 km thick.' },
            { term: 'Mantle', def: 'The layer below the crust, about 2900 km thick. Contains semi-molten rock (magma) that flows very slowly.' },
            { term: 'Core', def: 'The innermost part of the Earth. The outer core is liquid iron and nickel; the inner core is solid. Temperature can reach 5000°C.' },
            { term: 'Rock Types', def: '3 types: Igneous (formed from cooling magma), Sedimentary (formed by deposition of particles), Metamorphic (transformed by heat/pressure).' },
          ],
          quiz: [
            { q: 'What is the outermost layer of the Earth?', opts: ['Mantle', 'Outer Core', 'Crust', 'Inner Core'], ans: 2, exp: 'The crust is the outermost layer — the thin solid surface we live on.' },
            { q: 'Which rock is formed from cooled magma?', opts: ['Sedimentary', 'Metamorphic', 'Limestone', 'Igneous'], ans: 3, exp: 'Igneous rocks form when magma cools and solidifies. E.g., granite, basalt.' },
            { q: 'The hottest layer of Earth is:', opts: ['Crust', 'Mantle', 'Inner Core', 'Outer Core'], ans: 2, exp: 'The inner core reaches about 5000°C — hotter than the surface of the Sun!' },
          ]
        }
      }
    }
  },
  8: {
    Science: {
      icon: '🔬', color: 'teal',
      chapters: {
        'Cell Structure & Function': {
          flashcards: [
            { term: 'Cell Membrane', def: 'A thin, flexible boundary around every cell. Controls what enters and exits. Made of a phospholipid bilayer.' },
            { term: 'Nucleus', def: 'The "control centre" of the cell. Contains DNA (genetic information). Surrounded by the nuclear membrane.' },
            { term: 'Mitochondria', def: 'The "powerhouse of the cell." Converts glucose and oxygen into ATP energy through cellular respiration.' },
            { term: 'Chloroplast', def: 'Found only in plant cells. Contains chlorophyll and is the site of photosynthesis. Has its own DNA.' },
            { term: 'Plant vs Animal Cell', def: 'Plant cells have: cell wall, chloroplasts, large central vacuole. Animal cells have: centrioles, no cell wall.' },
          ],
          quiz: [
            { q: 'Which organelle is the "powerhouse of the cell"?', opts: ['Nucleus', 'Chloroplast', 'Mitochondria', 'Ribosome'], ans: 2, exp: 'Mitochondria produce ATP energy through cellular respiration — powering all cell activities!' },
            { q: 'Which of these is found ONLY in plant cells?', opts: ['Mitochondria', 'Cell Membrane', 'Nucleus', 'Chloroplast'], ans: 3, exp: 'Chloroplasts are unique to plant cells — they carry out photosynthesis using sunlight.' },
            { q: 'What does the nucleus contain?', opts: ['Chlorophyll', 'DNA', 'ATP', 'Water'], ans: 1, exp: 'The nucleus stores DNA — the genetic blueprint with instructions for the entire organism.' },
            { q: 'Which controls what enters and exits the cell?', opts: ['Cell Wall', 'Nucleus', 'Vacuole', 'Cell Membrane'], ans: 3, exp: 'The cell membrane is selectively permeable — it controls which substances cross in/out.' },
          ]
        },
        'Force & Pressure': {
          flashcards: [
            { term: 'Force', def: 'A push or pull that can change an object\'s speed, direction, or shape. Measured in Newtons (N). Formula: F = m × a.' },
            { term: 'Friction', def: 'A force that opposes motion between two surfaces in contact. Can be useful (car brakes) or harmful (machine wear).' },
            { term: 'Pressure', def: 'Force applied per unit area. Formula: P = F/A. Measured in Pascals (Pa). Smaller area = more pressure for same force.' },
            { term: 'Gravity', def: 'The force of attraction between any two masses. Earth\'s gravity pulls everything towards its centre at 9.8 m/s².' },
          ],
          quiz: [
            { q: 'What is the unit of force?', opts: ['Pascal', 'Joule', 'Newton', 'Watt'], ans: 2, exp: 'Force is measured in Newtons (N) — named after Sir Isaac Newton.' },
            { q: 'Pressure = Force ÷ ?', opts: ['Mass', 'Volume', 'Area', 'Density'], ans: 2, exp: 'P = F/A. If you reduce area and keep force same, pressure increases!' },
            { q: 'Why does a sharp knife cut better than a blunt one?', opts: ['More force applied', 'Larger area', 'Less area = more pressure', 'Less friction'], ans: 2, exp: 'A sharp knife has a very small area — so the same force creates much more pressure.' },
            { q: 'Friction always acts ___ to motion:', opts: ['Parallel', 'Opposite', 'Perpendicular', 'Upward'], ans: 1, exp: 'Friction always acts opposite to the direction of motion — it tries to slow things down.' },
          ]
        }
      }
    },
    Maths: {
      icon: '🔢', color: 'purple',
      chapters: {
        'Squares & Square Roots': {
          flashcards: [
            { term: 'Perfect Square', def: 'A number that is the square of an integer. E.g., 1, 4, 9, 16, 25, 36, 49, 64, 81, 100.' },
            { term: 'Square Root', def: 'The inverse operation of squaring. √n is the number that when multiplied by itself gives n. √25 = 5 because 5² = 25.' },
            { term: 'Pythagorean Theorem', def: 'In a right-angled triangle: a² + b² = c² where c is the hypotenuse (longest side). E.g., 3² + 4² = 5².' },
            { term: 'Irrational Numbers', def: 'Numbers whose square roots are not whole numbers. E.g., √2, √3, √5 are irrational — they go on forever without repeating.' },
          ],
          quiz: [
            { q: 'What is √144?', opts: ['11', '12', '14', '13'], ans: 1, exp: '√144 = 12 because 12 × 12 = 144. 144 is a perfect square.' },
            { q: 'In a right triangle with sides 5 and 12, the hypotenuse is:', opts: ['13', '17', '15', '10'], ans: 0, exp: '5² + 12² = 25 + 144 = 169 = 13². So hypotenuse = 13.' },
            { q: 'Which is a perfect square?', opts: ['50', '72', '81', '98'], ans: 2, exp: '81 = 9² = 9 × 9. It\'s a perfect square!' },
          ]
        }
      }
    }
  }
};

// Generate subjects for years that have less data by copying year 6 structure
for (let y = 9; y <= 12; y++) {
  CURRICULUM[y] = {
    Science: { icon: '🔬', color: 'teal', chapters: {
      'Physics': {
        flashcards: [
          { term: 'Work', def: 'Work = Force × Distance × cos(θ). Work is done only when force causes displacement in its direction. Unit: Joule.' },
          { term: 'Power', def: 'Rate of doing work. Power = Work ÷ Time. Unit: Watt (W). 1 Watt = 1 Joule per second.' },
          { term: 'Energy', def: 'Capacity to do work. Types: Kinetic (motion), Potential (stored), Thermal, Chemical, Nuclear. Unit: Joule.' },
          { term: 'Law of Conservation', def: 'Energy cannot be created or destroyed — only converted from one form to another. Total energy always remains constant.' },
        ],
        quiz: [
          { q: 'What is the unit of Power?', opts: ['Joule', 'Newton', 'Watt', 'Pascal'], ans: 2, exp: 'Power is measured in Watts. 1 Watt = 1 Joule per second.' },
          { q: 'Power = Work ÷ ?', opts: ['Force', 'Distance', 'Mass', 'Time'], ans: 3, exp: 'Power = Work/Time. The faster you do the same work, the more powerful you are.' },
          { q: 'Energy cannot be created or destroyed — this is the:', opts: ['Newton\'s Law', 'Law of Conservation of Energy', 'Ohm\'s Law', 'Faraday\'s Law'], ans: 1, exp: 'The Law of Conservation of Energy — energy only changes form, the total is always constant.' },
        ]
      },
      'Chemistry': {
        flashcards: [
          { term: 'Atom', def: 'The smallest unit of matter that retains chemical properties. Made of protons, neutrons (in nucleus), and electrons (orbiting).' },
          { term: 'Element', def: 'A pure substance made of only one type of atom. E.g., gold (Au), oxygen (O), hydrogen (H). 118 elements in the periodic table.' },
          { term: 'Compound', def: 'A substance formed when two or more elements chemically combine in fixed ratios. E.g., H₂O, CO₂, NaCl.' },
          { term: 'Periodic Table', def: 'Arrangement of 118 elements by increasing atomic number. Organised into periods (rows) and groups (columns).' },
        ],
        quiz: [
          { q: 'What is the smallest unit of matter?', opts: ['Molecule', 'Atom', 'Cell', 'Electron'], ans: 1, exp: 'An atom is the smallest unit that retains the chemical properties of an element.' },
          { q: 'H₂O is an example of a:', opts: ['Element', 'Mixture', 'Compound', 'Metal'], ans: 2, exp: 'H₂O is a compound — two hydrogen atoms chemically bonded to one oxygen atom.' },
          { q: 'How many elements are in the periodic table?', opts: ['100', '108', '118', '92'], ans: 2, exp: 'As of now, 118 elements are confirmed in the periodic table.' },
        ]
      }
    }},
    Maths: { icon: '🔢', color: 'purple', chapters: {
      'Algebra': {
        flashcards: [
          { term: 'Linear Equation', def: 'An equation where variables have power 1. Graph is a straight line. E.g., 2x + 3 = 7, y = mx + c.' },
          { term: 'Quadratic Equation', def: 'An equation of the form ax² + bx + c = 0. Has at most 2 solutions. Solved by factoring or the quadratic formula.' },
          { term: 'Quadratic Formula', def: 'x = (-b ± √(b²-4ac)) / 2a. Used when factoring is difficult. The discriminant b²-4ac determines the nature of roots.' },
        ],
        quiz: [
          { q: 'Solve: 2x + 3 = 11', opts: ['x = 3', 'x = 4', 'x = 5', 'x = 7'], ans: 1, exp: '2x = 11-3 = 8, so x = 8/2 = 4.' },
          { q: 'A quadratic equation has degree:', opts: ['1', '3', '2', '0'], ans: 2, exp: 'Quadratic equations have degree 2 — the highest power of the variable is 2.' },
        ]
      },
      'Trigonometry': {
        flashcards: [
          { term: 'sin θ', def: 'In a right triangle: sin θ = Opposite / Hypotenuse. Key values: sin 0°=0, sin 30°=½, sin 60°=√3/2, sin 90°=1.' },
          { term: 'cos θ', def: 'cos θ = Adjacent / Hypotenuse. Key values: cos 0°=1, cos 30°=√3/2, cos 60°=½, cos 90°=0.' },
          { term: 'tan θ', def: 'tan θ = Opposite / Adjacent = sin θ / cos θ. Key values: tan 0°=0, tan 30°=1/√3, tan 45°=1, tan 60°=√3.' },
          { term: 'Pythagorean Identity', def: 'sin²θ + cos²θ = 1. This identity is true for all values of θ. Very useful in proofs!' },
        ],
        quiz: [
          { q: 'sin 90° = ?', opts: ['0', '√3/2', '½', '1'], ans: 3, exp: 'sin 90° = 1. As the angle approaches 90°, the opposite side approaches the hypotenuse.' },
          { q: 'tan 45° = ?', opts: ['0', '√3', '1', '1/√3'], ans: 2, exp: 'tan 45° = 1 because at 45° the opposite and adjacent sides are equal.' },
          { q: 'sin²θ + cos²θ = ?', opts: ['0', '2', 'θ', '1'], ans: 3, exp: 'The Pythagorean Identity: sin²θ + cos²θ = 1, always!' },
        ]
      }
    }},
    English: { icon: '📚', color: 'pink', chapters: {
      'Writing Skills': {
        flashcards: [
          { term: 'Essay Structure', def: 'Introduction (hook + thesis) → Body paragraphs (topic sentence + evidence + analysis) → Conclusion (restate thesis + broader implications).' },
          { term: 'Thesis Statement', def: 'A single sentence in the introduction that states the main argument of your essay. A good thesis is specific, arguable, and significant.' },
          { term: 'Cohesion', def: 'The logical flow of ideas in writing, connected by transitional words: however, furthermore, in contrast, as a result, consequently.' },
        ],
        quiz: [
          { q: 'A thesis statement appears in the:', opts: ['Conclusion', 'Body paragraphs', 'Introduction', 'Title'], ans: 2, exp: 'The thesis statement is in the introduction — it tells the reader what you will argue.' },
          { q: '"However" is an example of a:', opts: ['Adjective', 'Noun', 'Transition word', 'Verb'], ans: 2, exp: '"However" is a transition word used to show contrast between two ideas.' },
        ]
      }
    }},
    'Social Science': { icon: '🌍', color: 'amber', chapters: {
      'Political Science': {
        flashcards: [
          { term: 'Democracy', def: 'A system of government where citizens elect their representatives. "Government of the people, by the people, for the people." — Abraham Lincoln.' },
          { term: 'Constitution', def: 'The supreme law of a country. India\'s Constitution came into effect on 26 January 1950. Dr. B.R. Ambedkar was its chief architect.' },
          { term: 'Fundamental Rights', def: '6 fundamental rights in the Indian Constitution: Right to Equality, Freedom, Against Exploitation, Religious Freedom, Cultural/Educational Rights, Constitutional Remedies.' },
        ],
        quiz: [
          { q: 'India\'s Constitution came into effect on:', opts: ['15 Aug 1947', '26 Jan 1947', '26 Jan 1950', '15 Aug 1950'], ans: 2, exp: '26 January 1950 is India\'s Republic Day — when the Constitution came into force.' },
          { q: 'Who was the chief architect of India\'s Constitution?', opts: ['Nehru', 'Gandhi', 'Patel', 'Dr. B.R. Ambedkar'], ans: 3, exp: 'Dr. B.R. Ambedkar chaired the Drafting Committee of India\'s Constitution.' },
          { q: 'How many Fundamental Rights does India have?', opts: ['5', '7', '6', '10'], ans: 2, exp: 'India\'s Constitution originally had 7 Fundamental Rights; the right to property was removed, leaving 6.' },
        ]
      }
    }}
  };
}
