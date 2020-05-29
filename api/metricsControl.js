const express = require('express');
let router = express.Router();
const { control } = require("../promClient/promController");
const online_log = require("online-log");
const log = online_log.log;
const baseURI = '/api/v1/control'

/*url to post an update to a metric
* format: body:{
    "metric": "test_gauge",
    "value": 2
    "operation": "set"
}
*/
//TODO: Check if requested metric existes and send error if not
router.post(baseURI + '/:type',(req, res)=> {
    

    const body = req.body;
    const type = req.params.type

    if(type !== "histogram" && type !== "gauge" &&  type !== "counter" && type !== "summary" ){
        log('DEBUG', 'Specified type is not recognised');
        res.status(400).send("Type not recognised")
        return
    }
    
    const { metric, value, operation, labels } = body

    log('DEBUG', `Metric request recieved for metric "${metric}" of type [${type}]`);

    if(labels){
        log('TRACE', 'Request contains labels specification');
        log('TRACE', `Performing operation over metric "${metric}" of type [${type}] with value [${value}] and labels ${JSON.stringify(labels)}`);
        try{
             control[type][operation](metric, value, labels);
             res.status(200).send("")
             return
        }
        catch(err){
            log('ERROR', `There has been an error performing operation "${operation}" over type [${type}]`);
            log('ERROR', err);
            res.status(500).send("There has been an internal error. Try again later")
            return
        }
    }
    else{
        log('TRACE', 'Request does not contain labels specification');
        log('TRACE', `Performing operation over metric "${metric}" of type [${type}] with value [${value}]`);

        try{
            control[type][operation](metric, value);
            res.status(200).send("")
            return
       }
       catch(err){
           log('ERROR', `There has been an error performing operation "${operation}" over type [${type}]`);
           log('ERROR', err);
           res.status(500).send("There has been an internal error. Try again later")
           return
       }

    }

})

router.get(baseURI + '/resetMetrics', (req, res)=>{

    log('DEBUG', 'Recieved request to reset register metrics');

    const { resetMetrics, register } = require('../promClient/promClient');

    try{
        resetMetrics(register)
        log('DEBUG', 'Register metrics reseted successfully');
        res.status(200).send("Register metrics reseted successfully")
    }
    catch (err) {
            loge('ERROR', 'Error resing register metrics');
            res.status(500).send("Error trying to reset register metrics")
        }




})



module.exports = router;