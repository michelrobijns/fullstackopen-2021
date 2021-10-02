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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
