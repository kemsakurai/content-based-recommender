import { Document, RecommenderOptions, SimilarDocument, ExportedModel } from '../types';
/**
 * コンテンツベース推薦システムのメインクラス
 * TF-IDFとコサイン類似度を使用して文書間の類似性を計算し、類似したアイテムを推薦します
 */
declare class ContentBasedRecommender {
    /** 推薦システムの設定オプション */
    private options;
    /** 文書間の類似度データ */
    private data;
    /**
     * ContentBasedRecommenderのコンストラクタ
     * @param options 推薦システムの設定オプション
     */
    constructor(options?: RecommenderOptions);
    /**
     * 設定オプションを設定・検証する
     * @param options 設定オプション
     * @throws {Error} 無効なオプションが指定された場合
     */
    setOptions(options?: RecommenderOptions): void;
    /**
     * 単一コレクションの文書を学習する
     * @param documents 学習対象の文書配列
     */
    train(documents: Document[]): void;
    /**
     * 双方向学習（異なるコレクション間の類似度計算）
     * @param documents メインの文書配列
     * @param targetDocuments ターゲット文書配列
     */
    trainBidirectional(documents: Document[], targetDocuments: Document[]): void;
    /**
     * 文書配列のバリデーション
     * @param documents 検証対象の文書配列
     * @throws {Error} 無効な文書配列が指定された場合
     */
    validateDocuments(documents: Document[]): void;
    /**
     * 指定IDの類似文書を取得する
     * @param id 文書ID
     * @param start 開始インデックス（デフォルト: 0）
     * @param size 取得サイズ（未指定の場合は全て）
     * @returns 類似文書の配列
     */
    getSimilarDocuments(id: string, start?: number, size?: number): SimilarDocument[];
    /**
     * 学習済みモデルをエクスポートする
     * @returns エクスポートデータ
     */
    export(): Partial<ExportedModel>;
    /**
     * エクスポートされたモデルをインポートする
     * @param object インポートするモデルデータ
     */
    import(object: Partial<ExportedModel>): void;
    /**
     * 文書の前処理（トークン化、ステミング等）
     * @param documents 対象文書配列
     * @param options 設定オプション
     * @returns 前処理済み文書配列
     */
    private _preprocessDocuments;
    /**
     * 文字列からトークンを抽出する
     * @param string 対象文字列
     * @returns トークン配列
     */
    private _getTokensFromString;
    /**
     * 文書ベクトルを生成する
     * @param processedDocuments 前処理済み文書配列
     * @param options 設定オプション
     * @returns 文書ベクトル配列
     */
    private _produceWordVectors;
    /**
     * 2つのベクトルセット間の類似度を計算する（双方向学習用）
     * @param documentVectors メイン文書のベクトル配列
     * @param targetDocumentVectors ターゲット文書のベクトル配列
     * @param options 設定オプション
     * @returns 類似度データ
     */
    private _calculateSimilaritiesBetweenTwoVectors;
    /**
     * データハッシュを初期化する
     * @param documentVectors 文書ベクトル配列
     * @returns 初期化されたデータハッシュ
     */
    private initializeDataHash;
    /**
     * 同一コレクション内の類似度を計算する
     * @param documentVectors 文書ベクトル配列
     * @param options 設定オプション
     * @returns 類似度データ
     */
    private _calculateSimilarities;
    /**
     * 類似文書を降順でソートし、最大数を制限する
     * @param data 類似度データ
     * @param options 設定オプション
     */
    private orderDocuments;
}
export default ContentBasedRecommender;
//# sourceMappingURL=ContentBasedRecommender.d.ts.map