const promClient = require('../promClient/promClient')
const expect = require("chai").expect;



//initialing tests



//Correct initializing
describe("Initializating test", () => {

  beforeEach(() => {
    const client = require('prom-client')
    client.register.clear()
    promClient.register.clear()
    
  })
  it("initialize correctly", (done) => {
    
    //Generate mokups 
    const correctMK = [
      {
        name: 'test_gauge',
        type: 'Gauge',
        info: { name: 'web_test_gauge', help: 'Total test gauge' }
      },
      {
        name: 'test_gauge1',
        type: 'Gauge',
        info: { name: 'web_test_gauge2', help: 'Total test gauge' }
      }
    ]
    const client = require('prom-client');
    expect(promClient.generateMetricsFromConfig(client, correctMK)).to.equal(0)
    done()
  });
  it("Initialize with exit code 2", (done) => {
   
    //Generate mokups 
    const incorrectMK = [
      {
        name: 'test_gauge',
        type: 'Gauge',
        info: { name: 'web_test_gauge', help: 'Total test gauge' }
      },
      {
        name: 'test_gauge',
        type: 'Gauge',
        info: { name: 'web_test_gauge2', help: 'Total test gauge' }
      }
    ]
     let client = require('prom-client');
    
    expect(promClient.generateMetricsFromConfig(client, incorrectMK)).to.equal(2)
    done();
  })
})

