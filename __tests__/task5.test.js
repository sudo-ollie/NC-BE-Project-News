const app = require('../app')
const request = require('supertest')
const db = require('../db/connection.js')
const seed = require('../db/seeds/seed.js')
const testData = require('../db/data/test-data/index.js')
const endpointFile = require('../endpoints.json')
const commentFile = require('../db/data/test-data/articles.js')

beforeEach(() => seed(testData))

afterAll(() => {
  db.end()
})

describe('General Tests', () => {
    test('Requests to an incorrect endpoint should return 404 + a message', () => {
      return request(app)
        .get('/api/test')
        .expect(404)
        .then((response => {
          expect(response.body).toEqual({msg : 'No Such Endpoint'})
        }))
    })
  });

  describe('Articles API - Returrn articles', () => {
    test('GET request should return a 200 and an object', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then((response) => {
            expect(typeof response.body.articles).toBe('object')
          })
    })
    test('Response object should be properly sorted', () => {
      return request(app)
        .get('/api/articles')
        .then((response) => {
          expect(response.body.articles).toBeSortedBy( 'created_at' , {descending : true})
        })
  })
    test("Object entries shouldn't contain a body property but should contain a comment count", () => {       
      return request(app)
        .get('/api/articles')
        .then((response) => {
          response.body.articles.forEach((element) => {
            expect(Object.keys(element)).toEqual(["article_id", "title", "topic", "author", "created_at", "votes", "article_img_url" , "comment_count"])
          })
        })
  })
  });


