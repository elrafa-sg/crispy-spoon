import { Transaction } from "@prisma/client"
import { addDays } from 'date-fns'

import { pgClient } from "../database/postgresql"

class TransactionService {
    static async getTransactions() {
        let transactionList: Transaction[] = []

        transactionList = await pgClient.transaction.findMany({ include: { payable: false } })

        return transactionList
    }

    static async createTransaction({ amount, description, method, name, cpf, card_number, valid, cvv }) {
        const createdTransaction = await pgClient.transaction.create({
            data: {
                amount, description, method,
                name, cpf, card_number: card_number.substr(-4),
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