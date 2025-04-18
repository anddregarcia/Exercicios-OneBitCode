const Author = require('./Author')

const author = new Author('André')

const post = author.createPost("Javascript", "Estudos sobre Javascript.")

post.addComment("Criando novo comentário", "andre.garcia")

console.log(author)
console.log(post)