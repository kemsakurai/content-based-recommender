import * as kuromoji from 'kuromoji';

/**
 * kuromojiライブラリの直接テスト
 */

async function testKuromoji() {
  console.log('kuromojiライブラリのテストを開始...');

  return new Promise((resolve, reject) => {
    kuromoji.builder({ dicPath: 'node_modules/kuromoji/dict' }).build((err, tokenizer) => {
      if (err) {
        console.error('kuromoji初期化エラー:', err);
        reject(err);
        return;
      }

      console.log('kuromoji初期化成功');

      const text = 'JavaScriptプログラミングは楽しいです';
      console.log('テストテキスト:', text);

      const tokens = tokenizer.tokenize(text);
      console.log('形態素解析結果:');

      tokens.forEach(token => {
        console.log(`- 表層形: ${token.surface_form}, 品詞: ${token.pos}, 基本形: ${token.basic_form}`);
      });

      // 名詞、動詞、形容詞のみを抽出
      const filteredTokens = tokens
        .filter(token => {
          const pos = token.pos;
          return ['名詞', '動詞', '形容詞'].includes(pos) &&
                 (token.basic_form?.length || 0) > 1 &&
                 !/^[ひらがな]$/.test(token.basic_form || token.surface_form);
        })
        .map(token => token.basic_form || token.surface_form);

      console.log('フィルタリング後のトークン:', filteredTokens);
      console.log('重複除去後:', [...new Set(filteredTokens)]);

      resolve(null);
    });
  });
}

testKuromoji().catch(console.error);
