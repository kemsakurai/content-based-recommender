import * as natural from 'natural';
import striptags from 'striptags';
import { ITokenizer } from '../../types';

const { PorterStemmer, NGrams } = natural;
const tokenizer = new natural.WordTokenizer();

/**
 * 英語テキスト用のトークナイザークラス
 * TF-IDFとN-gram（unigram, bigram, trigram）を生成します
 */
export class EnglishTokenizer implements ITokenizer {
  /**
   * 英語テキストをトークン化する
   * @param text 対象テキスト
   * @returns トークン配列のPromise
   */
  public async tokenize(text: string): Promise<string[]> {
    // HTMLタグの除去と小文字化
    const cleanText = striptags(text, [], ' ').toLowerCase();

    // 文字列のトークン化
    const rawTokens = tokenizer.tokenize(cleanText);

    if (!rawTokens) {
      return [];
    }

    // ユニグラムの取得（ステミング処理）
    const unigrams = rawTokens.map(token => PorterStemmer.stem(token));

    // バイグラムの取得
    const bigrams = NGrams.bigrams(rawTokens)
      .map(bigram =>
        bigram.map(token => PorterStemmer.stem(token)).join('_')
      );

    // トライグラムの取得
    const trigrams = NGrams.trigrams(rawTokens)
      .map(trigram =>
        trigram.map(token => PorterStemmer.stem(token)).join('_')
      );

    return [...unigrams, ...bigrams, ...trigrams];
  }
}
