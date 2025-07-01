import { Document } from '../src/types/index.js';

/**
 * サンプル文書タグデータ
 * 双方向学習でのタグ付けシステムのテストに使用される文書の配列
 */
const sampleDocumentTags: Document[] = [
  {
    id: '1',
    content: 'Javascript',
  },
  {
    id: '2',
    content: 'machine learning',
  },
  {
    id: '3',
    content: 'application',
  },
  {
    id: '4',
    content: 'introduction',
  },
  {
    id: '5',
    content: 'future',
  },
  {
    id: '6',
    content: 'Python',
  },
  {
    id: '7',
    content: 'Bitcoin',
  },
];

export default sampleDocumentTags;
