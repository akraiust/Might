mightApp
		.controller(
				'loginController',
				function($rootScope, $scope, $timeout, $http, $location,
						$window, BASE_URL) {
					$rootScope.userData = {};
					$rootScope.userDetails = {};
					$rootScope.isLoading = false;
					$scope.list = [];
					$scope.text = 'hello';

					$scope.isSaved = false;
					$scope.isSubmit = true;
					$scope.isUpdate = false;
					$rootScope.isWebSaved = false;
					$rootScope.isFPLinkSent = false;

					$rootScope.isUser = false;
					$scope.isFlag = false;
					//$scope.emailPass = true;

					$scope.validation = {
						username : true,
						password : true,
						firstName : true,
						lastName : true,
						login_username : true,
						login_password : true,
						login_banner_msg : true
					};

					$scope.validationFp = {
						emailId : true,
						emailExists : true 

					};
					$scope.registerForm = {

						"userId" : "",
						"username" : "",
						"password" : "",
						"firstName" : "",
						"lastName" : "",
						"userType" : [ "USER" ]

					};

					$scope.forgotPasswordForm = {
						"emailId" : ""
					};
					$scope.isSaved = false;
					var validationFlagFP = false;
					$scope.checkValidation = function(arg) {
						// CheckPassword($scope.registerForm.password);
						if ($scope.registerForm[arg] != null) {
							$scope.validation[arg] = true;
						}

					};
				//	$scope.emailPass = true;
					// email duplicate validation
					$scope.emailCheck = function() {
						checkEmail(BASE_URL, $scope.registerForm,
								(function(res) {
									if (res){
										$scope.validationFp.emailExists = true;
									
									if (validationFlagFP == false) {										
										
										sendData(BASE_URL,
												$scope.forgotPasswordForm.emailId,
												(function() {
													$rootScope.isFPLinkSent = true;
													$scope.forgotPasswordForm = {};
													// $scope.forgotPasswordForm.setPristine();

													$location.path('/forgotPassword');
												}))
									}
									}

									else {
										$scope.validationFp.emailExists = false;

									}
									//return;
								}

								))

					};

					function checkEmail(baseurl, user, callback) {
						$http.get(
								baseurl + 'rest/login/Get/byEmail?username='
										+ user.username).success(
								function(response) {
									callback(response);
								});

					}

					/* test test test test test test test--->Start */

					$scope.submitRegisterData = function() {

						// debugger;
						var validationFlag = false;

						if ($scope.registerForm.firstName == ''
								|| $scope.registerForm.firstName == null
								|| $scope.registerForm.firstName == undefined) {
							$scope.validation.firstName = false;
							validationFlag = true;
							$scope.isSaved = false;
						}
						if ($scope.registerForm.lastName == ''
								|| $scope.registerForm.lastName == null
								|| $scope.registerForm.lastName == undefined) {
							$scope.validation.lastName = false;
							validationFlag = true;
						}
						if ($scope.registerForm.username == ''
								|| $scope.registerForm.username == null
								|| $scope.registerForm.username == undefined) {
							$scope.validation.username = false;
							validationFlag = true;

						}
						if ($scope.registerForm.password == ''
								|| $scope.registerForm.password == null
								|| $scope.registerForm.password == undefined) {
							$scope.validation.password = false;
							validationFlag = true;
						}

						if (validationFlag == false) {
							saveData(BASE_URL, $scope.registerForm,
									(function() {
										$scope.isSaved = true;
										$rootScope.isWebSaved = true;
										$rootScope.isUser = true;
									}))

							$scope.registerForm = {};
							$scope.registerForm.setPristine();

							$location.path('/login');
						}

						$timeout(function() {
							$rootScope.isWebSaved = false;

						}, 1000);

						$timeout(function() {
							$rootScope.isUser = false;
						}, 4000);

					};

					$scope.submitForgotPasswordData = function() {

						// debugger;
						

						if ($scope.forgotPasswordForm.emailId == ''
								|| $scope.forgotPasswordForm.emailId == null
								|| $scope.forgotPasswordForm.emailId == undefined) {
							$scope.validationFP.emailId = false;
							validationFlagFP = true;
							// $scope.isSaved = false;
						}
						//$scope.emailCheck();
						if (validationFlagFP == false) {										
							
							sendData(BASE_URL,
									$scope.forgotPasswordForm.emailId,
									(function(response) {
										
										
										if(response.return == "SUCCESS"){
											$rootScope.isFPLinkSent = true;
											$scope.forgotPasswordForm = {};}
										if(response.return == "USER_NOT_EXIST"){
	
												$scope.validationFp.emailExists = false;
											}
											// $scope.forgotPasswordForm.setPristine();

											$location.path('/forgotPassword');

										/*$rootScope.isFPLinkSent = true;
										$scope.forgotPasswordForm = {};
										// $scope.forgotPasswordForm.setPristine();

										$location.path('/forgotPassword');*/
									}))
						}
				/*		if (validationFlagFP == false && $scope.validationFP.emailExists) {
							
							
							sendData(BASE_URL,
									$scope.forgotPasswordForm.emailId,
									(function() {
										$rootScope.isFPLinkSent = true;
										$scope.forgotPasswordForm = {};
										// $scope.forgotPasswordForm.setPristine();

										$location.path('/forgotPassword');
									}))

							
						}*/

						/*
						 * $timeout(function(){ $rootScope.isWebSaved= false;
						 * 
						 * },1000);
						 * 
						 * $timeout(function(){ $rootScope.isUser=false;
						 * },4000);
						 */

					};

					function sendData(baseurl, email, callback) {
						$http.post(
										baseurl
												+ 'rest/email/emailForForgetPassword?emailId='
												+ email).success(
										function(response) {
											callback(response);
										});

					}

					function saveData(baseurl, user, callback) {
						$http.post(baseurl + 'rest/login/save/', user).success(
								function(response) {
									callback(response);
								});

					}
					
					$('input[name="Forgot Button"]').click(function(){
				        $('span').text('');
				});
					
					 $scope.forgotPassword = function () {
					    	$location.path('/forgotPassword');
					    	
					    }
					
					$scope.login_click = function() {

						var loginValidationFlag = false;

						if (!$rootScope.userData.userid
								|| $rootScope.userData.userid.length === 0
								|| $rootScope.userData.userid === undefined) {
							$scope.validation.login_username = false;
							loginValidationFlag = true;
						}

						if (!$rootScope.userData.password
								|| $rootScope.userData.password.length === 0
								|| $rootScope.userData.password === undefined) {
							$scope.validation.login_password = false;
							loginValidationFlag = true;
						}

						if (loginValidationFlag == false) {

							$http
									.get(
											BASE_URL
													+ 'rest/login/validateCredentials?username='
													+ $rootScope.userData.userid
													+ '&password='
													+ $rootScope.userData.password)
									.then(
											function(response) {
												if (response.data.firstName != null) {

													$rootScope.userDetails.displayName = response.data.firstName;
													$window.localStorage.setItem("displayName",$rootScope.userDetails.displayName);
													$rootScope.userDetails.userType = response.data.userType;
													//dataService.dataobj = response.data;
													$rootScope.userDetails.EmailId = response.data.email;
													$rootScope.userDetails.userName = $rootScope.userData.userid;
													$rootScope.isLoading = false;
													$window.localStorage.setItem("userType",$rootScope.userDetails.userType);
													
													
													$window.localStorage.setItem("userId",$rootScope.userData.userid);
													
													$location.path('/home');
													$scope.validation.login_banner_msg = true;
												} else {
													$scope.validation.login_banner_msg = false;
													$location.path('/login');
												}
											});

						}

					}

				});