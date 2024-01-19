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

describe('GENERAL TESTS', () => {
    test('REQUESTS TO AN INCORRECT ENDPOINT SHOULD RETURN A 404 + MESSAGE', () => {
      return request(app)
        .get('/api/test')
        .expect(404)
        .then((response => {
          expect(response.body).toEqual({msg : 'No Such Endpoint'})
        }))
    })
  });

describe('TASK 9 - DELETE COMMENT BY COMMENT_ID', () => {

    test('VALID REQUEST SHOULD RETURN A 204 ONLY (NO MESSAGE)', () => {
      return request(app)
          .delete('/api/comments/5')
          .expect(204)
          .then((response) => {
            expect(response.body.hasOwnProperty('msg')).toBe(false)
          })
      })
    
      test('REQUEST TO A NON-EXISTENT COMMENT SHOULD RETURN A 404 + MESSAGE', () => {
        return request(app)
          .delete('/api/comments/500')
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toEqual("404 - COMMENT DOESN'T EXIST")
          })
      })

      test('REQUEST TO AN INVALID COMMENT_ID SHOULD RETURN A 400 + MESSAGE', () => {
        return request(app)
          .delete('/api/comments/one')
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toEqual("400 - INVALID COMMENT ID (NON-INT)")
          })
      })
});


