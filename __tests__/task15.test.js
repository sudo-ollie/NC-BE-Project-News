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

describe('TASK DESCRIPTION HERE', () => {

    test('TEST TITLE', () => {
        return request(app)
          .get('')
          .expect()
          .then((response) => {

          })
      })
    
      test('TEST TITLE', () => {
        return request(app)
          .get('')
          .expect()
          .then((response) => {

          })
      })
});


