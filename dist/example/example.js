"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ContentBasedRecommender_1 = __importDefault(require("../lib/ContentBasedRecommender"));
const sample_documents_1 = __importDefault(require("../fixtures/sample-documents"));
const sample_document_tags_1 = __importDefault(require("../fixtures/sample-document-tags"));
/**
 * Content-Based Recommenderの使用例
 * 双方向学習を使用して投稿と関連タグの推薦を実行
 */
// タグのマッピングを作成（IDからタグオブジェクトへの変換用）
const tagMap = sample_document_tags_1.default.reduce((acc, tag) => {
    acc[tag.id] = tag;
    return acc;
}, {});
// 推薦システムのインスタンスを作成
const recommender = new ContentBasedRecommender_1.default();
// 双方向学習を実行（投稿とタグ間の類似度を計算）
recommender.trainBidirectional(sample_documents_1.default, sample_document_tags_1.default);
// 各投稿に対して関連タグを取得・表示
for (const post of sample_documents_1.default) {
    const relatedTags = recommender.getSimilarDocuments(post.id);
    const tagNames = relatedTags.map(t => tagMap[t.id].content);
    console.log(post.content, 'related tags:', tagNames);
}
//# sourceMappingURL=example.js.map