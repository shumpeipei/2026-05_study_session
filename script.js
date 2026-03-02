const GAS_URL = 'https://script.google.com/macros/s/AKfycbzgX1ii3xr3cPyNntg976EN_tvmDfeEog2a5wkK4zI6XcHRvE9cTmZe7j39Q967NTM5Pw/exec';
const STORAGE_KEY = 'joined_study_session_2026_05';

async function fetchCount() {
  try {
    const res = await fetch(`${GAS_URL}?action=get`);
    const data = await res.json();
    document.getElementById('joinCount').textContent = data.ok ? data.value : '—';
  } catch (e) {
    document.getElementById('joinCount').textContent = '—';
  }
}

async function handleJoin() {
  const btn = document.getElementById('joinBtn');
  btn.disabled = true;
  try {
    const res = await fetch(`${GAS_URL}?action=up`);
    const data = await res.json();
    if (data.ok) {
      document.getElementById('joinCount').textContent = data.value;
      localStorage.setItem(STORAGE_KEY, 'true');
      document.getElementById('joinDoneMsg').classList.add('show');
    } else {
      throw new Error(data.error);
    }
  } catch (e) {
    btn.disabled = false;
    alert('通信エラーが発生しました。時間をおいて再度お試しください。');
  }
}

function checkAlreadyJoined() {
  if (localStorage.getItem(STORAGE_KEY)) {
    document.getElementById('joinBtn').disabled = true;
    document.getElementById('joinDoneMsg').classList.add('show');
  }
}

const quizData = {
  1: {
    correct: 'B', feedback: {
      A: { ok: false, text: '上長への即時エスカレーションは、ファシリテーターとしての機能を放棄することになります。まずは自分で場を整理する動きが求められます。' },
      B: { ok: true, text: '正解です。対立の背景にある「真の懸念点」を可視化し、双方が納得できる第三の選択肢を探ることが、コーディネーターの核心的な役割です。' },
      C: { ok: false, text: '多数決は意思決定を速めますが、少数意見を切り捨てることになり、後の抵抗や手戻りにつながりやすい手法です。' },
      D: { ok: false, text: '先送りは問題を温存するだけです。少なくとも「次回までに各自が整理すべきこと」を明確にして会議を締めることが必要です。' },
    }
  },
  2: {
    correct: 'C', feedback: {
      A: { ok: false, text: '大きな会議の場での初出し提案は、参加者が準備できておらず反発を招きやすい。「根回し」は日本のビジネス文化における重要なコーディネーション技法です。' },
      B: { ok: false, text: 'メール一斉送信は情報共有としては有効ですが、合意形成とは異なります。受け取り側が「読んでいない」「内容を理解していない」まま進むリスクがあります。' },
      C: { ok: true, text: '正解です。事前の個別調整（いわゆる根回し）により、各関係者の懸念点を把握・反映した上で臨む大きな場は、スムーズな合意につながります。' },
      D: { ok: false, text: '事後報告は合意形成ではありません。関係者の反発と手戻りコストを招く最もリスクの高い選択肢です。' },
    }
  },
  3: {
    correct: 'B', feedback: {
      A: { ok: false, text: '個人の記憶違いを原因とすると、再発防止につながりません。プロセスの問題として捉えることが重要です。' },
      B: { ok: true, text: '正解です。「合意した」という事実は、文書化・共有・確認のセットで初めて完結します。議事録の送付と確認期限の設定が再発防止の基本です。' },
      C: { ok: false, text: '参加者数が一因になることもありますが、根本はコミュニケーション・記録のプロセス設計にあります。' },
      D: { ok: false, text: '会議頻度と合意の品質は直接的には関係しません。1回の会議でも適切に記録・共有すれば問題は防げます。' },
    }
  }
};

let score = 0, currentQ = 1;
const answers = {};

function initDots() {
  const c = document.getElementById('progressDots');
  c.innerHTML = '';
  for (let i = 1; i <= 3; i++) {
    const d = document.createElement('div');
    d.className = 'progress-dot' + (i === 1 ? ' active' : '');
    d.id = 'dot' + i;
    c.appendChild(d);
  }
}

function updateDots(q) {
  for (let i = 1; i <= 3; i++) {
    document.getElementById('dot' + i).className = 'progress-dot' + (i < q ? ' done' : i === q ? ' active' : '');
  }
}

document.querySelectorAll('.option-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    const q = parseInt(this.dataset.q), opt = this.dataset.opt;
    if (answers[q]) return;
    answers[q] = opt;
    const data = quizData[q], isCorrect = opt === data.correct;
    if (isCorrect) score++;
    document.querySelectorAll(`.option-btn[data-q="${q}"]`).forEach(b => {
      b.disabled = true;
      if (b.dataset.opt === data.correct) b.classList.add('correct');
      else if (b.dataset.opt === opt && !isCorrect) b.classList.add('incorrect');
    });
    document.getElementById('fv' + q).textContent = isCorrect ? '✓ 正解です' : '✗ 不正解';
    document.getElementById('fv' + q).className = 'feedback-verdict ' + (isCorrect ? 'ok' : 'ng');
    document.getElementById('ft' + q).textContent = data.feedback[opt].text;
    document.getElementById('fb' + q).classList.add('show');
  });
});

function nextQuestion(n) {
  document.getElementById('q' + (n - 1)).classList.remove('active');
  document.getElementById('q' + n).classList.add('active');
  currentQ = n; updateDots(n);
  window.scrollTo({ top: document.querySelector('.quiz-section').offsetTop - 20, behavior: 'smooth' });
}

function showResult() {
  document.getElementById('q3').classList.remove('active');
  document.getElementById('progressDots').style.display = 'none';
  document.getElementById('resultCard').classList.add('show');
  document.getElementById('resultScore').textContent = score;
  const types = [
    ['スキルアップ候補者型', '今まさに学ぶタイミングです。本勉強会は、コーディネーション・合意形成の基礎から実践まで、一から丁寧に学べる内容になっています。ぜひご参加ください。'],
    ['成長フェーズ型', 'コーディネーションへの意識はあるものの、場面に応じた手法の選択に伸びしろがあります。本勉強会で体系的なフレームワークを学ぶことで、大きく変わります。'],
    ['実践経験者型', '概ねコーディネーションの勘所を掴んでいます。あと一歩の理解で、より確実に合意を引き出せるようになります。本勉強会で弱点を補強しましょう。'],
    ['熟練のコーディネーター型', '3問すべて正解です。合意形成の基本原則をしっかり押さえています。本勉強会では、さらに複雑なマルチステークホルダー場面の応用スキルを学びましょう。'],
  ];
  document.getElementById('resultType').textContent = types[score][0];
  document.getElementById('resultDesc').textContent = types[score][1];
  window.scrollTo({ top: document.querySelector('.quiz-section').offsetTop - 20, behavior: 'smooth' });
}

function retryQuiz() {
  score = 0; Object.keys(answers).forEach(k => delete answers[k]);
  document.getElementById('resultCard').classList.remove('show');
  document.getElementById('progressDots').style.display = 'flex';
  document.querySelectorAll('.quiz-card').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.option-btn').forEach(b => { b.disabled = false; b.className = 'option-btn'; });
  document.querySelectorAll('.feedback').forEach(f => f.classList.remove('show'));
  document.getElementById('q1').classList.add('active');
  currentQ = 1; initDots();
}

const observer = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.1 }
);
document.querySelectorAll('section, .join-section').forEach(s => observer.observe(s));

initDots();
fetchCount();
checkAlreadyJoined();
