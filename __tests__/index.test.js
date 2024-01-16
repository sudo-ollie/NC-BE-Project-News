const app = require('../app')
const request = require('supertest')
const db = require('../db/connection.js')
const seed = require('../db/seeds/seed.js')
const testData = require('../db/data/test-data/index.js')

beforeEach(() => seed(testData))

afterAll(() => {
  db.end()
})

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
  });