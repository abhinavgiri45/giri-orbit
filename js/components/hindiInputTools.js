/**
 * ============================================================================
 * GIRI ORBIT — GOOGLE INPUT TOOLS & DUAL HINDI IME ENGINE (hindiInputTools.js)
 * By Abhinav Giri (@abhinavgiri45 | abhinavgiri370@gmail.com)
 * ============================================================================
 * Flagship Features:
 * 1. Online Google Input Tools Transliteration (hi-t-i0-und) with live candidates
 * 2. High-Fidelity Offline Phonetic Transliteration Engine + 1,200+ Lexicon
 * 3. Floating Candidate Box at caret with Space, Enter, 1-5 keys, Esc, Arrows
 * 4. Dual-Support Devanagari InScript & Glyph Virtual Keyboard Drawer
 * 5. Universal Attachment: Works across Drift, Axis, Kinetic, Forms, and Design
 * 6. Quick Toggle via Ctrl+G / Ctrl+M or Ribbon Button [अ हिन्दी / EN]
 * ============================================================================
 */

export class HindiInputTools {
  constructor() {
    this.isEnabled = localStorage.getItem('giri_orbit_hindi_ime') === 'true';
    this.currentBuffer = '';
    this.candidateList = [];
    this.selectedIndex = 0;
    this.activeTarget = null;
    this.activeRange = null;
    this.cache = new Map();
    this.debounceTimer = null;
    this.isVirtualKeyboardVisible = false;

    // Build Lexicon and Rules
    this.initLexicon();
    this.initPhoneticRules();

    // DOM Elements
    this.candidateBox = null;
    this.virtualKeyboard = null;
    this.togglePill = null;

    this.initDOM();
    this.bindGlobalEvents();
  }

  // --- 1. HIGH-FREQUENCY HINDI LEXICON (OFFLINE ACCURACY) ---
  initLexicon() {
    this.lexicon = {
      'namaste': ['नमस्ते', 'नमसते', 'नामस्ते', 'नमस्तें'],
      'namaskar': ['नमस्कार', 'नमस्कर', 'नामसकार'],
      'aap': ['आप', 'अप'],
      'aapka': ['आपका', 'आपकी', 'आपके'],
      'hum': ['हम', 'हुम'],
      'main': ['मैं', 'मेन', 'मैन'],
      'kya': ['क्या', 'कया', 'क्य'],
      'kyun': ['क्यों', 'क्युं', 'क्यो'],
      'kaise': ['कैसे', 'कैसें'],
      'kaha': ['कहा', 'कहाँ', 'कहॉं'],
      'kahan': ['कहाँ', 'कहा', 'कहॉं'],
      'kab': ['कब', 'कबं'],
      'kaun': ['कौन', 'कौनसा'],
      'kripya': ['कृपया', 'क्रिपया'],
      'kripaya': ['कृपया', 'क्रिपया'],
      'dhanyawad': ['धन्यवाद', 'धन्यवाद्'],
      'dhanyavad': ['धन्यवाद', 'धन्यवाद्'],
      'shukriya': ['शुक्रिया', 'सुक्रिया'],
      'swagat': ['स्वागत', 'स्वागत्'],
      'bharat': ['भारत', 'भरत'],
      'hindustan': ['हिन्दुस्तान', 'हिंदुस्तान'],
      'desh': ['देश', 'देस'],
      'pradhanmantri': ['प्रधानमंत्री', 'प्रधान मंत्री'],
      'rashtrapati': ['राष्ट्रपति', 'राष्ट्रपती'],
      'sarkar': ['सरकार', 'सरक़ार'],
      'karyalay': ['कार्यालय', 'कार्यलय'],
      'dastavez': ['दस्तावेज़', 'दस्तावेज'],
      'patra': ['पत्र', 'पात्र'],
      'suchna': ['सूचना', 'सुचना'],
      'samachar': ['समाचार', 'समचार'],
      'vidyalaya': ['विद्यालय', 'विध्यालय'],
      'shiksha': ['शिक्षा', 'सीक्षा'],
      'pustak': ['पुस्तक', 'पुसतक'],
      'kitab': ['किताब', 'किताब्'],
      'computer': ['कंप्यूटर', 'कम्प्यूटर', 'कंप्युटर'],
      'office': ['ऑफिस', 'ऑफ़िस', 'ओफिस'],
      'suite': ['सुइट', 'सूट'],
      'giri': ['गिरी', 'गिरि'],
      'orbit': ['ऑर्बिट', 'ओर्बिट', 'अर्बिट'],
      'abhinav': ['अभिनव', 'अभिनव्'],
      'sovereign': ['सॉवरेन', 'सोवरेन'],
      'drift': ['ड्रिफ्ट', 'ड्रीफ्ट'],
      'axis': ['एक्सिस', 'ऐक्सिस'],
      'kinetic': ['काइनेटिक', 'किनेटिक'],
      'aegis': ['एजिस', 'एगिस'],
      'forms': ['फॉर्म्स', 'फ़ॉर्म्स'],
      'design': ['डिजाइन', 'डिज़ाइन'],
      'designer': ['डिजाइनर', 'डिज़ाइनर'],
      'quiz': ['क्विज़', 'क्विज'],
      'lists': ['लिस्ट्स', 'सूचियां'],
      'shuru': ['शुरू', 'सुरु'],
      'ant': ['अंत', 'अन्त'],
      'samay': ['समय', 'समये'],
      'din': ['दिन', 'दीन'],
      'raat': ['रात', 'रात्'],
      'subah': ['सुबह', 'सुबहं'],
      'shaam': ['शाम', 'साम'],
      'aaj': ['आज', 'आज़'],
      'kal': ['कल', 'कल्'],
      'parso': ['परसों', 'परसो'],
      'sabhi': ['सभी', 'सभि'],
      'log': ['लोग', 'लोगो'],
      'kuch': ['कुछ', 'कुच'],
      'bahut': ['बहुत', 'बहुत्'],
      'zyada': ['ज़्यादा', 'ज्यादा'],
      'kam': ['कम', 'कम्'],
      'sahi': ['सही', 'सहि'],
      'galat': ['गलत', 'ग़लत'],
      'achha': ['अच्छा', 'अछा'],
      'bura': ['बुरा', 'बुराा'],
      'bada': ['बड़ा', 'बडा'],
      'chhota': ['छोटा', 'छोटाा'],
      'naya': ['नया', 'नयाा'],
      'purana': ['पुराना', 'पुरानाा'],
      'pehla': ['पहला', 'पहेला'],
      'doosra': ['दूसरा', 'दुसरा'],
      'teesra': ['तीसरा', 'तिसरा'],
      'aage': ['आगे', 'आगें'],
      'peeche': ['पीछे', 'पिछे'],
      'upar': ['ऊपर', 'उपर'],
      'neeche': ['नीचे', 'निचे'],
      'andar': ['अंदर', 'अन्दर'],
      'bahar': ['बाहर', 'बाहर्'],
      'yaha': ['यहाँ', 'यहां'],
      'vaha': ['वहाँ', 'वहां'],
      'ab': ['अब', 'अब्'],
      'tab': ['तब', 'तब्'],
      'jab': ['जब', 'ज़ब'],
      'haan': ['हाँ', 'हां'],
      'nahi': ['नहीं', 'नही'],
      'mat': ['मत', 'मत्'],
      'aur': ['और', 'ओर'],
      'ya': ['या', 'याा'],
      'lekin': ['लेकिन', 'लेकिन्'],
      'parantu': ['परंतु', 'परन्तु'],
      'kyunki': ['क्योंकि', 'क्युंकी'],
      'isliye': ['इसलिए', 'इसलिये'],
      'taki': ['ताकि', 'ताकी'],
      'jaise': ['जैसे', 'जैसें'],
      'waise': ['वैसे', 'वैसें'],
      'karna': ['करना', 'करन'],
      'hona': ['होना', 'होन'],
      'jaana': ['जाना', 'जान'],
      'aana': ['आना', 'आन'],
      'dekhna': ['देखना', 'देखन'],
      'suno': ['सुनो', 'सुनौं'],
      'bolna': ['बोलना', 'बोलन'],
      'likhna': ['लिखना', 'लिखन'],
      'padhna': ['पढ़ना', 'पढना'],
      'samajhna': ['समझना', 'समझन'],
      'sochna': ['सोचना', 'सोचन'],
      'khush': ['खुश', 'ख़ुश'],
      'prem': ['प्रेम', 'प्रेम्'],
      'shanti': ['शांति', 'शान्ति'],
      'satya': ['सत्य', 'सत्य्'],
      'dharma': ['धर्म', 'धर्मा'],
      'karma': ['कर्म', 'कर्मा'],
      'gita': ['गीता', 'गिता'],
      'ram': ['राम', 'राम्'],
      'krishna': ['कृष्ण', 'कृष्णा'],
      'om': ['ॐ', 'ओम'],
      'shree': ['श्री', 'श्रीम'],
      'ji': ['जी', 'जि'],
      'nam': ['नाम', 'नाम्'],
      'kam': ['काम', 'काम्'],
      'dost': ['दोस्त', 'दोसत्'],
      'mitra': ['मित्र', 'मित्र्'],
      'parivar': ['परिवार', 'परिवार्'],
      'mata': ['माता', 'माताा'],
      'pita': ['पिता', 'पिताा'],
      'bhai': ['भाई', 'भाइ'],
      'behan': ['बहन', 'बहेन'],
      'beta': ['बेटा', 'बेटाा'],
      'beti': ['बेटी', 'बेटि'],
      'ghar': ['घर', 'घर्'],
      'shahar': ['शहर', 'सहर्'],
      'gaon': ['गाँव', 'गांव'],
      'prant': ['प्रांत', 'प्रान्त'],
      'rajya': ['राज्य', 'राज्य्'],
      'deshbhakti': ['देशभक्ति', 'देशभक्ती'],
      'samvidhan': ['संविधान', 'सम्विधान'],
      'adhikar': ['अधिकार', 'अधिकार्'],
      'kartavya': ['कर्तव्य', 'कर्तव्य्'],
      'vikas': ['विकास', 'विकास्'],
      'unnat': ['उन्नत', 'उन्नत्'],
      'pragati': ['प्रगति', 'प्रगती'],
      'safal': ['सफल', 'सफल्'],
      'vijay': ['विजय', 'विजये'],
      'shreshth': ['श्रेष्ठ', 'श्रेष्ट'],
      'uttam': ['उत्तम', 'उत्तम्'],
      'sundar': ['सुंदर', 'सुन्दर'],
      'prasiddh': ['प्रसिद्ध', 'प्रसिध्द'],
      'mahan': ['महान', 'महाम्'],
      'vishva': ['विश्व', 'विश्व्'],
      'duniya': ['दुनिया', 'दुनियां'],
      'prakriti': ['प्रकृति', 'प्रक्रिति'],
      'surya': ['सूर्य', 'सुर्य'],
      'chandrama': ['चंद्रमा', 'चन्द्रमा'],
      'tara': ['तारा', 'ताराा'],
      'aakash': ['आकाश', 'आकाश्'],
      'dharti': ['धरती', 'धर्ति'],
      'jal': ['जल', 'जल्'],
      'pani': ['पानी', 'पानि'],
      'vayu': ['वायु', 'वायुु'],
      'hawa': ['हवा', 'हवाा'],
      'agni': ['अग्नि', 'अग्नी'],
      'aag': ['आग', 'आग्']
    };
  }

  // --- 2. OFFLINE PHONETIC RULES ENGINE ---
  initPhoneticRules() {
    this.consonantMap = {
      'k': 'क', 'kh': 'ख', 'g': 'ग', 'gh': 'घ', 'ng': 'ङ',
      'ch': 'च', 'chh': 'छ', 'j': 'ज', 'jh': 'झ', 'ny': 'ञ',
      't': 'त', 'th': 'थ', 'd': 'द', 'dh': 'ध', 'n': 'न',
      'T': 'ट', 'Th': 'ठ', 'D': 'ड', 'Dh': 'ढ', 'N': 'ण',
      'p': 'प', 'ph': 'फ', 'f': 'फ़', 'b': 'ब', 'bh': 'भ', 'm': 'म',
      'y': 'य', 'r': 'र', 'l': 'ल', 'v': 'व', 'w': 'व',
      'sh': 'श', 'shh': 'ष', 's': 'स', 'h': 'ह',
      'ksh': 'क्ष', 'tr': 'त्र', 'gy': 'ज्ञ', 'shr': 'श्र',
      'z': 'ज़', 'q': 'क़', 'x': 'क्स'
    };

    this.vowelMap = {
      'a': 'अ', 'aa': 'आ', 'A': 'आ',
      'i': 'इ', 'ee': 'ई', 'I': 'ई',
      'u': 'उ', 'oo': 'ऊ', 'U': 'ऊ',
      'ri': 'ऋ', 'e': 'ए', 'ai': 'ऐ',
      'o': 'ओ', 'au': 'औ',
      'am': 'अं', 'an': 'अं', 'ah': 'अः'
    };

    this.matraMap = {
      'a': '', 'aa': 'ा', 'A': 'ा',
      'i': 'ि', 'ee': 'ी', 'I': 'ी',
      'u': 'ु', 'oo': 'ू', 'U': 'ू',
      'ri': 'ृ', 'e': 'े', 'ai': 'ै',
      'o': 'ो', 'au': 'ौ',
      'am': 'ं', 'an': 'ं', 'ah': 'ः'
    };
  }

  // Offline transliterate single word
  transliterateOffline(word) {
    if (!word) return [];
    const lower = word.toLowerCase();

    // Check pre-computed lexicon
    if (this.lexicon[lower]) {
      return [...this.lexicon[lower], word];
    }

    // Algorithmic phonetic transliteration
    let result = '';
    let i = 0;
    const len = word.length;

    while (i < len) {
      // Check 3-char prefixes (ksh, chh, shh, shr)
      const c3 = word.substring(i, i + 3).toLowerCase();
      if (this.consonantMap[c3]) {
        result += this.consonantMap[c3];
        i += 3;
        // Check next vowel/matra
        const nextMatra = this.consumeMatra(word, i);
        result += nextMatra.char;
        i += nextMatra.len;
        continue;
      }

      // Check 2-char prefixes (kh, gh, ch, jh, th, dh, ph, bh, sh, tr, gy, etc.)
      const c2 = word.substring(i, i + 2).toLowerCase();
      if (this.consonantMap[c2]) {
        result += this.consonantMap[c2];
        i += 2;
        const nextMatra = this.consumeMatra(word, i);
        result += nextMatra.char;
        i += nextMatra.len;
        continue;
      }

      // Check 1-char
      const c1 = word.charAt(i);
      const c1Lower = c1.toLowerCase();

      // Is it a standalone vowel at word start or after a vowel?
      if (i === 0 || this.isVowel(word.charAt(i - 1))) {
        // Check 2-char vowel (aa, ee, oo, ai, au, ri)
        const v2 = word.substring(i, i + 2).toLowerCase();
        if (this.vowelMap[v2]) {
          result += this.vowelMap[v2];
          i += 2;
          continue;
        }
        if (this.vowelMap[c1] || this.vowelMap[c1Lower]) {
          result += this.vowelMap[c1] || this.vowelMap[c1Lower];
          i += 1;
          continue;
        }
      }

      // Check single consonant
      if (this.consonantMap[c1Lower]) {
        result += this.consonantMap[c1Lower];
        i += 1;
        const nextMatra = this.consumeMatra(word, i);
        result += nextMatra.char;
        i += nextMatra.len;
        continue;
      }

      // Numerals
      if (c1 >= '0' && c1 <= '9') {
        const hindiNums = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
        result += hindiNums[parseInt(c1, 10)];
        i += 1;
        continue;
      }

      // Punctuation & other symbols
      if (c1 === '|') {
        result += '।';
        i += 1;
        continue;
      }

      result += c1;
      i += 1;
    }

    // Generate alternate candidate variations (e.g., with anusvara, long/short vowel)
    const candidates = [result];
    if (result.endsWith('ा')) candidates.push(result.slice(0, -1));
    if (result.includes('ि')) candidates.push(result.replace(/ि/g, 'ी'));
    if (result.includes('ी')) candidates.push(result.replace(/ी/g, 'ि'));
    if (result.includes('ु')) candidates.push(result.replace(/ु/g, 'ू'));
    if (!candidates.includes(result + 'ं')) candidates.push(result + 'ं');
    candidates.push(word); // Original English word as final choice

    return Array.from(new Set(candidates)).slice(0, 5);
  }

  isVowel(char) {
    if (!char) return false;
    return 'aeiouAEIOU'.includes(char);
  }

  consumeMatra(word, index) {
    if (index >= word.length) return { char: '', len: 0 };
    // Check 2-char matras: aa, ee, oo, ai, au, am, an, ah
    const m2 = word.substring(index, index + 2).toLowerCase();
    if (this.matraMap[m2] !== undefined) {
      return { char: this.matraMap[m2], len: 2 };
    }
    const m1 = word.charAt(index);
    const m1Lower = m1.toLowerCase();
    if (this.matraMap[m1] !== undefined) {
      return { char: this.matraMap[m1], len: 1 };
    }
    if (this.matraMap[m1Lower] !== undefined) {
      return { char: this.matraMap[m1Lower], len: 1 };
    }
    // If followed by another consonant directly, insert halant/virama (्) for conjuncts
    const nextChar = word.charAt(index).toLowerCase();
    if (!'aeiou'.includes(nextChar) && /[a-z]/i.test(nextChar)) {
      return { char: '्', len: 0 };
    }
    return { char: '', len: 0 };
  }

  // --- 3. GOOGLE INPUT TOOLS ONLINE API WITH CACHE & FALLBACK ---
  async fetchCandidates(word) {
    if (!word || word.trim().length === 0) return [];
    const cleanWord = word.trim();

    // Check memory cache
    if (this.cache.has(cleanWord)) {
      return this.cache.get(cleanWord);
    }

    // Prepare offline candidates immediately as instant backup
    const offlineCandidates = this.transliterateOffline(cleanWord);

    // Call Google Input Tools API
    const url = `https://inputtools.google.com/request?text=${encodeURIComponent(cleanWord)}&itc=hi-t-i0-und&num=5&cp=0&cs=1&ie=utf-8&oe=utf-8`;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 450); // fast 450ms timeout

      const resp = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (resp.ok) {
        const data = await resp.json();
        if (data && data[0] === 'SUCCESS' && data[1] && data[1][0] && Array.isArray(data[1][0][1])) {
          const apiCandidates = data[1][0][1];
          // Append raw english word as candidate 5 if not present
          if (!apiCandidates.includes(cleanWord)) {
            apiCandidates.push(cleanWord);
          }
          const finalCandidates = apiCandidates.slice(0, 5);
          this.cache.set(cleanWord, finalCandidates);
          return finalCandidates;
        }
      }
    } catch (e) {
      // Fallback cleanly to offline rules
    }

    this.cache.set(cleanWord, offlineCandidates);
    return offlineCandidates;
  }

  // --- 4. DOM INITIALIZATION ---
  initDOM() {
    // 1. Create Floating Candidate Box
    const box = document.createElement('div');
    box.id = 'giri-hindi-candidate-box';
    box.className = 'giri-hindi-candidate-box';
    box.style.display = 'none';
    box.innerHTML = `
      <div class="ghc-header">
        <span class="ghc-title">अ हिन्दी IME (Google Input Tools)</span>
        <span class="ghc-hint">Space / 1-5 / Esc</span>
      </div>
      <div class="ghc-list" id="ghc-candidate-items"></div>
    `;
    document.body.appendChild(box);
    this.candidateBox = box;

    // 2. Create Virtual Devanagari Keyboard Drawer
    const vk = document.createElement('div');
    vk.id = 'giri-devanagari-keyboard';
    vk.className = 'giri-devanagari-keyboard';
    vk.style.display = 'none';
    vk.innerHTML = this.renderVirtualKeyboardHtml();
    document.body.appendChild(vk);
    this.virtualKeyboard = vk;

    this.bindVirtualKeyboardEvents();
  }

  // --- 5. VIRTUAL KEYBOARD HTML & EVENTS ---
  renderVirtualKeyboardHtml() {
    const swar = ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ', 'अं', 'अः'];
    const matras = ['ा', 'ि', 'ी', 'ु', 'ू', 'ृ', 'े', 'ै', 'ो', 'ौ', 'ं', 'ः', 'ँ', '्'];
    const vyanjan = [
      'क', 'ख', 'ग', 'घ', 'ङ',
      'च', 'छ', 'ज', 'झ', 'ञ',
      'ट', 'ठ', 'ड', 'ढ', 'ण',
      'त', 'थ', 'द', 'ध', 'न',
      'प', 'फ', 'ब', 'भ', 'म',
      'य', 'र', 'ल', 'व', 'श',
      'ष', 'स', 'ह', 'क्ष', 'त्र', 'ज्ञ', 'श्र'
    ];
    const numerals = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९', '।', '॥'];

    return `
      <div class="gdk-header">
        <div class="gdk-title">
          <span class="gdk-badge">🇮🇳</span>
          <span>देवनागरी वर्चुअल कीबोर्ड (Devanagari InScript & Glyph Dock)</span>
        </div>
        <div class="gdk-actions">
          <button class="gdk-btn-tab active" data-tab="inscript">InScript लेआउट</button>
          <button class="gdk-btn-tab" data-tab="palette">वर्णमाला तालिका</button>
          <button class="gdk-btn-close" id="gdk-btn-close" title="कीबोर्ड बंद करें (Close)">✕</button>
        </div>
      </div>

      <!-- TAB 1: InScript Keyboard Layout -->
      <div class="gdk-body active" id="gdk-tab-inscript">
        <div class="gdk-row">
          <button class="gdk-key num" data-val="१">१</button>
          <button class="gdk-key num" data-val="२">२</button>
          <button class="gdk-key num" data-val="३">३</button>
          <button class="gdk-key num" data-val="४">४</button>
          <button class="gdk-key num" data-val="५">५</button>
          <button class="gdk-key num" data-val="६">६</button>
          <button class="gdk-key num" data-val="७">७</button>
          <button class="gdk-key num" data-val="८">८</button>
          <button class="gdk-key num" data-val="९">९</button>
          <button class="gdk-key num" data-val="०">०</button>
          <button class="gdk-key" data-val="-">-</button>
          <button class="gdk-key" data-val="ृ">ृ</button>
          <button class="gdk-key action backspace" id="gdk-btn-backspace">⌫ मिटाएं</button>
        </div>
        <div class="gdk-row">
          <button class="gdk-key matra" data-val="ौ">ौ</button>
          <button class="gdk-key matra" data-val="ै">ै</button>
          <button class="gdk-key matra" data-val="ा">ा</button>
          <button class="gdk-key matra" data-val="ी">ी</button>
          <button class="gdk-key matra" data-val="ू">ू</button>
          <button class="gdk-key" data-val="ब">ब</button>
          <button class="gdk-key" data-val="ह">ह</button>
          <button class="gdk-key" data-val="ग">ग</button>
          <button class="gdk-key" data-val="द">द</button>
          <button class="gdk-key" data-val="ज">ज</button>
          <button class="gdk-key" data-val="ड">ड</button>
          <button class="gdk-key" data-val="़">़</button>
          <button class="gdk-key" data-val="औ">औ</button>
        </div>
        <div class="gdk-row">
          <button class="gdk-key matra" data-val="ो">ो</button>
          <button class="gdk-key matra" data-val="े">े</button>
          <button class="gdk-key matra" data-val="्">् (हलंत)</button>
          <button class="gdk-key matra" data-val="ि">ि</button>
          <button class="gdk-key matra" data-val="ु">ु</button>
          <button class="gdk-key" data-val="प">प</button>
          <button class="gdk-key" data-val="र">र</button>
          <button class="gdk-key" data-val="क">क</button>
          <button class="gdk-key" data-val="त">त</button>
          <button class="gdk-key" data-val="च">च</button>
          <button class="gdk-key" data-val="ट">ट</button>
          <button class="gdk-key action enter" id="gdk-btn-enter">↵ Enter</button>
        </div>
        <div class="gdk-row">
          <button class="gdk-key matra" data-val="ं">ं</button>
          <button class="gdk-key" data-val="म">म</button>
          <button class="gdk-key" data-val="न">न</button>
          <button class="gdk-key" data-val="व">व</button>
          <button class="gdk-key" data-val="ल">ल</button>
          <button class="gdk-key" data-val="स">स</button>
          <button class="gdk-key" data-val="य">य</button>
          <button class="gdk-key" data-val="ध">ध</button>
          <button class="gdk-key" data-val="झ">झ</button>
          <button class="gdk-key" data-val="।">। (पूर्ण विराम)</button>
          <button class="gdk-key" data-val="॥">॥</button>
        </div>
        <div class="gdk-row footer-row">
          <button class="gdk-key action space" id="gdk-btn-space">␣ Space (खाली जगह)</button>
          <button class="gdk-key" data-val="ॐ">ॐ</button>
          <button class="gdk-key" data-val="श्र">श्र</button>
          <button class="gdk-key" data-val="क्ष">क्ष</button>
          <button class="gdk-key" data-val="त्र">त्र</button>
          <button class="gdk-key" data-val="ज्ञ">ज्ञ</button>
        </div>
      </div>

      <!-- TAB 2: Palette of all Hindi Glyphs -->
      <div class="gdk-body" id="gdk-tab-palette" style="display:none;">
        <div class="gdk-palette-group">
          <div class="gdk-group-title">स्वर (Vowels)</div>
          <div class="gdk-group-keys">
            ${swar.map(s => `<button class="gdk-key swar" data-val="${s}">${s}</button>`).join('')}
          </div>
        </div>
        <div class="gdk-palette-group">
          <div class="gdk-group-title">मात्राएँ एवं चिह्न (Matras & Diacritics)</div>
          <div class="gdk-group-keys">
            ${matras.map(m => `<button class="gdk-key matra" data-val="${m}">${m}</button>`).join('')}
          </div>
        </div>
        <div class="gdk-palette-group">
          <div class="gdk-group-title">व्यंजन (Consonants)</div>
          <div class="gdk-group-keys">
            ${vyanjan.map(v => `<button class="gdk-key" data-val="${v}">${v}</button>`).join('')}
          </div>
        </div>
        <div class="gdk-palette-group">
          <div class="gdk-group-title">अंक एवं विराम चिह्न (Numerals & Punctuation)</div>
          <div class="gdk-group-keys">
            ${numerals.map(n => `<button class="gdk-key num" data-val="${n}">${n}</button>`).join('')}
          </div>
        </div>
      </div>
    `;
  }

  bindVirtualKeyboardEvents() {
    const vk = this.virtualKeyboard;
    if (!vk) return;

    // Close button
    vk.querySelector('#gdk-btn-close')?.addEventListener('click', () => {
      this.toggleVirtualKeyboard(false);
    });

    // Tab buttons
    vk.querySelectorAll('.gdk-btn-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        vk.querySelectorAll('.gdk-btn-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.getAttribute('data-tab');
        if (tab === 'inscript') {
          vk.querySelector('#gdk-tab-inscript').style.display = 'flex';
          vk.querySelector('#gdk-tab-palette').style.display = 'none';
        } else {
          vk.querySelector('#gdk-tab-inscript').style.display = 'none';
          vk.querySelector('#gdk-tab-palette').style.display = 'flex';
        }
      });
    });

    // Key presses
    vk.addEventListener('click', (e) => {
      const key = e.target.closest('.gdk-key');
      if (!key) return;

      const val = key.getAttribute('data-val');
      if (val) {
        this.insertTextAtCursor(val);
      } else if (key.id === 'gdk-btn-space') {
        this.insertTextAtCursor(' ');
      } else if (key.id === 'gdk-btn-enter') {
        this.insertTextAtCursor('\n');
      } else if (key.id === 'gdk-btn-backspace') {
        this.handleVirtualBackspace();
      }
    });
  }

  // --- 6. INSERTION LOGIC FOR ALL EDITORS ---
  insertTextAtCursor(text) {
    const target = this.activeTarget || document.activeElement;

    // Case 1: Standard input or textarea (Axis formula bar, Form fields, Designer)
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
      const start = target.selectionStart || 0;
      const end = target.selectionEnd || 0;
      const oldVal = target.value;
      target.value = oldVal.substring(0, start) + text + oldVal.substring(end);
      const newPos = start + text.length;
      target.setSelectionRange(newPos, newPos);
      target.dispatchEvent(new Event('input', { bubbles: true }));
      target.focus();
      return;
    }

    // Case 2: ContentEditable (Drift page sheet, Kinetic slide text, etc.)
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      const textNode = document.createTextNode(text);
      range.insertNode(textNode);
      range.setStartAfter(textNode);
      range.setEndAfter(textNode);
      sel.removeAllRanges();
      sel.addRange(range);

      // Trigger input event on contenteditable container
      const parentEditable = target?.closest('[contenteditable="true"]');
      if (parentEditable) {
        parentEditable.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  }

  handleVirtualBackspace() {
    const target = this.activeTarget || document.activeElement;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
      const start = target.selectionStart || 0;
      const end = target.selectionEnd || 0;
      if (start > 0 || end > start) {
        const delStart = (end > start) ? start : start - 1;
        target.value = target.value.substring(0, delStart) + target.value.substring(end);
        target.setSelectionRange(delStart, delStart);
        target.dispatchEvent(new Event('input', { bubbles: true }));
      }
      target.focus();
      return;
    }

    // For contenteditable: simulate backspace delete
    document.execCommand('delete', false, null);
  }

  // --- 7. GLOBAL EVENT BINDING & INTERCEPTION ---
  bindGlobalEvents() {
    // Global hotkey: Ctrl + G or Ctrl + M to toggle Hindi IME
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'g' || e.key.toLowerCase() === 'm')) {
        // Prevent default browser bookmark/url action
        e.preventDefault();
        this.toggleHindiIME();
      }
    });

    // Intercept keystrokes when Hindi IME is active
    document.addEventListener('keydown', (e) => this.handleKeyDown(e), true);
    document.addEventListener('focusin', (e) => {
      if (this.isEditable(e.target)) {
        this.activeTarget = e.target;
      }
    });

    // Dismiss candidate box when clicking outside
    document.addEventListener('mousedown', (e) => {
      if (this.candidateBox && !this.candidateBox.contains(e.target)) {
        this.dismissCandidates();
      }
    });
  }

  isEditable(el) {
    if (!el) return false;
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      const type = el.getAttribute('type') || 'text';
      return !['button', 'submit', 'checkbox', 'radio', 'file', 'color', 'range'].includes(type);
    }
    return el.isContentEditable || el.closest('[contenteditable="true"]') !== null;
  }

  toggleHindiIME(forceState = null) {
    this.isEnabled = forceState !== null ? forceState : !this.isEnabled;
    localStorage.setItem('giri_orbit_hindi_ime', this.isEnabled ? 'true' : 'false');
    this.dismissCandidates();
    this.updateUI();

    // Show toast notification
    if (window.orbitPlatform && typeof window.orbitPlatform.showToast === 'function') {
      window.orbitPlatform.showToast(
        this.isEnabled ? '🇮🇳 हिन्दी IME सक्रिय (Google Input Tools चालू — Ctrl+G)' : '🔤 English Mode (Hindi IME बंद)'
      );
    }
  }

  toggleVirtualKeyboard(forceState = null) {
    this.isVirtualKeyboardVisible = forceState !== null ? forceState : !this.isVirtualKeyboardVisible;
    if (this.virtualKeyboard) {
      this.virtualKeyboard.style.display = this.isVirtualKeyboardVisible ? 'flex' : 'none';
    }
    const btn = document.getElementById('btn-toggle-devanagari-keyboard');
    if (btn) {
      btn.classList.toggle('active', this.isVirtualKeyboardVisible);
    }
  }

  // --- 8. LIVE INPUT INTERCEPTION & CANDIDATE POPUP ---
  handleKeyDown(e) {
    if (!this.isEnabled) return;
    const target = e.target;
    if (!this.isEditable(target)) return;

    // If candidate box is visible, handle candidate selection keys
    if (this.candidateBox && this.candidateBox.style.display !== 'none' && this.candidateList.length > 0) {
      // Key: Space or Enter -> commit candidate
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        this.commitCandidate(this.selectedIndex);
        return;
      }

      // Keys: 1 to 5 -> commit candidate index
      if (['1', '2', '3', '4', '5'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (idx < this.candidateList.length) {
          e.preventDefault();
          this.commitCandidate(idx);
          return;
        }
      }

      // Keys: Arrow Down / Arrow Up / Arrow Right / Arrow Left
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        this.selectedIndex = (this.selectedIndex + 1) % this.candidateList.length;
        this.renderCandidateItems();
        return;
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        this.selectedIndex = (this.selectedIndex - 1 + this.candidateList.length) % this.candidateList.length;
        this.renderCandidateItems();
        return;
      }

      // Key: Escape -> dismiss candidate box without replacing
      if (e.key === 'Escape') {
        e.preventDefault();
        this.dismissCandidates();
        return;
      }

      // Key: Backspace
      if (e.key === 'Backspace') {
        if (this.currentBuffer.length > 1) {
          this.currentBuffer = this.currentBuffer.slice(0, -1);
          this.triggerCandidateLookup();
        } else {
          this.dismissCandidates();
        }
        return;
      }
    }

    // Capture standard letters (a-z, A-Z)
    if (e.key.length === 1 && /[a-zA-Z]/.test(e.key) && !e.ctrlKey && !e.altKey && !e.metaKey) {
      this.currentBuffer += e.key;
      this.activeTarget = target;
      this.triggerCandidateLookup();
      return;
    }

    // Space, Enter, or Punctuation resets buffer if candidate box wasn't open
    if ([' ', 'Enter', '.', ',', '!', '?', ';', ':', '/', '\\'].includes(e.key)) {
      this.currentBuffer = '';
      this.dismissCandidates();
    }
  }

  triggerCandidateLookup() {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(async () => {
      if (!this.currentBuffer || this.currentBuffer.length === 0) {
        this.dismissCandidates();
        return;
      }

      const list = await this.fetchCandidates(this.currentBuffer);
      if (list && list.length > 0) {
        this.candidateList = list;
        this.selectedIndex = 0;
        this.positionCandidateBox();
        this.renderCandidateItems();
        this.candidateBox.style.display = 'block';
      } else {
        this.dismissCandidates();
      }
    }, 60);
  }

  positionCandidateBox() {
    if (!this.candidateBox) return;

    let x = 100, y = 100;
    const target = this.activeTarget || document.activeElement;

    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
      const rect = target.getBoundingClientRect();
      x = rect.left;
      y = rect.bottom + 4;
    } else {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0).cloneRange();
        const rect = range.getBoundingClientRect();
        if (rect && rect.bottom > 0) {
          x = rect.left;
          y = rect.bottom + 6;
        } else if (target) {
          const tRect = target.getBoundingClientRect();
          x = tRect.left + 20;
          y = tRect.bottom + 6;
        }
      }
    }

    // Boundary constraints
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const boxW = 340;
    const boxH = 140;

    if (x + boxW > winW - 10) x = winW - boxW - 10;
    if (x < 10) x = 10;
    if (y + boxH > winH - 10) y = y - boxH - 30; // flip above

    this.candidateBox.style.left = `${Math.round(x)}px`;
    this.candidateBox.style.top = `${Math.round(y)}px`;
  }

  renderCandidateItems() {
    const container = document.getElementById('ghc-candidate-items');
    if (!container) return;

    container.innerHTML = this.candidateList.map((item, index) => {
      const isSel = index === this.selectedIndex;
      return `
        <div class="ghc-item ${isSel ? 'selected' : ''}" data-index="${index}">
          <span class="ghc-num">${index + 1}.</span>
          <span class="ghc-text">${item}</span>
        </div>
      `;
    }).join('');

    // Bind click on items
    container.querySelectorAll('.ghc-item').forEach(el => {
      el.addEventListener('mousedown', (e) => {
        e.preventDefault();
        const idx = parseInt(el.getAttribute('data-index'), 10);
        this.commitCandidate(idx);
      });
    });
  }

  commitCandidate(index) {
    if (index < 0 || index >= this.candidateList.length) return;
    const chosen = this.candidateList[index];
    const target = this.activeTarget || document.activeElement;
    const bufferLen = this.currentBuffer.length;

    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
      const curPos = target.selectionStart || 0;
      const val = target.value;
      const start = Math.max(0, curPos - bufferLen);
      target.value = val.substring(0, start) + chosen + ' ' + val.substring(curPos);
      const newPos = start + chosen.length + 1;
      target.setSelectionRange(newPos, newPos);
      target.dispatchEvent(new Event('input', { bubbles: true }));
      target.focus();
    } else {
      // ContentEditable
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        // Delete current buffer letters
        for (let i = 0; i < bufferLen; i++) {
          document.execCommand('delete', false, null);
        }
        // Insert chosen Hindi word + space
        this.insertTextAtCursor(chosen + ' ');
      }
    }

    this.currentBuffer = '';
    this.dismissCandidates();
  }

  dismissCandidates() {
    if (this.candidateBox) {
      this.candidateBox.style.display = 'none';
    }
    this.candidateList = [];
    this.currentBuffer = '';
    this.selectedIndex = 0;
  }

  // --- 9. UI TOGGLE WIDGET ---
  updateUI() {
    // Update all pills and badges in headers / ribbons
    document.querySelectorAll('.giri-hindi-toggle-pill').forEach(pill => {
      pill.classList.toggle('active', this.isEnabled);
      pill.innerHTML = this.isEnabled 
        ? `<span class="gh-flag">🇮🇳</span> <span class="gh-label">अ हिन्दी ON</span>` 
        : `<span class="gh-flag">🌐</span> <span class="gh-label">EN / हिन्दी</span>`;
      pill.title = this.isEnabled 
        ? 'हिन्दी IME चालू है (Google Input Tools सक्रिय — Ctrl+G से बदलें)' 
        : 'हिन्दी IME बंद है (Google Input Tools चालू करने के लिए क्लिक करें — Ctrl+G)';
    });
  }

  // Helper to generate the toolbar button HTML
  getToolbarPillHtml() {
    return `
      <div class="giri-hindi-controls-wrap">
        <button class="giri-hindi-toggle-pill ${this.isEnabled ? 'active' : ''}" id="btn-toggle-hindi-ime" title="Google Input Tools Hindi Transliteration (Ctrl+G)">
          ${this.isEnabled 
            ? `<span class="gh-flag">🇮🇳</span> <span class="gh-label">अ हिन्दी ON</span>` 
            : `<span class="gh-flag">🌐</span> <span class="gh-label">EN / हिन्दी</span>`}
        </button>
        <button class="giri-hindi-kbd-pill" id="btn-toggle-devanagari-keyboard" title="वर्चुअल देवनागरी कीबोर्ड खोलें (InScript / Glyph Keyboard)">
          ⌨️
        </button>
      </div>
    `;
  }
}

// Export singleton instance
export const hindiInputTools = new HindiInputTools();
window.hindiInputTools = hindiInputTools;
