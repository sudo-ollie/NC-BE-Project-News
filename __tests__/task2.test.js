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

  describe('Topics API', () => {
    test('GET request should return an array of objects', () => {
        return request(app)
          .get('/api/topics')
          .expect(200)
          .then((response) => {
            expect(response.body.topics.length).toBe(3)
            expect(Array.isArray(response.body.topics)).toBe(true)
            response.body.topics.forEach((element) => {
              expect(typeof element).toBe('object')
              expect(Array.isArray(element)).toBe(false)
            })
          })
      })
    
      test('Each array item should have the correct properties', () => {
        return request(app)
          .get('/api/topics')
          .then((response) => {
            response.body.topics.forEach((element) => {
              expect(Object.keys(element)).toEqual(['slug' , 'description'])
            })
          })
      })
});


