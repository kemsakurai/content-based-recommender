/**
 * プロジェクト内で使用される型定義
 */
/**
 * 文書データの基本インターフェース
 */
export interface Document {
    /** 文書の一意識別子 */
    id: string;
    /** 文書の内容 */
    content: string;
    /** その他の任意プロパティ */
    [key: string]: any;
}
/**
 * ContentBasedRecommenderの設定オプション
 */
export interface RecommenderOptions {
    /** 最大ベクトルサイズ（デフォルト: 100） */
    maxVectorSize?: number;
    /** 保持する類似文書の最大数 */
    maxSimilarDocuments?: number;
    /** 類似度の最小閾値（0-1） */
    minScore?: number;
    /** デバッグモードの有効化 */
    debug?: boolean;
}
/**
 * 類似文書の情報
 */
export interface SimilarDocument {
    /** 文書ID */
    id: string;
    /** 類似度スコア */
    score: number;
}
/**
 * 学習済みモデルのエクスポートデータ
 */
export interface ExportedModel {
    /** 設定オプション */
    options: RecommenderOptions;
    /** 類似度データ */
    data: Record<string, SimilarDocument[]>;
}
/**
 * プリプロセス済み文書データ
 */
export interface ProcessedDocument {
    /** 文書ID */
    id: string;
    /** トークン化された単語の配列 */
    tokens: string[];
    /** 元の文書データ */
    originalDocument: Document;
}
/**
 * TF-IDFの計算結果
 */
export interface TfIdfResult {
    /** 単語 */
    term: string;
    /** TF-IDF値 */
    tfidf: number;
    /** 文書ID */
    documentId: string;
}
//# sourceMappingURL=index.d.ts.map