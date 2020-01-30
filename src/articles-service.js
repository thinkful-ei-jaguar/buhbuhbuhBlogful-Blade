//service means it serves as we are asking it to serve something for us


const ArticlesService = {
  //function inside our service object
  getAllArticles: function (knex) {     //shorthand is getAllArticles() {}, this is the first key!
    return knex.select('*').from('blogful_articles');   
  },
  insertArticle(knex, newArticle) {
    return knex
      .insert(newArticle)
      .into('blogful_articles')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  }, 
  getById(knex, id) {
    return knex.from('blogful_articles').select('*').where('id', id).first();
  },
  deleteArticle(knex, id) {
    return knex('blogful_articles')
      .where({ id })
      .delete();
  },
  updateArticle(knex, id, newArticleFields) {
    return knex('blogful_articles')
      .where({ id })
      .update(newArticleFields);
  },
};

module.exports = ArticlesService;