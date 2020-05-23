const expect = require("chai").expect;

//FIXME
//Correct initializing
describe("Controller test", () => {

    beforeEach(() => {
      const client = require('prom-client')
      client.register.clear()
    })
    it("Type gauge, operation set without labels", (done) => {
      
      //Generate mokups 
      const correctMK = [
        {
          name: 'test_gauge',
          type: 'Gauge',
          info: { name: 'web_test_gauge', help: 'Total test gauge' }
        },
        
      ]

        const requestMK = {
            "metric": "test_gauge",
            "value": 16,
            "operation": "set"
        }
        const { metric, value, operation } = requestMK

      const promClient = require('../promClient/promClient');
      const client = require('prom-client')
      promClient.initializeRegister()
      promClient.generateMetricsFromConfig(client, correctMK)
      const control = require('../promClient/promController').control
      const type = "gauge"

      console.log(control[type][operation](metric, value))
      
     expect(control[type][operation](new client.Gauge(
        { name: 'controller_test_gauge', help: 'Total test gauge' }
      ), value)).not.to.throw(Error());

      done()
    });
  })
  
  