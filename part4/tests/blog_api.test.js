const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('the correct amount of blogs is returned', async () => {
    const currentBlogs = await helper.blogsInDb()
    expect(currentBlogs.length).toEqual(2)
  })

  test('unique identifier property is named id', async () => {
    const currentBlogs = await helper.blogsInDb()
    expect(currentBlogs[0].id).toBeDefined()
  })
})

describe('making an HTTP POST request to the /api/blogs url', () => {
  test('successfully creates a new blog post', async () => {
    const newBlog = {
      title: 'Test Blog Post Title',
      author: 'Yours Truly',
      url: 'https://example.com',
      likes: 3
    }

    const addedBlog = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfterAdd = await helper.blogsInDb()
    expect(blogsAfterAdd).toHaveLength(helper.initialBlogs.length + 1)

    delete addedBlog.body.id

    expect(addedBlog.body).toEqual(newBlog)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
