import { expect } from 'chai';
import { EnglishTokenFilter } from '../../src/lib/filters/EnglishTokenFilter.js';

describe('EnglishTokenFilter', () => {
  let filter: EnglishTokenFilter;

  beforeEach(() => {
    filter = new EnglishTokenFilter();
  });

  describe('filter method', () => {
    it('基本的なフィルタリングが正しく動作する', () => {
      const tokens = ['hello', 'world', 'programming', 'hello'];
      const result = filter.filter(tokens);

      // 重複除去により'hello'は1つだけになる
      expect(result.filter(token => token === 'hello')).to.have.length(1);
      expect(result).to.include.members(['hello', 'world', 'programming']);
    });

    it('ストップワードが正しく除去される', () => {
      const tokens = ['the', 'quick', 'brown', 'fox', 'and', 'dog'];
      const result = filter.filter(tokens);

      // 'the', 'and'はストップワードなので除去される
      expect(result).to.not.include.members(['the', 'and']);
      expect(result).to.include.members(['quick', 'brown', 'fox', 'dog']);
    });

    it('最小長フィルタリングが正しく動作する', () => {
      const filterWithMinLength = new EnglishTokenFilter({ minTokenLength: 3 });
      const tokens = ['a', 'is', 'cat', 'dog', 'elephant'];
      const result = filterWithMinLength.filter(tokens);

      // 3文字未満のトークンは除去される
      expect(result).to.not.include.members(['a', 'is']);
      expect(result).to.include.members(['cat', 'dog', 'elephant']);
    });
  });

  describe('filterWithNgrams method', () => {
    it('N-gramを含むトークンが正しくフィルタリングされる', () => {
      const tokens = ['hello', 'world_programming', 'the_cat', 'dog_running'];
      const result = filter.filterWithNgrams(tokens);

      // 'the_cat'はストップワード'the'を含むので除去される
      expect(result).to.not.include('the_cat');
      expect(result).to.include.members(['hello', 'world_programming', 'dog_running']);
    });

    it('ユニグラムのストップワードは除去される', () => {
      const tokens = ['hello', 'the', 'world', 'and'];
      const result = filter.filterWithNgrams(tokens);

      expect(result).to.not.include.members(['the', 'and']);
      expect(result).to.include.members(['hello', 'world']);
    });
  });

  describe('オプション設定', () => {
    it('重複除去を無効にできる', () => {
      const filterNoDuplicates = new EnglishTokenFilter({ removeDuplicates: false });
      const tokens = ['hello', 'world', 'hello'];
      const result = filterNoDuplicates.filter(tokens);

      // 重複除去が無効なので'hello'が2つ残る
      expect(result.filter(token => token === 'hello')).to.have.length(2);
    });

    it('ストップワード除去を無効にできる', () => {
      const filterNoStopwords = new EnglishTokenFilter({ removeStopwords: false });
      const tokens = ['the', 'quick', 'brown', 'fox'];
      const result = filterNoStopwords.filter(tokens);

      // ストップワード除去が無効なので'the'が残る
      expect(result).to.include('the');
    });

    it('カスタムストップワードが正しく適用される', () => {
      const filterCustomStopwords = new EnglishTokenFilter({
        customStopWords: ['programming', 'coding']
      });
      const tokens = ['hello', 'programming', 'world', 'coding'];
      const result = filterCustomStopwords.filter(tokens);

      // カスタムストップワードは除去される
      expect(result).to.not.include.members(['programming', 'coding']);
      expect(result).to.include.members(['hello', 'world']);
    });
  });
});
