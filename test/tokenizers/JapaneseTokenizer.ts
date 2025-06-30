import { expect } from 'chai';
import { JapaneseTokenizer } from '../../src/lib/tokenizers/JapaneseTokenizer';

describe('JapaneseTokenizer', () => {
  let tokenizer: JapaneseTokenizer;

  beforeEach(() => {
    tokenizer = new JapaneseTokenizer();
  });

  describe('tokenize()', () => {
    it('HTMLタグが正しく除去されること', async () => {
      const text = '<p>これは<strong>テスト</strong>です</p>';
      const tokens = await tokenizer.tokenize(text);

      // HTMLタグが含まれていないことを確認
      const joinedTokens = tokens.join(' ');
      expect(joinedTokens).to.not.include('<p>');
      expect(joinedTokens).to.not.include('<strong>');
      expect(joinedTokens).to.not.include('</strong>');
      expect(joinedTokens).to.not.include('</p>');
    });

    it('日本語テキストが正しくトークン化されること', async () => {
      const text = 'JavaScriptプログラミングは楽しいです';
      const tokens = await tokenizer.tokenize(text);

      expect(tokens).to.be.an('array');
      expect(tokens.length).to.be.greaterThan(0);

      // 期待される単語が含まれることを確認
      expect(tokens).to.include('JavaScript');
      expect(tokens).to.include('プログラミング');
      expect(tokens).to.include('楽しい');
    });

    it('基本形が優先されること', async () => {
      const text = '走ります';
      const tokens = await tokenizer.tokenize(text);

      expect(tokens).to.be.an('array');
      expect(tokens.length).to.be.greaterThan(0);

      // 基本形（走る）が取得されることを確認
      expect(tokens).to.include('走る');
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

    it('複雑な日本語文章が処理できること', async () => {
      const text = '機械学習アルゴリズムを使って自然言語処理を行います。';
      const tokens = await tokenizer.tokenize(text);

      expect(tokens).to.be.an('array');
      expect(tokens.length).to.be.greaterThan(0);

      // 期待される単語が含まれることを確認
      expect(tokens).to.include('機械');
      expect(tokens).to.include('学習');
      expect(tokens).to.include('アルゴリズム');
      expect(tokens).to.include('自然');
      expect(tokens).to.include('言語');
      expect(tokens).to.include('処理');
      expect(tokens).to.include('行う');
    });
  });

  describe('getDetailedTokens()', () => {
    it('詳細な形態素解析結果が取得できること', async () => {
      const text = 'プログラミング言語';
      const detailedTokens = await tokenizer.getDetailedTokens(text);

      expect(detailedTokens).to.be.an('array');
      expect(detailedTokens.length).to.be.greaterThan(0);

      // 各トークンが必要なプロパティを持つことを確認
      detailedTokens.forEach((token) => {
        expect(token).to.have.property('surface_form');
        expect(token).to.have.property('pos');
        expect(token).to.have.property('basic_form');
      });
    });

    it('品詞情報が取得できること', async () => {
      const text = '美しい花が咲く';
      const detailedTokens = await tokenizer.getDetailedTokens(text);

      expect(detailedTokens).to.be.an('array');
      expect(detailedTokens.length).to.be.greaterThan(0);

      // 品詞情報が含まれることを確認
      const posTypes = detailedTokens.map(token => token.pos);
      expect(posTypes).to.include('形容詞');
      expect(posTypes).to.include('名詞');
      expect(posTypes).to.include('動詞');
    });

    it('HTMLタグが除去された状態で解析されること', async () => {
      const text = '<span>技術</span>について';
      const detailedTokens = await tokenizer.getDetailedTokens(text);

      // HTMLタグ関連の表層形が含まれていないことを確認
      const surfaceForms = detailedTokens.map(token => token.surface_form);
      expect(surfaceForms).to.not.include('<span>');
      expect(surfaceForms).to.not.include('</span>');
      expect(surfaceForms).to.include('技術');
    });
  });
});
