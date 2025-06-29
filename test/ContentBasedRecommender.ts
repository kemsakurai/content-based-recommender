import { expect } from 'chai';
import ContentBasedRecommender from '../src/lib/ContentBasedRecommender';
import { Document } from '../src/types';
import sampleDocuments from '../fixtures/sample-documents';
import sampleTargetDocuments from '../fixtures/sample-target-documents';

/**
 * ContentBasedRecommenderのテストスイート
 * オプション検証、文書検証、学習結果検証、エクスポート/インポート機能をテスト
 */

describe('ContentBasedRecommender', () => {
  describe('options validation', () => {
    it('should only accept maxVectorSize greater than 0', () => {
      expect(() => {
        const recommender = new ContentBasedRecommender({
          maxVectorSize: -1,
        });
        recommender.train(sampleDocuments);
      }).to.throw('The option maxVectorSize should be integer and greater than 0');
    });

    it('should only accept maxSimilarDocuments greater than 0', () => {
      expect(() => {
        const recommender = new ContentBasedRecommender({
          maxSimilarDocuments: -1,
        });
        recommender.train(sampleDocuments);
      }).to.throw('The option maxSimilarDocuments should be integer and greater than 0');
    });

    it('should only accept minScore between 0 and 1', () => {
      expect(() => {
        const recommender = new ContentBasedRecommender({
          minScore: -1,
        });
        recommender.train(sampleDocuments);
      }).to.throw('The option minScore should be a number between 0 and 1');

      expect(() => {
        const recommender = new ContentBasedRecommender({
          minScore: 2,
        });
        recommender.train(sampleDocuments);
      }).to.throw('The option minScore should be a number between 0 and 1');
    });
  });

  describe('documents validation', () => {
    const recommender = new ContentBasedRecommender();

    it('should only accept array of documents', () => {
      expect(() => {
        recommender.train({
          1000001: 'Hello World',
          1000002: 'I love programming!',
        } as any);
      }).to.throw('Documents should be an array of objects');
    });

    it('should only accept array of documents, with fields id and content', () => {
      expect(() => {
        recommender.train([
          {
            name: '1000001',
            text: 'Hello World'
          },
          {
            name: '1000002',
            text: 'I love programming!'
          },
        ] as any);
      }).to.throw('Documents should be have fields id and content');
    });
  });

  describe('training result validation', () => {
    it('should return list of similar documents in right order', () => {
      const recommender = new ContentBasedRecommender();
      recommender.train(sampleDocuments);

      const similarDocuments = recommender.getSimilarDocuments('1000002');

      const ids = similarDocuments.map(document => document.id);
      expect(ids).to.deep.equal(['1000004', '1000009', '1000005', '1000003', '1000006', '1000001']);
    });

    it('should to be able to control how many similar documents to obtain', () => {
      const recommender = new ContentBasedRecommender();
      recommender.train(sampleDocuments);

      let similarDocuments = recommender.getSimilarDocuments('1000002', 0, 2);
      let ids = similarDocuments.map(document => document.id);
      expect(ids).to.deep.equal(['1000004', '1000009']);

      similarDocuments = recommender.getSimilarDocuments('1000002', 2);
      ids = similarDocuments.map(document => document.id);
      expect(ids).to.deep.equal(['1000005', '1000003', '1000006', '1000001']);

      similarDocuments = recommender.getSimilarDocuments('1000002', 1, 3);
      ids = similarDocuments.map(document => document.id);
      expect(ids).to.deep.equal(['1000009', '1000005', '1000003']);
    });

    it('should to be able to control the minScore of similar documents', () => {
      const recommender = new ContentBasedRecommender({ minScore: 0.4 });
      recommender.train(sampleDocuments);

      sampleDocuments.forEach((document: Document) => {
        const similarDocuments = recommender.getSimilarDocuments(document.id);
        const scores = similarDocuments.map(similarDocument => similarDocument.score);
        scores.forEach((score: number) => {
          expect(score).to.be.at.least(0.4);
        });
      });
    });

    it('should to be able to control the maximum number of similar documents', () => {
      const recommender = new ContentBasedRecommender({ maxSimilarDocuments: 3 });
      recommender.train(sampleDocuments);

      sampleDocuments.forEach((document: Document) => {
        const similarDocuments = recommender.getSimilarDocuments(document.id);
        expect(similarDocuments).to.have.length.at.most(3);
      });
    });
  });

  describe('training multi collection result validation', () => {
    it('should return list of similar documents of the target collection in right order', () => {
      const recommender = new ContentBasedRecommender();
      recommender.trainBidirectional(sampleDocuments, sampleTargetDocuments);

      const similarDocuments = recommender.getSimilarDocuments('1000011');

      const ids = similarDocuments.map(document => document.id);
      expect(ids).to.deep.equal(['1000002', '1000004', '1000009', '1000005', '1000003', '1000006', '1000001']);
    });

    it('should to be able to control how many similar documents to obtain using multiple collections', () => {
      const recommender = new ContentBasedRecommender();
      recommender.trainBidirectional(sampleDocuments, sampleTargetDocuments);

      let similarDocuments = recommender.getSimilarDocuments('1000011', 0, 2);
      let ids = similarDocuments.map(document => document.id);
      expect(ids).to.deep.equal(['1000002', '1000004']);

      similarDocuments = recommender.getSimilarDocuments('1000011', 2);
      ids = similarDocuments.map(document => document.id);
      expect(ids).to.deep.equal(['1000009', '1000005', '1000003', '1000006', '1000001']);

      similarDocuments = recommender.getSimilarDocuments('1000011', 1, 3);
      ids = similarDocuments.map(document => document.id);
      expect(ids).to.deep.equal(['1000004', '1000009', '1000005']);
    });

    it('should to be able to control the minScore of similar documents', () => {
      const recommender = new ContentBasedRecommender({ minScore: 0.4 });
      recommender.train(sampleDocuments);

      sampleDocuments.forEach((document: Document) => {
        const similarDocuments = recommender.getSimilarDocuments(document.id);
        const scores = similarDocuments.map(similarDocument => similarDocument.score);
        scores.forEach((score: number) => {
          expect(score).to.be.at.least(0.4);
        });
      });
    });

    it('should to be able to control the maximum number of similar documents', () => {
      const recommender = new ContentBasedRecommender({ maxSimilarDocuments: 3 });
      recommender.train(sampleDocuments);

      sampleDocuments.forEach((document: Document) => {
        const similarDocuments = recommender.getSimilarDocuments(document.id);
        expect(similarDocuments).to.have.length.at.most(3);
      });
    });
  });

  describe('export and import', () => {
    it('should to be able to give the same results with recommender created by import method', () => {
      const recommender = new ContentBasedRecommender({
        maxSimilarDocuments: 3,
        minScore: 0.4,
      });
      recommender.train(sampleDocuments);

      const exportedData = recommender.export();

      // エクスポート結果に基づいて別の推薦システムを作成
      const recommender2 = new ContentBasedRecommender(exportedData.options);
      recommender2.import(exportedData);

      sampleDocuments.forEach((document: Document) => {
        const similarDocuments = recommender.getSimilarDocuments(document.id);
        const similarDocuments2 = recommender2.getSimilarDocuments(document.id);

        expect(similarDocuments).to.deep.equal(similarDocuments2);
      });
    });
  });
});
