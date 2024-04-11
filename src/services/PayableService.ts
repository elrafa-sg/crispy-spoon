import { pgClient } from "../database/postgresql"

class PayableService {
    static async getBalance() {
        let balance = { available: 0, waiting_funds: 0 }

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

        return balance
    }
}

export { PayableService }