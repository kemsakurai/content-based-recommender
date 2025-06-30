import { expect } from 'chai';
import ContentBasedRecommender from '../src/lib/ContentBasedRecommender';

describe('Pipeline Integration Tests', () => {
  describe('ContentBasedRecommender Integration Tests', () => {
    it('英語での推薦が正しく動作する', async () => {
      const englishRecommender = new ContentBasedRecommender({ language: 'en' });
      const englishDocuments = [
        { id: '1', content: 'Machine learning algorithms for data analysis' },
        { id: '2', content: 'Deep learning neural networks' },
        { id: '3', content: 'Natural language processing techniques' },
        { id: '4', content: 'Data mining and machine learning' }
      ];

      await englishRecommender.train(englishDocuments);
      const englishSimilar = englishRecommender.getSimilarDocuments('1');

      expect(englishSimilar).to.be.an('array');
      expect(englishSimilar.length).to.be.greaterThan(0);

      // 類似文書が正しく計算されていることを確認
      const firstSimilar = englishSimilar[0];
      expect(firstSimilar).to.have.property('id');
      expect(firstSimilar).to.have.property('score');
      expect(firstSimilar.score).to.be.a('number');
      expect(firstSimilar.score).to.be.greaterThan(0);
      expect(firstSimilar.score).to.be.lessThanOrEqual(1);
    });

    it('日本語での推薦が正しく動作する', async () => {
      const japaneseRecommender = new ContentBasedRecommender({ language: 'ja' });
      const japaneseDocuments = [
        { id: '1', content: '機械学習は、データ分析の強力なツールです' },
        { id: '2', content: 'ディープラーニングとニューラルネットワーク' },
        { id: '3', content: '自然言語処理の技術について' },
        { id: '4', content: 'データマイニングと機械学習の応用' }
      ];

      await japaneseRecommender.train(japaneseDocuments);
      const japaneseSimilar = japaneseRecommender.getSimilarDocuments('1');

      expect(japaneseSimilar).to.be.an('array');
      expect(japaneseSimilar.length).to.be.greaterThan(0);

      // 類似文書が正しく計算されていることを確認
      const firstSimilar = japaneseSimilar[0];
      expect(firstSimilar).to.have.property('id');
      expect(firstSimilar).to.have.property('score');
      expect(firstSimilar.score).to.be.a('number');
      expect(firstSimilar.score).to.be.greaterThan(0);
      expect(firstSimilar.score).to.be.lessThanOrEqual(1);
    }).timeout(10000);

    it('言語切り替えが正しく動作する', async () => {
      const recommender = new ContentBasedRecommender({ language: 'en' });

      // 最初は英語
      expect(recommender['options'].language).to.equal('en');

      // 日本語に切り替え
      recommender.setOptions({ language: 'ja' });
      expect(recommender['options'].language).to.equal('ja');

      // パイプラインが更新されていることを確認（間接的に）
      const japaneseDocuments = [
        { id: '1', content: '機械学習の基礎' },
        { id: '2', content: 'データ分析手法' }
      ];

      // エラーなく学習できることを確認
      try {
        await recommender.train(japaneseDocuments);
        expect(true).to.be.true; // 成功した場合
      } catch (error) {
        expect.fail(`Japanese training should not throw an error: ${error}`);
      }
    }).timeout(10000);
  });
});
