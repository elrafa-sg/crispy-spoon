import { Queue } from 'bullmq'

const connection = {
    hostname: 'localhost',
    port: 6379
}

const transactionQueue = new Queue('TransactionQueue', {
    connection: {
        host: 'localhost',
        port: 6379
    }
})

export { connection, transactionQueue }