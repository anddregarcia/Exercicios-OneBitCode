const Post = require('./Post')

class Author{
    constructor(name)
    {
        this.name = name
        this.listOfPosts = []
    }

    createPost(title, comment)
    {
        const post = new Post(title, comment, this)
        this.listOfPosts.push(post)
        return post
    }
}

module.exports = Author