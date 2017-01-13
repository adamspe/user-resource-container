var AppContainer = require('app-container'),
    appModule = {
        init: function(container) {
            return container.addResource(AppContainer.userResource({
                uri: '/api/v1/user'
            }));
        },
        container: function(config) {
            return appModule.init(new AppContainer().init(config||{}));
        }
    };

module.exports = appModule;
