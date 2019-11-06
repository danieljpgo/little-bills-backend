import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Transaction } from '.'

const app = () => express(apiRoot, routes)

let userSession, transaction

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  userSession = signSync(user.id)
  transaction = await Transaction.create({ user })
})

test('POST /transactions 201 (user)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession, wallet: 'test', category: 'test', value: 'test', description: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.wallet).toEqual('test')
  expect(body.category).toEqual('test')
  expect(body.value).toEqual('test')
  expect(body.description).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('POST /transactions 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /transactions 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
  expect(typeof body.rows[0].user).toEqual('object')
})

test('GET /transactions 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /transactions/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${transaction.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(transaction.id)
  expect(typeof body.user).toEqual('object')
})

test('GET /transactions/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${transaction.id}`)
  expect(status).toBe(401)
})

test('GET /transactions/:id 404 (user)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: userSession })
  expect(status).toBe(404)
})
