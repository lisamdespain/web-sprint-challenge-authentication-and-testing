// Write your tests here
const db = require('../data/dbConfig');
const Users = require('../api/auth/users-model');
const auth = require('../api/auth/auth-router');
const request = require('supertest');
const jokes = require('../api/jokes/jokes-router');

test('[1] sanity', () => {
  expect(true).toBe(true)
})

beforeAll(async () =>{
  await db.migrate.rollback();
  await db.migrate.latest();
})

beforeEach(async () =>{
  await db('users').truncate();
  await db.seed.run();
})

afterAll(async () =>{
  await db.destroy();
})

test('[2] environment check', () =>{
  expect(process.env.NODE_ENV).toBe('testing')
})

describe('model tests', () =>{
  test('[3] findById', async() =>{
    let result = await Users.findById(1);
    expect(result).toBeDefined();
    expect(result.id).toBe(1);
    expect(result.username).toBe('Lisa');
    
    result = await Users.findById(22);
    expect(result).not.toBeDefined();
  })
  test('[4] insert', async () =>{
    let result = await Users.add({username: 'Mabel', password: 'puppytreats'});
    expect(result).toBeDefined();
    expect(result.id).toBe(5);
    expect(result.username).toBe('Mabel');

    result = await Users.findById(5);
    expect(result.username).toBe('Mabel');
  })
})

describe('router tests', () =>{
  test('[5] POST /register', async () => {
    let res = await request(auth).post('/register').send({ name: 'Mabel', password: 'puppy_treats' });
    expect(res.body.id).toBe(5);
    expect(res.body.username).toBe('Mabel');

    let result = await Users.findById(5);
    expect(result.username).toBe('Mabel');

    res = await request(auth).post('/register').send({ notAName: 'blah' });
    expect(res.body).toEqual({ message: 'username and password required' });
    expect(res.status).toBe(400);
});
test('[6] POST /login', async () => {
  let res = await request(auth).post('/login').send({ name: 'Lisa', password: 'password1' });
  expect(res.body.id).toBe(1);
  expect(res.body.username).toBe('Lisa');

  let result = await Users.findById(1);
  expect(result.username).toBe('Lisa');

  res = await request(auth).post('/login').send({ notAName: 'blah' });
  expect(res.body).toEqual({ message: 'username and password required' });
  expect(res.status).toBe(400);
});
})

describe('jokes testing', () =>{
  test('[6] can NOT get jokes when not logged in', async () =>{
    let result = await request(jokes).get('/');
        expect(result.statusCode).toBe(400);
        expect(result.body).toBe({message: 'token required'});
  })
  test('[7] CAN get jokes when logged in', async () =>{
    let result = await request(jokes).get('/');
        expect(result.statusCode).toBe(200);
        expect(result.body).toBeInstanceOf(Array);
        expect(result.body).toHaveLength(3);
  })
})