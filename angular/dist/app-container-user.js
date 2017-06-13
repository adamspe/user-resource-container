/*
 * app-container-user
 * Version: 1.0.0 - 2017-06-13
 */

angular.module('app-container-user.filters',[
])
.filter('fullName',[function(){
    return function(user) {
        if(user && (user.fname || user.sname)){
            if(user.fname && user.sname) {
                return user.fname + ' ' + user.sname;
            }
            return user.fname ? user.fname : user.sname;
        }
    };
}]);

angular.module('app-container-user',[
    'app-container-common',
    'app-container-user.filters',
    'app-container-user.uadmin',
    'templates-app-container-user'
])
.service('User',['$appService',function($appService) {
    var User = $appService('user/:id'),
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

angular.module('templates-app-container-user', ['js/uadmin/edit-user.html', 'js/uadmin/password-confirm.html', 'js/uadmin/user-administration.html']);

angular.module("js/uadmin/edit-user.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("js/uadmin/edit-user.html",
    "<div ng-class=\"{'solo-view' : !isModal}\">\n" +
    "    <section class=\"app-panel\">\n" +
    "        <md-toolbar class=\"md-toolbar-tools\">\n" +
    "            <h2 flex md-truncate>{{title}}</h2>\n" +
    "            <md-button class=\"md-icon-button close-dialog\" aria-label=\"Close dialog\" ng-if=\"isModal\" ng-click=\"cancel()\"></md-button>\n" +
    "        </md-toolbar>\n" +
    "        <md-content layout-padding>\n" +
    "            <form name=\"editUserForm\">\n" +
    "                <div layout=\"column\">\n" +
    "                    <md-input-container>\n" +
    "                        <label>E-mail</label>\n" +
    "                        <input  ng-if=\"me.isAdmin()\" type=\"email\" ng-model=\"user.email\" required existing-emails=\"existingEmails\">\n" +
    "                        <span ng-if=\"!me.isAdmin()\"><br />{{user.email}}</span>\n" +
    "                    </md-input-container>\n" +
    "                    <div layout=\"row\" layout-xs=\"column\">\n" +
    "                        <md-input-container flex>\n" +
    "                            <label>First name</label>\n" +
    "                            <input type=\"text\" ng-model=\"user.fname\" required>\n" +
    "                        </md-input-container>\n" +
    "                        <md-input-container flex>\n" +
    "                            <label>Last name</label>\n" +
    "                            <input type=\"text\" ng-model=\"user.sname\" required>\n" +
    "                        </md-input-container>\n" +
    "                    </div>\n" +
    "                    <md-checkbox ng-show=\"isModal\" ng-model=\"isAdmin\"> Administrator</md-checkbox>\n" +
    "                    <md-checkbox ng-show=\"user._id\" ng-model=\"resetPassword\">Reset Password</md-checkbox>\n" +
    "                    <password-confirm user=\"user\" ng-if=\"resetPassword\"></password-confirm>\n" +
    "                    <div layout=\"row\" layout-align=\"end end\">\n" +
    "                        <md-button ng-if=\"isModal\" ng-click=\"cancel()\">Cancel</md-button>\n" +
    "                        <md-button class=\"md-primary\" ng-click=\"ok()\" ng-disabled=\"editUserForm.$invalid\">OK</md-button>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div ng-messages=\"editUserForm.$error\" md-colors=\"{color: 'default-warn'}\">\n" +
    "                    <p ng-message=\"password\">Password must be at least 8 characters long and contain at least one character from all four character classes; upper, lower, numeric and symbols.</p>\n" +
    "                    <p ng-message=\"confirm\">Password and password confirmation do not match.</p>\n" +
    "                    <p ng-message=\"existingEmails\">There is already a user with the e-mail address {{editUserForm.$error.existingEmails[0].$viewValue}}</p>\n" +
    "                    <p ng-message=\"required\">You must enter all required fields.</p>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </md-content>\n" +
    "    </section>\n" +
    "</div>\n" +
    "");
}]);

angular.module("js/uadmin/password-confirm.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("js/uadmin/password-confirm.html",
    "<div layout=\"column\">\n" +
    "    <md-input-container>\n" +
    "        <label>Password</label>\n" +
    "        <input type=\"password\" ng-model=\"user.secret\" password-validate=\"user\" password-validate-key=\"password\" required>\n" +
    "    </md-input-container>\n" +
    "    <md-input-container>\n" +
    "        <label>Password confirm</label>\n" +
    "        <input type=\"password\" ng-model=\"user.$$secret\" password-compare=\"user\" password-key=\"secret\" password-compare-key=\"confirm\" required>\n" +
    "    </md-input-container>\n" +
    "</div>\n" +
    "");
}]);

angular.module("js/uadmin/user-administration.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("js/uadmin/user-administration.html",
    "<md-button id=\"uadmin-add-user\" class=\"md-raised md-icon-button\" ng-if=\"me.isAdmin()\" ng-click=\"create()\">\n" +
    "    <md-tooltip md-direction=\"right\">New user</md-tooltip>\n" +
    "</md-button>\n" +
    "<div class=\"solo-view\" ng-if=\"me.isAdmin()\">\n" +
    "    <section class=\"app-panel user-admin\">\n" +
    "        <md-toolbar class=\"md-toolbar-tools\">\n" +
    "            <h2 flex md-truncate>User administration</h2>\n" +
    "        </md-toolbar>\n" +
    "        <md-content flex>\n" +
    "        <md-list>\n" +
    "            <md-list-item ng-repeat=\"user in users\" ng-click=\"edit(user)\" ng-disabled=\"user._id === me._id\">\n" +
    "                <md-list-item-text layout=\"column\" class=\"md-1-line\">\n" +
    "                    <h4>{{user | fullName}}<span ng-if=\"user.isAdmin()\"> (administrator)</span> <a ng-href=\"mailto:{{user.email}}\">{{user.email}}</a></h4>\n" +
    "                </md-list-item-text>\n" +
    "                <md-button ng-if=\"user._id !== me._id\" class=\"md-icon-button delete-user\" aria-label=\"Delete user\" ng-click=\"delete(user)\">\n" +
    "                    <md-tooltip md-direction=\"left\">Delete user</md-tooltip>\n" +
    "                </md-button>\n" +
    "            </md-list-item>\n" +
    "        </md-list>\n" +
    "    </md-content>\n" +
    "    </section>\n" +
    "</div>\n" +
    "");
}]);

angular.module('app-container-user.uadmin',[
])
.controller('EditUserController',['$scope','$mdDialog','User',function($scope,$mdDialog,User){
    $scope.me = User.me();
    $scope.isModal = true;
    $scope.cancel = $mdDialog.cancel;
    $scope.resetPassword = $scope.user._id ? false : true;
    $scope.isAdmin = $scope.user.isAdmin();
    $scope.$watch('isAdmin',function(){
        $scope.user[$scope.isAdmin ? 'makeAdmin' : 'makeNormal']();
    });
    $scope.ok = function() {
        $mdDialog.hide($scope.user);
    };
}])
.directive('userProfile',['$log','User','NotificationService',function($log,User,NotificationService){
    return {
        restrict: 'E',
        templateUrl: 'js/uadmin/edit-user.html',
        link: function($scope,$element,$attrs) {
            User.me().$promise.then(function(me) {
                $scope.me = me;
                $scope.user = angular.extend({},me);
                $scope.title = 'Profile';
                $scope.ok = function() {
                    angular.extend(me,$scope.user);
                    me.$update({id: me._id},function(){
                        NotificationService.addInfo('Profile updated');
                    },NotificationService.addError);
                };
            });
        }
    };
}])
.directive('existingEmails',['$q','$parse',function($q,$parse){
    return {
        require: 'ngModel',
        link: function($scope,$element,$attrs,$ctrl) {
            var existing = $parse($attrs.existingEmails)($scope);
            if(existing) {
                $ctrl.$asyncValidators['existingEmails'] = function(modelValue,newValue) {
                    var def = $q.defer();
                    if(existing.indexOf(modelValue) === -1) {
                        def.resolve(true);
                    } else {
                        def.reject();
                    }
                    return def.promise;
                };
            }
        }
    };
}])
.directive('passwordValidate',['$q','$parse',function($q,$parse){
    return {
        require: 'ngModel',
        link: function($scope,$element,$attrs,$ctrl) {
            var user = $parse($attrs.passwordValidate)($scope);
            if(user && $attrs.passwordValidateKey) {
                $ctrl.$asyncValidators[$attrs.passwordValidateKey] = function(modelValue,newValue) {
                    var def = $q.defer();
                    if(newValue && newValue.match(/(?=.{8,})(?=.*?[^\w\s])(?=.*?[0-9])(?=.*?[A-Z]).*?[a-z].*/)) {
                        def.resolve(true);
                    } else {
                        def.reject();
                    }
                    return def.promise;
                };
            }
        }
    };
}])
.directive('passwordCompare',['$q','$parse',function($q,$parse){
    return {
        require: 'ngModel',
        link: function($scope,$element,$attrs,$ctrl) {
            var user = $parse($attrs.passwordCompare)($scope);
            if(user && $attrs.passwordKey && $attrs.passwordCompareKey) {
                $ctrl.$asyncValidators[$attrs.passwordCompareKey] = function(modelValue,newValue) {
                    var def = $q.defer();
                    if(newValue === user[$attrs.passwordKey]) {
                        def.resolve(true);
                    } else {
                        def.reject();
                    }
                    return def.promise;
                };
            }
        }
    };
}])
.directive('passwordConfirm',[function(){
    return {
        restrict: 'E',
        templateUrl: 'js/uadmin/password-confirm.html',
        scope: {
            user: '='
        }
    };
}])
.directive('userAdministration',['$log','User','DialogService','NotificationService','$mdDialog',function($log,User,DialogService,NotificationService,$mdDialog){
    return {
        restrict: 'E',
        templateUrl: 'js/uadmin/user-administration.html',
        link: function($scope,$element,$attrs) {
            function list() {
                // Not currently designed for scalability since user objects are small things
                // this and the existingEmails directive could deal with paged/dynamic data
                // at some point if necessary
                User.query(function(users){
                    $scope.users = users.list;
                    $scope.emails = $scope.users.map(function(u) { return u.email; });
                });
                $scope.create = function() {
                    $mdDialog.show({
                        templateUrl: 'js/uadmin/edit-user.html',
                        controller: 'EditUserController',
                        scope: angular.extend($scope.$new(true),{
                                user: new User({roles: ['user']}),
                                title: 'New user',
                                existingEmails: $scope.emails
                            }),
                        fullscreen: true
                    }).then(function(user) {
                        user.$save(function(){
                            NotificationService.addInfo('User '+user.email+' created.');
                            list();
                        },NotificationService.addError);
                    },angular.noop);
                };
                $scope.edit = function(user) {
                    $mdDialog.show({
                        templateUrl: 'js/uadmin/edit-user.html',
                        controller: 'EditUserController',
                        scope: angular.extend($scope.$new(true),{
                                user: new User(angular.copy(user,{})),
                                title: 'Edit user',
                                existingEmails: $scope.emails.filter(function(e) { return e !== user.email; })
                            }),
                        fullscreen: true
                    }).then(function(updates) {
                        angular.extend(user,updates);
                        user.$update({id: user._id},function(){
                            NotificationService.addInfo('User '+user.email+' updated.');
                        },NotificationService.addError);
                    },angular.noop);
                };
                $scope.delete = function(user) {
                    $mdDialog.show($mdDialog.confirm()
                        .title('Are you sure you want to delete '+user.email+'?')
                        .textContent('This cannot be undone.')
                        .ariaLabel('Delete user')
                        .ok('Yes')
                        .cancel('No'))
                        .then(function(){
                                user.$remove({id:user._id},function(){
                                    NotificationService.addInfo('User '+user.email+' deleted.');
                                    list();
                                },NotificationService.addError);
                            },angular.noop);
                };
            }
            User.me().$promise.then(function(me) {
                if(me.isAdmin()) {
                    $scope.me = me;
                    list();
                }
            });
        }
    };
}]);
