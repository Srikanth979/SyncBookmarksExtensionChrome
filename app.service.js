syncBookmarksUIApp.factory("RESTfulService",  ['$http', '$q', '$firebaseAuth', RESTfulService]);

function RESTfulService(http, $q, $firebaseAuth){
    var RESTfulServiceObj = {
        getSignInUserUrl: getSignInUserUrl,
        getSignUpUserUrl: getSignUpUserUrl,
        asyncPostCall: asyncPostCall
    };

    var auth = $firebaseAuth();        

    var AuthResponse = function(code, message, data){
        this.code = '';
        this.message = '';
        this.data = {};
    }

    var config = {
        "headers": {
            "Content-Type": "application/json"
        }
    };

    function getSignInUserUrl(){
        return 'signIn';
    }

    function getSignUpUserUrl(){                
        return 'signOut';
    }

    function asyncPostCall(action, body){
        var deferred = $q.defer();
        switch(action){
            case 'signUp':
                auth.$createUserWithEmailAndPassword(body.email, body.password).then(function(success){
                    var signUpResponse = new AuthResponse('success', '', {});
                    deferred.resolve(signUpResponse);
                }).catch(function(error){
                    var signUpResponse = new AuthResponse('error', error.message, {
                        code: error.code
                    });
                    deferred.reject(signUpResponse);
                });
                break;
            case 'signIn':
                auth.$signInWithEmailAndPassword(body.email, body.password).then(function(success){
                    var signInResponse = new AuthResponse('success', '', {});
                    deferred.resolve(signInResponse);
                }).catch(function(error){
                    var signInResponse = new AuthResponse('error', error.message, {
                        code: error.code
                    });
                    deferred.reject(signInResponse);
                });
                break;            
            case 'signOut':
                if(body.userSignedIn){
                    console.log("Dollar Current User");                    
                    auth.$signOut().then(function() {
                        console.log("Sign-out successful.");
                        deferred.resolve("Sign-out successful.");
                    }).catch(function(error) {
                        console.log("An error happened.");
                        deferred.reject(error);
                    });
                }                
            default:
                console.log("async Post Call")
        }
        return deferred.promise;
    }

    return RESTfulServiceObj;    
}