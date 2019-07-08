const soap = require('soap');
const moment = require('moment');
const _ = require('lodash');

class Cbr {
    async getGetCursOnDate () {
        var url = 'http://www.cbr.ru/DailyInfoWebServ/DailyInfo.asmx?WSDL';
        var args = {'On_date': moment().format('YYYY-MM-DD')};

        let curs = await soap.createClientAsync(url)
            .then((client) => {
                return client.GetCursOnDateAsync(args);
            }).then((result) => {
                return result;
            });

        return _.get(curs, '[0].GetCursOnDateResult.diffgram.ValuteData.ValuteCursOnDate');
    }
}
const cbr = new Cbr();

module.exports.cbr = cbr;

