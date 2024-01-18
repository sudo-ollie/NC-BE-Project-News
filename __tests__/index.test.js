const app = require('../app')
const request = require('supertest')
const db = require('../db/connection.js')
const seed = require('../db/seeds/seed.js')
const testData = require('../db/data/test-data/index.js')
const endpointFile = require('../endpoints.json')

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

describe('Articles API - Returrn articles', () => {
  test('GET request should return a 200 and an object', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then((response) => {
          expect(typeof response.body.articles).toBe('object')
          console.log(response.body.articles)
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

describe('Articles API - Get Article Comments', () => {
  test('GET request should return a 200 and an array', () => {
      return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body.comments)).toBe(true)
        })
  })

  test("Array entries should contain all the correct properties && should be properly sorted", () => {       
    return request(app)
      .get('/api/articles/1/comments')
      .then((response) => {
        console.log(response.body.comments , 'COMMENTS IN TEST')
        response.body.comments.forEach((element) => {
          console.log(element , 'ELEMENTS')
          expect(Object.keys(element)).toEqual([ 'comment_id', 'body', 'article_id', 'author', 'votes', 'created_at' ])
          expect(response.body.comments).toBeSortedBy( 'created_at' , {descending : true})
        })
      })
  })

  test('Articles with no comments should return an empty array', () => {
    return request(app)
      .get('/api/articles/2/comments')
      .then((response) => {
        console.log(response.body.comments , 'COMMENTS')
        expect(response.body.comments.length).toBe(0)
      })
  })
  
  test('Non-existent articles should respond with a 400 & message', () => {
    return request(app)
      .get('/api/articles/4000/comments')
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toEqual("Article Doesn't Exist")
      })
  })
});

describe.only('Articles API - POST Comment', () => {

  test('POST request should return a 200 and the payload in response', () => {
    const commentPayload = {
      username : 'icellusedkars',
      body : 'Jest is the best!'
    }

      return request(app)
        .post('/api/articles/5/comments')
        .send(commentPayload)
        .expect(200)
        .then((response) => {
          expect(response.body.comment_content.article_id).toEqual(5)
          expect(response.body.comment_content.author).toEqual('icellusedkars')
          expect(response.body.comment_content.body).toEqual('Jest is the best!')
        })
  })

  test('POST request with missing headers should return a 404 & message', () => {
    const commentPayload = {
      username : 'NCUSER',
    }

    return request(app)
      .post('/api/articles/5/comments')
      .send(commentPayload)
      .expect(404)
      .then((response) => {
        console.log(response.body)
        expect(response.body.msg).toEqual('404 - Missing Required Data')
      })
  })

  test("POST request with an invalid user should return a 404 & message", () => {
    const commentPayload = {
      username : 'NCUSER1',
      body : 'Jest is the best!'
    }

    return request(app)
      .post('/api/articles/500/comments')
      .send(commentPayload)
      .expect(404)
      .then((response) => {
        console.log(response.body)
        expect(response.body.msg).toEqual("404 - Article / User Doesn't Exist")
      })
  }) 

  test.only("Valid post request to an article that doesn't exist should return a 404 & message", () => {
    const commentPayload = {
      username : 'icellusedkars',
      body : 'Jest is the best!'
    }

    return request(app)
      .post('/api/articles/500/comments')
      .send(commentPayload)
      .expect(404)
      .then((response) => {
        console.log(response.body)
        expect(response.body.msg).toEqual("404 - Article / User Doesn't Exist")
      })
}) 
});