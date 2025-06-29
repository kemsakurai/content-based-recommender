import ContentBasedRecommender from './src/lib/ContentBasedRecommender';

/**
 * 日本語形態素解析の詳細デバッグ
 */

async function debugJapaneseProcessing() {
  console.log('日本語形態素解析の詳細デバッグを開始...');

  const recommender = new ContentBasedRecommender({
    language: 'ja',
    debug: false,
    minScore: 0.0,
  });

  // recommender内のプライベートメソッドを直接テスト
  const testText = 'JavaScriptプログラミングは楽しいです';
  console.log('テストテキスト:', testText);

  try {
    // プライベートメソッドを直接呼び出すため、any型でキャスト
    const tokens = await (recommender as any)._getJapaneseTokens(testText);
    console.log('抽出されたトークン:', tokens);

    if (tokens.length === 0) {
      console.log('警告: トークンが生成されていません');
    }

    // より多くの文書でテスト
    const documents = [
      {
        id: '1',
        content: 'JavaScriptプログラミングは楽しいです',
      },
      {
        id: '2',
        content: 'JavaScript開発の基礎知識を学びます',
      },
      {
        id: '3',
        content: 'プログラミング言語の比較検討',
      },
    ];

    console.log('\n各文書のトークン化結果:');
    for (const doc of documents) {
      const docTokens = await (recommender as any)._getJapaneseTokens(doc.content);
      console.log(`文書 ${doc.id}: "${doc.content}" -> [${docTokens.join(', ')}]`);
    }

    console.log('\n学習開始...');
    await recommender.train(documents);

    console.log('\n類似度結果:');
    for (const doc of documents) {
      const similarities = recommender.getSimilarDocuments(doc.id);
      console.log(`文書 ${doc.id} の類似文書:`, similarities);
    }

  } catch (error) {
    console.error('エラー:', error);
  }
}

debugJapaneseProcessing();
