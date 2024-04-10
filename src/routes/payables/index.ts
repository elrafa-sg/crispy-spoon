import { Hono } from 'hono'

import { pgClient } from '../../database/postgresql'

const PayableController = new Hono()

PayableController.get('/', async (c) => {
    let balance = { available: 0, waiting_funds: 0 }

    try {
        const transactionList = await pgClient.transaction.findMany({
            include: {
                payable: true
            }
        })

        transactionList.map(t => {
            switch (t.payable?.status) {
                case 'PAID':
                    balance.available += Math.round(t.amount - ((t.amount / 100) * t.payable.fee))
                case 'WATING_FUNDS':
                    balance.waiting_funds += Math.round(t.amount - ((t.amount / 100) * t.payable.fee))
            }
        })

        c.status(200)
    }
    catch (err) {
        c.status(500)
    }

    return c.json(balance)
})


export default PayableController