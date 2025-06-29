# Content-Based Recommender - GitHub Copilot Instructions

## プロジェクト概要

このプロジェクトは、TypeScriptで実装されたコンテンツベース推薦システムライブラリです。TF-IDF（Term Frequency-Inverse Document Frequency）とコサイン類似度を使用して、文書間の類似性を計算し、類似したアイテムを推薦します。英語と日本語の両方に対応した多言語サポート機能を備えています。

## 主要技術スタック

- **言語**: TypeScript (Node.js)
- **機械学習アルゴリズム**: TF-IDF、コサイン類似度
- **自然言語処理**:
  - **英語**: トークン化（natural.WordTokenizer）、ステミング（Porter Stemmer）、ストップワード除去、N-gram（unigram, bigram, trigram）
  - **日本語**: 形態素解析（kuromoji）、品詞フィルタリング（名詞、動詞、形容詞）
- **主要依存関係**:
  - `natural`: 英語自然言語処理機能
  - `kuromoji`: 日本語形態素解析
  - `vector-object`: ベクトル演算
  - `striptags`: HTMLタグの除去
  - `stopword`: ストップワードの除去
  - `underscore`: ユーティリティ関数

## アーキテクチャ

### ファイル構造
```
├── index.ts                           # メインエントリーポイント
├── src/
│   ├── lib/ContentBasedRecommender.ts # 推薦システムのコアクラス
│   ├── types/index.ts                 # TypeScript型定義
│   ├── example/example.ts             # 使用例
│   ├── fixtures/                      # テストデータ
│   │   ├── sample-documents.ts
│   │   ├── sample-document-tags.ts
│   │   ├── sample-target-documents.ts
│   │   └── sample-japanese-documents.ts  # 日本語テストデータ
│   └── test/ContentBasedRecommender.ts   # ユニットテスト
├── tsconfig.json                      # TypeScript設定
└── eslint.config.js                   # ESLint設定（v9対応）
```

### コアクラス: ContentBasedRecommender

#### 主要メソッド
- `constructor(options)`: インスタンス初期化
- `train(documents)`: 単一コレクションの学習（非同期）
- `trainBidirectional(collectionA, collectionB)`: 双方向学習（異なるコレクション間、非同期）
- `getSimilarDocuments(id, start, size)`: 類似文書の取得
- `export()` / `import(object)`: モデルの保存・読み込み

#### 設定オプション
- `maxVectorSize`: ワードベクトルの最大サイズ（デフォルト: 100）
- `maxSimilarDocuments`: 保持する類似文書の最大数
- `minScore`: 類似度の最小閾値（0-1）
- `debug`: デバッグモードの有効化
- `language`: 使用する言語（デフォルト: 'en'、日本語: 'ja'）

## アルゴリズムフロー

1. **前処理** (`_preprocessDocuments`)
   - HTMLタグの除去
   - 小文字化
   - トークン化
   - ストップワードの除去
   - ステミング処理
   - N-gram（unigram, bigram, trigram）の生成

2. **ベクトル化** (`_produceWordVectors`)
   - TF-IDFによる重み付け
   - ベクトルオブジェクトの生成

3. **類似度計算** (`_calculateSimilarities`)
   - コサイン類似度の計算
   - スコアによるフィルタリング
   - 降順ソート

## 開発ガイドライン

### コーディング規約
- ESLint (airbnb-base) に準拠
- クラスメソッドには `this` を使用
- プライベートメソッドには `_` プレフィックスを使用
- コンソール出力は `debug` オプション使用時のみ

### テスト要件
- Mocha + Chaiを使用
- オプション検証のテスト
- 文書検証のテスト
- 学習結果の検証
- エクスポート/インポート機能のテスト
- 日本語形態素解析機能のテスト

### パフォーマンス考慮事項
- `maxVectorSize` による計算量制御
- `minScore` による低スコア文書のフィルタリング
- `maxSimilarDocuments` によるメモリ使用量制御

## 使用例

### 基本的な使用方法（英語）
```javascript
const ContentBasedRecommender = require('content-based-recommender');

const recommender = new ContentBasedRecommender({
  minScore: 0.1,
  maxSimilarDocuments: 100
});

const documents = [
  { id: '1', content: 'JavaScript programming tutorial' },
  { id: '2', content: 'Machine learning with Python' }
];

await recommender.train(documents);
const similar = recommender.getSimilarDocuments('1');
```

### 日本語での使用方法
```typescript
const recommender = new ContentBasedRecommender({
  language: 'ja',
  minScore: 0.1
});

const japaneseDocuments = [
  { id: '1', content: 'JavaScriptプログラミングは楽しいです' },
  { id: '2', content: 'プログラミング言語の比較検討' }
];

await recommender.train(japaneseDocuments);
const similar = recommender.getSimilarDocuments('1');
// 結果: [{ id: '2', score: 0.22028815056182968 }]
```

### 双方向学習（タグ付けシステム）
```javascript
await recommender.trainBidirectional(posts, tags);
const relatedTags = recommender.getSimilarDocuments(postId);
```

## 機能拡張時の注意点

1. **新しいオプション追加時**
   - `setOptions` メソッドでの検証ロジック追加
   - `defaultOptions` の更新
   - テストケースの追加

2. **前処理機能拡張時**
   - `_getTokensFromString` メソッドの修正
   - 言語固有の処理を考慮
   - 日本語の場合は`_getJapaneseTokens`メソッドで形態素解析

3. **類似度計算アルゴリズム変更時**
   - `_calculateSimilarities` メソッドの修正
   - 既存テストとの互換性確認

## デバッグとトラブルシューティング

- `debug: true` オプションで進行状況を監視
- 大規模データセットでのパフォーマンステストが未実施
- メモリ使用量に注意（`maxSimilarDocuments`, `minScore` で制御）

## NPMパッケージ情報

- パッケージ名: `content-based-recommender`
- バージョン: 1.6.0
- ライセンス: MIT
- 作者: Stanley Fok
- リポジトリ: https://github.com/stanleyfok/content-based-recommender

## CI/CD

- GitHub ActionsでNode.js CIを実行
- 複数のNode.jsバージョン（10.x～14.x）でテスト
- NPMパッケージの自動公開設定済み
コメントは日本語で記述してください。
変数名と関数名は英語でキャメルケースを使用してください。
プライベートメソッドには '_' プレフィックスを使用してください。
ESLint設定に従ってコードを記述してください。
関数には適切なJSDocコメントを付けてください。
