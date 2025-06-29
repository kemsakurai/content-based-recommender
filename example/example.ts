import ContentBasedRecommender from '../src/lib/ContentBasedRecommender';
import { Document } from '../src/types';
import posts from '../fixtures/sample-documents';
import tags from '../fixtures/sample-document-tags';

/**
 * Content-Based Recommenderの使用例
 * 双方向学習を使用して投稿と関連タグの推薦を実行
 */

// タグのマッピングを作成（IDからタグオブジェクトへの変換用）
const tagMap = tags.reduce((acc: Record<string, Document>, tag: Document) => {
  acc[tag.id] = tag;
  return acc;
}, {});

// 推薦システムのインスタンスを作成
const recommender = new ContentBasedRecommender();

// 双方向学習を実行（投稿とタグ間の類似度を計算）
recommender.trainBidirectional(posts, tags);

// 各投稿に対して関連タグを取得・表示
for (const post of posts) {
  const relatedTags = recommender.getSimilarDocuments(post.id);
  const tagNames = relatedTags.map(t => tagMap[t.id].content);
  console.log(post.content, 'related tags:', tagNames);
}
