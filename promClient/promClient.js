

const online_log = require("online-log");
const log = online_log.log;

module.exports.webMetrics = {}


function initializeRegister(){

    log('DEBUG', 'Initializing prometheus client');
    const client = require('prom-client');
    module.exports.register = client.register;
    //collecting default metrics 
    const collectDefaultMetrics = client.collectDefaultMetrics
    const register =  module.exports.register
    collectDefaultMetrics({ register })
    log('DEBUG', 'Generating metric from configuration file');
    
    return generateMetricsFromConfig(client);
}
/**
 * Generates prometheus client metrics from configuration file
 * @param {Object} client prometheus client object
 * return exit code: 0 ok, 1 err on file reading, 2 processed with errors
 */
function generateMetricsFromConfig(client, metricDefinitionTest){

    let metricsDefinition = []

    try{
        //List of object with the metrics to create
        metricsDefinition = require('../configuration/configuration').metricsDefinition
        log('INFO', `Total of ${metricsDefinition.length} metrics identified in configuration file`);
   
       // console.log(metricsDefinition)
    }
    catch (err) {

        log('ERROR', 'There has been an error trying to read the configuration file');
        log('ERROR', err);
        //On error return exit code 1
        return 1
    }
    
    //Testing variable
    if(metricDefinitionTest){
        metricsDefinition = metricDefinitionTest
    }

    log('DEBUG', 'Generating webMetrics object');
    

    //Variable to store those metrics that fail on creation
    let failedMetrics = []
    //Process the metricDefinition to generates metrics
    for (metric in metricsDefinition) {

        try{
            let metricObj = metricsDefinition[metric]

            if(Object.keys(module.exports.webMetrics).includes(metricObj.name)){


                log('ERROR', 'Trying to generate metric that already exists');
                throw new Error('Repeated metric name')

            }
            log('TRACE', `Generating metric for config object "${metricObj.name}" of type "${metricObj.type}"`);
            module.exports.webMetrics[metricObj.name] = {}
    
            let options = {}
                    options.name = metricObj.info.name
                    options.help = metricObj.info.help
            
            switch (metricObj.type) {
                case "Gauge":
                    module.exports.webMetrics[metricObj.name] = new client.Gauge(metricObj.info)
                    break
                case "Counter":
                    if(metricObj.labelNames){
                        options.labelNames = metricObj.labelNames
                    }
                    module.exports.webMetrics[metricObj.name] = new client.Counter(options)
                    break
                case "Histogram":
                    
                    if(metricObj.buckets){
                        options.buckets = metricObj.buckets
                    }
                    if(metricObj.labelNames){
                        options.labelNames = metricObj.labelNames
                    }
                    module.exports.webMetrics[metricObj.name] = new client.Histogram(options)
                    
                    break
                case "Summary":

                    if(metricObj.percentiles){
                        options.percentiles = metricObj.percentiles
                    }
                    if(metricObj.maxAgeSeconds){
                        options.maxAgeSeconds = metricObj.maxAgeSeconds
                    }
                    if(metricObj.ageBuckets){
                        options.ageBuckets = metricObj.ageBuckets
                    }
                    module.exports.webMetrics[metricObj.name] = new client.Summary(options)
                    break
                default:
                    throw new Error(`Unknown or missing metric type for metric ${metric}`)
            }
    
        }
        catch(err){
            log('ERROR', `There has been an error processing metric ${metric}`);
            failedMetrics.push(metric)
            log('ERROR', err);

        }
        
    }
    console.log(module.exports.webMetrics)
    log('INFO', `Finallized web metrics creation with ${failedMetrics.length} errors`);
    return failedMetrics.length == 0 ? 0 : 2

}

module.exports.initializeRegister = initializeRegister
module.exports.generateMetricsFromConfig = generateMetricsFromConfig
module.exports.resetMetrics = (register) => {

    log('DEBUG', 'Reseting metrics');
    try{
        register.resetMetrics()

    }
    catch(err){
        log('ERROR', 'There has been an error trying to reset metrics');
        log(err)
    }
}