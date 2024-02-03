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

describe('GENERAL API TESTS', () => {
    test('Requests to an incorrect endpoint should return 404 + a message', () => {
      return request(app)
        .get('/api/test')
        .expect(404)
        .then((response => {
          expect(response.body).toEqual({msg : 'No Such Endpoint'})
        }))
    })
  });

describe('TOPICS API - RETURN ALL TOPICS', () => {
    test('GET - REQUEST SHOULD RETURN AN ARRAY OF OBJECTS', () => {
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
    
      test('EVERY ARRAY ITEM SHOULD CONTAIN THE CORRECT PROPERTIES', () => {
        return request(app)
          .get('/api/topics')
          .then((response) => {
            response.body.topics.forEach((element) => {
              expect(Object.keys(element)).toEqual(['slug' , 'description'])
            })
          })
      })
});

describe('Base API - RETURN ALL ENDPOINTS', () => {
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

describe('ARTICLES API - RETURN ARTICLE BY ARTICLE_ID', () => {
  test('GET request should return a 200 and an object', () => {
      return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then((response) => {
          console.log(response.body)
          expect(typeof response.body).toBe('object')
        })
  })
  test("Should return an error if article_id is an invalid input", () => {       
      return request(app)
        .get('/api/articles/test')
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toEqual('400 - INVALID COMMENT ID (NON-INT)')
        })
  })
  test("Should return an error if article_id is valid input but the file doesn't exist", () => {       
    return request(app)
      .get('/api/articles/5000')
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toEqual('404 - File Not Found')
      })
})
});

describe('ARTICLES API - RETURN ALL ARTICLES', () => {
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

describe('ARTICLES API - GET ARTICLE COMMENTS BY ARTICLE_ID', () => {
  test('GET request should return a 200 and an array', () => {
      return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then((response) => {
          console.log(response.body)
          console.log(response , 'RESPONSE')
          expect(Array.isArray(response.body.comments)).toBe(true)
          //Jest objectMatch
        })
  })

  test("Array entries should contain all the correct properties && should be properly sorted", () => {       
    return request(app)
      .get('/api/articles/1/comments')
      .then((response) => {
        response.body.comments.forEach((element) => {
          expect(Object.keys(element)).toEqual([ 'comment_id', 'body', 'article_id', 'author', 'votes', 'created_at' ])
          expect(response.body.comments).toBeSortedBy( 'created_at' , {descending : true})
        })
      })
  })

  test('Articles with no comments should return an empty array', () => {
    return request(app)
      .get('/api/articles/2/comments')
      .then((response) => {
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

describe('ARTICLES API - ADD ARTICLE COMMENT', () => {

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
        expect(response.body.msg).toEqual("404 - Article / User Doesn't Exist")
      })
  }) 

  test("Valid post request to an article that doesn't exist should return a 404 & message", () => {
    const commentPayload = {
      username : 'icellusedkars',
      body : 'Jest is the best!'
    }

    return request(app)
      .post('/api/articles/500/comments')
      .send(commentPayload)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toEqual("404 - Article / User Doesn't Exist")
      })
}) 
});

describe('ARTICLES API - PATCH VOTE COUNT', () => {

  test('PATCH request should return a 200 and the payload in response', () => {
    const votePayload = { inc_votes: 10 }

      return request(app)
        .patch('/api/articles/1')
        .send(votePayload)
        .expect(200)
        .then((response) => {
          expect(response.body.updated_article.votes).toBe(110)
        })
  })

  test('PATCH request with an incorrect value should return a 400 & message', () => {
    const votePayload = { inc_votes: 'ten' }

      return request(app)
        .patch('/api/articles/1')
        .send(votePayload)
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe('400 - INVALID COMMENT ID (NON-INT)')
        })
  })

  test('PATCH request to an incorrect endpoint should return a 404 & message', () => {
    const votePayload = { inc_votes: 10 }

      return request(app)
        .patch('/api/articles/500')
        .send(votePayload)
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Article Doesn't Exist / Error Reading Votes")
        })
  })
});

describe('ARTICLES API - DELETE COMMENT BY COMMENT_ID', () => {

  test('VALID REQUEST SHOULD RETURN A 204 ONLY (NO MESSAGE)', () => {
    return request(app)
        .delete('/api/comments/5')
        .expect(204)
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

describe('USERS API - GET LIST OF USERS', () => {

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

describe('ARTICLES API - REQUESTS WITH QUERIES', () => {

  test('GET request should return a 200 & query results', () => {
      return request(app)
        .get('/api/articles?topic=mitch')
        .expect(200)
        .then((response) => {
          expect(response.body.articles.length).toEqual(12)
        })
    })

  test('GET request with a query + a sort returns a correct query & a 200 ', () => {
    return request(app)
      .get('/api/articles?topic=mitch&sorted=Asc')
      .expect(200)
      .then((response) => {
        expect(response.body.articles.length).toEqual(12)
        expect(response.body.articles).toBeSortedBy( 'created_at' , {ascending : true})
      })
  })

  test('GET request with no query should return all results & a 200', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then((response) => {
        expect(response.body.articles.length).toEqual(13)
      })
  })


  test('Valid query topic with an invalid value should return a 400 & msg', () => {
    return request(app)
      .get('/api/articles?topic=invalid')
      .expect(400)
      .then((response) => {
        console.log(response.body)
        expect(response.body.msg).toEqual('400 - No Matches Found')
      })
  })

  test('Invalid query topic with an invalid value should return a 400 & msg', () => {
    return request(app)
      .get('/api/articles?test=invalid')
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toEqual('Non-Valid Query')
      })
  })
});
