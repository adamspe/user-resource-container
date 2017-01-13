angular.module('app-container-user',[
    'app-container-common',
    'app-container-user.filters',
    'app-container-user.uadmin',
    'templates-app-container-user'
])
.service('User',['$appService',function($appService) {
    var User = $appService('/api/v1/user/:id'),
        me;
    // the server side uses a role array but for the purposes
    // of the starter app dumbing this down to admin/non-admin.
    User.prototype.isAdmin = function() {
        return this.roles && this.roles.length && this.roles.indexOf('admin') !== -1;
    };
    User.prototype.makeAdmin = function() {
        if(!this.isAdmin()){
            this.roles.push('admin');
        }
    };
    User.prototype.makeNormal = function() {
        if(this.isAdmin()) {
            this.roles.splice(this.roles.indexOf('admin'),1);
        }
    };
    User.me = function() {
        if(me) {
            return me;
        }
        return (me = User.get({id: 'me'}));
    };
    return User;
}]);
