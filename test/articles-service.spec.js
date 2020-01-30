
//import the service object with all the function keys
const ArticlesService = require('../src/articles-service')
//call the knex library
const knex = require('knex')

//testing articles service object
describe(`Articles service object`, function() {

  let db
  let testArticles = [
    {
      id: 1,
      date_published: new Date('2029-01-22T16:28:32.615Z'),
      title: 'First test post!',
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?'
    },
    {
      id: 2,
      date_published: new Date('2100-05-22T16:28:32.615Z'),
      title: 'Second test post!',
      content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, exercitationem cupiditate dignissimos est perspiciatis, nobis commodi alias saepe atque facilis labore sequi deleniti. Sint, adipisci facere! Velit temporibus debitis rerum.'
    },
    {
      id: 3,
      date_published: new Date('1919-12-22T16:28:32.615Z'),
      title: 'Third test post!',
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus, voluptate? Necessitatibus, reiciendis? Cupiditate totam laborum esse animi ratione ipsa dignissimos laboriosam eos similique cumque. Est nostrum esse porro id quaerat.'
    },
  ]
  
  before('setup db', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
  })

  //removes all the rows before we insert new test data  
  before('insert mock data', () => db('blogful_articles').truncate())

  
  //this cleans up database for testing also...
  afterEach(() => db('blogful_articles').truncate())

  after('end connection to db', () => db.destroy())
   

    it(`getAllArticles() resolves all articles from 'blogful_articles' table`, () => {
        // test that ArticlesService.getAllArticles gets data from table
        return ArticlesService.getAllArticles(db)
         .then(actual => {
          expect(actual).to.eql(testArticles.map(article => ({
                     ...article,
                      date_published: new Date(article.date_published)
                    })))
      })
    })
  })

  context(`Given 'blogful_articles' has no data`, () => {
    it(`getAllArticles() resolves an empty array`, () => {
      return ArticlesService
      .getAllArticles(db)
        .then(actual => {
          expect(actual).to.eql([])
        })
    })
    it(`insertArticle() inserts an article and resolves the article with an 'id'`, () => {
        const newArticle = {
          title: 'Test new title',
          content: 'Test new content',
          date_published: new Date('2020-01-01T00:00:00.000Z'),
        }
        return ArticlesService.insertArticle(db, newArticle)
            .then(actual => {
                expect(actual).to.eql({
                  id: 1,
                  title: newArticle.title,
                  content: newArticle.content,
                  date_published: newArticle.date_published,
                })
            })
    })
    it(`getById() resolves an article by id from 'blogful_articles' table`, () => {
        const thirdId = 3
        const thirdTestArticle = testArticles[thirdId - 1]
        return ArticlesService.getById(db, thirdId)
          .then(actual => {
            expect(actual).to.eql({
              id: thirdId,
              title: thirdTestArticle.title,
              content: thirdTestArticle.content,
              date_published: thirdTestArticle.date_published,
            })
          })
    })

    it(`deleteArticle() removes an article by id from 'blogful_articles' table`, () => {
        const articleId = 3
        return ArticlesService.deleteArticle(db, articleId)
          .then(() => ArticlesService.getAllArticles(db))
          .then(allArticles => {
            // copy the test articles array without the "deleted" article
            const expected = testArticles.filter(article => article.id !== articleId)
            expect(allArticles).to.eql(expected)
          })
    })
    it(`updateArticle() updates an article from the 'blogful_articles' table`, () => {
        const idOfArticleToUpdate = 3
        const newArticleData = {
          title: 'updated title',
          content: 'updated content',
          date_published: new Date(),
        }
        return ArticlesService.updateArticle(db, idOfArticleToUpdate, newArticleData)
          .then(() => ArticlesService.getById(db, idOfArticleToUpdate))
          .then(article => {
            expect(article).to.eql({
              id: idOfArticleToUpdate,
              ...newArticleData,
            })
          })
    })
  })
