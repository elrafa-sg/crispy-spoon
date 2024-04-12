import { PayableService } from '../services/PayableService';

describe('PayableService', () => {
    it('get balance should return available e waiting_funds values', async () => {
        const balance = await PayableService.getBalance();

        expect(balance).toEqual({
            available: expect.any(Number),
            waiting_funds: expect.any(Number)
        })
    });
});