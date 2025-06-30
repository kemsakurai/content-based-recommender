// テストファイルのインデックス
// Mochaが自動的に実行するためのエントリポイント

// 個別コンポーネントのテスト
import './tokenizers/EnglishTokenizer';
import './tokenizers/JapaneseTokenizer';
import './filters/EnglishTokenFilter';
import './filters/JapaneseTokenFilter';
import './factories/ProcessingPipelineFactory';

// 統合テスト
import './ContentBasedRecommenderImproved';
import './pipeline-integration-test';

// 既存のテスト（後方互換性）
import './ContentBasedRecommender';
