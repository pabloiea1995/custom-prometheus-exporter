
const configuration = require('./configuration/configuration')

//Initialize server
const { port } = configuration;
const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const cors = require('cors')

server.use(cors())
//Initialize logs
const online_log = require("online-log");
online_log(server, {
  enable_console_print: true,
  enable_colorful_console: true
});
//asign logging main function
const log = online_log.log;

server.use(bodyParser.json({ limit: '50mb' }));
server.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

//routes
server.use('',require('./api/metricsControl'));



//Initializing prometheus client
const promClient = require('./promClient/promClient');

let promClientInitializationResult = promClient.initializeRegister();

//variable to store promtheus client initialization attempts 
let initalizationAttempts = 0
let initializationDone = false
while (!initializationDone && initalizationAttempts < 4) {

  if(initalizationAttempts > 0){
   
    log('DEBUG', `Attempt number ${initalizationAttempts + 1} of prometheus client initialization`);
  
  }

  if (promClientInitializationResult == 2) {
    log('WARN', 'Initialization of prometheus client has terminated with errors, review configuration file!');
    initializationDone = true
    initalizationAttempts = 4
  }
  else if (promClientInitializationResult == 1) {
    log('WARN', 'Initialization of prometheus client has not terminated successfully, retrying it');
    initalizationAttempts++;
    promClientInitializationResult = promClient.initializeRegister();
  }
  else if (promClientInitializationResult == 0){
    log('DEBUG', 'Initialization of prometheus client has  terminated successfully');
    initializationDone = true
    initalizationAttempts = 4
  }
}

if (!initializationDone){

    log('ERROR', 'Initialization of prometheus client not done, exiting program execution');
    process.exit(1);
}
else{
  server.get('/metrics', (req, res) => {
    res.set('Content-Type', promClient.register.contentType);
    res.end(promClient.register.metrics());
  });
}
//Enable collection of default metrics
//client.collectDefaultMetrics();

log('INFO', `Server listening to ${port}, metrics exposed on /metrics endpoint`);
server.listen(port);