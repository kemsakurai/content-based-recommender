import { IJapaneseTokenFilter, TokenFilterOptions, DetailedJapaneseToken } from '../../types/index.js';

/**
 * 日本語専用トークンフィルタークラス
 * ストップワード除去、重複除去、長さフィルタリング、品詞フィルタリング等を行います
 */
export class JapaneseTokenFilter implements IJapaneseTokenFilter {
  /** フィルターオプション */
  private options: Required<TokenFilterOptions>;

  /** 日本語デフォルトストップワード */
  private static readonly DEFAULT_STOPWORDS = [
    'は', 'が', 'の', 'に', 'を', 'で', 'と', 'か', 'も', 'から',
    'まで', 'より', 'こと', 'もの', 'ため', 'など'
  ];

  /**
   * コンストラクタ
   * @param options フィルターオプション
   */
  constructor(options: TokenFilterOptions = {}) {
    this.options = {
      removeDuplicates: options.removeDuplicates ?? true,
      removeStopwords: options.removeStopwords ?? true,
      customStopWords: options.customStopWords ?? [],
      minTokenLength: options.minTokenLength ?? 1,
      allowedPos: options.allowedPos ?? ['名詞', '動詞', '形容詞']
    };
  }

  /**
   * トークン配列をフィルタリングする
   * @param tokens フィルタリング対象のトークン配列
   * @returns フィルタリング済みトークン配列
   */
  public filter(tokens: string[]): string[] {
    let filteredTokens = tokens;

    // 長さフィルタリング
    if (this.options.minTokenLength > 1) {
      filteredTokens = this._filterByLength(filteredTokens);
    }

    // ストップワード除去
    if (this.options.removeStopwords) {
      filteredTokens = this._removeStopwords(filteredTokens);
    }

    // 重複除去
    if (this.options.removeDuplicates) {
      filteredTokens = this._removeDuplicates(filteredTokens);
    }

    return filteredTokens;
  }

  /**
   * 品詞情報を使用したフィルタリング（日本語用）
   * @param tokens 品詞情報付きトークン配列
   * @returns フィルタリング済みトークン配列
   */
  public filterWithPos(tokens: DetailedJapaneseToken[]): string[] {
    let filteredTokens = tokens
      .filter(token => {
        // 品詞フィルタリング
        if (!this.options.allowedPos.includes(token.pos)) {
          return false;
        }

        // 基本形または表層形を取得
        const tokenText = (token.basic_form && token.basic_form !== '*')
          ? token.basic_form
          : token.surface_form;

        // 長さフィルタリング
        if (tokenText.length < this.options.minTokenLength) {
          return false;
        }

        // ひらがな一文字の除外
        if (/^[\u3042-\u3096]$/.test(tokenText)) {
          return false;
        }

        return true;
      })
      .map(token => {
        const baseForm = token.basic_form;
        return (baseForm && baseForm !== '*') ? baseForm : token.surface_form;
      });

    // ストップワード除去
    if (this.options.removeStopwords) {
      filteredTokens = this._removeStopwords(filteredTokens);
    }

    // 重複除去
    if (this.options.removeDuplicates) {
      filteredTokens = this._removeDuplicates(filteredTokens);
    }

    return filteredTokens;
  }

  /**
   * 長さによるフィルタリング
   * @param tokens トークン配列
   * @returns フィルタリング済みトークン配列
   */
  private _filterByLength(tokens: string[]): string[] {
    return tokens.filter(token => token.length >= this.options.minTokenLength);
  }

  /**
   * ストップワード除去（日本語用）
   * @param tokens トークン配列
   * @returns ストップワード除去済みトークン配列
   */
  private _removeStopwords(tokens: string[]): string[] {
    const stopwords = this._getStopwords();
    return tokens.filter(token => !stopwords.has(token));
  }

  /**
   * 重複除去
   * @param tokens トークン配列
   * @returns 重複除去済みトークン配列
   */
  private _removeDuplicates(tokens: string[]): string[] {
    return Array.from(new Set(tokens));
  }

  /**
   * ストップワードセットを取得する
   * @returns ストップワードのSet
   */
  private _getStopwords(): Set<string> {
    const allStopwords = [...JapaneseTokenFilter.DEFAULT_STOPWORDS, ...this.options.customStopWords];
    return new Set(allStopwords);
  }
}
