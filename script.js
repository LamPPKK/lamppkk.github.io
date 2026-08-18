const languageToggle = document.querySelector(".language-toggle");
const languageOptions = languageToggle?.querySelectorAll("[data-language]");
const translatableElements = document.querySelectorAll("[data-en][data-vi]");
const translatableAriaElements = document.querySelectorAll(
  "[data-en-aria-label][data-vi-aria-label]",
);
const translatableAltElements = document.querySelectorAll("[data-en-alt][data-vi-alt]");
const progressBar = document.querySelector(".page-progress span");

const japaneseTranslations = Object.freeze({
  "Skip to content": "本文へスキップ",
  "Lâm Nguyễn — home": "Lâm Nguyễn — ホーム",
  Work: "注目プロジェクト",
  Archive: "全プロジェクト",
  Credentials: "資格",
  Experience: "経歴",
  About: "紹介",
  "Technical Project Manager · Hanoi": "テクニカルプロジェクトマネージャー · ハノイ",
  "Complex software.": "複雑なソフトウェアを。",
  "Clear direction.": "明確な方向へ。",
  "I bridge engineering and business to turn ambitious ideas into secure, useful products—and help the teams behind them thrive.":
    "技術とビジネスをつなぎ、大胆なアイデアを安全で価値ある製品へ変え、その開発チームの成長を支えます。",
  "Explore selected work": "注目プロジェクトを見る",
  "Download CV": "CVをダウンロード",
  "Project leadership / Mobile / Systems": "プロジェクト推進 / モバイル / システム",
  "years in software": "ソフトウェア経験年数",
  "delivery projects": "デリバリープロジェクト",
  "professional credentials": "専門資格",
  "Open-source footprint": "オープンソース活動",
  "653 public repositories on GitHub.": "GitHubで653件の公開リポジトリ。",
  "02 / SELECTED WORK": "02 / 注目プロジェクト",
  "Built at the intersection.": "領域の交差点から、価値を形に。",
  "A selection of open-source systems and product delivery work across browser infrastructure, mobile banking, and SaaS operations.":
    "ブラウザー基盤、モバイルバンキング、SaaS運用にわたるオープンソース開発とプロダクトデリバリーの実績です。",
  "Current build": "開発中",
  "An early-stage, cross-platform browser system spanning a Chromium/Blink patch set, a native SwiftUI shell, a WPE WebKit container, and a focused Rust kiosk runtime.":
    "Chromium/Blinkのパッチセット、SwiftUIネイティブシェル、WPE WebKitコンテナ、Rust製キオスクランタイムで構成するクロスプラットフォーム・ブラウザー基盤です。",
  "Contributed to a secure iOS banking experience spanning authentication, card controls, notifications, and global account views.":
    "認証、カード管理、通知、グローバル口座表示を備えた、安全なiOSバンキング体験の開発に貢献しました。",
  "Coordinated an integrated landing, booking, and HR solution—aligning client needs with design and development delivery.":
    "ランディング、予約、人事管理を統合し、顧客要件とデザイン・開発デリバリーを整合させました。",
  "GITHUB / OPEN SOURCE": "GITHUB / オープンソース",
  "A public lab for systems, mobile, and tooling.": "システム、モバイル、開発ツールの公開ラボ。",
  "653 public repositories, with original work spanning browser runtimes, Swift and Kotlin apps, WSL experiments, developer tooling, and learning archives.":
    "653件の公開リポジトリで、ブラウザーランタイム、Swift・Kotlinアプリ、WSL実験、開発ツール、学習アーカイブを公開しています。",
  "View all repositories": "すべてのリポジトリを見る",
  "Swift · Movie ranking ↗": "Swift · 映画ランキング ↗",
  "Dart · Music chart ↗": "Dart · 音楽チャート ↗",
  "03 / PROJECT ARCHIVE": "03 / プロジェクト一覧",
  "The work, with the context intact.": "背景まで伝わる、プロジェクト実績。",
  "An expandable record of 12 delivery engagements. Client-sensitive findings are intentionally excluded; scope, role, contribution, stack, and team context are preserved.":
    "12件のデリバリー実績を展開形式で掲載しています。顧客機密に関わる所見は除外し、範囲、役割、貢献、技術、チーム構成を記載しています。",
  "Security governance · 2025—2026": "セキュリティガバナンス · 2025—2026",
  "Project Manager": "プロジェクトマネージャー",
  "Coordinated OWASP-aligned assessments for iOS, Android, and Flutter applications across internal FPT projects, from test planning through remediation verification.":
    "FPT社内のiOS・Android・Flutterアプリを対象に、OWASP準拠の評価をテスト計画から是正確認まで統括しました。",
  "Owned assessment plans, vulnerability tracking, risk reporting, stakeholder updates, remediation guidance, and coordination between pentesters and development teams.":
    "評価計画、脆弱性管理、リスク報告、関係者への進捗共有、是正方針、ペンテストチームと開発チームの連携を担当しました。",
  Period: "期間",
  Team: "チーム",
  "20 pentesters": "ペネトレーションテスター20名",
  "4 pentesters · 2 security analysts": "ペネトレーションテスター4名 · セキュリティアナリスト2名",
  "5 pentesters · 2 security analysts": "ペネトレーションテスター5名 · セキュリティアナリスト2名",
  "5 pentesters": "ペネトレーションテスター5名",
  "6 pentesters": "ペネトレーションテスター6名",
  "Managed an end-to-end security assessment of internal retail and automotive-service management systems, focusing on data protection and platform integrity.":
    "小売・自動車サービス向け社内管理システムについて、データ保護とプラットフォーム完全性を重視したセキュリティ評価を一貫して管理しました。",
  "Aligned the testing roadmap with operations, maintained the risk log, supervised portal and API testing, presented business-impact reports, and verified patches with the client IT team.":
    "運用計画とテストロードマップを整合し、リスクログ、ポータル・APIテスト、事業影響レポート、顧客ITチームとの修正確認を管理しました。",
  "Directed a high-compliance audit of Japanese financial-service applications, coordinating international stakeholders and rigorous banking-security requirements.":
    "日本の金融サービスアプリを対象に、高いコンプライアンス要件を満たす監査を指揮し、国際関係者と厳格な銀行セキュリティ要件を調整しました。",
  "Supervised testing of core flows, translated risk into executive and developer-ready reporting, and ensured actionable remediation guidance before deployment.":
    "主要フローのテストを監督し、経営層・開発者向けにリスクを可視化し、導入前に実行可能な是正方針を提示しました。",
  "Led a focused assessment of private LLM infrastructure covering prompt injection, sensitive-data exposure, API controls, and training-pipeline integrity.":
    "プライベートLLM基盤を対象に、プロンプトインジェクション、機密データ露出、API制御、学習パイプラインの完全性を評価しました。",
  "Prioritized AI-specific risks, coordinated guardrails with AI engineers, and produced remediation guidance balancing model capability with enterprise security.":
    "AI固有リスクを優先順位付けし、AIエンジニアとガードレールを整備し、モデル性能と企業セキュリティを両立する是正方針を策定しました。",
  "Managed a time-critical assessment of securities-trading infrastructure and applications, protecting availability, transaction integrity, and user trust.":
    "証券取引基盤とアプリを短期間で評価し、可用性、取引の完全性、利用者の信頼を守るプロジェクトを管理しました。",
  "Tracked vulnerabilities to closure, accelerated collaboration between security and development teams, and delivered risk reports focused on financial impact.":
    "脆弱性を解消まで追跡し、セキュリティ・開発間の連携を促進し、金融影響に焦点を当てたリスク報告を提供しました。",
  "Mobile engineering · 2021—2025": "モバイル開発 · 2021—2025",
  "18 mobile specialists": "モバイル担当18名",
  "40 mobile specialists": "モバイル担当40名",
  "5 mobile specialists": "モバイル担当5名",
  "6 mobile specialists": "モバイル担当6名",
  "14 mobile specialists": "モバイル担当14名",
  "iOS Developer · Lead": "iOS開発者 · リード",
  "Built a multi-market iOS solution: eKYC onboarding for Vietnam and installment-payment management for Australia, designed for secure expansion.":
    "ベトナム向けeKYCとオーストラリア向け分割払い管理を統合し、安全な拡張を想定した複数市場対応iOSソリューションを開発しました。",
  "Estimated and implemented features, wrote unit tests, reviewed code, resolved issues with QA, optimized performance, and maintained regulatory and security compliance.":
    "機能見積もり・実装、ユニットテスト、コードレビュー、QAとの不具合解決、性能改善、法令・セキュリティ準拠を担当しました。",
  "iOS Developer": "iOS開発者",
  "Developed an iOS mobility super app covering ride booking, pickup and drop-off, routing, ecommerce, loyalty, and a business transport marketplace.":
    "配車、乗降地点、経路案内、EC、ロイヤルティ、法人輸送マーケットプレイスを備えたiOSモビリティ・スーパーアプリを開発しました。",
  "Estimated and delivered features, maintained unit tests and source quality, reviewed peer code, and partnered with QA on debugging and performance.":
    "機能の見積もりと提供、ユニットテストと品質維持、コードレビュー、QAと連携したデバッグ・性能改善を行いました。",
  "Delivered an airport staff application for operational planning, task management, and efficient field reporting.":
    "空港スタッフ向けに、運用計画、タスク管理、現場レポートを効率化するアプリを提供しました。",
  "Led iOS implementation across native UIKit flows, embedded WebKit experiences, and REST API integration.":
    "UIKitネイティブ画面、WebKit組み込み体験、REST API連携を含むiOS実装をリードしました。",
  "Mobile Developer · Lead": "モバイル開発者 · リード",
  "Built an academic portal for students and lecturers with timetables, reminders, registration, grades, exams, campus maps, and student activities.":
    "時間割、リマインダー、履修登録、成績、試験、学内マップ、学生活動を備えた学生・教員向けポータルを開発しました。",
  "Led cross-platform delivery and REST integration, including notifications and the transition path from Xamarin toward .NET MAUI.":
    "通知とXamarinから.NET MAUIへの移行を含む、クロスプラットフォーム開発とREST連携をリードしました。",
  "Built an iOS CRM connecting Honda Vietnam customers, dealers, and service centers for warranty lookup, QR scanning, claims, installation, and repair requests.":
    "Honda Vietnamの顧客、販売店、サービス拠点をつなぎ、保証照会、QR読取、保証申請、取付・修理依頼に対応するiOS CRMを開発しました。",
  "Analyzed requirements and led feature implementation across BLE, location services, maps, Core Data, media, and Clean Swift architecture.":
    "要件を分析し、BLE、位置情報、地図、Core Data、メディア、Clean Swift構成の機能実装をリードしました。",
  "Created a luxury jewelry experience with 360-degree product views and AR try-on before an in-store purchase.":
    "360度の商品表示とAR試着により、来店購入前に高級ジュエリーを体験できるアプリを開発しました。",
  "Implemented product presentation and virtual try-on flows across ARKit, UIKit, WebKit, REST services, and push notifications.":
    "ARKit、UIKit、WebKit、RESTサービス、プッシュ通知を用いて商品表示とバーチャル試着を実装しました。",
  "Product operations · 2024—Now": "プロダクト運用 · 2024—現在",
  "06/2024—Present": "06/2024—現在",
  "10 product specialists": "プロダクト担当10名",
  "Managed an integrated customer booking, internal task-governance, and HRM ecosystem for a photo and video editing agency.":
    "写真・動画編集エージェンシー向けに、顧客予約、社内タスク管理、HRMを統合したエコシステムを管理しました。",
  "Orchestrated discovery through deployment, automated client-to-editor assignment, improved scheduling and status visibility, managed resource allocation, and aligned leadership stakeholders.":
    "要件発見から導入までを統括し、顧客から編集者への割当を自動化し、スケジュール・進捗の可視化、リソース配分、経営層との整合を推進しました。",
  "04 / CREDENTIALS + CV": "04 / 資格 + CV",
  "Learning, made visible.": "学びを、実績として見える形に。",
  "Eight core credentials documented in the current CV, with 43 professional credentials available through LinkedIn.":
    "現行CVに記載した主要8資格に加え、LinkedInでは43件の専門資格を確認できます。",
  "The complete professional record.": "職務経歴の全体像。",
  "Three pages covering profile, education, experience, core skills, credentials, and detailed delivery records.":
    "プロフィール、学歴、職歴、主要スキル、資格、詳細なプロジェクト実績を3ページにまとめています。",
  Degree: "学位",
  "N5 · Basic communication": "N5 · 基本的なコミュニケーション",
  "Information Technology Engineer": "情報技術エンジニア",
  "Open CV": "CVを開く",
  "Download PDF": "PDFをダウンロード",
  "View all credentials on LinkedIn ↗": "LinkedInですべての資格を見る ↗",
  "05 / EXPERIENCE": "05 / 職務経歴",
  "From building the product to leading the work.": "製品をつくる立場から、仕事を導く立場へ。",
  "2026 — NOW": "2026 — 現在",
  "Leading software initiatives with an emphasis on clear governance, cross-functional alignment, and reliable delivery.":
    "明確なガバナンス、部門横断の連携、確実なデリバリーを重視し、ソフトウェア施策を推進しています。",
  "Associate Project Manager": "アソシエイトプロジェクトマネージャー",
  "Coordinated short-cycle security advisory and offensive-security projects, supporting scope, monitoring, and on-time outcomes.":
    "短期のセキュリティ助言・攻撃的セキュリティ案件を調整し、スコープ管理、進捗監視、納期達成を支援しました。",
  "2024 — NOW": "2024 — 現在",
  "Operations Project Manager": "オペレーションプロジェクトマネージャー",
  "Connects clients, designers, and developers to move SaaS work from initial brief through market-ready delivery.":
    "顧客、デザイナー、開発者をつなぎ、SaaS案件を初期要件から市場投入可能な状態まで推進しています。",
  "iOS App Developer": "iOSアプリ開発者",
  "Built and maintained user-focused native applications with UIKit and SwiftUI, establishing the technical foundation behind today’s leadership.":
    "UIKitとSwiftUIでユーザー中心のネイティブアプリを開発・保守し、現在のリーダーシップを支える技術基盤を築きました。",
  "Information Technology Lecturer": "情報技術講師",
  "Taught IT and computer science, turning technical concepts into practical learning for the next generation.":
    "ITとコンピューターサイエンスを教え、技術概念を次世代の実践的な学びへ変換しました。",
  "06 / OPERATING SYSTEM": "06 / 仕事の進め方",
  "Clarity is a delivery tool.": "明確さは、デリバリーを支える道具。",
  "My technical background helps me ask better questions. My management practice turns the answers into a system a team can execute.":
    "技術的背景がより良い問いを生み、マネジメントの実践がその答えをチームの実行可能な仕組みに変えます。",
  "Frame the real problem": "本質的な課題を定義する",
  "Translate business intent, user context, and technical constraints into a shared brief.":
    "事業意図、利用者の状況、技術的制約を、共通理解できる要件に変換します。",
  "Make risk visible": "リスクを可視化する",
  "Surface dependencies, security concerns, and delivery tradeoffs before they become surprises.":
    "依存関係、セキュリティ懸念、デリバリー上のトレードオフを早期に明らかにします。",
  "Build a steady rhythm": "安定したリズムをつくる",
  "Use lean rituals, useful artifacts, and honest signals to keep decisions and delivery moving.":
    "簡潔な習慣、有用な成果物、誠実なシグナルで意思決定とデリバリーを前進させます。",
  "Close the learning loop": "学習の循環を閉じる",
  "Treat every release and retrospective as input for a stronger product and a stronger team.":
    "すべてのリリースと振り返りを、より良い製品とチームをつくる入力として扱います。",
  "07 / ABOUT": "07 / プロフィール",
  "Engineer’s depth. Operator’s view. Teacher’s clarity.": "エンジニアの深さ。運用者の視点。教育者の明快さ。",
  "I am a Technical Project Manager with a 5+ year foundation in software engineering. Today I lead iOS-centric and security-focused initiatives at FPT Software, improve product operations at Nodesign, and stay close to the craft through open-source systems work.":
    "ソフトウェアエンジニアとして5年以上の基盤を持つテクニカルプロジェクトマネージャーです。現在はFPT SoftwareでiOS・セキュリティ案件を推進し、Nodesignでプロダクト運用を改善しながら、オープンソースのシステム開発も継続しています。",
  "Across every role, the goal stays the same: build technology that works and teams that thrive.":
    "どの役割でも目標は同じです。確実に機能する技術と、成長できるチームをつくること。",
  "Working vocabulary": "中核スキル",
  "08 / START A CONVERSATION": "08 / お問い合わせ",
  "Have a hard problem?": "難しい課題がありますか？",
  "Let’s make it clear.": "一緒に整理しましょう。",
  "Connect on LinkedIn": "LinkedInでつながる",
  "Built with intent. Hosted on GitHub Pages.": "意図を持って設計し、GitHub Pagesで公開しています。",
  "Back to top ↑": "ページ上部へ ↑",
});

const japaneseAriaTranslations = Object.freeze({
  "Primary navigation": "メインナビゲーション",
  Language: "言語",
  "Profile card": "プロフィールカード",
  "Based in Hanoi, Vietnam, GMT plus seven": "ベトナム・ハノイ在住、GMTプラス7",
  "Profile highlights": "プロフィールの要点",
  Technologies: "使用技術",
});

const japaneseAltTranslations = Object.freeze({
  "Portrait of Nguyễn Đức Tùng Lâm": "Nguyễn Đức Tùng Lâmのポートレート",
});

const setLanguage = (language) => {
  const nextLanguage = ["en", "vi", "jp"].includes(language) ? language : "en";
  const documentLanguage = nextLanguage === "jp" ? "ja" : nextLanguage;

  document.documentElement.lang = documentLanguage;
  document.documentElement.dataset.language = nextLanguage;
  translatableElements.forEach((element) => {
    element.textContent =
      nextLanguage === "jp"
        ? japaneseTranslations[element.dataset.en] ?? element.dataset.en
        : element.dataset[nextLanguage];
  });
  translatableAriaElements.forEach((element) => {
    const translation =
      nextLanguage === "jp"
        ? japaneseAriaTranslations[element.dataset.enAriaLabel] ?? element.dataset.enAriaLabel
        : element.dataset[`${nextLanguage}AriaLabel`];
    element.setAttribute("aria-label", translation);
  });
  translatableAltElements.forEach((element) => {
    const translation =
      nextLanguage === "jp"
        ? japaneseAltTranslations[element.dataset.enAlt] ?? element.dataset.enAlt
        : element.dataset[`${nextLanguage}Alt`];
    element.setAttribute("alt", translation);
  });

  languageOptions?.forEach((option) => {
    const isActive = option.dataset.language === nextLanguage;
    option.classList.toggle("language-active", isActive);
    option.setAttribute("aria-pressed", String(isActive));
  });

  document.title = {
    en: "Lâm Nguyễn — Technical Project Manager",
    vi: "Lâm Nguyễn — Quản lý dự án công nghệ",
    jp: "Lâm Nguyễn — テクニカルプロジェクトマネージャー",
  }[nextLanguage];

  try {
    localStorage.setItem("portfolio-language", nextLanguage);
  } catch {
    // The portfolio still works when storage is unavailable.
  }
};

const getPreferredLanguage = () => {
  try {
    const storedLanguage = localStorage.getItem("portfolio-language");
    if (["en", "vi", "jp"].includes(storedLanguage)) return storedLanguage;
  } catch {
    // Fall through to the browser preference.
  }

  const browserLanguage = navigator.language.toLowerCase();
  if (browserLanguage.startsWith("vi")) return "vi";
  if (browserLanguage.startsWith("ja")) return "jp";
  return "en";
};

setLanguage(getPreferredLanguage());

languageOptions?.forEach((option) => {
  option.addEventListener("click", () => setLanguage(option.dataset.language));
});

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8%", threshold: 0.08 },
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const updateProgress = () => {
  if (!progressBar) return;

  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
  progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
};

window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
updateProgress();

const currentYear = document.querySelector("#current-year");
if (currentYear) currentYear.textContent = String(new Date().getFullYear());
