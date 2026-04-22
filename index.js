/**
 * NeuroLearn — Cognitive Science Learning Platform
 * 
 * Evidence-based adaptive education implementing cognitive science research:
 * - Leitner box spaced repetition (Ebbinghaus forgetting curve)
 * - Interleaved practice (mixing topics for deeper learning)
 * - Dual coding (visual + textual representations)
 * - Retrieval practice (testing > re-reading)
 * - Bloom's taxonomy progression (remember → create)
 * 
 * Based on Dunlosky et al. (2013) "Improving Students' Learning With
 * Effective Learning Techniques" — Psychological Science in the Public Interest.
 * 
 * @module NeuroLearn
 * @version 2.0.0
 * @license MIT
 */

function prng(s) {
  s = s | 0;
  return function() {
    s = (s + 0x6D2B79F5) | 0;
    var t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

var CURRICULUM = {
  'algebra': {
    title: 'Algebra Fundamentals', domain: 'math', bloom: 'remember',
    prereqs: [], concepts: ['variables', 'expressions', 'equations'],
    content: 'Algebra uses letters to represent unknowns. Expression: 3x+5. Equation: 3x+5=20. Solve by inverse operations.',
    cards: [
      { q: 'What is a variable?', a: 'A letter representing an unknown number' },
      { q: 'Solve: 2x + 6 = 18', a: 'x = 6 (subtract 6, divide by 2)' },
      { q: 'Simplify: 3(x + 4)', a: '3x + 12 (distributive property)' }
    ],
    quiz: [
      { q: 'If 5x - 3 = 22, what is x?', opts: ['4','5','3','7'], ans: 1 },
      { q: 'Which property: a(b+c) = ab+ac?', opts: ['Commutative','Associative','Distributive','Identity'], ans: 2 }
    ],
    visual: '  ⚖️  3x + 5 = 20\n      -5       -5\n  ⚖️  3x     = 15\n      ÷3       ÷3\n  ⚖️  x      =  5'
  },
  'geometry': {
    title: 'Geometry Essentials', domain: 'math', bloom: 'apply',
    prereqs: ['algebra'], concepts: ['shapes', 'area', 'Pythagorean theorem'],
    content: 'Geometry studies shapes and space. Rectangle: A=l×w. Triangle: A=½bh. Circle: A=πr². Right triangle: a²+b²=c².',
    cards: [
      { q: 'Area of circle, radius 7?', a: '≈153.94 (π×49)' },
      { q: 'Pythagorean theorem?', a: 'a² + b² = c² for right triangles' },
      { q: 'Angles in a triangle sum to?', a: '180 degrees' }
    ],
    quiz: [
      { q: 'Right triangle legs 3,4. Hypotenuse?', opts: ['5','6','7','12'], ans: 0 },
      { q: 'Triangle area, base 10, height 6?', opts: ['60','30','16','20'], ans: 1 }
    ],
    visual: '     ╱│\n  5╱  │4\n  ╱   │\n ╱────│\n   3\n a²+b²=c² → 9+16=25 ✓'
  },
  'cell-bio': {
    title: 'Cell Biology', domain: 'science', bloom: 'understand',
    prereqs: [], concepts: ['cells', 'organelles', 'DNA'],
    content: 'Cells are life\'s building blocks. Nucleus stores DNA. Mitochondria make ATP energy. Ribosomes build proteins. Plant cells add chloroplasts and cell walls.',
    cards: [
      { q: '"Powerhouse" of the cell?', a: 'Mitochondria — glucose → ATP' },
      { q: '4 phases of mitosis?', a: 'Prophase, Metaphase, Anaphase, Telophase' },
      { q: 'Molecule carrying genetic code?', a: 'DNA (deoxyribonucleic acid)' }
    ],
    quiz: [
      { q: 'Which organelle does photosynthesis?', opts: ['Mitochondria','Nucleus','Chloroplast','Ribosome'], ans: 2 },
      { q: 'Chromosomes line up in which phase?', opts: ['Prophase','Metaphase','Anaphase','Telophase'], ans: 1 }
    ],
    visual: '  ╔═══════════════╗\n  ║ ┌────┐ ⚬ribo  ║\n  ║ │Nucl│  ~ER~  ║\n  ║ │eus │  ⊕mito ║\n  ║ └────┘  ⊕mito ║\n  ╚═══════════════╝'
  },
  'genetics': {
    title: 'Genetics & Heredity', domain: 'science', bloom: 'analyze',
    prereqs: ['cell-bio'], concepts: ['alleles', 'Punnett squares', 'dominant/recessive'],
    content: 'Each trait has two alleles. Dominant (B) masks recessive (b). Punnett squares predict offspring. BB,Bb=dominant phenotype. bb=recessive.',
    cards: [
      { q: 'Heterozygous means?', a: 'Two different alleles (e.g., Bb)' },
      { q: 'Bb × Bb: fraction bb?', a: '1/4 (25%) from Punnett square' },
      { q: 'What did Mendel study?', a: 'Pea plants — dominant/recessive inheritance' }
    ],
    quiz: [
      { q: 'Bb × bb: % dominant offspring?', opts: ['25%','50%','75%','100%'], ans: 1 },
      { q: 'Genotype means:', opts: ['Appearance','Genetic makeup','Blood type','Chromosome #'], ans: 1 }
    ],
    visual: '  ┌────┬────┬────┐\n  │    │  B │  b │\n  ├────┼────┼────┤\n  │  B │ BB │ Bb │\n  ├────┼────┼────┤\n  │  b │ Bb │ bb │\n  └────┴────┴────┘\n  3 dominant : 1 recessive'
  },
  'history': {
    title: 'Ancient Civilizations', domain: 'humanities', bloom: 'evaluate',
    prereqs: [], concepts: ['civilizations', 'writing', 'democracy'],
    content: 'Key civilizations: Mesopotamia (cuneiform), Egypt (pyramids), Greece (democracy), Rome (engineering), China (Silk Road). Each contributed uniquely to human progress.',
    cards: [
      { q: 'First writing system?', a: 'Cuneiform — Sumerians, ~3400 BCE' },
      { q: 'Where did democracy begin?', a: 'Athens, Greece (~507 BCE)' },
      { q: 'What connected East and West?', a: 'The Silk Road — trade route to Mediterranean' }
    ],
    quiz: [
      { q: 'Who built first aqueducts?', opts: ['Egypt','Greece','Rome','China'], ans: 2 },
      { q: 'Rosetta Stone decoded which script?', opts: ['Cuneiform','Hieroglyphs','Sanskrit','Latin'], ans: 1 }
    ],
    visual: '  3500BCE ── Mesopotamia\n  3100BCE ── Egypt\n   800BCE ── Greece\n   500BCE ── Rome\n   221BCE ── China (Qin)'
  },
  'statistics': {
    title: 'Intro to Statistics', domain: 'math', bloom: 'analyze',
    prereqs: ['algebra'], concepts: ['mean', 'median', 'mode', 'std deviation'],
    content: 'Mean=sum/count. Median=middle value (sorted). Mode=most frequent. Standard deviation measures data spread from the mean.',
    cards: [
      { q: 'Mean of [3,7,7,9,14]?', a: '8 (40÷5)' },
      { q: 'Median of [2,5,8,12,15]?', a: '8 (middle value)' },
      { q: 'Large std deviation means?', a: 'Data widely spread from mean' }
    ],
    quiz: [
      { q: 'Mode of [4,7,7,9,11,7]?', opts: ['4','7','9','7.5'], ans: 1 },
      { q: 'SD of [10,10,10,10]?', opts: ['10','1','0','5'], ans: 2 }
    ],
    visual: '     ╭──╮\n   ╭─╯  ╰─╮  Normal curve\n  ╭╯      ╰╮ Mean=Med=Mode\n  ╰─────────╯\n  ◀── SD ──▶'
  }
};

/** Create learner with Leitner box tracking */
function createLearner(name) {
  return { name: name, level: 1, xp: 0, streak: 0, mastery: {}, boxes: {}, attempts: 0, correct: 0, badges: [], sessions: 0 };
}

/** Review a flashcard — Leitner system: correct→up a box, wrong→box 1 */
function reviewCard(learner, topicId, idx, correct) {
  var key = topicId + ':' + idx;
  var box = learner.boxes[key] || 1;
  var intervals = ['', '1d', '3d', '7d', '14d', '30d'];
  if (correct) { box = Math.min(5, box + 1); learner.correct++; learner.xp += box * 10; learner.streak++; }
  else { box = 1; learner.streak = 0; learner.xp += 5; }
  learner.boxes[key] = box; learner.attempts++;
  if (learner.xp >= learner.level * 150) learner.level++;
  // Update topic mastery from avg box level
  var keys = Object.keys(learner.boxes).filter(function(k) { return k.startsWith(topicId + ':'); });
  var avg = keys.reduce(function(s, k) { return s + learner.boxes[k]; }, 0) / Math.max(1, keys.length);
  learner.mastery[topicId] = Math.min(1, avg / 5);
  // Award badges
  if (learner.streak >= 5 && learner.badges.indexOf('🔥 On Fire') < 0) learner.badges.push('🔥 On Fire');
  if (learner.correct >= 10 && learner.badges.indexOf('🧠 Scholar') < 0) learner.badges.push('🧠 Scholar');
  if (Object.keys(learner.mastery).length >= 4 && learner.badges.indexOf('🌍 Explorer') < 0) learner.badges.push('🌍 Explorer');
  return { feedback: correct ? '✅ Box ' + box + ' (next: ' + intervals[box] + ')' : '❌ → Box 1', box: box, next: intervals[box] };
}

/** Take a quiz with retrieval practice scoring */
function takeQuiz(learner, topicId, answers) {
  var t = CURRICULUM[topicId];
  if (!t) return { score: 0, total: 0, lines: ['Topic not found'] };
  var score = 0, lines = [];
  t.quiz.forEach(function(q, i) {
    var ans = answers[i] !== undefined ? answers[i] : -1;
    var ok = ans === q.ans; if (ok) score++;
    lines.push((ok ? '✅' : '❌') + ' ' + q.q);
    if (!ok) lines.push('   → ' + q.opts[q.ans]);
    reviewCard(learner, topicId, 10 + i, ok);
  });
  var pct = Math.round(score / t.quiz.length * 100);
  lines.push(score + '/' + t.quiz.length + ' (' + pct + '%) ' + (pct >= 80 ? '⭐⭐⭐' : pct >= 50 ? '⭐⭐' : '📚'));
  return { score: score, total: t.quiz.length, lines: lines };
}

/** Generate interleaved study plan */
function studyPlan(learner, seed) {
  var r = prng(seed || 42);
  var avail = Object.keys(CURRICULUM).filter(function(id) {
    return CURRICULUM[id].prereqs.every(function(p) { return (learner.mastery[p] || 0) >= 0.3; });
  });
  var weak = avail.filter(function(id) { return (learner.mastery[id] || 0) < 0.5; });
  var strong = avail.filter(function(id) { return (learner.mastery[id] || 0) >= 0.5; });
  var plan = [], topics = [];
  for (var i = 0; i < 2 && weak.length; i++) { var x = Math.floor(r() * weak.length); topics.push(weak.splice(x, 1)[0]); }
  if (strong.length) topics.push(strong[Math.floor(r() * strong.length)]);
  topics.forEach(function(id, i) {
    var t = CURRICULUM[id], m = Math.round((learner.mastery[id] || 0) * 100);
    var tech = m < 30 ? 'Visual + Read' : m < 60 ? 'Flashcards' : 'Quiz + Elaborate';
    plan.push((i + 1) + '. ' + t.title + ' [' + t.domain + '] ' + m + '% → ' + tech);
  });
  learner.sessions++;
  return { plan: '📋 Study Plan:\n' + plan.join('\n') + '\n💡 Interleaved practice improves retention', topics: topics };
}

/** Dashboard with mastery bars, knowledge graph, Bloom's progress */
function dashboard(learner) {
  var l = [], acc = learner.attempts > 0 ? Math.round(learner.correct / learner.attempts * 100) : 0;
  l.push('╔════════════════════════════════════════════════╗');
  l.push('║  🧠 NeuroLearn — ' + learner.name + '\'s Dashboard' + ' '.repeat(Math.max(0, 16 - learner.name.length)) + '║');
  l.push('╠════════════════════════════════════════════════╣');
  l.push('║  Lvl ' + learner.level + ' | XP: ' + learner.xp + ' | Acc: ' + acc + '% | Streak: ' + learner.streak + '       ║');
  var xpBar = Math.round(Math.min(1, learner.xp / (learner.level * 150)) * 20);
  l.push('║  [' + '█'.repeat(xpBar) + '░'.repeat(20 - xpBar) + '] → Level ' + (learner.level + 1) + '            ║');
  l.push('╠════════════════════════════════════════════════╣');
  Object.keys(CURRICULUM).forEach(function(id) {
    var t = CURRICULUM[id], m = learner.mastery[id] || 0, pct = Math.round(m * 100);
    var bar = '█'.repeat(Math.round(m * 12)) + '░'.repeat(12 - Math.round(m * 12));
    var name = (t.title + '                 ').substring(0, 18);
    var bl = t.bloom.charAt(0).toUpperCase();
    l.push('║  ' + name + ' [' + bar + '] ' + (pct < 10 ? ' ' : '') + pct + '% [' + bl + ']  ║');
  });
  l.push('╠════════════════════════════════════════════════╣');
  l.push('║  🔗 algebra → geometry → statistics            ║');
  l.push('║     cell-bio → genetics                       ║');
  l.push('║     history (independent)                     ║');
  l.push('║  🏅 ' + (learner.badges.join(' ') || 'No badges yet') + '                      ║');
  l.push('╚════════════════════════════════════════════════╝');
  return l.join('\n');
}

// ═══════ SHOWCASE ═══════

console.log('╔════════════════════════════════════════════════╗');
console.log('║  🧠 NeuroLearn — Cognitive Science Platform     ║');
console.log('╚════════════════════════════════════════════════╝\n');

var L = createLearner('Sophia');

console.log('━━━ 1. Study Plan (Interleaved Practice) ━━━');
console.log(studyPlan(L, 42).plan);

console.log('\n━━━ 2. Dual Coding: Visual + Text ━━━');
['algebra','cell-bio'].forEach(function(id) {
  var t = CURRICULUM[id];
  console.log('\n📖 ' + t.title + ' [Bloom: ' + t.bloom + ']');
  console.log(t.content);
  console.log(t.visual);
});

console.log('\n━━━ 3. Leitner Flashcard Review ━━━');
['algebra','cell-bio','history','genetics'].forEach(function(id) {
  var t = CURRICULUM[id]; if (!t) return;
  console.log('\n📇 ' + t.title + ':');
  t.cards.forEach(function(c, i) {
    var ok = i !== 1;
    var r = reviewCard(L, id, i, ok);
    console.log('  Q: ' + c.q + ' → ' + r.feedback);
  });
});

console.log('\n━━━ 4. Retrieval Practice Quizzes ━━━');
['algebra','cell-bio','history'].forEach(function(id) {
  var t = CURRICULUM[id];
  console.log('\n📝 ' + t.title + ':');
  var r = takeQuiz(L, id, t.quiz.map(function(q) { return q.ans; }));
  r.lines.forEach(function(l) { console.log('  ' + l); });
});

console.log('\n━━━ 5. Dashboard ━━━');
console.log(dashboard(L));

console.log('\nExports: prng, createLearner, reviewCard, takeQuiz, studyPlan, dashboard, CURRICULUM');

module.exports = { prng: prng, createLearner: createLearner, reviewCard: reviewCard, takeQuiz: takeQuiz, studyPlan: studyPlan, dashboard: dashboard, CURRICULUM: CURRICULUM };
