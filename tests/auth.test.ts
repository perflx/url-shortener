import { expect, test, describe, it, beforeEach, afterAll, beforeAll } from 'vitest'
import app from '../src/app';
import request from 'supertest';
import prisma from '../src/shared/prisma';

let link = {
  shortURL: "shortcode",
  originalURL: "originalURL"
}


beforeAll(async () => {
  await prisma.link.deleteMany();
  await prisma.user.deleteMany();
});

describe('/POST auth/register', () => {

  it('creating user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'aa@gmail.com', password: '12345678' });

    expect(res.status).toBe(201);

  });

  it('creating existing user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'aa@gmail.com', password: '12345678' });

    expect(res.status).toBe(409);

  });

  it("create user with bad email", async() => {
    const res = await request(app).post("/auth/register")
      .send({email: "notemail.com", password: "12345678"});
    expect(res.status).toBe(400);
  })

  it("create user with short password", async() => {
    const res = await request(app).post("/auth/register")
      .send({email: "aab@gmail.com", password: "1234"});
    expect(res.status).toBe(400);
  })

  
  it("create user with long password", async() => {
    const res = await request(app).post("/auth/register")
      .send({email: "aab@gmail.com", password: "12345671234567123456712345671234567123456712345671234567123456712345671234567123456712345671234567123456712345671234567123"});
    expect(res.status).toBe(400);
  })

  it('creating user without data', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send();

    expect(res.status).toBe(400);

  });
});


describe('/POST auth/login', () => {

  it('login the actual user', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'aa@gmail.com', password: '12345678' });

      expect(res.status).toBe(200);
    });

  it('invalid email', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'adf@b.com', password: '12345678' });

    expect(res.status).toBe(401);
  });

  it('invalid password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'aa@gmail.com', password: '32132122' });

    expect(res.status).toBe(401);
  });

  it('bad request', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send();

    expect(res.status).toBe(400);
  });

  it('bad email', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'wrongemail', password: '12345678' });

    expect(res.status).toBe(400);
  });

  it('short password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'aa@gmail.com', password: '1234567' });

    expect(res.status).toBe(401);
  });

  it('long password (147 symbols)', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'wrongemail@mail.com', password: '123456712345671234567123456712345671234567123456712345671234567123456712345671234567123456712345671234567123456712345671234567123456712345671234567' });

      expect(res.status).toBe(400);
    });

});

describe("POST /link", ()=>{
  let authToken: string;
  beforeAll(async () => {
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({ email: 'aa@gmail.com', password: '12345678' });

    authToken = loginResponse.body.token;
  });


  it("creates shortened link", async ()=>{
    const originalURL = "https://www.youtube.com/";
    const res = await request(app).post("/link")
      .set(`Authorization`, `Bearer ${authToken}`)
      .send({link: originalURL});
    link = {shortURL: res.body.shortCode, originalURL: originalURL};
    expect(res.status).toBe(201);
  })

  it("tries to create without link", async() =>{
    const res = await request(app).post("/link")
      .set(`Authorization`, `Bearer ${authToken}`)
      .send();
      expect(res.status).toBe(400);
  })

  it("tries to create with wrong data", async() =>{
    const res = await request(app).post("/link")
      .set(`Authorization`, `Bearer ${authToken}`)
      .send({email: "ab@gmail.com", password: "12345678"});
      expect(res.status).toBe(400);
  })

  it("tries to create 11 links", async()=>{
    for (let i = 0; i < 9; i++ ){
      await request(app).post("/link").set(`Authorization`, `Bearer ${authToken}`).send({link: "https://www.youtube.com/"});
    }
    const res = await request(app).post("/link")
      .set(`Authorization`, `Bearer ${authToken}`)
      .send({link: "https://www.youtube.com/"});
    expect(res.status).toBe(429);
  })

  it("creates link without authorization", async ()=>{

    const res = await request(app).post("/link")
      .send({link: "https://www.youtube.com/"});
    expect(res.status).toBe(401);
  })

})


describe("GET redirect", ()=>{

  it("tries to redirect", async()=>{
    const res = await request(app).get("/" + link.shortURL);
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe(link.originalURL);
  })

  it("tries to redirect non-existing link", async()=>{
    const res = await request(app).get("/notarealurl");
    expect(res.status).toBe(404);
  })

})



afterAll(async () => {
  await prisma.link.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});