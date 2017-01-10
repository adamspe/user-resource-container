var AppContainer = require('app-container'),
    appModule = {
        init: function(container) {
            return container.addResource(AppContainer.userResource());
        },
        container: function(config) {
            return appModule.init(new AppContainer(config||{}));
        }
    };

module.exports = appModule;
