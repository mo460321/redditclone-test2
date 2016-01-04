//Starter Project for the Reddit Clone
var app = angular.module('reddit-clone', ['ngRoute', 'firebase']);

app.constant('fbURL','https://sida-003-redditclone.firebaseio.com/');

app.factory('Posts',function($firebase, fbURL){
   return $firebase(new Firebase(fbURL)).$asArray(); 
});

app.config(function($routeProvider){
    $routeProvider
    .when('/',{
        controller: 'MainController',
        templateUrl: 'main.html'
    })
    .otherwise({
        redirectTo:'/'
    })
});

app.controller('MainController',function($scope,$firebase,Posts,fbURL){
    $scope.posts=Posts;
    $scope.savePost = function(post) {
        if (post.name && post.description && post.url && $scope.authData) {
            Posts.$add({
                name: post.name,
                description: post.description,
                url: post.url,
                votes: 0,
                user: $scope.authData.twitter.username
            });
            post.name = '';
            post.description = '';
            post.url = '';
        }else{
            alert('sorry you need all of those inputs to be filled or you need to be logged in');
        }
    };
    $scope.addVote = function(post){
        post.votes++;
        Posts.$save(post);
    };
    $scope.deletePost = function(post){
        var postForDeletion = new Firebase(fbURL + post.$id);
        postForDeletion.remove();
    };
    $scope.addComment = function(post, comment){
        if($scope.authData){
            var ref = new Firebase(fbURL+post.$id+'/comments');
            var sync=$firebase(ref);
            $scope.comments = sync.$asArray();
            $scope.comments.$add({
                user:$scope.authData.twitter.username,
                text: comment.text
            }) 
        }else{
            alert('you need to be logged in before doing that')
        }
    }
    $scope.removeComment = function(post,comment){
         var commentForDeletion = new Firebase(fbURL+post.$id+'/comments/');
         commentForDeletion.remove();
    }
     $scope.login = function () {
        //Creating a refrence URL with Firebase
        var ref = new Firebase(fbURL);
        //Doing the OAuth popup
        ref.authWithOAuthPopup('twitter', function (error, authData) {
            //If there is an error
            if (error) {
                alert('Sorry bro, there was an error.');
            }
            //If the user is logged in correctly
            else {
                alert('You were logged in successfully.');
            }
            //Set the authData we get to a global variable that can be used
            $scope.authData = authData;
        });
    }
});
