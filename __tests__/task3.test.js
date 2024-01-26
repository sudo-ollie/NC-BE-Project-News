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

  describe('Base API', () => {
    test('GET request should return an endpoint object', () => {
        return request(app)
          .get('/api')
          .expect(200)
          .then((response) => {
            expect(typeof response.body.endpointInfo).toBe('object')
          })
    })
      test('The object should contain the same information as the local .JSON', () => {       
        return request(app)
          .get('/api')
          .then((response) => {
            expect(response.body.endpointInfo).toEqual(endpointFile)
          })
        })
});


