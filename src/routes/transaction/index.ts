import { Hono } from 'hono'

import { pgClient } from '../../database/postgresql'
import { Transaction } from '@prisma/client'
import { addDays } from 'date-fns'

const TransactionController = new Hono()

TransactionController.get('/', async (c) => {
    let transactionList: Transaction[] = []

    try {
        transactionList = await pgClient.transaction.findMany()
        c.status(200)
    }
    catch (err) {
        c.status(500)
    }

    return c.json({ transactionList })
})

TransactionController.post('/', async (c) => {
    const { amount, description, method,
        name, cpf, card_number, valid, cvv
    } = await c.req.json()

    const createdTransaction = await pgClient.transaction.create({
        data: {
            amount, description, method,
            name, cpf, card_number, valid, cvv
        }
    });

    switch (createdTransaction.method) {
        case "PIX":
            await pgClient.payable.create({
                data: {
                    transactionId: createdTransaction.id,
                    status: 'PAID',
                    fee: 2.99,
                    payment_date: new Date()
                }
            })
            break;
        case "CREDIT_CARD":
            await pgClient.payable.create({
                data: {
                    transactionId: createdTransaction.id,
                    status: 'WATING_FUNDS',
                    fee: 8.99,
                    payment_date: addDays(new Date(), 15)
                }
            })
            break;
    }

    c.status(200)

    return c.body(`Transação ${createdTransaction.id} criada com sucesso!`)
})

export default TransactionController