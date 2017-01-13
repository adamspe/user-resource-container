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
