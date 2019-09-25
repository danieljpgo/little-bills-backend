import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Goals } from '.'

const app = () => express(apiRoot, routes)

let userSession, anotherSession, goals

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '123456' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  goals = await Goals.create({ user })
})

test('POST /goals 201 (user)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession, startTime: 'test', endTime: 'test', startValue: 'test', endValue: 'test', status: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.startTime).toEqual('test')
  expect(body.endTime).toEqual('test')
  expect(body.startValue).toEqual('test')
  expect(body.endValue).toEqual('test')
  expect(body.status).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('POST /goals 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /goals 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
  expect(typeof body.rows[0].user).toEqual('object')
})

test('GET /goals 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /goals/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${goals.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(goals.id)
  expect(typeof body.user).toEqual('object')
})

test('GET /goals/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${goals.id}`)
  expect(status).toBe(401)
})

test('GET /goals/:id 404 (user)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: userSession })
  expect(status).toBe(404)
})

test('PUT /goals/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${goals.id}`)
    .send({ access_token: userSession, startTime: 'test', endTime: 'test', startValue: 'test', endValue: 'test', status: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(goals.id)
  expect(body.startTime).toEqual('test')
  expect(body.endTime).toEqual('test')
  expect(body.startValue).toEqual('test')
  expect(body.endValue).toEqual('test')
  expect(body.status).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('PUT /goals/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${goals.id}`)
    .send({ access_token: anotherSession, startTime: 'test', endTime: 'test', startValue: 'test', endValue: 'test', status: 'test' })
  expect(status).toBe(401)
})

test('PUT /goals/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${goals.id}`)
  expect(status).toBe(401)
})

test('PUT /goals/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: anotherSession, startTime: 'test', endTime: 'test', startValue: 'test', endValue: 'test', status: 'test' })
  expect(status).toBe(404)
})

test('DELETE /goals/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${goals.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /goals/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${goals.id}`)
    .send({ access_token: anotherSession })
  expect(status).toBe(401)
})

test('DELETE /goals/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${goals.id}`)
  expect(status).toBe(401)
})

test('DELETE /goals/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: anotherSession })
  expect(status).toBe(404)
})
