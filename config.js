// ========================================
// SRSアプリ テンプレート設定ファイル（config.js）
// 作成日時: 2026-03-26T01:00:00+09:00
// ========================================
//
// ★ 新しい教材SRSを作るときは、このファイルだけを書き換える。
//   index.html のロジックは一切触らない。
//
// ★ 展開チェックリスト:
//   1. このファイル（config.js）の全項目を新教材に合わせて書き換える
//   2. sw.js の CACHE_NAME を APP_CONFIG.SW_CACHE_NAME と同じ値にする
//   3. manifest.json の name/short_name/theme_color/background_color を合わせる
//   4. icon-192.png / icon-512.png を新デザインに差し替える
//   5. GASコードの SPREADSHEET_ID / SHEET_NAME_DATA / SHEET_NAME_META を書き換える
//   6. GASをデプロイし、取得したURLを GAS_URL に設定する
//
// ========================================

var APP_CONFIG = {

  // ================================
  // 1. アプリ識別（★最重要: ここが他教材と重複するとデータ破壊）
  // ================================

  // アプリ名（ホーム画面に大きく表示される）
  APP_NAME: "ネクステ SRS",

  // localStorageキー（★教材ごとに必ず一意にすること）
  STORAGE_KEY: "nextstage-srs-v1",

  // JSONエクスポート時のファイル名接頭辞
  EXPORT_PREFIX: "nextstage-srs",

  // Service Workerキャッシュ名（★sw.jsのCACHE_NAMEと手動で一致させる）
  SW_CACHE_NAME: "nextstage-srs-v1",

  // ================================
  // 2. クラウド同期
  // ================================

  // GAS デプロイURL（空文字ならローカルのみ動作）
  GAS_URL: "https://script.google.com/macros/s/AKfycbzS1xszZqOo8-iHTcGnVroWudbWT-Wlfm9KVZ2qNVDENLaQP3dvU3ubr_vzxedApwDOJw/exec",

  // ================================
  // 3. 配色（表紙 #E0A000 アンバーオレンジから生成、目に優しいトーン）
  // ================================

  COLORS: {
    // ページ背景
    pageBg:        "#FFF8E1",   // ウォームクリーム（amber-50）
    cardBorder:    "#FFE0B2",   // ライトアンバー（amber-100）
    cardBg:        "#FFFFFF",   // 白

    // テキスト（コントラスト比: textPrimary 5.3:1, textSecondary 3.6:1 on #FFF8E1）
    textPrimary:   "#BF360C",   // ディープオレンジ900（見出し・重要テキスト）
    textSecondary: "#E65100",   // ディープオレンジ800（ラベル・説明文）
    textMuted:     "#FFB74D",   // アンバー300（注釈・ヒント）

    // ボタン（白文字コントラスト 4.4:1 on #D84315）
    btnPrimaryBg:  "#D84315",   // ディープオレンジ700（メインボタン）
    btnPrimaryFg:  "#FFFFFF",
    btnSecondaryBg:"#FFFFFF",
    btnSecondaryFg:"#E65100",   // サブボタン文字
    btnSecondaryBorder: "#FFE0B2",

    // 入力欄
    inputBorder:   "#FFE0B2",
    inputBg:       "#FFFFFF",

    // ステータス
    statusOk:      "#D84315",
    statusError:   "#C62828",
    statusMuted:   "#FFB74D",

    // 復習判定ボタン（×△は共通、○◎はテーマカラー）
    judgeCorrectBg:     "#FFF3E0",
    judgeCorrectFg:     "#BF360C",
    judgeCorrectBorder: "#FFE0B2",
    judgeEasyBg:        "#FFF8E1",
    judgeEasyFg:        "#E65100",
    judgeEasyBorder:    "#FFCC80",

    // バッジ
    badgeNewBg:     "#FFF3E0",
    badgeNewFg:     "#E65100",
    badgeGradBg:    "#FFF3E0",
    badgeGradFg:    "#BF360C",
    badgeNeutralBg: "#F5F5F5",
    badgeNeutralFg: "#999999",
    badgePendingBg: "#FFF8E1",
    badgePendingFg: "#FFB74D",

    // 設定画面
    gasOkBg:  "#FFF3E0",
    gasOkFg:  "#BF360C",
    gasWarnBg:"#FEF3C7",
    gasWarnFg:"#92400E",
    codeBg:   "#FFF3E0",
    diagBg:   "#FFF3E0",
    diagFg:   "#D84315",
    diagBorder:"#FFE0B2",
  },

  // ================================
  // 4. UI文言
  // ================================
  LABELS: {
    unitName:      "\u554f\u984c",             // 問題
    registerBtn:   "\u554f\u984c\u3092\u767b\u9332\u3059\u308b",   // 問題を登録する
    registerTitle: "\u554f\u984c\u3092\u767b\u9332",               // 問題を登録
    idLabel:       "\u554f\u984c\u8b58\u5225\u5b50",               // 問題識別子
    idPlaceholder: "\u4f8b\uff1a42\u3001P45-3\u3001\u6587\u6cd512", // 例：42、P45-3、文法12
    idHint:        "\u30dd\u30a4\u30f3\u30c8\u756a\u53f7\u3001\u30da\u30fc\u30b8\u756a\u53f7+\u554f\u984c\u756a\u53f7\u306a\u3069\u81ea\u7531\u306b\u5165\u529b\u3067\u304d\u307e\u3059", // ポイント番号、ページ番号+問題番号など自由に入力できます
    listTitle:     "\u767b\u9332\u4e00\u89a7",                     // 登録一覧
    listUnit:      "\u4ef6",                                       // 件
    csvTitle:      "\u307e\u3068\u3081\u3066\u53d6\u308a\u8fbc\u307f", // まとめて取り込み
    reviewUnit:    "\u554f",                                       // 問
    cardHint:      "\u30cd\u30af\u30b9\u30c6\u3067\u78ba\u8a8d\u3057\u3066\u5224\u5b9a\u3057\u3066\u304f\u3060\u3055\u3044", // ネクステで確認して判定してください
    searchPlaceholder: "\u8b58\u5225\u5b50\u3067\u691c\u7d22",     // 識別子で検索
  },
};
