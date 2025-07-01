import { expect } from 'chai';
import { EnglishTokenizer } from '../../src/lib/tokenizers/EnglishTokenizer.js';

describe('EnglishTokenizer', () => {
  let tokenizer: EnglishTokenizer;

  beforeEach(() => {
    tokenizer = new EnglishTokenizer();
  });

  describe('tokenize()', () => {
    it('HTMLタグが正しく除去されること', async () => {
      const text = '<p>This is a <strong>test</strong> document</p>';
      const tokens = await tokenizer.tokenize(text);

      // HTMLタグが含まれていないことを確認
      const joinedTokens = tokens.join(' ');
      expect(joinedTokens).to.not.include('<p>');
      expect(joinedTokens).to.not.include('<strong>');
      expect(joinedTokens).to.not.include('</strong>');
      expect(joinedTokens).to.not.include('</p>');
    });

    it('小文字化が正しく行われること', async () => {
      const text = 'Programming JavaScript Node.js';
      const tokens = await tokenizer.tokenize(text);

      // すべてのトークンが小文字になっていることを確認
      tokens.forEach((token: string) => {
        if (token.includes('_')) {
          // N-gramの場合、分割して確認
          const parts = token.split('_');
          parts.forEach((part: string) => {
            expect(part).to.equal(part.toLowerCase());
          });
        } else {
          expect(token).to.equal(token.toLowerCase());
        }
      });
    });

    it('ユニグラム、バイグラム、トライグラムが生成されること', async () => {
      const text = 'machine learning algorithm';
      const tokens = await tokenizer.tokenize(text);

      // ユニグラムの確認
      expect(tokens).to.include('machin'); // stemmed version of "machine"
      expect(tokens).to.include('learn');  // stemmed version of "learning"
      expect(tokens).to.include('algorithm');

      // バイグラムの確認（N-gramは_で結合される）
      const bigrams = tokens.filter((token: string) => token.includes('_') && token.split('_').length === 2);
      expect(bigrams.length).to.be.greaterThan(0);

      // トライグラムの確認
      const trigrams = tokens.filter((token: string) => token.includes('_') && token.split('_').length === 3);
      expect(trigrams.length).to.be.greaterThan(0);
    });

    it('空文字列に対して空配列を返すこと', async () => {
      const tokens = await tokenizer.tokenize('');
      expect(tokens).to.be.an('array');
      expect(tokens).to.have.length(0);
    });

    it('スペースのみの文字列に対して空配列を返すこと', async () => {
      const tokens = await tokenizer.tokenize('   ');
      expect(tokens).to.be.an('array');
      expect(tokens).to.have.length(0);
    });

    it('ステミング処理が正しく行われること', async () => {
      const text = 'running runner runs';
      const tokens = await tokenizer.tokenize(text);

      // 語幹が統一されることを確認
      expect(tokens).to.include('run'); // 'running', 'runner', 'runs' の語幹
    });

    it('単一単語でも処理できること', async () => {
      const text = 'programming';
      const tokens = await tokenizer.tokenize(text);

      expect(tokens).to.be.an('array');
      expect(tokens.length).to.be.greaterThan(0);
      expect(tokens).to.include('program'); // stemmed version
    });

    it('特殊文字が含まれたテキストも処理できること', async () => {
      const text = 'Hello, world! How are you?';
      const tokens = await tokenizer.tokenize(text);

      expect(tokens).to.be.an('array');
      expect(tokens.length).to.be.greaterThan(0);

      // 句読点は除去されることを確認
      tokens.forEach((token: string) => {
        expect(token).to.not.include(',');
        expect(token).to.not.include('!');
        expect(token).to.not.include('?');
      });
    });
  });
});
