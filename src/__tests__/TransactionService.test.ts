import { TransactionService } from "../services/TransactionService";

describe('TransactionService', () => {
    it('get transactions should return an array of transactions', async () => {
        const transactionsList = await TransactionService.getTransactions();

        expect(transactionsList).toEqual(
            expect.arrayContaining([
                {
                    id: expect.any(Number),
                    amount: expect.any(Number),
                    description: expect.any(String),
                    method: expect.any(String),
                    name: expect.any(String),
                    cpf: expect.any(String),
                    card_number: expect.any(String),
                    valid: expect.any(String),
                    cvv: expect.any(Number)
                }
            ])
        )
    })

    it('should create and return the created transaction', async () => {
        jest.mock("../services/TransactionService", () => ({
            TransactionService: {
                createTransaction: jest.fn().mockResolvedValue({
                    id: 1,
                    amount: 123,
                    description: 'Teste PIX',
                    method: 'PIX',
                    name: 'John Foo',
                    cpf: '12345678912',
                    card_number: '1234567890123456',
                    valid: '1031',
                    cvv: 123
                })
            }
        }));

        const createdTransaction = await TransactionService.createTransaction({
            amount: 123,
            description: 'Teste PIX',
            method: 'PIX',
            name: 'John Foo',
            cpf: '12345678912',
            card_number: '1234567890123456',
            valid: '1031',
            cvv: 123
        });

        expect(createdTransaction).toEqual({
            id: expect.any(Number),
            amount: expect.any(Number),
            description: expect.any(String),
            method: expect.any(String),
            name: expect.any(String),
            cpf: expect.any(String),
            card_number: expect.any(String),
            valid: expect.any(String),
            cvv: expect.any(Number),
        })
    })
})
