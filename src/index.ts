import { Hono } from 'hono'

import TransactionController from './routes/transaction'

const app = new Hono()

app.route('/transaction', TransactionController)

export default app
