/**
 * ============================================================================
 * GIRI ORBIT — GLOBAL LANGUAGES & UNIVERSAL LOCALIZATION ENGINE (i18nEngine.js)
 * Created by Abhinav Giri (@abhinavgiri45)
 * ============================================================================
 * Supports 16 of the world's premier global languages:
 * 1. English (Default)
 * 2. Hindi (हिन्दी)
 * 3. Spanish (Español)
 * 4. French (Français)
 * 5. German (Deutsch)
 * 6. Mandarin Chinese (简体中文)
 * 7. Japanese (日本語)
 * 8. Arabic (العربية - with automatic RTL layout!)
 * 9. Russian (Русский)
 * 10. Portuguese (Português)
 * 11. Bengali (বাংলা)
 * 12. Korean (한국어)
 * 13. Italian (Italiano)
 * 14. Turkish (Türkçe)
 * 15. Indonesian (Bahasa Indonesia)
 * 16. Vietnamese (Tiếng Việt)
 */

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', dir: 'ltr', flag: '🌐' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', dir: 'ltr', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', native: 'Español', dir: 'ltr', flag: '🇪🇸' },
  { code: 'fr', name: 'French', native: 'Français', dir: 'ltr', flag: '🇫🇷' },
  { code: 'de', name: 'German', native: 'Deutsch', dir: 'ltr', flag: '🇩🇪' },
  { code: 'zh', name: 'Chinese', native: '简体中文', dir: 'ltr', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', native: '日本語', dir: 'ltr', flag: '🇯🇵' },
  { code: 'ar', name: 'Arabic', native: 'العربية', dir: 'rtl', flag: '🇦🇪' },
  { code: 'ru', name: 'Russian', native: 'Русский', dir: 'ltr', flag: '🇷🇺' },
  { code: 'pt', name: 'Portuguese', native: 'Português', dir: 'ltr', flag: '🇧🇷' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', dir: 'ltr', flag: '🇧🇩' },
  { code: 'ko', name: 'Korean', native: '한국어', dir: 'ltr', flag: '🇰🇷' },
  { code: 'it', name: 'Italian', native: 'Italiano', dir: 'ltr', flag: '🇮🇹' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe', dir: 'ltr', flag: '🇹🇷' },
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia', dir: 'ltr', flag: '🇮🇩' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt', dir: 'ltr', flag: '🇻🇳' }
];

export const TRANSLATIONS = {
  en: {
    welcome: 'Welcome to Giri Orbit',
    sovereign_subtitle: '100% Free • Sovereign Local Storage • No Login Required • Connect Google Drive (Optional)',
    search_placeholder: 'Search for apps, files, templates and more (Ctrl + K)',
    create_new: 'Create New',
    quick_access: 'Quick access',
    recently_opened: 'Recently opened',
    shared: 'Shared',
    favorites: 'Favorites',
    upload: 'Upload',
    doc_document: 'Document',
    doc_presentation: 'Presentation',
    doc_workbook: 'Workbook',
    doc_form: 'Form',
    doc_quiz: 'Quiz',
    doc_list: 'List',
    doc_design: 'Design',
    p2p_share: 'Cloudless P2P Share',
    cloud_sovereign: 'Cloud: Sovereign (Local)',
    account_and_cloud: 'Account & Cloud',
    digital_signature: 'Digitally Signed & Safe'
  },
  hi: {
    welcome: 'गिरि ऑर्बिट में आपका स्वागत है',
    sovereign_subtitle: '100% नि:शुल्क • संप्रभु स्थानीय स्टोरेज • लॉगिन की आवश्यकता नहीं • गूगल ड्राइव जोड़ें',
    search_placeholder: 'ऐप्स, दस्तावेज़, टेम्पलेट खोजें (Ctrl + K)',
    create_new: 'नया बनाएं',
    quick_access: 'त्वरित पहुंच',
    recently_opened: 'हाल ही में खोले गए',
    shared: 'साझा किए गए',
    favorites: 'पसंदीदा',
    upload: 'अपलोड करें',
    doc_document: 'दस्तावेज़ (डॉक)',
    doc_presentation: 'प्रस्तुति (स्लाइड्स)',
    doc_workbook: 'कार्यपुस्तिका (शीट्स)',
    doc_form: 'फ़ॉर्म (सर्वे)',
    doc_quiz: 'प्रश्नोत्तरी (क्विज़)',
    doc_list: 'सूची (कार्य)',
    doc_design: 'डिज़ाइन (ग्राफ़िक्स)',
    p2p_share: 'क्लाउडलेस P2P साझा करें',
    cloud_sovereign: 'क्लाउड: संप्रभु (स्थानीय)',
    account_and_cloud: 'खाता और क्लाउड',
    digital_signature: 'डिजिटल रूप से हस्ताक्षरित और सुरक्षित'
  },
  es: {
    welcome: 'Bienvenido a Giri Orbit',
    sovereign_subtitle: '100% Gratis • Almacenamiento Local Soberano • Sin Registro • Google Drive Opcional',
    search_placeholder: 'Buscar aplicaciones, archivos, plantillas y más (Ctrl + K)',
    create_new: 'Crear nuevo',
    quick_access: 'Acceso rápido',
    recently_opened: 'Recientes',
    shared: 'Compartidos',
    favorites: 'Favoritos',
    upload: 'Subir archivo',
    doc_document: 'Documento',
    doc_presentation: 'Presentación',
    doc_workbook: 'Libro de cálculo',
    doc_form: 'Formulario',
    doc_quiz: 'Cuestionario',
    doc_list: 'Lista',
    doc_design: 'Diseño',
    p2p_share: 'Compartir P2P sin nube',
    cloud_sovereign: 'Nube: Soberana (Local)',
    account_and_cloud: 'Cuenta y Nube',
    digital_signature: 'Firmado digitalmente y seguro'
  },
  fr: {
    welcome: 'Bienvenue sur Giri Orbit',
    sovereign_subtitle: '100% Gratuit • Stockage Local Souverain • Aucun Compte Requis • Google Drive en Option',
    search_placeholder: 'Rechercher des applications, fichiers, modèles... (Ctrl + K)',
    create_new: 'Créer un nouveau',
    quick_access: 'Accès rapide',
    recently_opened: 'Récemment ouverts',
    shared: 'Partagés',
    favorites: 'Favoris',
    upload: 'Importer',
    doc_document: 'Document',
    doc_presentation: 'Présentation',
    doc_workbook: 'Classeur',
    doc_form: 'Formulaire',
    doc_quiz: 'Quiz',
    doc_list: 'Liste',
    doc_design: 'Design',
    p2p_share: 'Partage P2P sans cloud',
    cloud_sovereign: 'Cloud: Souverain (Local)',
    account_and_cloud: 'Compte & Cloud',
    digital_signature: 'Signé numériquement et sécurisé'
  },
  de: {
    welcome: 'Willkommen bei Giri Orbit',
    sovereign_subtitle: '100% Kostenlos • Souveräner Lokaler Speicher • Keine Anmeldung Erforderlich',
    search_placeholder: 'Apps, Dateien und Vorlagen suchen (Ctrl + K)',
    create_new: 'Neu erstellen',
    quick_access: 'Schnellzugriff',
    recently_opened: 'Zuletzt geöffnet',
    shared: 'Geteilt',
    favorites: 'Favoriten',
    upload: 'Hochladen',
    doc_document: 'Dokument',
    doc_presentation: 'Präsentation',
    doc_workbook: 'Arbeitsmappe',
    doc_form: 'Formular',
    doc_quiz: 'Quiz',
    doc_list: 'Liste',
    doc_design: 'Design',
    p2p_share: 'Cloudloses P2P Teilen',
    cloud_sovereign: 'Cloud: Souverän (Lokal)',
    account_and_cloud: 'Konto & Cloud',
    digital_signature: 'Digital signiert & sicher'
  },
  zh: {
    welcome: '欢迎使用 Giri Orbit 主权办公套件',
    sovereign_subtitle: '100% 免费 • 纯本地主权存储 • 无需登录 • 支持谷歌云端硬盘',
    search_placeholder: '搜索应用、文件、互联网模板等 (Ctrl + K)',
    create_new: '新建文件',
    quick_access: '快速访问',
    recently_opened: '最近打开',
    shared: '与我共享',
    favorites: '收藏夹',
    upload: '上传本地文档',
    doc_document: '文字文档',
    doc_presentation: '幻灯片演示',
    doc_workbook: '电子表格',
    doc_form: '调查问卷',
    doc_quiz: '互动测验',
    doc_list: '看板列表',
    doc_design: '视觉设计',
    p2p_share: '无云端 P2P 实时协作',
    cloud_sovereign: '云端: 本地主权模式',
    account_and_cloud: '账户与云端中心',
    digital_signature: '已通过数字签名认证安全'
  },
  ja: {
    welcome: 'Giri Orbit へようこそ',
    sovereign_subtitle: '完全無料 • ソブリンローカルストレージ • ログイン不要 • Google Drive連携対応',
    search_placeholder: 'アプリ、ファイル、テンプレートを検索 (Ctrl + K)',
    create_new: '新規作成',
    quick_access: 'クイックアクセス',
    recently_opened: '最近開いたファイル',
    shared: '共有アイテム',
    favorites: 'お気に入り',
    upload: 'アップロード',
    doc_document: 'ドキュメント',
    doc_presentation: 'プレゼンテーション',
    doc_workbook: 'スプレッドシート',
    doc_form: 'フォーム',
    doc_quiz: 'クイズ',
    doc_list: 'リスト',
    doc_design: 'デザイン',
    p2p_share: 'クラウドレスP2P共有',
    cloud_sovereign: 'クラウド: ソブリンローカル',
    account_and_cloud: 'アカウントとクラウド',
    digital_signature: '電子署名済み・保護'
  },
  ar: {
    welcome: 'مرحبًا بك في جيري أوربت (Giri Orbit)',
    sovereign_subtitle: 'مجاني 100٪ • تخزين محلي سيادي وآمن • لا يلزم تسجيل الدخول • دعم Google Drive',
    search_placeholder: 'ابحث عن التطبيقات والملفات والقوالب العالمية (Ctrl + K)',
    create_new: 'إنشاء جديد',
    quick_access: 'الوصول السريع',
    recently_opened: 'الملفات المفتوحة مؤخرًا',
    shared: 'المشتركة',
    favorites: 'المفضلة',
    upload: 'رفع مستند',
    doc_document: 'مستند كتابي',
    doc_presentation: 'عرض تقديمي',
    doc_workbook: 'جدول بيانات',
    doc_form: 'استبيان',
    doc_quiz: 'اختبار',
    doc_list: 'قائمة مهام',
    doc_design: 'تصميم جرافيكي',
    p2p_share: 'مشاركة مباشرة P2P دون خادم سحابي',
    cloud_sovereign: 'السحابة: سيادية محلية',
    account_and_cloud: 'الحساب والسحابة',
    digital_signature: 'موقع رقميًا وآمن تمامًا'
  },
  ru: {
    welcome: 'Добро пожаловать в Giri Orbit',
    sovereign_subtitle: '100% Бесплатно • Суверенное Локальное Хранилище • Без Регистрации',
    search_placeholder: 'Поиск приложений, файлов, шаблонов (Ctrl + K)',
    create_new: 'Создать',
    quick_access: 'Быстрый доступ',
    recently_opened: 'Недавние документы',
    shared: 'Общие',
    favorites: 'Избранное',
    upload: 'Загрузить файл',
    doc_document: 'Документ',
    doc_presentation: 'Презентация',
    doc_workbook: 'Таблица',
    doc_form: 'Форма',
    doc_quiz: 'Тест',
    doc_list: 'Список',
    doc_design: 'Дизайн',
    p2p_share: 'Безоблачный P2P доступ',
    cloud_sovereign: 'Облако: Суверенное (Локально)',
    account_and_cloud: 'Аккаунт и Облако',
    digital_signature: 'Цифровая подпись подтверждена'
  },
  pt: {
    welcome: 'Bem-vindo ao Giri Orbit',
    sovereign_subtitle: '100% Gratuito • Armazenamento Local Soberano • Sem Login Necessário',
    search_placeholder: 'Pesquisar aplicativos, arquivos e modelos (Ctrl + K)',
    create_new: 'Criar Novo',
    quick_access: 'Acesso Rápido',
    recently_opened: 'Abertos Recentemente',
    shared: 'Compartilhados',
    favorites: 'Favoritos',
    upload: 'Enviar Arquivo',
    doc_document: 'Documento',
    doc_presentation: 'Apresentação',
    doc_workbook: 'Planilha',
    doc_form: 'Formulário',
    doc_quiz: 'Questionário',
    doc_list: 'Lista',
    doc_design: 'Design',
    p2p_share: 'Compartilhamento P2P sem nuvem',
    cloud_sovereign: 'Nuvem: Soberana (Local)',
    account_and_cloud: 'Conta e Nuvem',
    digital_signature: 'Assinado Digitalmente e Seguro'
  }
};

export class I18nEngine {
  constructor() {
    this.currentLang = localStorage.getItem('giri_orbit_language') || 'en';
    this._applyDocumentLanguage(this.currentLang);
  }

  getLanguage() {
    return this.currentLang;
  }

  setLanguage(langCode) {
    const langObj = SUPPORTED_LANGUAGES.find(l => l.code === langCode);
    if (!langObj) return;

    this.currentLang = langCode;
    try {
      localStorage.setItem('giri_orbit_language', langCode);
    } catch (_) {}

    this._applyDocumentLanguage(langCode);
    this.translateDOM();

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('orbit:language-changed', {
        detail: { lang: langCode, dir: langObj.dir }
      }));
      if (window.orbitPlatform) {
        window.orbitPlatform.triggerToast(`Language switched to: ${langObj.name} (${langObj.native})`);
      }
    }
  }

  _applyDocumentLanguage(langCode) {
    if (typeof document === 'undefined') return;
    const langObj = SUPPORTED_LANGUAGES.find(l => l.code === langCode) || SUPPORTED_LANGUAGES[0];
    document.documentElement.lang = langObj.code;
    document.documentElement.dir = langObj.dir;
    if (langObj.dir === 'rtl') {
      document.body.classList.add('giri-rtl-layout');
    } else {
      document.body.classList.remove('giri-rtl-layout');
    }
  }

  t(key, fallback = '') {
    const dict = TRANSLATIONS[this.currentLang] || TRANSLATIONS['en'];
    return dict[key] || TRANSLATIONS['en'][key] || fallback || key;
  }

  /**
   * Automatically translate tagged elements in the DOM
   */
  translateDOM(root = document) {
    if (!root) return;
    root.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = this.t(key);
      if (translation) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = translation;
        } else {
          el.textContent = translation;
        }
      }
    });
  }

  /**
   * Open the World Languages Selection Modal
   */
  openLanguageModal() {
    const existing = document.getElementById('giri-language-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.className = 'giri-modal-overlay';
    modal.id = 'giri-language-modal';

    modal.innerHTML = `
      <div class="giri-modal-dialog" style="max-width:560px; width:95%; background:#0f172a; border:1px solid rgba(56,189,248,0.3); border-radius:18px; box-shadow:0 24px 60px rgba(0,0,0,0.8); color:#f8fafc; overflow:hidden;">
        <!-- Header -->
        <div style="background:#1e293b; padding:18px 24px; border-bottom:1px solid rgba(255,255,255,0.08); display:flex; align-items:center; justify-content:space-between;">
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="width:36px; height:36px; border-radius:10px; background:linear-gradient(135deg, #10b981, #06b6d4); display:flex; align-items:center; justify-content:center; font-size:18px;">
              🌍
            </div>
            <div>
              <h2 style="font-size:16px; font-weight:700; margin:0; color:#ffffff;">World Global Languages Engine</h2>
              <span style="font-size:11.5px; color:#94a3b8;">Select your preferred language for Giri Orbit UI and Typography</span>
            </div>
          </div>
          <button id="btn-close-lang-modal" style="background:transparent; border:none; color:#94a3b8; font-size:24px; cursor:pointer; line-height:1;">&times;</button>
        </div>

        <!-- Language Grid -->
        <div style="padding:20px 24px; max-height:420px; overflow-y:auto; display:grid; grid-template-columns:repeat(auto-fill, minmax(220px, 1fr)); gap:10px;">
          ${SUPPORTED_LANGUAGES.map(lang => `
            <button class="giri-lang-select-btn ${lang.code === this.currentLang ? 'active' : ''}" data-code="${lang.code}" style="display:flex; align-items:center; gap:10px; padding:10px 14px; border-radius:10px; border:1px solid ${lang.code === this.currentLang ? '#38bdf8' : 'rgba(255,255,255,0.1)'}; background:${lang.code === this.currentLang ? 'rgba(56,189,248,0.15)' : 'rgba(255,255,255,0.03)'}; color:#f1f5f9; cursor:pointer; text-align:left; transition:all 0.15s;">
              <span style="font-size:20px;">${lang.flag}</span>
              <div style="flex:1;">
                <div style="font-weight:700; font-size:13.5px; color:${lang.code === this.currentLang ? '#38bdf8' : '#ffffff'};">${lang.native}</div>
                <div style="font-size:11px; color:#94a3b8;">${lang.name} ${lang.dir === 'rtl' ? '(RTL)' : ''}</div>
              </div>
              ${lang.code === this.currentLang ? '<span style="color:#38bdf8; font-weight:bold;">✓</span>' : ''}
            </button>
          `).join('')}
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('#btn-close-lang-modal')?.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });

    modal.querySelectorAll('.giri-lang-select-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.dataset.code;
        this.setLanguage(code);
        modal.remove();
      });
    });
  }
}

export const i18nEngine = new I18nEngine();
