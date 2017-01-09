var AppContainer = require('app-container');

module.exports = function(config) {
    return (new AppContainer(config||{})).addResource(AppContainer.userResource());
};
