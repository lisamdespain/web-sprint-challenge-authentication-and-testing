// Write your tests here
const db = require('../data/dbConfig');
const Users = require('../api/auth/users-model');
const request = require('supertest');
const server = require('./server')
const user1 = {username: 'mabel', password: 'treats'}

beforeAll(async () =>{
  await db.migrate.rollback();
  await db.migrate.latest();
})

afterAll(async () =>{
  await db.destroy();
})

beforeEach(async () =>{
  await db('users').truncate();
})

test('[1] sanity', () => {
  expect(true).not.toBe(false)
})

test('[2] environment check', () =>{
  expect(process.env.NODE_ENV).toBe('testing')
})

describe('auth POSTS', () =>{
  test('[3] POST /register adds new user to the database', async () => {
    await request(server).post('/api/auth/register').send(user1);
    const user = await db('users').first();
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('username');
    expect(user).toHaveProperty('password');
    expect(user.username).toBe('mabel')
});

test('[4] POST /register responds with the new user', async () => {
  const response = await request(server).post('/api/auth/register').send(user1);
  expect(response.statusCode).toBe(201);
  expect(response.body).toHaveProperty('id');
  expect(response.body).toHaveProperty('username');
  expect(response.body).toHaveProperty('password');
  expect(response.body.password).not.toEqual(user1.password);
  expect(response.body.username).toBe('mabel')
});

test('[5] POST /login existing user', async () => {
  let res = await request(server).post('/api/auth/login').send(user1);
  expect(res.body.id).toBe(1);
  expect(res.body.username).toBe('mabel');

  let result = await Users.findById(1);
  expect(result.username).toBe('mabel');
});

test('[6] POST /login if credentials do not match, do not log in', async () => {
  let res = await request(server).post('/api/auth/login').send({ notAName: 'blah' });
  expect(res.body).toEqual({ message: 'username and password required' });
  expect(res.status).toBe(400);
});
})

describe('jokes endpoint testing', () =>{
  test('[7] can NOT get jokes when not logged in', async () =>{
    let result = await request(server).get('/api/jokes');
        expect(result.statusCode).toBe(400);
        expect(result.body).toBe({message: 'token required'});
  })

  test('[8] CAN get jokes when logged in', async () =>{
    let result = await request(server).get('/api/jokes');
        expect(result.statusCode).toBe(200);
        expect(result.body).toBeInstanceOf(Array);
        expect(result.body).toHaveLength(3);
  })
})