import { Hono } from 'hono'

const app = new Hono()

app.get('/transaction', (c) => {
  c.status(200)

  return c.json({transactions: []})
})

app.post('/transaction', (c) => {
  const bodyRecebido = c.req.parseBody()

  c.status(200)

  return c.json(bodyRecebido)
})

export default app
