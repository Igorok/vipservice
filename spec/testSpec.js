const path = require('path');
const order = require(path.resolve(__dirname, '../models/orders.js')).order;
const cbr = require(path.resolve(__dirname, '../models/cbr.js')).cbr;

describe('Test data from api', () => {
    describe('Test count of orders', () => {
        it('orders count', async (done) => {
            try {
                const orders = await order.getOrders();
                expect(orders.length).toBe(10);
                done();
            } catch (e) {
                done(e);
            }
        });
    });

    describe('Test count of order details', () => {
        it('details count', async (done) => {
            try {
                const orders = await order.getOrderDetail(4);
                expect(orders.length).toBe(3);
                done();
            } catch (e) {
                done(e);
            }
        });
    });

    describe('Test cbr request', () => {
        it('soap', async (done) => {
            try {
                const curs = await cbr.getGetCursOnDate();
                expect(typeof(curs)).toBe('object');
                const usd = curs.find(c => (c.VchCode == 'USD'));
                expect(usd.Vcurs).toMatch(/\d.\d/);
                done();
            } catch (e) {
                done(e);
            }
        });
    });
});