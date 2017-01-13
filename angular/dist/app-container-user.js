/*
 * app-container-user
 * Version: 1.0.0 - 2017-01-12
 */

angular.module('app-container-user',[
    'app-container-common',
    'app-container-user.uadmin'
])
.service('User',['$appService',function($appService) {
    var User = $appService('/api/user/:id'),
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
    "<div class=\"clearfix\" ng-class=\"{'modal-header': isModal}\">\n" +
    "    <a ng-if=\"isModal\" href class=\"pull-right\" ng-click=\"dismiss()\"><i class=\"fa fa-times-circle-o fa-2x\"></i></a>\n" +
    "    <h2>{{title}}</h2>\n" +
    "</div>\n" +
    "<div class=\"clearfix\" ng-class=\"{'modal-body': isModal}\">\n" +
    "    <form name=\"editUserForm\">\n" +
    "        <div class=\"form-group\">\n" +
    "            <label for=\"email\">E-mail</label>\n" +
    "            <input  ng-if=\"me.isAdmin()\" type=\"email\" class=\"form-control\" id=\"email\" placeholder=\"Email\" ng-model=\"user.email\" required existing-emails=\"existingEmails\">\n" +
    "            <span ng-if=\"!me.isAdmin()\"><br />{{user.email}}</span>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <label for=\"firstName\">First name</label>\n" +
    "            <input type=\"text\" class=\"form-control\" id=\"firstName\" placeholder=\"First Name\" ng-model=\"user.fname\" required>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <label for=\"lastName\">Last name</label>\n" +
    "            <input type=\"text\" class=\"form-control\" id=\"lastName\" placeholder=\"Last Name\" ng-model=\"user.sname\" required>\n" +
    "        </div>\n" +
    "        <div class=\"checkbox\" ng-show=\"isModal\">\n" +
    "            <label>\n" +
    "                <input type=\"checkbox\" ng-model=\"isAdmin\"> Administrator\n" +
    "            </label>\n" +
    "        </div>\n" +
    "        <div class=\"checkbox\" ng-show=\"user._id\">\n" +
    "            <label>\n" +
    "                <input type=\"checkbox\" ng-model=\"resetPassword\"> Reset Password\n" +
    "            </label>\n" +
    "        </div>\n" +
    "        <password-confirm user=\"user\" ng-if=\"resetPassword\"></password-confirm>\n" +
    "        <ul class=\"list-inline pull-right\">\n" +
    "            <li ng-if=\"isModal\"><a class=\"btn btn-default\" ng-click=\"dismiss()\">Cancel</a></li>\n" +
    "            <li><a class=\"btn btn-default\" ng-click=\"ok()\" ng-disabled=\"editUserForm.$invalid\">OK</a></li>\n" +
    "        </ul>\n" +
    "        <p class=\"text-danger\" ng-if=\"editUserForm.$error.password[0].$viewValue\">\n" +
    "            Password must be at least 8 characters long and contain at least one character from all four character classes; upper, lower, numeric and symbols.\n" +
    "        </p>\n" +
    "        <p class=\"text-danger\" ng-if=\"user.secret && user.secret !== user.$$secret\">Password and password confirmation do not match.</p>\n" +
    "        <p class=\"text-danger\" ng-if=\"editUserForm.$error.existingEmails[0].$viewValue\">\n" +
    "            There is already a user with the e-mail address {{editUserForm.$error.existingEmails[0].$viewValue}}\n" +
    "        </p>\n" +
    "    </form>\n" +
    "</div>");
}]);

angular.module("js/uadmin/password-confirm.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("js/uadmin/password-confirm.html",
    "<div class=\"form-group\">\n" +
    "    <label for=\"password\">Password</label>\n" +
    "    <input type=\"password\" class=\"form-control\" id=\"password\" placeholder=\"Password\" ng-model=\"user.secret\" password-validate=\"user\" password-validate-key=\"password\">\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "    <label for=\"passwordConfirm\">Password confirm</label>\n" +
    "    <input type=\"password\" class=\"form-control\" id=\"passwordConfirm\" placeholder=\"Password\" ng-model=\"user.$$secret\" password-validate=\"user\" password-validate-key=\"confirm\">\n" +
    "</div>");
}]);

angular.module("js/uadmin/user-administration.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("js/uadmin/user-administration.html",
    "<table class=\"table table-striped table-condensed user-administration\" ng-if=\"me.isAdmin()\">\n" +
    "    <thead>\n" +
    "        <tr>\n" +
    "            <th>Name</th>\n" +
    "            <th>E-Mail</th>\n" +
    "            <th><span class=\"hidden-xs\">Administrator</span><span class=\"visible-xs\">Admin</span></th>\n" +
    "            <th class=\"text-right\"><a href ng-click=\"create()\" uib-tooltip=\"New User\" tooltip-placement=\"left\"><i class=\"fa fa-plus\"></i></a></th>\n" +
    "        </tr>\n" +
    "    </thead>\n" +
    "    <tbody>\n" +
    "        <tr ng-repeat=\"user in users\">\n" +
    "            <td>{{user | fullName}}</td>\n" +
    "            <td><a ng-href=\"mailto:{{user.email}}\">{{user.email}}</a></td>\n" +
    "            <td><i ng-if=\"user.isAdmin()\" class=\"fa fa-check\"></i></td>\n" +
    "            <td class=\"text-right\">\n" +
    "                <ul class=\"list-inline\">\n" +
    "                    <li><a href ng-click=\"edit(user)\" uib-tooltip=\"Edit User\" tooltip-placement=\"left\"><i class=\"fa fa-pencil\"></i></a></li>\n" +
    "                    <li><a href ng-click=\"delete(user)\" uib-tooltip=\"Delete User\" tooltip-placement=\"left\"><i class=\"fa fa-times\"></i></a></li>\n" +
    "                </ul>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "    </tbody>\n" +
    "</table>\n" +
    "");
}]);

angular.module('app.uadmin',[
])
.controller('EditUserController',['$scope','$uibModalInstance','User','theUser','existingEmails','title',function($scope,$uibModalInstance,User,theUser,existingEmails,title){
    $scope.me = User.me();
    $scope.title = title;
    $scope.isModal = true;
    $scope.user = theUser;
    $scope.existingEmails = existingEmails;
    $scope.dismiss = $uibModalInstance.dismiss;
    $scope.resetPassword = theUser._id ? false : true;
    $scope.isAdmin = theUser.isAdmin();
    $scope.$watch('isAdmin',function(){
        $scope.user[$scope.isAdmin ? 'makeAdmin' : 'makeNormal']();
    });
    $scope.ok = function() {
        $uibModalInstance.close($scope.user);
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
.directive('passwordConfirm',[function(){
    return {
        restrict: 'E',
        templateUrl: 'js/uadmin/password-confirm.html',
        scope: {
            user: '='
        }
    };
}])
.directive('userAdministration',['$log','$uibModal','User','DialogService','NotificationService',function($log,$uibModal,User,DialogService,NotificationService){
    return {
        restrict: 'E',
        templateUrl: 'js/uadmin/user-administration.html',
        link: function($scope,$element,$attrs) {
            function list() {
                User.query(function(users){
                    $scope.users = users.list.filter(function(u){
                        return u._id !== $scope.me._id;
                    });
                });
                $scope.create = function() {
                    $uibModal.open({
                        templateUrl: 'js/uadmin/edit-user.html',
                        controller: 'EditUserController',
                        windowClass: 'edit-user',
                        size: 'lg',
                        backdrop: 'static',
                        keyboard: false,
                        resolve: {
                            theUser: function() { return new User({roles: ['user']}); },
                            title: function() { return 'Create User'; },
                            existingEmails: function() { return $scope.users.map(function(u) { return u.email; }).concat([$scope.me.email]); }
                        }
                    }).result.then(function(user){
                        user.$save(function(){
                            NotificationService.addInfo('User created.');
                            list();
                        },NotificationService.addError);
                    });
                };
                $scope.edit = function(user) {
                    $uibModal.open({
                        templateUrl: 'js/uadmin/edit-user.html',
                        controller: 'EditUserController',
                        windowClass: 'edit-user',
                        size: 'lg',
                        backdrop: 'static',
                        keyboard: false,
                        resolve: {
                            theUser: function() { return angular.extend(new User(),user); },
                            title: function() { return 'Edit User'; },
                            existingEmails: function() {
                                return $scope.users.filter(function(u){
                                    return u._id !== user._id;
                                }).map(function(u) { return u.email; }).concat([$scope.me.email]);
                            }
                        }
                    }).result.then(function(updates){
                        angular.extend(user,updates);
                        user.$update({id: user._id},function(){
                            NotificationService.addInfo('User updated.');
                        },NotificationService.addError);
                    });
                };
                $scope.delete = function(user) {
                    DialogService.confirm({
                        question: 'Are you sure you want to delete '+user.email+'?',
                        warning: 'This cannot be undone.'
                    }).then(function(){
                        user.$remove({id:user._id},function(){
                            NotificationService.addInfo('User deleted.');
                            list();
                        },NotificationService.addError);
                    });
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