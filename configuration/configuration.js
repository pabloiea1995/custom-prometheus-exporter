module.exports = {


    //configuraciones de la conexion a mongo
  
    readInstalationsConfig: function () {
      const yaml = require('js-yaml');
      const fs = require('fs');
      const path = require('path');
  
      try {
        let filePath = path.join(__dirname, '/configuration.yaml')

        const config = yaml.safeLoad(fs.readFileSync(filePath, 'utf8'));
        //const indentedJson = JSON.parse(config);
        module.exports.mainConfig = config;
        module.exports.port = config.deployment.port
        module.exports.metricsDefinition = config.metrics.metricsDefinition



  
  
        console.log("Configuracion de instalaciones leida con exito")
      } catch (e) {
        console.log(e);
      }
    }

}
   
      
  
  module.exports.readInstalationsConfig();
  
  