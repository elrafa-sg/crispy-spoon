import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'

import { PayableService } from '../../services/PayableService'

const PayableController = new OpenAPIHono()

PayableController.get('/', async (c) => {
    let balance = { available: 0, waiting_funds: 0 }

    try {
        balance = await PayableService.getBalance()
        c.status(200)
        return c.json(balance)
    }
    catch (err) {
        c.status(500)
        return c.json({message: 'Internal Server Error'})
    }   
})


// SWAGGER / OPEN API
const defaultResponse = z.object({
    message: z.string()
})

const getPayablesResponse = z.object({
    available: z.number(),
    waiting_funds: z.number(),
})

const getPayables = createRoute({
    method: "get",
    path: "/",
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: getPayablesResponse,
                },
            },
            description: "Get payables separated by available e waiting funds",
        },
        500: {
            content: {
                "application/json": {
                    schema: defaultResponse,
                },
            },
            description: "Internal server error"
        },
    }
});

PayableController.openapi(getPayables, async (c) => {
    let balance = { available: 0, waiting_funds: 0 }

    try {
        balance = await PayableService.getBalance()
        c.status(200)
        return c.json(balance)
    }
    catch (err) {
        c.status(500)
        return c.json({message: 'Internal Server Error'})
    }   
});


export default PayableController