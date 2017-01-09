var pkg = require('../../package.json'),
    mongoose = require('mongoose'),
    should = require('should'),
    supertest = require('supertest'),
    AppContainer = require('app-container');

var util = {
    api: undefined,
    User: AppContainer.userModel(),
    debug: require('debug')('app-test'),
    before: function(done) {
        var container = require('../../container')({
            db: {
                db: pkg.name+'-test'
            }
        });
        require('app-container-login')(container,true/*test*/);
        util.api = supertest.agent(container.app());
        done();
    },
    login: function(email,password,done){
        util.api.post('/login')
            .send('username='+email+'&password='+password)
            .expect(302)
            .end(function(err,res){
                // verify re-direct to root
                res.headers.location.should.equal('/');
                done();
            });
    },
    logout: function(done){
        util.api.get('/logout')
            .expect(302,done);
    }
};

module.exports = util;
