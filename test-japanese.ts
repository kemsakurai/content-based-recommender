import ContentBasedRecommender from './src/lib/ContentBasedRecommender';

/**
 * 日本語形態素解析機能の詳細テスト
 */

async function testJapaneseProcessing() {
  console.log('日本語形態素解析のテストを開始...');

  try {
    const recommender = new ContentBasedRecommender({
      language: 'ja',
      debug: true,
      minScore: 0.0, // 最小スコアを0にして全ての結果を見る
    });

    const japaneseDocuments = [
      {
        id: '1',
        content: 'JavaScriptプログラミングは楽しいです',
      },
      {
        id: '2',
        content: '機械学習におけるJavaScriptの活用について',
      },
      {
        id: '3',
        content: 'JavaScript開発の基礎知識',
      },
    ];

    console.log('学習を開始...');
    await recommender.train(japaneseDocuments);
    console.log('学習が完了しました');

    for (const doc of japaneseDocuments) {
      const similarities = recommender.getSimilarDocuments(doc.id);
      console.log(`文書 ${doc.id} の類似文書:`, similarities);
    }

    console.log('テスト完了');
  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
}

testJapaneseProcessing();
