//Test to verify that configuration file is correctly formed

const promClient = require('../promClient/promClient')
const expect = require("chai").expect;



//initialing tests



//Correct initializing
describe("Well formed configuration file", () => {

  beforeEach(() => {
    const client = require('prom-client')
    client.register.clear()
  })
  it("Read config file and initialize register", (done) => {
    
    const promClient = require('../promClient/promClient')
    
    expect(promClient.initializeRegister()).to.equal(0)
    
    done()
  });
  
})

