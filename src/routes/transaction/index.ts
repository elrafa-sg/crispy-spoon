import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { Transaction } from '@prisma/client'
import { parseISO } from 'date-fns'

import { transactionQueue } from '../../bullmq.config'
import { TransactionService } from '../../services/TransactionService'

const TransactionController = new OpenAPIHono()

type TransactionData = {
    amount: number
    description: string,
    method: string,
    name: string,
    cpf: string,
    card_number: string,
    valid: string,
    cvv: number
}

// ROTAS
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
    const requestBody = await c.req.json()

    const errors = validateTransactionData(requestBody)
    if (errors.length > 0) {
        c.status(422);
        return c.json(errors)
    }

    const { amount, description, method,
        name, cpf, card_number, valid, cvv
    } = requestBody

    await transactionQueue.add(`Transaction:${cpf}:${new Date().valueOf()}`, {
        amount, description, method,
        name, cpf, card_number, valid, cvv
    });

    c.status(202)
    return c.json({ message: `Transação enviada para processamento com sucesso!` })
})

//#region VALIDAÇÕES
function validateTransactionData(data: TransactionData) {
    const errors = [];
    const { amount, description, method,
        name, card_number, valid, cvv
    } = data

    // Validação do valor da transação
    if (!Number.isInteger(amount) || amount <= 0) {
        errors.push('Campo "amount" inválido: valor deve ser um número inteiro positivo em centavos');
    }

    // Validação da descrição da transação
    if (!description || typeof description !== 'string') {
        errors.push('Campo "description" inválido: deve ser uma string');
    }

    // Validação do nome do pagador
    if (!name || typeof name !== 'string') {
        errors.push('Campo "name" inválido: deve ser uma string');
    }

    // Validação do método de pagamento
    if (!['PIX', 'CREDIT_CARD'].includes(method)) {
        errors.push('Campo "method" inválido: deve ser "PIX" ou "CREDIT_CARD"');
    }

    // Validação do número do cartão (se CREDIT_CARD)
    if (method === 'CREDIT_CARD' && (!card_number || typeof card_number !== 'string')) {
        errors.push('Campo "card_number" inválido: formato de número de cartão inválido');
    }

    // Validação da data de validade (se CREDIT_CARD)
    function isValidCardDate(valid: string) {
        const parsedISO = parseISO(valid)
        if (parsedISO instanceof Date && !isNaN(parsedISO.getTime())) {
            return true
        }
        return false
    }
    if (method === 'CREDIT_CARD' && (!valid || typeof valid !== 'string' || !isValidCardDate(valid))) {
        errors.push('Campo "valid" inválido: formato de data de validade inválido (MMAA)');
    }

    // Validação do CVV (se credit_card)
    if (method === 'CREDIT_CARD' && (!cvv || !Number.isInteger(cvv) || cvv.toString().length != 3)) {
        errors.push('Campo "cvv" inválido: formato de código de segurança inválido');
    }

    return errors;
}
//#endregion

//#region SWAGGER / OPEN API
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
        422: {
            content: {
                "application/json": {
                    schema: z.array(z.string())
                }
            },
            description: 'Unprocessable Entity'
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
    const requestBody = await c.req.json()

    const errors = validateTransactionData(requestBody)
    if (errors.length > 0) {
        c.status(422);
        return c.json(errors)
    }

    const { amount, description, method,
        name, cpf, card_number, valid, cvv
    } = requestBody

    await transactionQueue.add(`Transaction:${cpf}:${new Date().valueOf()}`, {
        amount, description, method,
        name, cpf, card_number, valid, cvv
    });

    c.status(202)
    return c.json({ message: `Transação enviada para processamento com sucesso!` })
});
//#endregion

export default TransactionController