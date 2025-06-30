import { expect } from 'chai';
import { ProcessingPipelineFactory } from '../../src/lib/factories/ProcessingPipelineFactory';
import { EnglishTokenizer } from '../../src/lib/tokenizers/EnglishTokenizer';
import { JapaneseTokenizer } from '../../src/lib/tokenizers/JapaneseTokenizer';
import { EnglishTokenFilter } from '../../src/lib/filters/EnglishTokenFilter';
import { JapaneseTokenFilter } from '../../src/lib/filters/JapaneseTokenFilter';

describe('ProcessingPipelineFactory', () => {
  describe('createPipeline', () => {
    it('英語用パイプラインが正しく作成される', () => {
      const pipeline = ProcessingPipelineFactory.createPipeline('en');

      expect(pipeline.tokenizer).to.be.instanceOf(EnglishTokenizer);
      expect(pipeline.filter).to.be.instanceOf(EnglishTokenFilter);
    });

    it('日本語用パイプラインが正しく作成される', () => {
      const pipeline = ProcessingPipelineFactory.createPipeline('ja');

      expect(pipeline.tokenizer).to.be.instanceOf(JapaneseTokenizer);
      expect(pipeline.filter).to.be.instanceOf(JapaneseTokenFilter);
    });

    it('デフォルトは英語パイプラインが作成される', () => {
      const pipeline = ProcessingPipelineFactory.createPipeline();

      expect(pipeline.tokenizer).to.be.instanceOf(EnglishTokenizer);
      expect(pipeline.filter).to.be.instanceOf(EnglishTokenFilter);
    });

    it('フィルターオプションが正しく渡される', () => {
      const options = {
        minTokenLength: 3,
        removeStopwords: false
      };

      const pipeline = ProcessingPipelineFactory.createPipeline('en', options);

      expect(pipeline.tokenizer).to.be.instanceOf(EnglishTokenizer);
      expect(pipeline.filter).to.be.instanceOf(EnglishTokenFilter);

      // フィルターオプションがフィルターに正しく渡されているかテスト
      const tokens = ['a', 'cat', 'the', 'programming'];
      const filtered = pipeline.filter.filter(tokens);

      // minTokenLength: 3なので'a'は除去される
      expect(filtered).to.not.include('a');
      // removeStopwords: falseなので'the'は残る
      expect(filtered).to.include('the');
      expect(filtered).to.include('cat');
      expect(filtered).to.include('programming');
    });
  });

  describe('createTokenizer', () => {
    it('英語トークナイザーを正しく生成すること', () => {
      const tokenizer = ProcessingPipelineFactory.createTokenizer('en');

      expect(tokenizer).to.be.instanceOf(EnglishTokenizer);
    });

    it('日本語トークナイザーを正しく生成すること', () => {
      const tokenizer = ProcessingPipelineFactory.createTokenizer('ja');

      expect(tokenizer).to.be.instanceOf(JapaneseTokenizer);
    });

    it('サポートされていない言語でエラーが発生すること', () => {
      expect(() => {
        // @ts-ignore - テスト用に型チェックを無視
        ProcessingPipelineFactory.createTokenizer('fr');
      }).to.throw('Unsupported language: fr');
    });

    it('生成されたトークナイザーが正しく動作すること', async () => {
      const englishTokenizer = ProcessingPipelineFactory.createTokenizer('en');
      const japaneseTokenizer = ProcessingPipelineFactory.createTokenizer('ja');

      // 英語トークナイザーのテスト
      const englishTokens = await englishTokenizer.tokenize('programming language');
      expect(englishTokens).to.be.an('array');
      expect(englishTokens.length).to.be.greaterThan(0);

      // 日本語トークナイザーのテスト
      const japaneseTokens = await japaneseTokenizer.tokenize('プログラミング言語');
      expect(japaneseTokens).to.be.an('array');
      expect(japaneseTokens.length).to.be.greaterThan(0);
    });

    it('各言語で異なるインスタンスが生成されること', () => {
      const tokenizer1 = ProcessingPipelineFactory.createTokenizer('en');
      const tokenizer2 = ProcessingPipelineFactory.createTokenizer('en');
      const japaneseTokenizer = ProcessingPipelineFactory.createTokenizer('ja');

      // 同じ言語でも異なるインスタンス
      expect(tokenizer1).to.not.equal(tokenizer2);

      // 異なる言語では異なるタイプ
      expect(tokenizer1).to.not.be.instanceOf(JapaneseTokenizer);
      expect(japaneseTokenizer).to.not.be.instanceOf(EnglishTokenizer);
    });
  });
});
