var AppContainer = require('app-container'),
    appModule = {
        init: function(container) {
            return container.addResource(AppContainer.userResource());
        },
        container: function(initPipeline) {
            return appModule.init(new AppContainer().init(initPipeline));
        }
    };

module.exports = appModule;
