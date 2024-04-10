import { Hono } from 'hono'

import TransactionController from './routes/transaction'
import PayableController from './routes/payables'

const app = new Hono()

app.route('/transaction', TransactionController)
app.route('/payable', PayableController)

export default app
