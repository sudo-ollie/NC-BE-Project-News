const app = require('../app.js')
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

    test('GET request should return a 200 & query results', () => {
        return request(app)
          .get('/api/articles/8?comment_count=true')
          .expect(200)
          .then((response) => {
            console.log(response)
          })
      })
  
    test('Non-valid query should return a 400 & message', () => {
      return request(app)
        .get('/api/articles/8?invalid_count=true')
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toEqual('Non-Valid Query')
        })
    })
});

