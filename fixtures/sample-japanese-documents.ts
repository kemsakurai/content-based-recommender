import { Document } from '../src/types';

/**
 * サンプル日本語文書データ
 * 日本語形態素解析機能のテストに使用される文書の配列
 */
const sampleJapaneseDocuments: Document[] = [
  {
    id: 'jp1000001',
    content: 'JavaScriptプログラミングは楽しいです',
  },
  {
    id: 'jp1000002',
    content: '機械学習におけるJavaScriptの活用について',
  },
  {
    id: 'jp1000003',
    content: 'Pythonと機械学習の応用事例',
  },
  {
    id: 'jp1000004',
    content: '自然言語処理と形態素解析の基礎知識',
  },
  {
    id: 'jp1000005',
    content: 'ディープラーニングフレームワークの比較検討',
  },
  {
    id: 'jp1000006',
    content: 'データサイエンスとビッグデータ解析',
  },
  {
    id: 'jp1000007',
    content: 'ウェブ開発におけるReactとVue.jsの特徴',
  },
  {
    id: 'jp1000008',
    content: 'ブロックチェーン技術とビットコインの未来',
  },
];

export default sampleJapaneseDocuments;
