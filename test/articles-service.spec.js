
//import the service object with all the function keys
const ArticlesService = require('../src/articles-service');
//call the knex library
const knex = require('knex');



let testArticles = [
  {
    id: 97,
    title: 'First test post!',
    date_published: new Date('2029-01-22T16:28:32.615Z'),
    content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?'
  },
  {
    id: 98,
    title: 'Second test post!',
    date_published: new Date('2100-05-22T16:28:32.615Z'),
    content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, exercitationem cupiditate dignissimos est perspiciatis, nobis commodi alias saepe atque facilis labore sequi deleniti. Sint, adipisci facere! Velit temporibus debitis rerum.'
  },
  {
    id: 99,
    title: 'Third test post!',
    date_published: new Date('1919-12-22T16:28:32.615Z'),
    content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus, voluptate? Necessitatibus, reiciendis? Cupiditate totam laborum esse animi ratione ipsa dignissimos laboriosam eos similique cumque. Est nostrum esse porro id quaerat.'
  },
];
//testing articles service object
describe('Articles service object', function () {
  let db;
  
  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
  });

  
  after(() => db.destroy());

  before(() => db('blogful_articles').truncate());

  afterEach(() => db('blogful_articles').truncate());


  context('Given "blogful_articles" has data', () => {
    before(() => {
      return db
        .into('blogful_articles')
        .insert(testArticles);
    });
    
    it('getAllArticles() resolves all articles from "blogful_articles" table', () => {
      //test here
      return ArticlesService.getAllArticles(db)
        .then(actual => {
          expect(actual).to.eql(testArticles.map(article => ({
                       ...article,
                       date_published: new Date(article.date_published)
                     })))
        })
    })
  });

  context(`Given 'blogful_articles' has no data`, () => {
     it(`getAllArticles() resolves an empty array`, () => {
       return ArticlesService.getAllArticles(db)
         .then(actual => {
           expect(actual).to.eql([])
         })
     })
   })
});

  
 

