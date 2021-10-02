const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.reduce((previous, current) => {
      return previous + current.likes
    }, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.length === 0
    ? {}
    : blogs.reduce((previous, current) => {
      return (previous.likes >= current.likes) ? previous : current
    })
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {}
  }

  let blogsByAuthor = {}
  let mostBlogsAuthor = {
    author: 'N/A',
    blogs: -1
  }

  blogs.forEach(blog => {
    if (blogsByAuthor[blog.author]) {
      blogsByAuthor[blog.author] += 1
    } else {
      blogsByAuthor[blog.author] = 1
    }

    if (mostBlogsAuthor.author !== blog.author &&
       blogsByAuthor[blog.author] > mostBlogsAuthor.blogs) {
      mostBlogsAuthor.author = blog.author
      mostBlogsAuthor.blogs = blogsByAuthor[blog.author]
    }

    if (mostBlogsAuthor.author === blog.author) {
      mostBlogsAuthor.blogs = blogsByAuthor[blog.author]
    }
  })

  return mostBlogsAuthor
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}
