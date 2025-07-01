import { expect } from 'chai';
import { JapaneseTokenFilter } from '../../src/lib/filters/JapaneseTokenFilter.js';
import { DetailedJapaneseToken } from '../../src/types/index.js';

describe('JapaneseTokenFilter', () => {
  let filter: JapaneseTokenFilter;

  beforeEach(() => {
    filter = new JapaneseTokenFilter();
  });

  describe('filter method', () => {
    it('基本的なフィルタリングが正しく動作する', () => {
      const tokens = ['こんにちは', 'プログラミング', 'は', '楽しい', 'です'];
      const result = filter.filter(tokens);

      // 日本語ストップワード'は'は除去される
      expect(result).to.not.include('は');
      expect(result).to.include('プログラミング');
      expect(result).to.include('楽しい');
    });

    it('最小長フィルタリングが正しく動作する', () => {
      const filterWithMinLength = new JapaneseTokenFilter({ minTokenLength: 2 });
      const tokens = ['あ', 'い', 'プログラミング', '楽しい'];
      const result = filterWithMinLength.filter(tokens);

      // 2文字未満は除去される
      expect(result).to.not.include('あ');
      expect(result).to.not.include('い');
      expect(result).to.include('プログラミング');
      expect(result).to.include('楽しい');
    });

    it('重複除去が正しく動作する', () => {
      const tokens = ['プログラミング', '楽しい', 'プログラミング'];
      const result = filter.filter(tokens);

      // 重複は除去される
      expect(result.filter(token => token === 'プログラミング')).to.have.length(1);
    });
  });

  describe('filterWithPos method', () => {
    it('品詞フィルタリングが正しく動作する', () => {
      const mockTokens: DetailedJapaneseToken[] = [
        { pos: '名詞', surface_form: 'プログラミング', basic_form: 'プログラミング' },
        { pos: '動詞', surface_form: '学ぶ', basic_form: '学ぶ' },
        { pos: '形容詞', surface_form: '楽しい', basic_form: '楽しい' },
        { pos: '助詞', surface_form: 'は', basic_form: 'は' },
        { pos: '副詞', surface_form: 'とても', basic_form: 'とても' }
      ];

      const result = filter.filterWithPos(mockTokens);

      // デフォルトでは名詞、動詞、形容詞のみ許可
      expect(result).to.include('プログラミング');
      expect(result).to.include('学ぶ');
      expect(result).to.include('楽しい');

      // 助詞、副詞は除外される
      expect(result).to.not.include('は');
      expect(result).to.not.include('とても');
    });

    it('基本形が優先される', () => {
      const mockTokens: DetailedJapaneseToken[] = [
        { pos: '動詞', surface_form: '走ります', basic_form: '走る' },
        { pos: '動詞', surface_form: '考える', basic_form: '*' }
      ];

      const result = filter.filterWithPos(mockTokens);

      // 基本形がある場合は基本形を、ない場合は表層形を返す
      expect(result).to.include('走る');
      expect(result).to.include('考える');
    });

    it('短い文字（ひらがな一文字）が除外される', () => {
      const mockTokens: DetailedJapaneseToken[] = [
        { pos: '名詞', surface_form: 'あ', basic_form: 'あ' },
        { pos: '名詞', surface_form: 'プログラミング', basic_form: 'プログラミング' }
      ];

      const result = filter.filterWithPos(mockTokens);

      expect(result).to.not.include('あ');
      expect(result).to.include('プログラミング');
    });

    it('カスタム品詞フィルタが適用される', () => {
      const filterCustomPos = new JapaneseTokenFilter({ allowedPos: ['名詞'] });
      const mockTokens: DetailedJapaneseToken[] = [
        { pos: '名詞', surface_form: 'プログラミング', basic_form: 'プログラミング' },
        { pos: '動詞', surface_form: '学ぶ', basic_form: '学ぶ' }
      ];

      const result = filterCustomPos.filterWithPos(mockTokens);

      // 名詞のみ許可
      expect(result).to.include('プログラミング');
      expect(result).to.not.include('学ぶ');
    });
  });

  describe('オプション設定', () => {
    it('重複除去を無効にできる', () => {
      const filterNoDuplicates = new JapaneseTokenFilter({ removeDuplicates: false });
      const tokens = ['プログラミング', '楽しい', 'プログラミング'];
      const result = filterNoDuplicates.filter(tokens);

      // 重複除去が無効なので'プログラミング'が2つ残る
      expect(result.filter(token => token === 'プログラミング')).to.have.length(2);
    });

    it('ストップワード除去を無効にできる', () => {
      const filterNoStopwords = new JapaneseTokenFilter({ removeStopwords: false });
      const tokens = ['プログラミング', 'は', '楽しい'];
      const result = filterNoStopwords.filter(tokens);

      // ストップワード除去が無効なので'は'が残る
      expect(result).to.include('は');
    });

    it('カスタムストップワードが正しく適用される', () => {
      const filterCustomStopwords = new JapaneseTokenFilter({
        customStopWords: ['プログラミング', '楽しい']
      });
      const tokens = ['プログラミング', '楽しい', '勉強'];
      const result = filterCustomStopwords.filter(tokens);

      // カスタムストップワードは除去される
      expect(result).to.not.include('プログラミング');
      expect(result).to.not.include('楽しい');
      expect(result).to.include('勉強');
    });
  });
});
