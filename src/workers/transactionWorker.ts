import { Worker } from 'bullmq';
import { TransactionService } from '../services/TransactionService';

import { connection } from '../bullmq.config'

async function processPayment(job: any) {
    const { amount, description, method, name, cpf, card_number, valid, cvv } = job.data;

    try {
        await TransactionService.createTransaction({
            amount, description, method,
            name, cpf, card_number, valid, cvv
        })
        return { success: true, message: 'Payment processed successfully' };
    }
    catch (err) {
        return { success: false, message: 'Payment process failed' };
    }
}

const transactionWorker = new Worker('TransactionQueue', processPayment, { connection, autorun: false });

transactionWorker.on('completed', (job) => {
    console.log(`Job ${job.id} completed successfully`);
});

transactionWorker.on('failed', (job: any, error) => {
    console.error(`Job ${job.id} failed:`, error);
});

transactionWorker.on('error', err => {
    console.error(err);
});

export { transactionWorker }