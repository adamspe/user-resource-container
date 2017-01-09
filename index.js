var appService = require('app-service');

appService.get().then(function(app){
    appService.addResource(app,appService.userResource());
    appService.start();
},appService.logAndExit);
