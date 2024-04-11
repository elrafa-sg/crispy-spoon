import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { Transaction } from '@prisma/client'

import { TransactionService } from '../../services/TransactionService'

const TransactionController = new OpenAPIHono()

TransactionController.get('/', async (c) => {
    let transactionList: Transaction[] = []

    try {
        transactionList = await TransactionService.getTransactions()
        c.status(200)
        return c.json({ transactionList })
    }
    catch (err) {
        c.status(500)
        return c.json({ message: 'Internal Server Error' })
    }
})

TransactionController.post('/', async (c) => {
    const { amount, description, method,
        name, cpf, card_number, valid, cvv
    } = await c.req.json()

    try {
        const createdTransaction = await TransactionService.createTransaction({
            amount, description, method,
            name, cpf, card_number, valid, cvv
        })

        c.status(200)
        return c.body(`Transação ${createdTransaction.id} criada com sucesso!`)
    }
    catch (err) {
        c.status(500)
        return c.body(`Internal Server Error`)
    }
})

// SWAGGER / OPEN API
const defaultResponse = z.object({
    message: z.string()
})

const TransactionSchema = z.object({
    id: z.number(),
    amount: z.number(),
    description: z.string(),
    method: z.enum(['PIX', 'CREDIT_CARD']),
    name: z.string(),
    cpf: z.string(),
    card_number: z.string(),
    valid: z.string(),
    cvv: z.number()
})

const CreateTransactionParam = z.object({
    amount: z.number(),
    description: z.string(),
    method: z.enum(['PIX', 'CREDIT_CARD']),
    name: z.string(),
    cpf: z.string(),
    card_number: z.string(),
    valid: z.string(),
    cvv: z.number()
})

const getTransactions = createRoute({
    method: "get",
    path: "/",
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: z.array(TransactionSchema)
                },
            },
            description: "Get a list with all transactions",
        },
        500: {
            content: {
                "application/json": {
                    schema: defaultResponse
                },
            },
            description: "Internal server error"
        },
    }
});

const createTransaction = createRoute({
    method: "post",
    path: "/",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: CreateTransactionParam
                }
            }
        }
    },
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: defaultResponse,
                },
            },
            description: "Create a transaction",
        },
        500: {
            content: {
                "application/json": {
                    schema: defaultResponse
                },
            },
            description: "Internal server error"
        },
    }
})

TransactionController.openapi(getTransactions, async (c) => {
    let transactionList: Transaction[] = []

    try {
        transactionList = await TransactionService.getTransactions()
        c.status(200)
        return c.json(transactionList)
    }
    catch (err) {
        c.status(500)
        return c.json({ message: 'Internal Server Error' })
    }
});

TransactionController.openapi(createTransaction, async (c) => {
    const { amount, description, method,
        name, cpf, card_number, valid, cvv
    } = await c.req.json()

    try {
        const createdTransaction = await TransactionService.createTransaction({
            amount, description, method,
            name, cpf, card_number, valid, cvv
        })

        c.status(200)
        return c.json({ message: `Transação ${createdTransaction.id} criada com sucesso!` })
    }
    catch (err) {
        c.status(500)
        return c.json({ message: `Internal Server Error` })
    }
});


export default TransactionController