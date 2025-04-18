const Comment = require('./Comment')

class Post {
    constructor (title, comment, author)
    {
        this.title = title
        this.author = author
        this.comment = comment
        this.listOfComments = []
        this.createdAt = Date()
    }

    addComment(comment, username)
    {
        this.listOfComments.push(new Comment(comment, username))
    }
}

module.exports = Post