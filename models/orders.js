const util = require('util');
const mysql = require('mysql');
const cbr = require('./cbr.js').cbr;
const cfg = require('../config').cfg;

// mysql connection
const pool = mysql.createPool({
    connectionLimit: 10,
    host: cfg.mysql.host,
    user: cfg.mysql.user,
    password: cfg.mysql.password,
    database: cfg.mysql.database
});
const getConnection = util.promisify(pool.getConnection).bind(pool);

class Order {
    // list of orders from mysql
    async getOrders () {
        let connection = await getConnection();
        let query = util.promisify(connection.query).bind(connection);

        let q = `select
            orders.ID,
            orders.locator,
            DATE_FORMAT(orders.date_insert, '%Y-%m-%d %H:%i:%s') AS date_insert,
            orders.price,
            orders.currency,
            count(order_passengers.ID) as count
            from orders
            left join order_passengers on orders.ID = order_passengers.order_id
            group by orders.ID
            ;`;

        let orders =  await query(q);
        connection.release();

        return orders;
    }

    // get information from cbr and format list of orders from mysql
    async getOrderList () {
        // get data
        let [ orders, curses ] = await Promise.all([
            this.getOrders(),
            cbr.getGetCursOnDate()
        ]);
        if (! orders || ! orders.length) {
            return [];
        }
        // formating of orders
        orders = orders.map(o => {
            if (o.currency == 'RUB') {
                o.price_rub = o.price;
                return o;
            }

            let curs = curses.find(c => {
                return c.VchCode == o.currency;
            });
            if (curs) {
                o.price_rub = Math.ceil(o.price * curs.Vcurs);
            }
            return o;
        });

        return orders;
    }

    /**
     * get details of order from mysql
     * @param {Integer} id - id of order
     */
    async getOrderDetail (id) {
        id = parseInt(id);
        if (isNaN(id)) {
            return [];
        }

        let connection = await getConnection();
        let query = util.promisify(connection.query).bind(connection);

        let q = `select
            order_passengers.ID,
            order_passengers.order_id,
            order_passengers.name_first,
            order_passengers.name_second,
            orders.locator
            from order_passengers
            left join orders on order_passengers.order_id = orders.ID
            where order_passengers.order_id = ?
            order by order_passengers.ID
            ;`;

        let details =  await query(q, [id]);
        connection.release();

        return details;
    }

}
const order = new Order();

module.exports.order = order;
