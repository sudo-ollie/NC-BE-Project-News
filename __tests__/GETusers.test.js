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

describe('GET - /api/users', () => {

    test('GET REQUEST SHOULD RETURN A 200 & ARRAY OF USER OBJECTS', () => {
        return request(app)
          .get('/api/users')
          .expect(200)
          .then((response) => {
            expect(Array.isArray(response.body.users)).toBe(true)
            expect(response.body.users.length).not.toEqual(0)
            response.body.users.forEach((user) => {
              expect(Array.isArray(user)).toBe(false)
              expect(Object.keys(user)).toEqual(['username' , 'name' , 'avatar_url'])
            })
          })
      })
});


