import { beforeAll, afterAll, describe, it, expect, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'

import { app } from '../src/app'

describe('transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'Transação Teste',
        amount: 5000,
        type: 'debit',
      })
      .expect(201)
  })

  it('should be able to list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Transação Teste',
        amount: 5000,
        type: 'debit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')!

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(listTransactionsResponse.body.transactionsList).toEqual([
      expect.objectContaining({
        title: 'Transação Teste',
        amount: -5000,
      }),
    ])
  })

  it('should be able to get a specific transaction', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Transação Teste',
        amount: 5000,
        type: 'debit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')!

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    const transactionId = listTransactionsResponse.body.transactionsList[0].id

    const singleTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)
      .expect(200)

    // console.log(singleTransactionResponse.body)

    expect(singleTransactionResponse.body).toEqual(
      expect.objectContaining({
        title: 'Transação Teste',
        amount: -5000,
      }),
    )
  })

  it('should be able to list a summary of all the transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Transação Teste Salário',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')!

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        title: 'Transação Teste Contas',
        amount: 1200,
        type: 'debit',
      })

    const summaryResponse = await request(app.server)
      .get(`/transactions/summary`)
      .set('Cookie', cookies)
      .expect(200)

    expect(summaryResponse.body.summary).toEqual({
      amount: 5000 - 1200,
    })
  })
})
