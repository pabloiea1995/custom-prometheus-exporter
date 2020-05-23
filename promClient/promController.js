//Module to define functionst to act on prom client metric by metric type
const promClient = require('./promClient')
const online_log = require("online-log");
const log = online_log.log;
var webMetrics = promClient.webMetrics

module.exports = {

    control: {
        /**
         * gauge.inc(); // Inc with 1
           gauge.inc(10); // Inc with 10
           gauge.dec(); // Dec with 1
           gauge.dec(10); // Dec with 10
           gauge.set(10);
         */
        gauge: {
            set: function (metric, value) {
                log('TRACE', `Performing set operation on type gauge`);
                try {
                    webMetrics[metric].set(value)
                }
                catch (err) {
                    log('ERROR', 'Error on set operation on gauge type');
                    log('ERROR', err);
                }

            },
            inc: function (metric, value) {
                log('TRACE', `Performing inc operation on type gauge`);
                try {
                    webMetrics[metric].inc(value)
                }
                catch (err) {
                    log('ERROR', 'Error on inc operation on type gauge ');
                    log('ERROR', err);
                }
            },
            dec: function (metric, value) {
                log('TRACE', `Performing dec operation`);
                try {
                    webMetrics[metric].dec(value)
                }
                catch (err) {
                    log('ERROR', 'Error on dec operation on gauge type');
                    log('ERROR', err);
                }
            }

        },
        counter: {
           
            inc: function (metric, value) {
                log('TRACE', `Performing inc operation on type counter`);
                try {
                    webMetrics[metric].inc(value)
                }
                catch (err) {
                    log('ERROR', 'Error on inc operation on type counter ');
                    log('ERROR', err);
                }
            }

        },
        //value is the bucket where to add a value
        histogram: {
            observe: function (metric, value, labels) {

                log('TRACE', `Performing observe operation on type histogram`);
                try {
                    if (labels) {
                        webMetrics[metric].observe(labels, value)
                    } else {
                        webMetrics[metric].observe(value)
                    }
                }
                catch (err) {
                    log('ERROR', 'Error on observe operation on histogram type');
                    log('ERROR', err);
                }
                
            }
        },
        summary: {
            observe: function (metric, value, labels) {

                log('TRACE', `Performing observe operation on type summary`);
                try {
                    if (labels) {
                        webMetrics[metric].observe(labels, value)
                    } else {
                        webMetrics[metric].observe(value)
                    }
                }
                catch (err) {
                    log('ERROR', 'Error on observe operation on summary type');
                    log('ERROR', err);
                }
                
            }
        },

    }


}