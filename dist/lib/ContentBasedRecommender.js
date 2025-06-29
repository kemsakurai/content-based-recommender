"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("underscore"));
const vector_object_1 = __importDefault(require("vector-object"));
const striptags_1 = __importDefault(require("striptags"));
const sw = __importStar(require("stopword"));
const natural = __importStar(require("natural"));
const { TfIdf, PorterStemmer, NGrams } = natural;
const tokenizer = new natural.WordTokenizer();
/**
 * デフォルト設定オプション
 */
const defaultOptions = {
    maxVectorSize: 100,
    maxSimilarDocuments: Number.MAX_SAFE_INTEGER,
    minScore: 0,
    debug: false,
};
/**
 * コンテンツベース推薦システムのメインクラス
 * TF-IDFとコサイン類似度を使用して文書間の類似性を計算し、類似したアイテムを推薦します
 */
class ContentBasedRecommender {
    /**
     * ContentBasedRecommenderのコンストラクタ
     * @param options 推薦システムの設定オプション
     */
    constructor(options = {}) {
        this.setOptions(options);
        this.data = {};
    }
    /**
     * 設定オプションを設定・検証する
     * @param options 設定オプション
     * @throws {Error} 無効なオプションが指定された場合
     */
    setOptions(options = {}) {
        // バリデーション
        if ((options.maxVectorSize !== undefined) &&
            (!Number.isInteger(options.maxVectorSize) || options.maxVectorSize <= 0)) {
            throw new Error('The option maxVectorSize should be integer and greater than 0');
        }
        if ((options.maxSimilarDocuments !== undefined) &&
            (!Number.isInteger(options.maxSimilarDocuments) || options.maxSimilarDocuments <= 0)) {
            throw new Error('The option maxSimilarDocuments should be integer and greater than 0');
        }
        if ((options.minScore !== undefined) &&
            (!_.isNumber(options.minScore) || options.minScore < 0 || options.minScore > 1)) {
            throw new Error('The option minScore should be a number between 0 and 1');
        }
        this.options = Object.assign({}, defaultOptions, options);
    }
    /**
     * 単一コレクションの文書を学習する
     * @param documents 学習対象の文書配列
     */
    train(documents) {
        this.validateDocuments(documents);
        if (this.options.debug) {
            console.log(`Total documents: ${documents.length}`);
        }
        // ステップ1 - 文書の前処理
        const preprocessDocs = this._preprocessDocuments(documents, this.options);
        // ステップ2 - 文書ベクトルの作成
        const docVectors = this._produceWordVectors(preprocessDocs, this.options);
        // ステップ3 - 類似度の計算
        this.data = this._calculateSimilarities(docVectors, this.options);
    }
    /**
     * 双方向学習（異なるコレクション間の類似度計算）
     * @param documents メインの文書配列
     * @param targetDocuments ターゲット文書配列
     */
    trainBidirectional(documents, targetDocuments) {
        this.validateDocuments(documents);
        this.validateDocuments(targetDocuments);
        if (this.options.debug) {
            console.log(`Total documents: ${documents.length}`);
        }
        // ステップ1 - 文書の前処理
        const preprocessDocs = this._preprocessDocuments(documents, this.options);
        const preprocessTargetDocs = this._preprocessDocuments(targetDocuments, this.options);
        // ステップ2 - 文書ベクトルの作成
        const docVectors = this._produceWordVectors(preprocessDocs, this.options);
        const targetDocVectors = this._produceWordVectors(preprocessTargetDocs, this.options);
        // ステップ3 - 類似度の計算
        this.data = this._calculateSimilaritiesBetweenTwoVectors(docVectors, targetDocVectors, this.options);
    }
    /**
     * 文書配列のバリデーション
     * @param documents 検証対象の文書配列
     * @throws {Error} 無効な文書配列が指定された場合
     */
    validateDocuments(documents) {
        if (!_.isArray(documents)) {
            throw new Error('Documents should be an array of objects');
        }
        for (let i = 0; i < documents.length; i += 1) {
            const document = documents[i];
            if (!_.has(document, 'id') || !_.has(document, 'content')) {
                throw new Error('Documents should be have fields id and content');
            }
            if (_.has(document, 'tokens') || _.has(document, 'vector')) {
                throw new Error('\"tokens\" and \"vector\" properties are reserved and cannot be used as document properties\"');
            }
        }
    }
    /**
     * 指定IDの類似文書を取得する
     * @param id 文書ID
     * @param start 開始インデックス（デフォルト: 0）
     * @param size 取得サイズ（未指定の場合は全て）
     * @returns 類似文書の配列
     */
    getSimilarDocuments(id, start = 0, size) {
        let similarDocuments = this.data[id];
        if (similarDocuments === undefined) {
            return [];
        }
        const end = (size !== undefined) ? start + size : undefined;
        similarDocuments = similarDocuments.slice(start, end);
        return similarDocuments;
    }
    /**
     * 学習済みモデルをエクスポートする
     * @returns エクスポートデータ
     */
    export() {
        return {
            options: this.options,
            data: this.data,
        };
    }
    /**
     * エクスポートされたモデルをインポートする
     * @param object インポートするモデルデータ
     */
    import(object) {
        const { options, data } = object;
        if (options) {
            this.setOptions(options);
        }
        if (data) {
            this.data = data;
        }
    }
    // プライベートメソッド
    /**
     * 文書の前処理（トークン化、ステミング等）
     * @param documents 対象文書配列
     * @param options 設定オプション
     * @returns 前処理済み文書配列
     */
    _preprocessDocuments(documents, options) {
        if (options.debug) {
            console.log('Preprocessing documents');
        }
        const processedDocuments = documents.map(item => {
            const tokens = this._getTokensFromString(item.content);
            return {
                id: item.id,
                tokens,
                originalDocument: item,
            };
        });
        return processedDocuments;
    }
    /**
     * 文字列からトークンを抽出する
     * @param string 対象文字列
     * @returns トークン配列
     */
    _getTokensFromString(string) {
        // HTMLタグの除去と小文字化
        const tmpString = (0, striptags_1.default)(string, [], ' ')
            .toLowerCase();
        // 文字列のトークン化
        const tokens = tokenizer.tokenize(tmpString);
        if (!tokens) {
            return [];
        }
        // ユニグラムの取得
        const unigrams = sw.removeStopwords(tokens)
            .map(unigram => PorterStemmer.stem(unigram));
        // バイグラムの取得
        const bigrams = NGrams.bigrams(tokens)
            .filter(bigram => 
        // ストップワードを含むバイグラムをフィルタリング
        (bigram.length === sw.removeStopwords(bigram).length))
            .map(bigram => 
        // トークンのステミング処理
        bigram.map(token => PorterStemmer.stem(token))
            .join('_'));
        // トライグラムの取得
        const trigrams = NGrams.trigrams(tokens)
            .filter(trigram => 
        // ストップワードを含むトライグラムをフィルタリング
        (trigram.length === sw.removeStopwords(trigram).length))
            .map(trigram => 
        // トークンのステミング処理
        trigram.map(token => PorterStemmer.stem(token))
            .join('_'));
        return [...unigrams, ...bigrams, ...trigrams];
    }
    /**
     * 文書ベクトルを生成する
     * @param processedDocuments 前処理済み文書配列
     * @param options 設定オプション
     * @returns 文書ベクトル配列
     */
    _produceWordVectors(processedDocuments, options) {
        // TF-IDFの処理
        const tfidf = new TfIdf();
        processedDocuments.forEach((processedDocument) => {
            tfidf.addDocument(processedDocument.tokens);
        });
        // ワードベクトルの作成
        const documentVectors = [];
        for (let i = 0; i < processedDocuments.length; i += 1) {
            if (options.debug) {
                console.log(`Creating word vector for document ${i}`);
            }
            const processedDocument = processedDocuments[i];
            const hash = {};
            const items = tfidf.listTerms(i);
            const maxSize = Math.min(options.maxVectorSize, items.length);
            for (let j = 0; j < maxSize; j += 1) {
                const item = items[j];
                hash[item.term] = item.tfidf;
            }
            const documentVector = {
                id: processedDocument.id,
                vector: new vector_object_1.default(hash),
            };
            documentVectors.push(documentVector);
        }
        return documentVectors;
    }
    /**
     * 2つのベクトルセット間の類似度を計算する（双方向学習用）
     * @param documentVectors メイン文書のベクトル配列
     * @param targetDocumentVectors ターゲット文書のベクトル配列
     * @param options 設定オプション
     * @returns 類似度データ
     */
    _calculateSimilaritiesBetweenTwoVectors(documentVectors, targetDocumentVectors, options) {
        const data = {
            ...this.initializeDataHash(documentVectors),
            ...this.initializeDataHash(targetDocumentVectors)
        };
        // 類似度スコアの計算
        for (let i = 0; i < documentVectors.length; i += 1) {
            if (options.debug)
                console.log(`Calculating similarity score for document ${i}`);
            for (let j = 0; j < targetDocumentVectors.length; j += 1) {
                const documentVectorA = documentVectors[i];
                const targetDocumentVectorB = targetDocumentVectors[j];
                const idi = documentVectorA.id;
                const vi = documentVectorA.vector;
                const idj = targetDocumentVectorB.id;
                const vj = targetDocumentVectorB.vector;
                const similarity = vi.getCosineSimilarity(vj);
                if (similarity > options.minScore) {
                    data[idi].push({
                        id: targetDocumentVectorB.id,
                        score: similarity
                    });
                    data[idj].push({
                        id: documentVectorA.id,
                        score: similarity
                    });
                }
            }
        }
        this.orderDocuments(data, options);
        return data;
    }
    /**
     * データハッシュを初期化する
     * @param documentVectors 文書ベクトル配列
     * @returns 初期化されたデータハッシュ
     */
    initializeDataHash(documentVectors) {
        return documentVectors.reduce((acc, item) => {
            acc[item.id] = [];
            return acc;
        }, {});
    }
    /**
     * 同一コレクション内の類似度を計算する
     * @param documentVectors 文書ベクトル配列
     * @param options 設定オプション
     * @returns 類似度データ
     */
    _calculateSimilarities(documentVectors, options) {
        const data = { ...this.initializeDataHash(documentVectors) };
        // 類似度スコアの計算
        for (let i = 0; i < documentVectors.length; i += 1) {
            if (options.debug)
                console.log(`Calculating similarity score for document ${i}`);
            for (let j = 0; j < i; j += 1) {
                const documentVectorA = documentVectors[i];
                const idi = documentVectorA.id;
                const vi = documentVectorA.vector;
                const documentVectorB = documentVectors[j];
                const idj = documentVectorB.id;
                const vj = documentVectorB.vector;
                const similarity = vi.getCosineSimilarity(vj);
                if (similarity > options.minScore) {
                    data[idi].push({
                        id: documentVectorB.id,
                        score: similarity
                    });
                    data[idj].push({
                        id: documentVectorA.id,
                        score: similarity
                    });
                }
            }
        }
        this.orderDocuments(data, options);
        return data;
    }
    /**
     * 類似文書を降順でソートし、最大数を制限する
     * @param data 類似度データ
     * @param options 設定オプション
     */
    orderDocuments(data, options) {
        // 類似文書を降順でソート
        Object.keys(data)
            .forEach((id) => {
            data[id].sort((a, b) => b.score - a.score);
            if (data[id].length > options.maxSimilarDocuments) {
                data[id] = data[id].slice(0, options.maxSimilarDocuments);
            }
        });
    }
}
exports.default = ContentBasedRecommender;
//# sourceMappingURL=ContentBasedRecommender.js.map