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
