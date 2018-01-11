/**
 * Handles the sign up button press.
 */
function handleSignUp(email, password) {
    console.log("handle Sign Up ...");
    var email = email;
    var password = password;
    configuredFirebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {        
        var errorCode = error.code;
        var errorMessage = error.message;        
        if (errorCode == 'auth/weak-password') {
            console.log('The password is too weak.');
        } else {
            console.log(errorMessage);
        }
        console.log(error);
        return error;        
    });    
};


function toggleSignIn(email, password) {
    
    var signInPromise = new Promise(function(resolve, reject){
        if (configuredFirebase.auth().currentUser) {            
            console.log("Already a user");        
            configuredFirebase.auth().signOut();
            resolve("User SignedOut");
        } else {                   
            configuredFirebase.auth().signInWithEmailAndPassword(email, password).then(function (successData){
                console.log("Signed In happily");
                resolve(successData);
            }).catch(function (error) {
                reject(error);
            });            
        }
    });
    
    return signInPromise;
    
}

/**
 * Sends an email verification to the user.
 */
function sendEmailVerification() {
    // [START sendemailverification]
    configuredFirebase.auth().currentUser.sendEmailVerification().then(function () {
        // Email Verification sent!
        // [START_EXCLUDE]
        alert('Email Verification Sent!');
        // [END_EXCLUDE]
    });
    // [END sendemailverification]
}

function sendPasswordReset() {
    var email = document.getElementById('email').value;
    // [START sendpasswordemail]
    configuredFirebase.auth().sendPasswordResetEmail(email).then(function () {
        // Password Reset Email Sent!
        // [START_EXCLUDE]
        alert('Password Reset Email Sent!');
        // [END_EXCLUDE]
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/invalid-email') {
            alert(errorMessage);
        } else if (errorCode == 'auth/user-not-found') {
            alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
    });
    // [END sendpasswordemail];
}

/**
 * initApp handles setting up UI event listeners and registering configuredFirebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function authStateObserver() {
    var authStatePromise = new Promise(function(resolve, reject){
        configuredFirebase.auth().onAuthStateChanged(function (user) {
            console.log("onAuthStateChanged ---- ");      
            if (user) {
                console.log("Username: "+ user.displayName);            
                var userData = {};
                userData.displayName = user.displayName;
                userData.email = user.email;
                userData.emailVerified = user.emailVerified;
                userData.photoURL = user.photoURL;
                userData.isAnonymous = user.isAnonymous;
                userData.uid = user.uid;
                userData.providerData = user.providerData;
                console.log(userData);
                resolve(userData);           
            }
        });
    });     
    return authStatePromise;
}