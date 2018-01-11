syncBookmarksUIApp.controller('appController', ['$scope', '$timeout', 'RESTfulService', '$firebaseAuth', AppController]);

function AppController($scope, $timeout, restfulService, $firebaseAuth){
    $scope.showSignInView = true;
    $scope.loadProgress = false;
    $scope.user = {
        email: '',
        password: '',
        confirmPassword: ''
    };
    $scope.reqStatus = '';
    $scope.userSignedIn = false;    
    var auth = $firebaseAuth();
    auth.$onAuthStateChanged(function(user) {
        console.log("Auth state has been changed: ");
        if (user) {
            $scope.userSignedIn = true;            
            console.log(user);
        } else {
            $scope.userSignedIn = false;
        }
    });

    $scope.signUser = function(formStatus){        
        $scope.loadProgress = true;
        console.log(formStatus);
        var user = $scope.user;
        var url = '';
        if(validateInput(formStatus, user)){
            if($scope.showSignInView){
                url = restfulService.getSignInUserUrl();
            }else{
                url = restfulService.getSignUpUserUrl();
            }            
            restfulService.asyncPostCall(url, user).then(
                function(successData){                   
                    $scope.loadProgress = false;
                }, function(errorData){                    
                    $scope.reqStatus = errorData.message;
                    $scope.loadProgress = false;
                }
            );           
        }
    };

    $scope.rejectFn = function(event){        
        event.preventDefault();
    }

    function validateInput(formStatus, user){
        if(formStatus){
            if(user.password === user.confirmPassword){
                return true;
            }
            if($scope.showSignInView){
                return true;
            }                     
        }        
        return false;
    }

    $scope.toggleShowSignInView = function(){
        $scope.showSignInView = !$scope.showSignInView;
    };

    $scope.signOut = function(){
        var body = {};
        body.userSignedIn = $scope.userSignedIn;
        restfulService.asyncPostCall('signOut', body).then(function(data){
          
            $scope.toggleShowSignInView();
        });
    }
}