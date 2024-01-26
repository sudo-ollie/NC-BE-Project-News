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

  describe('Articles API - Return article by article_id', () => {
    test('GET request should return a 200 and an object', () => {
        return request(app)
          .get('/api/articles/1')
          .expect(200)
          .then((response) => {
            expect(typeof response.body).toBe('object')
          })
    })
    test("Should return an error if article_id is an invalid input", () => {       
        return request(app)
          .get('/api/articles/test')
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toEqual('400 - File Not Found (Invalid Input Type)')
          })
    })
    test("Should return an error if article_id is valid input but the file doesn't exist", () => {       
      return request(app)
        .get('/api/articles/5000')
        .expect(404)
        .then((response) => {
          console.log(response.body.msg)
          expect(response.body.msg).toEqual('404 - File Not Found')
        })
  })
  });


