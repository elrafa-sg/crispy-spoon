import { PaymentMethod, Transaction } from "@prisma/client"
import { addDays } from 'date-fns'

import { pgClient } from "../database/postgresql"

type CreateTransactionParam = {
    amount: number,
    description: string,
    method: PaymentMethod,
    name: string,
    cpf: string,
    card_number: string
    valid: string,
    cvv: number 
}

class TransactionService {
    static async getTransactions() {
        let transactionList: Transaction[] = []

        transactionList = await pgClient.transaction.findMany({ include: { payable: false } })

        return transactionList
    }

    static async createTransaction(createTransactionParams: CreateTransactionParam) {
        const {
            amount, description, method,
            name, cpf, card_number, valid, cvv
        } = createTransactionParams

        const createdTransaction = await pgClient.transaction.create({
            data: {
                amount, description, method,
                name, cpf, card_number: card_number.substring(-4),
                valid, cvv
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

        return createdTransaction
    }
}

export { TransactionService }