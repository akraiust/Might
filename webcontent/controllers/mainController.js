mightApp.controller('mainController', function ($rootScope, $scope, $location, $http,$filter,$window,NumberOfRecords,BASE_URL,News_Web_Source,Twitter_Fb_Source,getSubCategoriesService) {
	 	
	// this represents the state of the dialog: a visible flag and the title being edited
	var EditDialogModel = function () {
	  this.visible = false;
	};
	
	EditDialogModel.prototype.open = function(allCategories, selectTitle){
		 this.category = allCategories;
		  
		  this.selectedCategory = JSON.stringify($.grep(allCategories, function(e){ 
										allSubCat = $.grep(e.subCategories, function(s){return s.subcategory == selectTitle.subCategory;});
										return (allSubCat.length != 0);
									}));
		 /* if(selectTitle != null ||selectTitle != undefined || selectTitle != ''  ){*/
		  
			this.title = selectTitle.title;
			this.url = selectTitle.url;
		  /*}*/
			this.visible = true;
			/*this.selectedItem = selectTitle;
			
		  if(selectTitle.category == 'RENEWABLES')
			{ 
			  this.catName = 'ENERGY';
			}
		 else
			 {
			 this.catName  = 'TECHNOLOGY TRENDS';
			
			 }
*/	
	};
	
	EditDialogModel.prototype.close = function() {
		
	  this.visible = false;
	};
	// end of Edit Dialog related stuffs
	// window.location.href =window.location.href.split('?')[0]; 
	 $scope.allSubCategory={};
	 $scope.allTrendingKeywords={};
	 
	 $scope.allTrendingSubCategory={};
	 
	 $scope.allCategoryAndSubCategoryForNewsAndWebLastPostDate;
	 $scope.allCategoryAndSubSategoryForTwitterAndFaceBookLastPostDate;
	 $scope.selectedSubcategory='';
	 $scope.searchText = null; 
	 $scope.fromDate; 
	 $scope.toDate;
	 $scope.isAdminUser = false;
	 $rootScope.isPasswordChanged = false;
	 $scope.isTextEntered = false;
	 $scope.allCategoryAndSubCategoryForNewsAndWebCount = 50;
	 $scope.allCategoryAndSubSategoryForTwitterAndFaceBookCount = 50;
	 $scope.allCategoryAndSubCategoryForNewsAndWebLatestPostDate = '';
		 $scope.allCategoryAndSubSategoryForTwitterAndFaceBookLatestPostDate = '';
	 $scope.validationCp = {
				username : true,
				currentPwd : true,
				NewPwd : true,
				confirmPwd : true,
				isPwdequal:true
			};
	 $scope.changePasswordForm = {

				"currentPwd" : "",
				"password" : "",
				"password_c" : ""
			};
	 var wordCloudOpen =false;
	 var pickerFireCount = 0;
	 var today = new Date();
	 
	 today.setHours(24,0,0,0);
     var dateTime =  today.getFullYear()+'-'+(today.getMonth()+1)+'-'+(today.getDate());
 	/*var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+(today.getDate()+1);
 	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	var time = 00 + ":" + 00 + ":" + 00;
 	var dateTime = date+' '+time;*/
 	
	//var result = getParameterByName('secureID');
	
	/*$window.localStorage.setItem("token",$rootScope.userDetails.userType);
	var userType  = $window.localStorage.getItem("token");
	
	$window.localStorage.setItem("token1",$rootScope.userData.userid);
	$rootScope.emailId   = $window.localStorage.getItem("token1");*///returns "xxx"
	//$window.localStorage.removeItem("token");
	   /* var url =  window.location.href;
	    var secureID = /secureID=([^&]+)/.exec(url)[1]; // Value is in [1] ('384' in our case)
*/		   // var result = captured ? captured : '';
	
	var userType  = $window.localStorage.getItem("userType");
	
	$rootScope.emailId   = $window.localStorage.getItem("userId");
	
		/*if (result == ''
			|| result == null
			|| result == undefined){
			$scope.hasSecureID = false;*/
			if( userType != null){
				//var userType = testUser.userType;	
				// var firstName =  testUser.firstName;
				// $rootScope.emailId =  testUser.userid;
				 
							 $scope.menuItems = ['ENERGY', 'TECHNOLOGY TRENDS'];
			/* if(firstName  == 'admin1')
				{ 
				 $scope.isAdminUser = true;
				}
*/
							 $scope.displayName   = $window.localStorage.getItem("displayName");				 
			 
			 
			 if(userType == 'EnergyUser' || userType == 'ADMIN')
				{ 
				 if($window.localStorage.getItem("activeMenu")!=null){
					 $scope.activeMenu = $window.localStorage.getItem("activeMenu");
				 }
				 else{
			 $scope.activeMenu = $scope.menuItems[0];}
			// $scope.activeSubMenu = 'SOLAR';
			 $scope.selectedCategory ="RENEWABLES";
			 $scope.homeCategory  ="RENEWABLES";
			 if(userType == 'ADMIN')
			 $scope.isAdminUser = true;
				}
			 else
				 {
				 
				 if($window.localStorage.getItem("activeMenu")!=null){
					 $scope.activeMenu = $window.localStorage.getItem("activeMenu");
				 }
				 else{
					 $scope.activeMenu = $scope.menuItems[1];;}
				
				// $scope.activeSubMenu = 'IOT';
				 $scope.selectedCategory ="TECHTRENDS";
				 $scope.homeCategory ="TECHTRENDS";
				 }
			 
			 $window.localStorage.setItem("activeMenu",$scope.activeMenu);
			 if($window.localStorage.getItem("selectedSubCat")!=null)
			 $window.localStorage.setItem("selectedSubCat",$window.localStorage.getItem("selectedSubCat"));
			 else
				 $window.localStorage.setItem("selectedSubCat",$scope.selectedSubcategory);	 
			 
			 if($window.localStorage.getItem("selectedCat")!=null)
				 $window.localStorage.setItem("selectedCat",$window.localStorage.getItem("selectedCat"));
				 else
					 $window.localStorage.setItem("selectedCat",$scope.selectedCategory);	
            // $window.localStorage.setItem("selectedCat",$scope.selectedCategory);
             
          //  var displayName = $window.localStorage.getItem("displayName");
          //   $rootScope.userDetails.displayName = displayName;
			  getAllCategories();
			  getLatestPostDate();
			  getCountForTestScreen($window.localStorage.getItem("selectedCat"),$window.localStorage.getItem("selectedSubCat"),NumberOfRecords,dateTime);
		      getAllCatAndSubCatPostDetailsForNewsAndWeb($window.localStorage.getItem("selectedCat"), $window.localStorage.getItem("selectedSubCat"),NumberOfRecords,dateTime,News_Web_Source);
		      getAllCatAndSubCatPostDetailsForTwitterAndFaceBook($window.localStorage.getItem("selectedCat"), $window.localStorage.getItem("selectedSubCat"),NumberOfRecords,dateTime,Twitter_Fb_Source);
		      validateJQCloud();
		    //  CompareDate();
			 }
			 else{
				$location.path('/login');
			 }
		/*}
		else{
			$scope.hasSecureID = true	;
			$location.path('/changePassword');
		}*/
/*	 if( dataService.dataobj != null){
		 $rootScope.userType = dataService.dataobj.userType;	
		 $rootScope.firstName =  dataService.dataobj.firstName;
		 $rootScope.emailId =  $rootScope.userData.userid;
		
		
	   Default Category tab selection based on usertype  
	 $scope.menuItems = ['ENERGY', 'TECHNOLOGY TRENDS'];
	 if($rootScope.firstName  == 'admin1')
		{ 
		 $scope.isAdminUser = true;
		}

	 
	 
	 if($rootScope.userType == 'EnergyUser')
		{ 
	 $scope.activeMenu = $scope.menuItems[0];
	// $scope.activeSubMenu = 'SOLAR';
	 $scope.selectedCategory ="RENEWABLES";
	 $scope.homeCategory  ="RENEWABLES";
		}
	 else
		 {
		 $scope.activeMenu = $scope.menuItems[1];
		// $scope.activeSubMenu = 'IOT';
		 $scope.selectedCategory ="TECHTRENDS";
		 $scope.homeCategory ="TECHTRENDS";
		 }
	 }
	 else{
		$location.path('/login');
	 }
	 */
	 
	$scope.setActive = function(menuItem) {	
	  $scope.activeMenu = menuItem;
	  }
	
	/*$(".keyword_icon").click(function(){
        $('.tootip_postn').tooltip('hide');
	
    });*/
	
	
	/*   $('[data-toggle="tooltip"]').tooltip(); */
	/*
	$scope.setActiveSubCategory = function(subMenuItem) {	
		  $scope.activeSubMenu = subMenuItem;
		  }*/
	
	 $scope.$back = function() { 
		    //window.history.back();
		 $location.path('/home');
		 //($window.localStorage.getItem("selectedCat"), $window.localStorage.getItem("selectedSubCat"),NumberOfRecords,dateTime,News_Web_Source);
	     // getAllCatAndSubCatPostDetailsForTwitterAndFaceBook($window.localStorage.getItem("selectedCat"), $window.localStorage.getItem("selectedSubCat"),NumberOfRecords,dateTime,Twitter_Fb_Source);
		  };
	 $scope.submitChangePasswordData = function() {

			// debugger;
			var validationFlagCP = false;

			if ($scope.changePasswordForm.currentPwd == ''
					|| $scope.changePasswordForm.currentPwd == null
					|| $scope.changePasswordForm.currentPwd == undefined) {
				$scope.validationCp.currentPwd = false;
				validationFlagCP = true;
				
			}
			else{
				
			/*	if(!$scope.hasSecureID){*/
				$http
				.get(
						BASE_URL
								+ 'rest/login/validateCredentials?username='
								+ $rootScope.emailId
								+ '&password='
								+ $scope.changePasswordForm.currentPwd)
				.then(
						function(response) {
							if (response.data.firstName != null) {
								$scope.validationCp.currentPwd = true;
								validationFlagCP = false;
								if ($scope.changePasswordForm.password == ''
									|| $scope.changePasswordForm.password == null
									|| $scope.changePasswordForm.password == undefined) {
								$scope.validationCp.NewPwd = false;
								validationFlagCP = true;
							}
							if ($scope.changePasswordForm.password_c == ''
									|| $scope.changePasswordForm.password_c == null
									|| $scope.changePasswordForm.password_c == undefined) {
								$scope.validationCp.confirmPwd = false;
								validationFlagCP = true;

							}
							if ($scope.validationCp.NewPwd && $scope.validationCp.confirmPwd) {
								if($scope.changePasswordForm.password  == $scope.changePasswordForm.password_c){
							$scope.validationCp.isPwdequal = true;
							validationFlagCP = false;
								}
								else{
									$scope.validationCp.isPwdequal = false;
									validationFlagCP = true;
								}

						}

							if (validationFlagCP == false) {
								saveChanges(BASE_URL,$rootScope.emailId,$scope.changePasswordForm.currentPwd ,$scope.changePasswordForm.password ,
										(function() {
											//$scope.isSaved = true;
											 $rootScope.isPasswordChanged= true;
											  
											//$rootScope.isUser = true;
										}))

								$scope.changePasswordForm = {};
								//$scope.registerForm.setPristine();
								  $rootScope.userData = {};
							        $rootScope.userDetails = {};
							        $rootScope.userData = {};			       
							        $window.localStorage.clear();
							        //var testURL = '/Products/List?SortDirection=dsc&Sort=price&Page=3&Page2=3';
							       // window.location.href =window.location.href.split('?')[0]; 
								$location.path('/changePassword');
								//window.location.href =window.location.href.split('?')[0];
							}
								//$location.path('/home');
								//$scope.validation.login_banner_msg = true;
								
								
							} else {
								$scope.validationCp.currentPwd = false;
								validationFlagCP = true;
								//$scope.validation.login_banner_msg = false;
								$location.path('/changePassword');
							}
						});
			/*	
				}
				else{
					$scope.validationCp.currentPwd = true;
					validationFlagCP = false;
				}*/
				
			}
			
			
			/*if ($scope.changePasswordForm.password == ''
					|| $scope.changePasswordForm.password == null
					|| $scope.changePasswordForm.password == undefined) {
				$scope.validationCp.NewPwd = false;
				validationFlagCP = true;
			}
			if ($scope.changePasswordForm.password_c == ''
					|| $scope.changePasswordForm.password_c == null
					|| $scope.changePasswordForm.password_c == undefined) {
				$scope.validationCp.confirmPwd = false;
				validationFlagCP = true;

			}
			if ($scope.validationCp.NewPwd && $scope.validationCp.confirmPwd) {
				if($scope.validationCp.NewPwd == $scope.validationCp.confirmPwd){
			$scope.validationCp.isPwdequal = true;
			validationFlagCP = false;
				}
				else{
					$scope.validationCp.isPwdequal = false;
					validationFlagCP = true;
				}

		}

			if (validationFlagCP == false) {
				saveChanges(BASE_URL,$rootScope.emailId,$scope.changePasswordForm.currentPwd ,$scope.changePasswordForm.password ,
						(function() {
							//$scope.isSaved = true;
							 $rootScope.isPasswordChanged= true;
							  
							//$rootScope.isUser = true;
						}))

				$scope.changePasswordForm = {};
				//$scope.registerForm.setPristine();
				  $rootScope.userData = {};
			        $rootScope.userDetails = {};
			        $rootScope.userData = {};			       
			        $window.localStorage.clear();
			        //var testURL = '/Products/List?SortDirection=dsc&Sort=price&Page=3&Page2=3';
			       // window.location.href =window.location.href.split('?')[0]; 
				$location.path('/changePassword');
				//window.location.href =window.location.href.split('?')[0];
			}*/
		};
		
		
		function getParameterByName(name, url) {
		    if (!url) {
		     url = window.location.href;
		     // url = 'http://localhost:8080/might/#/changePassword?secureID=hhdhjdhj'
		    }
		    name = name.replace(/[\[\]]/g, "\\$&");
		    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		        results = regex.exec(url);
		    if (!results) return null;
		    if (!results[2]) return '';
		    return decodeURIComponent(results[2].replace(/\+/g, " "));
		}
		
		function saveChanges(baseurl, emailId,currentPwd,password,callback) {
		  /*  var url = "http://www.example.com/index.php?myParam=384&login=admin"; // or window.location.href for current url
		    var captured = /myParam=([^&]+)/.exec(url)[1]; // Value is in [1] ('384' in our case)
		    var result = captured ? captured : 'myDefaultValue';*/
			//var secureID = getUrlVars()["secureID"];
			//var result = getParameterByName('secureID');
		   /* var url =  window.location.href;
		    var secureID = /secureID=([^&]+)/.exec(url)[1]; // Value is in [1] ('384' in our case)
*/		   // var result = captured ? captured : '';
			/*if (result == ''
				|| result == null
				|| result == undefined){*/
				
				var cparam = new Object();
				cparam.username = emailId;
				cparam.key = currentPwd;
				cparam.password = password;
				
				
				//call API to post the data
				/*$http.post(BASE_URL + 'rest/post/updatePostCategory?category='+param.category+'&subCategory='+param.subCategory+'&title='+param.title+'&status='+param.status)*/
			/*	$http.post(BASE_URL + 'rest/post/updatePostCategory/',JSON.stringify(cparam))*/
			/*	$http.post(baseurl + 'rest/login/edit?username='
						+ emailId+'&key='+currentPwd+'&password='+password).success(*/
				$http.post(baseurl + 'rest/login/edit/',JSON.stringify(cparam)).success(
						function(response) {
							callback(response);
						});
			/*}
			else{
				
				var chparam = new Object();
				chparam.key = result;
				//chparam.currentPwd = currentPwd;
				chparam.password = password;
				$http.post(baseurl + 'rest/login/edit?key='
						+result+'&password='+password).success(
				$http.post(baseurl + 'rest/login/edit/',JSON.stringify(chparam)).success(
						function(response) {
							callback(response);
						});
			}
			*/
			

		}

	
	  
	
/*	 validateUser();  */

                                                
                    $('[data-toggle="popover"]').popover({
                        placement : 'bottom',
                                                trigger : 'click',
                                                title : 'Please choose a date <a class="close" id="close-popover" data-dismiss="alert">&times;</a>',
                                                //  content : '<input data-provide="datepicker" id="datepicker" /><img class="img-responsive " src="./images/wordcloud_img.png" alt="Sample Image" ><img class="ui-datepicker-trigger" src="./images/calendar_icon.PNG" alt="..." title="...">',
                                                content : '<input data-provide="datepicker" id="datepicker" /><div class="img-responsive" id="example" style="width: 550px; height: 350px;"></div>',
                                                //content: '<datetimepicker data-ng-model="user.join_date" data-datetimepicker-config="{ startView:'day', minView:'day' }" data-before-render="beforeRender($dates)" />' 
                                                html : true,
                                                callback: function() {
                                                                
                                                    $("#datepicker").datepicker({
                                                                
                                                                                   //showOn: both - datepicker will appear clicking the input box as well as the calendar icon
                                                                                   //showOn: button - datepicker will appear only on clicking the calendar icon
                                                                                   showOn: 'both',
                                                                                   //you can use your local path also eg. buttonImage: 'images/x_office_calendar.png'
                                                                                   buttonImage: './images/calendar_icon.PNG',
                                                                                   buttonImageOnly: true,
                                                                                   changeMonth: true,
                                                                                   changeYear: true,
                                                                                   showAnim: 'slideDown',
                                                                                   duration: 'fast',                                                                              
                                                                                   dateFormat: 'yy-mm-dd',
                                                                                   maxDate: new Date(compareDate()),
                                                                                   onSelect: function (e) {
                                                                                  	 $scope.getTrendingSubCategories($scope.selectedCategory,e);
                                                                                   }
                                                                   });
                                                    
                                                    
                                                   /* $('#datepicker').datepicker(
                                                            {onSelect: function (ev) {
                                                            	 $scope.getTrendingSubCategories($scope.selectedCategory,e.target.value);
                                                        }
                                                        });*/
                                               /*     $('#datepicker').datepicker()
                                                    .on("onSelect", function (e) {
                                                    	
                                                    	
                                                   // console.log("Date changed: ",e.target.value);
                                                
                                                    $scope.getTrendingSubCategories($scope.selectedCategory,e.target.value);
                                                
                                                });*/
                                                }
                                                }).on('shown.bs.popover', function() {
                                                    var popup = $(this);
                                                    $('a#close-popover.close').click(function() {
                                                      popup.click();
                                                    });
                                                  });
                    
                    
                    $('#pickyDate').datepicker({
                      //showOn: both - datepicker will appear clicking the input box as well as the calendar icon
                                   //showOn: button - datepicker will appear only on clicking the calendar icon
                                   showOn: 'both',
                                   //you can use your local path also eg. buttonImage: 'images/x_office_calendar.png'
                                   buttonImage: './images/calendar_icon.PNG',
                                   buttonImageOnly: true,
                                   changeMonth: true,
                                   changeYear: true,
                                   showAnim: 'slideDown',
                                   duration: 'fast',                              
                                   dateFormat: 'yy-mm-dd',
                                   maxDate: new Date(compareDate())
                                });

                                                                
                                /*Closes the pop over if user clicks outside the popover */
                                                                /*$('html').on('click', function(e) {
                                                                    $('[data-toggle="popover"]').each(function() { //Loop for everything containing a data-toggle="popover"
                                                                        if ($(this).attr('aria-describedby') != null ) { //Check if the popover is active / contain an aria-describedby with a value
                                                                            var id = $(this).attr('aria-describedby'); //Put the value in a variable
                                                                            if (!$(e.target).closest(".popover-content").length && $(e.target).attr("aria-describedby") != id && !$(e.target).closest('[aria-describedby="'+id+'"').length) { //Look if the click is a child of the popover box or if it's the button itself or a child of the button
                                                                                $('[aria-describedby="'+id+'"]').trigger( "click" ); //trigger a click as if you clicked the button
                                                                              //  $('div#example.jqcloud').empty();
                                                                            }
                                                                        }
                                                                    });
                                                                });           */
                                                                
                	$(document).on('click','.navbar-collapse.in',function(e) {

                	    if( $(e.target).is('a') && ( $(e.target).attr('class') != 'dropdown-toggle' ) ) {
                	        $(this).collapse('hide');
                	    }

                	});                                            


                /*Validate User based on Logged in Credentials */
  /*  function validateUser() {
        if ($rootScope.userData === undefined || $rootScope.userData === null) {
            $location.path('/login');
        }
    }*/
/*    if ($rootScope.userData != undefined || $rootScope.userData != null) {
        getAllCategories();
        getAllCatAndSubCatPostDetailsForNewsAndWeb($scope.selectedCategory, "",NumberOfRecords,dateTime,News_Web_Source);
        getAllCatAndSubCatPostDetailsForTwitterAndFaceBook($scope.selectedCategory, "",NumberOfRecords,dateTime,Twitter_Fb_Source);
        
                    validateJQCloud();
                    CompareDate();
                 
    }*/
                	
                	 function getLatestPostDate() {    	
                	
                 	 if ($scope.selectedCategory != undefined && $scope.selectedCategory != null && $scope.selectedCategory != "") {
                         $http.get(BASE_URL+'rest/user/post/GetPostBy/categoryAndSubCategory?category='+$scope.selectedCategory+'&subCategory='+''+'&numberOfPosts='+1+'&toDate='+dateTime+'&source='+News_Web_Source).then(function (response) {
                     		$scope.allNewsAndWeb= response.data.categoriesResponse; 
                     		 $scope.allCategoryAndSubCategoryForNewsAndWebLatestPostDate = $scope.allNewsAndWeb[0].postDate;
                     		});
                        $http.get(BASE_URL+'rest/user/post/GetPostBy/categoryAndSubCategory?category='+$scope.selectedCategory+'&subCategory='+''+'&numberOfPosts='+1+"&toDate="+dateTime+"&source="+Twitter_Fb_Source).then(function (response) {
                     	   $scope.allTwitterAndFaceBook = response.data.categoriesResponse;
                     	   $scope.allCategoryAndSubSategoryForTwitterAndFaceBookLatestPostDate = $scope.allTwitterAndFaceBook[0].postDate;
                     		});
                 	 }
                	 }
                	 
                	 
                	 function getLatestPostDateForHome() {    	
                     	
                     	 if ($scope.homeCategory != undefined && $scope.homeCategory != null && $scope.homeCategory != "") {
                             $http.get(BASE_URL+'rest/user/post/GetPostBy/categoryAndSubCategory?category='+$scope.homeCategory+'&subCategory='+''+'&numberOfPosts='+1+'&toDate='+dateTime+'&source='+News_Web_Source).then(function (response) {
                         		$scope.allNewsAndWeb= response.data.categoriesResponse; 
                         		 $scope.allCategoryAndSubCategoryForNewsAndWebLatestPostDate = $scope.allNewsAndWeb[0].postDate;
                         		});
                            $http.get(BASE_URL+'rest/user/post/GetPostBy/categoryAndSubCategory?category='+$scope.homeCategory+'&subCategory='+''+'&numberOfPosts='+1+"&toDate="+dateTime+"&source="+Twitter_Fb_Source).then(function (response) {
                         	   $scope.allTwitterAndFaceBook = response.data.categoriesResponse;
                         	   $scope.allCategoryAndSubSategoryForTwitterAndFaceBookLatestPostDate = $scope.allTwitterAndFaceBook[0].postDate;
                         		});
                     	 }
                    	 }
    
    function compareDate() {
       // var todayDate = new Date(); //Today Date
       // var dateOne = new Date(2010, 11, 25);
    	$scope.setCalDate = new Date();
  
         if($scope.allCategoryAndSubCategoryForNewsAndWebLatestPostDate!= null &&  $scope.allCategoryAndSubSategoryForTwitterAndFaceBookLatestPostDate != null &&
        		 $scope.allCategoryAndSubCategoryForNewsAndWebLatestPostDate!= '' &&  $scope.allCategoryAndSubSategoryForTwitterAndFaceBookLatestPostDate != ''){    
        if ($scope.allCategoryAndSubCategoryForNewsAndWebLatestPostDate > $scope.allCategoryAndSubSategoryForTwitterAndFaceBookLatestPostDate
        		|| $scope.allCategoryAndSubCategoryForNewsAndWebLatestPostDate == $scope.allCategoryAndSubSategoryForTwitterAndFaceBookLatestPostDate) {
        	$scope.setCalDate = $scope.allCategoryAndSubCategoryForNewsAndWebLatestPostDate;
         }else {
        	 $scope.setCalDate = $scope.allCategoryAndSubSategoryForTwitterAndFaceBookLatestPostDate;
         }
        $scope.setCalDate = $scope.setCalDate.split('T')[0];
        return $scope.setCalDate;
         }
         
     
    	 else{
    		 return $scope.setCalDate;
    	 }
    		 
    }
    
    
    
    function validateJQCloud() {
                                var tmp = $.fn.popover.Constructor.prototype.show;
                                                $.fn.popover.Constructor.prototype.show = function () {
                                                tmp.call(this);
                                                if (this.options.callback) {
                                    this.options.callback();
                                  }
                                }
    }
    
    /* Get All Categories List */
    function getAllCategories() {     
        $http.get(BASE_URL+'rest/categories/GetAllCategories').then(function (response) {
            $scope.allSubCategory = response.data;            
           // $window.localStorage.setItem("allSubCategory",$scope.allSubCategory);
            $(".keyword_icon").show();
        });
    }
    
    $scope.getTrendingSubCategories = function(selectedCategory,date1) {
       
 
                                                 /*  pickerFireCount++;
                                                   if (pickerFireCount == 3) {*/
                                       var promise = getSubCategoriesService.getTrendingSubCategories(selectedCategory,date1);
                                
                                       promise.then(function(payload) { 
                                
                                                   $scope.allTrendingSubCategory = payload.data;                                                
                                                   
                                                
                                                                                var tag_list1 = new Array();
                                                                                var atk1 = $scope.allTrendingSubCategory;
                                                
                                                                                for ( var i = 0; i < atk1.length; ++i ) {
                                                                                                                var x =  $scope.allTrendingSubCategory[i];
                                                                                                                tag_list1.push({
                                                                                                                                text: x.keyword,
                                                                                                                                weight: x.score,
                                                                                            handlers : {click: function() { 
                                                                                                var zz = x;
                                                                                              
                                                                                                return function() {
                                                                                              
                                                                                                                $scope.removeAppendedPosts();
                                                                                                                var days = 1;
                                                                                                                var selectedDate =  new Date(date1);
                                                                                                                
                                                                                                                selectedDate.setHours(24,0,0,0);
                                                                                                                var toDate = selectedDate.getFullYear() + '-' + (selectedDate.getMonth()+1) + '-' + (selectedDate.getDate());
                                                                                                                $scope.fromDate= date1;
                                                                                                    $scope.toDate= toDate;
                                                                                                                valtosend1 = zz.keyword;
                                                                                                                $scope.selectedSubcategory =zz.keyword;
                                                                                                
                                                                                                               //  console.log(BASE_URL+'rest/user/post/GetPostBy/categoryAndSubCategory?category='+$scope.selectedCategory+'&subCategory='+valtosend1+'&numberOfPosts='+NumberOfRecords+'&source='+News_Web_Source+'&fromDate='+date1+'&toDate='+toDate);
                                                                                                                    $http.get(BASE_URL+'rest/user/post/GetPostBy/categoryAndSubCategory?category='+$scope.selectedCategory+'&subCategory='+valtosend1+'&numberOfPosts='+NumberOfRecords+'&source='+News_Web_Source+'&fromDate='+date1+'&toDate='+toDate).then(function (response) {                                                                                                 
                                                                                                                                $scope.allCategoryAndSubCategoryForNewsAndWeb = response.data.categoriesResponse;
                                                                                                                                $scope.allCategoryAndSubCategoryForNewsAndWebCount = response.data.total_count.WEB + response.data.total_count.NEWS ;
                                                                                                           // console.log($scope.allCategoryAndSubCategoryForNewsAndWeb);
                                                                                                            if($scope.allCategoryAndSubCategoryForNewsAndWeb.length >0)
                                                                                                            $scope.allCategoryAndSubCategoryForNewsAndWebLastPostDate = $scope.allCategoryAndSubCategoryForNewsAndWeb[$scope.allCategoryAndSubCategoryForNewsAndWeb.length - 1].postDate;
                                                                                                            
                                                                                                           // console.log($scope.allCategoryAndSubCategoryForNewsAndWebLastPostDate);
                                                                                                          
                                                                                                        }); 
                                                                                                                
                                                                                                    
                                                                                                    /* Get SubCategories Data for TwitterAndFaceBook */
                                                                                                
                                                                                                                   // console.log(BASE_URL+'rest/user/post/GetPostBy/categoryAndSubCategory?category='+$scope.selectedCategory+'&subCategory='+valtosend1+'&numberOfPosts='+NumberOfRecords+"&source="+Twitter_Fb_Source+'&fromDate='+date1+'&toDate='+toDate);
                                                                                                                    $http.get(BASE_URL+'rest/user/post/GetPostBy/categoryAndSubCategory?category='+$scope.selectedCategory+'&subCategory='+valtosend1+'&numberOfPosts='+NumberOfRecords+"&source="+Twitter_Fb_Source+'&fromDate='+date1+'&toDate='+toDate).then(function (response) {
                                                                                                          
                                                                                                                                $scope.allCategoryAndSubSategoryForTwitterAndFaceBook = response.data.categoriesResponse;
                                                                                                                                $scope.allCategoryAndSubSategoryForTwitterAndFaceBookCount = response.data.total_count.FACEBOOK + response.data.total_count.TWITTER;
                                                                                                           // console.log($scope.allCategoryAndSubSategoryForTwitterAndFaceBook);
                                                                                                            if( $scope.allCategoryAndSubSategoryForTwitterAndFaceBook.length >0)
                                                                                                            $scope.allCategoryAndSubSategoryForTwitterAndFaceBookLastPostDate = $scope.allCategoryAndSubSategoryForTwitterAndFaceBook[$scope.allCategoryAndSubSategoryForTwitterAndFaceBook.length - 1].postDate;
                                                                                                           // console.log($scope.allCategoryAndSubSategoryForTwitterAndFaceBookLastPostDate);
                                                                                                        });
                                                                                                  
                                                                                                }
                                                                                               
                                                                                            }()},
                                                                                                                                html: {title: x.score + " posts"}
                                                                                                                });
                                                                                }
                                                                                
                                                                                 $('div#example.jqcloud').empty();
                                                                                 $("#example").jQCloud(tag_list1); 
                                                                                 tag_list1 =[];
                                                                                 $scope.allTrendingSubCategory={};
                                                   
                                                   
                                                   
                                
                                          },
                
                                          function(errorPayload) {
                                              $log.error('failure loading movie', errorPayload);
                                
                                          });
                                      /* pickerFireCount = 0;
                                                   }*/
                
                
    
        }
   
    
  /*  $('a#close-popover').click(function(e){
                $('.popover').hide();
    });*/
    
   $(document).on("click", ".popover .close" , function(){
                   $('.keyword_icon').popover('hide');
                   $('.keyword_icon_mob').popover('hide');
                //$('.close').popover('hide');
        //$(this).parents(".popover").popover('hide');
    });

    
 /* Get Icon Based on Subcategory */
    $scope.getIcons = function(mtns){
    	//$scope.allSubCategory = $window.localStorage.getItem("allSubCategory");
    //	getAllCategories();
                angular.forEach($scope.allSubCategory, function(value, key) {                                   
                                  for(i=0;i<value.subCategories.length;i++){
                                                  if(mtns!=null && mtns == value.subCategories[i].subcategory){
                                                                  imgUrl= value.subCategories[i].imgUrl;
                                                  }
                                  }                              
                                
                                });
                return imgUrl;
    };
    

/*    $(".editPost").on('click', function(){*/
    	/*$(document).on('click','.editPost',function(e) {
  		
  		$scope.editDialog.open($scope.allSubCategory, $scope.selectedEditPost);
  	});*/
    /* Called when user clicks on home button */ 
    $scope.homebtn_click = function () {
    	//window.location.href =window.location.href.split('?')[0];
    	 $('.keyword_icon').popover('hide');
         $('.keyword_icon_mob').popover('hide');
         $scope.searchText="";
  	  if($scope.homeCategory == 'TECHTRENDS')
      {
     // $scope.selectedCategory = "TECHTRENDS";
  		 $scope.activeMenu = $scope.menuItems[1];
      $window.localStorage.setItem("activeMenu",$scope.menuItems[1]);
     // $window.localStorage.setItem("selectedCat",$scope.homeCategory);
      
      }
      else{
//$scope.selectedCategory = "RENEWABLES";
    		 $scope.activeMenu = $scope.menuItems[0];
$window.localStorage.setItem("activeMenu",$scope.menuItems[0]);  
//$window.localStorage.setItem("selectedCat",$scope.homeCategory);

    	
}
  	$scope.selectedCategory = $scope.homeCategory;
  	$window.localStorage.setItem("selectedCat",$scope.homeCategory);
  	
	$scope.selectedSubcategory='';
	$window.localStorage.setItem("selectedSubCat",$scope.selectedSubcategory); 
	 $location.path('/home');
	getLatestPostDateForHome();
    	 getAllCatAndSubCatPostDetailsForNewsAndWeb($scope.homeCategory, $scope.selectedSubcategory,NumberOfRecords,dateTime,News_Web_Source);
         getAllCatAndSubCatPostDetailsForTwitterAndFaceBook($scope.homeCategory,$scope.selectedSubcategory,NumberOfRecords,dateTime,Twitter_Fb_Source); 
        // CompareDate();
        
    }
    
   
  
 
    
   /* $("#back").click(function(){
    	$location.path('/home');
	
    });*/
    /* Called when user clicks on changePassword button */ 
    $scope.changePassword = function () {
    	$location.path('/changePassword');
    	 $('.keyword_icon').popover('hide');
         $('.keyword_icon_mob').popover('hide');
    }
    
    /* Called when user clicks on logout button */ 
    $scope.logout = function () {
        $rootScope.userData = {};
        $rootScope.userDetails = {};
        $location.path('/login');
        $('.keyword_icon').popover('hide');
        $('.keyword_icon_mob').popover('hide');
        $window.localStorage.clear();
    }
    
   
    /* Get Social Media Icon Based on source */
    $scope.getSocialMediaIcon = function(source){    
                 if(source == 'TWITTER' ){
                                    return 'images/twitter_logo.png';
                                 }
                                 else {
                                    return 'images/fb.png';
                                 } 
    }
  

  

    /* Format the post date */ 
    function formatDate(date) {
    	var date = date.split('T')[0];
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }
    
    
    /* Format the post date */
    function formatPostDate(date) {
    	var date = date.split('T')[0];
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [day,month,year].join('-');
    }
    
    function getCountForTestScreen(category, subcategory,numberOfPosts,dateTime)
    {
    $http.get(BASE_URL+'rest/user/post/GetPostBy/categoryAndSubCategory?category='+category+'&subCategory='+subcategory+'&numberOfPosts='+1+'&toDate='+dateTime+'&source='+News_Web_Source ).then(function (response) {
        
        $scope.allCategoryAndSubCategoryForNewsAndWebTestCount = response.data.total_count.WEB + response.data.total_count.NEWS;              
    });
        //console.log($scope.allCategoryAndSubCategoryForNewsAndWebTestLastPostDate);
        $http.get(BASE_URL+'rest/user/post/GetPostBy/categoryAndSubCategory?category='+category+'&subCategory='+subcategory+'&numberOfPosts='+1+"&toDate="+dateTime+"&source="+Twitter_Fb_Source ).then(function (response) {
      
            $scope.allCategoryAndSubSategoryForTwitterAndFaceBookTestCount = response.data.total_count.FACEBOOK + response.data.total_count.TWITTER;

        });
    }
    
    /* Get SubCategories Data for NewsAndWeb */
    function getAllCatAndSubCatPostDetailsForNewsAndWeb( category, subcategory,numberOfPosts,dateTime,source) {
                if( $scope.isAdminUser)
                 { 
                	
                	
                $http.get(BASE_URL+'rest/user/post/GetPostBy/categoryAndSubCategory?category='+category+'&subCategory='+subcategory+'&numberOfPosts='+$scope.allCategoryAndSubCategoryForNewsAndWebTestCount+'&toDate='+dateTime+'&source='+source ).then(function (response) {
                $scope.allCategoryAndSubCategoryForNewsAndWebTest = response.data.categoriesResponse;
                console.log($scope.allCategoryAndSubCategoryForNewsAndWebTest);
                $scope.allCategoryAndSubCategoryForNewsAndWebTestCount = response.data.total_count.WEB + response.data.total_count.NEWS;              
                if($scope.allCategoryAndSubCategoryForNewsAndWebTest.length >0)
                $scope.allCategoryAndSubCategoryForNewsAndWebTestLastPostDate  = $scope.allCategoryAndSubCategoryForNewsAndWebTest[$scope.allCategoryAndSubCategoryForNewsAndWebTest.length - 1].postDate;
              
                //console.log($scope.allCategoryAndSubCategoryForNewsAndWebTestLastPostDate);
                });
            
                 }
                else{ 
                $http.get(BASE_URL+'rest/user/post/GetPostBy/categoryAndSubCategory?category='+category+'&subCategory='+subcategory+'&numberOfPosts='+numberOfPosts+'&toDate='+dateTime+'&source='+source).then(function (response) {
                $scope.allCategoryAndSubCategoryForNewsAndWeb = response.data.categoriesResponse;
                $scope.allCategoryAndSubCategoryForNewsAndWebCount = response.data.total_count.WEB + response.data.total_count.NEWS;
          
                //console.log($scope.allCategoryAndSubCategoryForNewsAndWeb);
                if($scope.allCategoryAndSubCategoryForNewsAndWeb.length >0){
            	/*if(subcategory == '')
                $scope.allCategoryAndSubCategoryForNewsAndWebLatestPostDate = $scope.allCategoryAndSubCategoryForNewsAndWeb[0].postDate;*/
                $scope.allCategoryAndSubCategoryForNewsAndWebLastPostDate = $scope.allCategoryAndSubCategoryForNewsAndWeb[$scope.allCategoryAndSubCategoryForNewsAndWeb.length - 1].postDate;
                }
               //console.log($scope.allCategoryAndSubCategoryForNewsAndWebLastPostDate);
                }); 
                }
                }
    
    /* Get SubCategories Data for TwitterAndFaceBook */
    function getAllCatAndSubCatPostDetailsForTwitterAndFaceBook( category, subcategory,numberOfPosts,dateTime,source) {       
                if( $scope.isAdminUser)
                                {
                                $http.get(BASE_URL+'rest/user/post/GetPostBy/categoryAndSubCategory?category='+category+'&subCategory='+subcategory+'&numberOfPosts='+$scope.allCategoryAndSubSategoryForTwitterAndFaceBookTestCount+"&toDate="+dateTime+"&source="+source ).then(function (response) {
                $scope.allCategoryAndSubSategoryForTwitterAndFaceBookTest = response.data.categoriesResponse;
                $scope.allCategoryAndSubSategoryForTwitterAndFaceBookTestCount = response.data.total_count.FACEBOOK + response.data.total_count.TWITTER;
              console.log($scope.allCategoryAndSubSategoryForTwitterAndFaceBookTest);
                if( $scope.allCategoryAndSubSategoryForTwitterAndFaceBookTest.length >0)
                $scope.allCategoryAndSubSategoryForTwitterAndFaceBookTestLastPostDate = $scope.allCategoryAndSubSategoryForTwitterAndFaceBookTest[$scope.allCategoryAndSubSategoryForTwitterAndFaceBookTest.length - 1].postDate;
               // console.log($scope.allCategoryAndSubSategoryForTwitterAndFaceBookTestLastPostDate);
            });
                                }
                else{
                $http.get(BASE_URL+'rest/user/post/GetPostBy/categoryAndSubCategory?category='+category+'&subCategory='+subcategory+'&numberOfPosts='+numberOfPosts+"&toDate="+dateTime+"&source="+source).then(function (response) {
            $scope.allCategoryAndSubSategoryForTwitterAndFaceBook = response.data.categoriesResponse;
            $scope.allCategoryAndSubSategoryForTwitterAndFaceBookCount = response.data.total_count.FACEBOOK + response.data.total_count.TWITTER ;
           // console.log($scope.allCategoryAndSubSategoryForTwitterAndFaceBook);
            if( $scope.allCategoryAndSubSategoryForTwitterAndFaceBook.length >0){
            	/*if(subcategory == '')
            	$scope.allCategoryAndSubSategoryForTwitterAndFaceBookLatestPostDate =$scope.allCategoryAndSubSategoryForTwitterAndFaceBook[0].postDate;*/
            $scope.allCategoryAndSubSategoryForTwitterAndFaceBookLastPostDate = $scope.allCategoryAndSubSategoryForTwitterAndFaceBook[$scope.allCategoryAndSubSategoryForTwitterAndFaceBook.length - 1].postDate;
            }
            //console.log($scope.allCategoryAndSubSategoryForTwitterAndFaceBookLastPostDate);
        });
                }
    }
   
   
    /* Search Event Handler */
    $scope.change = function(text) {          
        valtosend = $scope.searchText;
        if(valtosend != null && valtosend !="")
        	{
        	$scope.isTextEntered = true;
        	}
        else{
        	$scope.isTextEntered = false;
        }
        $http.get(BASE_URL+'rest/user/post/SearchForKeyWords?Keywords='+encodeURIComponent(valtosend)+'&category='+$scope.selectedCategory+'&source='+News_Web_Source+'&numberOfPosts='+NumberOfRecords).then(function(result){
        /*	result.data = {
        			“categoriesResponse”:[
                        {
                                        "title": "",
                                        "summary": "",
"description": "",
                                       "url": "",
                                       "postDate": "",
                                       "category": "",
                                      "subCategory": "",
                                       "postType": "",
                                       "source": "",
                                       "imageUrl": ""
                        },
{
                                        "title": "",
                                        "summary": "",
"description": "",
                                       "url": "",
                                       "postDate": "",
                                       "category": "",
                                      "subCategory": "",
                                       "postType": "",
                                       "source": "",
                                       "imageUrl": ""
                        }

          ],
“newsCount”:2,
“feedsCount”:2,
“twitterCount”:2,
“facebookCount”:2
};*/
            if( $scope.isAdminUser)
            {
            	$scope.allCategoryAndSubCategoryForNewsAndWebTest = result.data.categoriesResponse;
            	$scope.allCategoryAndSubCategoryForNewsAndWebTestCount = result.data.total_count.WEB + result.data.total_count.NEWS;	
                if( $scope.allCategoryAndSubCategoryForNewsAndWebTest.length >0)
                    $scope.allCategoryAndSubCategoryForNewsAndWebTestLastPostDate = $scope.allCategoryAndSubCategoryForNewsAndWebTest[$scope.allCategoryAndSubCategoryForNewsAndWebTest.length - 1].postDate;
            }
            else{
            	$scope.allCategoryAndSubCategoryForNewsAndWeb = result.data.categoriesResponse;
            	$scope.allCategoryAndSubCategoryForNewsAndWebCount = result.data.total_count.WEB + result.data.total_count.NEWS;
                if( $scope.allCategoryAndSubCategoryForNewsAndWeb.length >0)
                    $scope.allCategoryAndSubCategoryForNewsAndWebLastPostDate = $scope.allCategoryAndSubCategoryForNewsAndWeb[$scope.allCategoryAndSubCategoryForNewsAndWeb.length - 1].postDate;
            }
        	
        	
                
               // console.log($scope.allCategoryAndSubCategoryForNewsAndWebLastPostDate);
        });
        
        $http.get(BASE_URL+'rest/user/post/SearchForKeyWords?Keywords='+encodeURIComponent(valtosend)+'&category='+$scope.selectedCategory+'&source='+Twitter_Fb_Source+'&numberOfPosts='+NumberOfRecords).then(function(result){
           
        	 if( $scope.isAdminUser)
             {
        		 $scope.allCategoryAndSubSategoryForTwitterAndFaceBookTest = result.data.categoriesResponse;
                 $scope.allCategoryAndSubSategoryForTwitterAndFaceBookTestCount = result.data.total_count.FACEBOOK + result.data.total_count.TWITTER;
                 if($scope.allCategoryAndSubSategoryForTwitterAndFaceBookTest.length >0)
                     $scope.allCategoryAndSubSategoryForTwitterAndFaceBookTestLastPostDate = $scope.allCategoryAndSubSategoryForTwitterAndFaceBookTest[$scope.allCategoryAndSubSategoryForTwitterAndFaceBookTest.length - 1].postDate;
             }
             else{
            	 $scope.allCategoryAndSubSategoryForTwitterAndFaceBook = result.data.categoriesResponse;
                 $scope.allCategoryAndSubSategoryForTwitterAndFaceBookCount = result.data.total_count.FACEBOOK + result.data.total_count.TWITTER;
                 if($scope.allCategoryAndSubSategoryForTwitterAndFaceBook.length >0)
                     $scope.allCategoryAndSubSategoryForTwitterAndFaceBookLastPostDate = $scope.allCategoryAndSubSategoryForTwitterAndFaceBook[$scope.allCategoryAndSubSategoryForTwitterAndFaceBook.length - 1].postDate;
                    // console.log($scope.allCategoryAndSubSategoryForTwitterAndFaceBookLastPostDate);
             }
        	
        	
        	
        	
        });
        };       
   
        
    /* SubCategory selection Event Handler */
    $scope.navCat_click = function (subCat) { 
    	//$location.path('/home');
    	 $scope.removeAppendedPosts();
                 $scope.selectedSubcategory = subCat;
                 $window.localStorage.setItem("selectedSubCat",$scope.selectedSubcategory);                 
                 $scope.allTrendingSubCategory={};
                angular.forEach($scope.allSubCategory, function(value, key) {                   
                                  for(i=0;i<value.subCategories.length;i++){
                                                  if(subCat!=null && subCat == value.subCategories[i].subcategory){                                                         
                                                                  
                                                                $scope.selectedCategory =value.categoryName;
                                                                if($scope.selectedCategory == 'TECHNOLOGY TRENDS')
                                                                                {
                                                                                $scope.selectedCategory = "TECHTRENDS";
                                                                                $window.localStorage.setItem("activeMenu",$scope.menuItems[1]);
                                                                                }
                                                                                else{
                                                                    $scope.selectedCategory = "RENEWABLES";
                                                                    $window.localStorage.setItem("activeMenu",$scope.menuItems[0]);
                                                                                }
                                                                $window.localStorage.setItem("selectedCat",$scope.selectedCategory);
                                                  }
                                  }                              
                                
                                });
               
                	getLatestPostDate();
                	getCountForTestScreen($scope.selectedCategory,$scope.selectedSubcategory,NumberOfRecords,dateTime);
                    getAllCatAndSubCatPostDetailsForNewsAndWeb($scope.selectedCategory,$scope.selectedSubcategory,NumberOfRecords,dateTime,News_Web_Source);
                    getAllCatAndSubCatPostDetailsForTwitterAndFaceBook($scope.selectedCategory,$scope.selectedSubcategory,NumberOfRecords,dateTime,Twitter_Fb_Source);
                
                
               
                $('.keyword_icon').popover('hide');
                $('.keyword_icon_mob').popover('hide');
                
                $scope.searchText = '';               
                $scope.isTextEntered = false;
    }
    
	/* Open popup to edit Category/Subcategory/Titel of the tile*/
    $scope.editDialog = new EditDialogModel();
	 
	/* Update Title Information from Popup*/	 
	 $scope.formSubmitted = function(objForm){
       //close the popup
		objForm.editDialog.visible = false;
		
		//create the object for parameters
		var param = new Object();
		param.category = objForm.editDialog.selectedCategory.categoryName;
		
		 if(param.category == 'ENERGY')
			{ 
			 param.category  = 'RENEWABLES';
			}
		 else
			 {
			 param.category   = 'TECHTRENDS';
			
			 }
		param.subCategory = objForm.editDialog.selectedSubCategory.subcategory;
		param.title = objForm.editDialog.title;
		param.url = objForm.editDialog.url;
		if(objForm.editDialog.Approved)
		param.status = 1;
		else
			param.status = 0;
		
		
		
		
		var paramReq = [{"category":param.category ,"subCategory":param.subCategory,"url":param.url}];
			
		
		//call API to post the data
		/*$http.post(BASE_URL + 'rest/post/updatePostCategory?category='+param.category+'&subCategory='+param.subCategory+'&title='+param.title+'&status='+param.status)*/
		$http.post(BASE_URL + 'rest/user/post/updatePostCategory/',JSON.stringify(paramReq))
		//$http.post(BASE_URL + 'rest/user/post/updatePostCategory/',$httpParamSerializer(param))
		
			.success(function(response) {
				alert("Post Updated");
				callback(response);				
			}
		);
		
		var paramReq1 = {"url":[param.url],"status":param.status};
		
		$http.post(BASE_URL + 'rest/user/post/updateStatusByList/',JSON.stringify(paramReq1))
		//$http.post(BASE_URL + 'rest/user/post/updatePostCategory/',$httpParamSerializer(param))
		
			.success(function(response) {
				//callback(response);
			/*	 if( $scope.isAdminUser)
		          {
		          $http.get(BASE_URL+'rest/user/post/GetPostBy/categoryAndSubCategory?category='+$window.localStorage.getItem("selectedCat")+'&subCategory='+$window.localStorage.getItem("selectedSubCat")+'&numberOfPosts='+NumberOfRecords+'&toDate='+dateTime+'&source='+News_Web_Source ).then(function (response) {
		$scope.allCategoryAndSubCategoryForNewsAndWebTest = response.data.categoriesResponse;
		$scope.allCategoryAndSubCategoryForNewsAndWebTestCount = response.data.total_count.WEB + response.data.total_count.NEWS;
		//  console.log($scope.allCategoryAndSubCategoryForNewsAndWebTest);
		if($scope.allCategoryAndSubCategoryForNewsAndWebTest.length >0)
		$scope.allCategoryAndSubCategoryForNewsAndWebTestLastPostDate  = $scope.allCategoryAndSubCategoryForNewsAndWebTest[$scope.allCategoryAndSubCategoryForNewsAndWebTest.length - 1].postDate;

		//console.log($scope.allCategoryAndSubCategoryForNewsAndWebTestLastPostDate);

		});
		          $http.get(BASE_URL+'rest/user/post/GetPostBy/categoryAndSubCategory?category='+$window.localStorage.getItem("selectedSubCat")+'&subCategory='+$window.localStorage.getItem("selectedSubCat")+'&numberOfPosts='+NumberOfRecords+"&toDate="+dateTime+"&source="+Twitter_Fb_Source ).then(function (response) {
		              $scope.allCategoryAndSubSategoryForTwitterAndFaceBookTest = response.data.categoriesResponse;
		              $scope.allCategoryAndSubSategoryForTwitterAndFaceBookTestCount = response.data.total_count.FACEBOOK + response.data.total_count.TWITTER;
		            console.log($scope.allCategoryAndSubSategoryForTwitterAndFaceBookTest);
		              if( $scope.allCategoryAndSubSategoryForTwitterAndFaceBookTest.length >0)
		              $scope.allCategoryAndSubSategoryForTwitterAndFaceBookTestLastPostDate = $scope.allCategoryAndSubSategoryForTwitterAndFaceBookTest[$scope.allCategoryAndSubSategoryForTwitterAndFaceBookTest.length - 1].postDate;
		             // console.log($scope.allCategoryAndSubSategoryForTwitterAndFaceBookTestLastPostDate);
		          });
		          }	*/
			}
		);
		
		 
   };
    
    $scope.removeAppendedPosts = function(){
                $('div#chatter_scroll  div:not(chatter_tile  chatter_tile-right-less)').remove();
                $('div.clearfix.margin-right-less  div:not(col-md-4 padding_right_less)').remove();
                } 
    
    /* Scroll Event Handlers  */
    $scope.scrollToEndContainer = function(dir) {     
        if(dir == 'bottom')
                {
        $scope.scrollCheck_click();
                }
      };
      $scope.scrollToEndWindow = function(dir) {                 
                  if(dir == 'bottom')
                                {
                  $scope.scrollCheckWebNews_click();
                                }      
      }; 
      
      
      /* Scroll for more records for WebAndNews source */
      $scope.scrollCheckWebNews_click = function () {
                
   if(!$scope.isAdminUser)
                {
                numberOfPosts = NumberOfRecords;
                toDate =  $scope.allCategoryAndSubCategoryForNewsAndWebLastPostDate ;     
          valtosend = $scope.searchText;
        
         if($('div').hasClass('popover fade')){
                  wordCloudOpen = true;               
                }
       
          if(valtosend!=null && valtosend!="" && !wordCloudOpen)
                {
               // console.log(BASE_URL+'rest/user/post/SearchForKeyWords?Keywords='+valtosend+'&category='+$scope.selectedCategory+'&source='+News_Web_Source+'&toDate='+toDate+'&numberOfPosts='+numberOfPosts);
          $http.get(BASE_URL+'rest/user/post/SearchForKeyWords?Keywords='+encodeURIComponent(valtosend)+'&category='+$scope.selectedCategory+'&source='+News_Web_Source+'&toDate='+toDate+'&numberOfPosts='+numberOfPosts).then(function(result){
                                      
                $scope.allCategoryAndSubCategoryForNewsAndWeb1 = result.data.categoriesResponse;
                if( $scope.allCategoryAndSubCategoryForNewsAndWeb1.length >1){
                      $scope.allCategoryAndSubCategoryForNewsAndWebLastPostDate = $scope.allCategoryAndSubCategoryForNewsAndWeb1[$scope.allCategoryAndSubCategoryForNewsAndWeb1.length - 1].postDate;
                      
                     // console.log($scope.allCategoryAndSubCategoryForNewsAndWebLastPostDate);
               //  console.log($scope.allCategoryAndSubCategoryForNewsAndWeb1);
                 angular.forEach($scope.allCategoryAndSubCategoryForNewsAndWeb1, function(value, key) { 
                                if(key>0){
                 var imgsrc = $scope.getIcons(value.subCategory);                          
           
                                $("div.clearfix.margin-right-less").append(
                                                                $('<div>').attr('class', "col-md-4 padding_right_less").append(
                                                                $('<div>').attr('class', "news_tile").append(
                                                                $('<div>').attr('class', "media").append(
                                                                $('<a>').attr({'class':"media-left"}).append(
                                                                $('<img>').attr({'src': imgsrc,'class': "media-object"}).append(                                                                                                 
                                                                $('</a>')))).append(
                                                                $('<div>').attr('class', "media-body").append(
                                                                $('<h5>').attr('class', "media-heading").append(value.subCategory).append(
                                                                $('</h5>'))).append(
                                                                $('<span>').attr('class', "calander_wrap").append(
                                                                $('<span>').attr({'aria-hidden':"true",'class': "glyphicon glyphicon-time"}).append(          
                                                                $('</span>'))).append(
                                                                $('<span>').append('Posted on ' + formatPostDate(value.postDate)).append(
                                                                $('</span>'))).append(
                                                                $('</span>'))).append(
                                                                $('</div>'))).append(
                                                                $('<div>').attr('class', "media_text_box").append(
                                                                $('<h3>').attr('class', "media_text_heading").append(
                                                                $('<a>').attr({'target':"_blank",
                                                                                                                'href': value.url}).append(value.title).append(
                                                                $('</a>'))).append(                                         
                                                                $('</h3>'))).append(
                                                                $('<div>').attr('class', "hidden-lg hidden-md visible-sm visible-xs").append(
                                                    $('<span>').attr('class', "glyphicon glyphicon-thumbs-up hover_icons margin-right-less").append(
                                                    $('</span>'))).append(
                                                                $('<span>').attr('class', "glyphicon glyphicon-trash hover_icons margin-right-less").append(
                                                    $('</span>'))).append(
                                                    $('<span>').attr('class', "glyphicon glyphicon-envelope hover_icons margin-right-less").append(
                                                    $('</span>'))).append(
                                                    $('</div>')))).append(
                                                    $('<p>').append(
                                                    $('<img>').attr({'src': value.imageUrl,'class': "pull-left sub_left_img",
                                                                                                'alt':'','style':"height:40px;width:50px", 'onerror': 'this.style.display = "none"' }).append(
                                                                                                                                )).append(
                                                                                                                                                                value.summary).append(
                                                    $('</p>'))).append(
                                                    $('</div>')).append(
                                                    $('</div>')).append(
                                                    $('</div>'))).append(                                   
                                                    $('</div>'))));  }        
                                 });
            
          }
          });
          
                }
          else if(wordCloudOpen){
                

              //  console.log(BASE_URL+'rest/user/post/SearchForKeyWords?Keywords='+valtosend+'&category='+$scope.selectedCategory+'&subCategory='+$scope.selectedSubcategory+'&source='+News_Web_Source+'&fromDate='+$scope.fromDate+'&toDate='+$scope.toDate+'&numberOfPosts='+numberOfPosts);
              $http.get(BASE_URL+'rest/user/post/SearchForKeyWords?Keywords='+encodeURIComponent(valtosend)+'&category='+$scope.selectedCategory+'&subCategory='+$scope.selectedSubcategory+'&source='+News_Web_Source+'&fromDate='+$scope.fromDate+'&toDate='+toDate+'&numberOfPosts='+numberOfPosts).then(function(result){
                                      
                                $scope.allCategoryAndSubCategoryForNewsAndWeb1 = result.data.categoriesResponse;
                                if( $scope.allCategoryAndSubCategoryForNewsAndWeb1.length >1){
                                
                          $scope.allCategoryAndSubCategoryForNewsAndWebLastPostDate = $scope.allCategoryAndSubCategoryForNewsAndWeb1[$scope.allCategoryAndSubCategoryForNewsAndWeb1.length - 1].postDate;
                          
                        //  console.log($scope.allCategoryAndSubCategoryForNewsAndWebLastPostDate);
                              //   console.log($scope.allCategoryAndSubCategoryForNewsAndWeb1);
                                 angular.forEach($scope.allCategoryAndSubCategoryForNewsAndWeb1, function(value, key) {
                                                if(key>0){
                                 var imgsrc = $scope.getIcons(value.subCategory);                          
               
                                                $("div.clearfix.margin-right-less").append(
                                                                $('<div>').attr('class', "col-md-4 padding_right_less").append(
                                                                $('<div>').attr('class', "news_tile").append(
                                                                $('<div>').attr('class', "media").append(
                                                                $('<a>').attr({'class':"media-left"}).append(
                                                                $('<img>').attr({'src': imgsrc,'class': "media-object"}).append(                                                                                                 
                                                                $('</a>')))).append(
                                                                $('<div>').attr('class', "media-body").append(
                                                                $('<h5>').attr('class', "media-heading").append(value.subCategory).append(
                                                                $('</h5>'))).append(
                                                                $('<span>').attr('class', "calander_wrap").append(
                                                                $('<span>').attr({'aria-hidden':"true",'class': "glyphicon glyphicon-time"}).append(          
                                                                $('</span>'))).append(
                                                                $('<span>').append('Posted on ' + formatPostDate(value.postDate)).append(
                                                                $('</span>'))).append(
                                                                $('</span>'))).append(
                                                                $('</div>'))).append(
                                                                $('<div>').attr('class', "media_text_box").append(
                                                                $('<h3>').attr('class', "media_text_heading").append(
                                                                $('<a>').attr({'target':"_blank",
                                                                                                                'href': value.url}).append(value.title).append(
                                                                $('</a>'))).append(                                         
                                                                $('</h3>'))).append(
                                                                $('<div>').attr('class', "hidden-lg hidden-md visible-sm visible-xs").append(
                                                    $('<span>').attr('class', "glyphicon glyphicon-thumbs-up hover_icons margin-right-less").append(
                                                    $('</span>'))).append(
                                                                $('<span>').attr('class', "glyphicon glyphicon-trash hover_icons margin-right-less").append(
                                                    $('</span>'))).append(
                                                    $('<span>').attr('class', "glyphicon glyphicon-envelope hover_icons margin-right-less").append(
                                                    $('</span>'))).append(
                                                    $('</div>')))).append(
                                                    $('<p>').append(
                                                    $('<img>').attr({'src': value.imageUrl,'class': "pull-left sub_left_img",
                                                                                                'alt':'','style':"height:40px;width:50px", 'onerror': 'this.style.display = "none"' }).append(
                                                                                                                                )).append(
                                                                                                                                                                value.summary).append(
                                                    $('</p>'))).append(
                                                    $('</div>')).append(
                                                    $('</div>')).append(
                                                    $('</div>'))).append(                                   
                                                    $('</div>'))));  }
                                 });
                    }
              });
              
          }
          
          else{
        /*if( $scope.isAdminUser){
               
                toDate =   $scope.allCategoryAndSubCategoryForNewsAndWebTestLastPostDate ;
            //    console.log(BASE_URL+'rest/user/post/GetPostBy/categoryAndSubCategory?category='+ $scope.selectedCategory+'&subCategory='+$scope.selectedSubcategory+'&numberOfPosts='+numberOfPosts+'&source='+News_Web_Source+'&toDate='+toDate );
                $http.get(BASE_URL+'rest/user/post/GetPostBy/categoryAndSubCategory?category='+ $scope.selectedCategory+'&subCategory='+$scope.selectedSubcategory+'&numberOfPosts='+numberOfPosts+'&source='+News_Web_Source+'&toDate='+toDate ).then(function (result) {
                  
                                $scope.allCategoryAndSubCategoryForNewsAndWeb1 = result.data.categoriesResponse;
                if( $scope.allCategoryAndSubCategoryForNewsAndWeb1.length >1){
                      $scope.allCategoryAndSubCategoryForNewsAndWebTestLastPostDate = $scope.allCategoryAndSubCategoryForNewsAndWeb1[$scope.allCategoryAndSubCategoryForNewsAndWeb1.length - 1].postDate;
                      
                   //   console.log($scope.allCategoryAndSubCategoryForNewsAndWebTestLastPostDate);
                // console.log($scope.allCategoryAndSubCategoryForNewsAndWeb1);
                 angular.forEach($scope.allCategoryAndSubCategoryForNewsAndWeb1, function(value, key) { 
                                if(key>0){
                 var imgsrc = $scope.getIcons(value.subCategory);
                 $scope.selectedEditPost = value;
                 $("div.clearfix.margin-right-less").append(
                                                                $('<div>').attr('class', "col-md-4 padding_right_less").append(
                                                                $('<div>').attr('class', "news_tile").append(
                                                                $('<div>').attr('class', "media").append(
                                                                $('<a>').attr({'class':"media-left"}).append(
                                                                $('<img>').attr({'src': imgsrc,'class': "media-object"}).append(                                                                                                 
                                                                $('</a>')))).append(
                                                                $('<div>').attr('class', "media-body").append(
                                                                $('<h5>').attr('class', "media-heading").append(value.subCategory).append(
                                                                $('</h5>'))).append(
                                                                $('<span>').attr('class', "calander_wrap").append(
                                                                $('<span>').attr({'aria-hidden':"true",'class': "glyphicon glyphicon-time"}).append(          
                                                                $('</span>'))).append(
                                                                $('<span>').append('Posted on ' + formatPostDate(value.postDate)).append(
                                                                $('</span>'))).append(
                                                                $('</span>'))).append(
                                                                		 $('<a>').attr({'target':"_blank",'href': $scope.editDialog.open($scope.allSubCategory, value)}).append(value.title).append(
                                                                        $('<img>').attr({'src': "images/edit.jpg",'class': "media-body editPost",
                                                                                          'alt':'',
                                                                                          'href':$scope.editDialog.open($scope.allSubCategory, value),
                                                                                          'style':"width:60px;float:right;cursor:pointer"
                                                                                           }).append(
                                                                                        	  ,
                                                                                          'onclick':$scope.editDialog.open($scope.allSubCategory, value)}).append(
                                                                $('</div>')))).append(
                                                                $('<div>').attr('class', "media_text_box").append(
                                                                $('<h3>').attr('class', "media_text_heading").append(
                                                                $('<a>').attr({'target':"_blank",'href': value.url}).append(value.title).append(
                                                                $('</a>'))).append(                                         
                                                                $('</h3>'))).append(
                                                                $('<div>').attr('class', "hidden-lg hidden-md visible-sm visible-xs").append(
                                                    $('<span>').attr('class', "glyphicon glyphicon-thumbs-up hover_icons margin-right-less").append(
                                                    $('</span>'))).append(
                                                                $('<span>').attr('class', "glyphicon glyphicon-trash hover_icons margin-right-less").append(
                                                    $('</span>'))).append(
                                                    $('<span>').attr('class', "glyphicon glyphicon-envelope hover_icons margin-right-less").append(
                                                    $('</span>'))).append(
                                                    $('</div>')))).append(
                                                    $('<p>').append(
                                                    $('<img>').attr({'src': value.imageUrl,'class': "pull-left sub_left_img",
                                                                                                'alt':'','style':"height:40px;width:50px", 'onerror': 'this.style.display = "none"' }).append(
                                                                                                                                )).append(
                                                                                                                                                                value.summary).append(
                                                    $('</p>'))).append(
                                                    $('</div>')).append(
                                                    $('</div>')).append(
                                                    $('</div>'))).append(                                   
                                                    $('</div>')))); } 
                 });
                }
                                
              });
        }
        else{*/
   
                //console.log(BASE_URL+'rest/user/post/GetPostBy/categoryAndSubCategory?category='+ $scope.selectedCategory+'&subCategory='+$scope.selectedSubcategory+'&numberOfPosts='+numberOfPosts+'&source='+News_Web_Source+'&toDate='+toDate);
                $http.get(BASE_URL+'rest/user/post/GetPostBy/categoryAndSubCategory?category='+ $scope.selectedCategory+'&subCategory='+$scope.selectedSubcategory+'&numberOfPosts='+numberOfPosts+'&source='+News_Web_Source+'&toDate='+toDate).then(function (result) {
                  
                                $scope.allCategoryAndSubCategoryForNewsAndWeb1 = result.data.categoriesResponse;
                if( $scope.allCategoryAndSubCategoryForNewsAndWeb1.length >1){
                      $scope.allCategoryAndSubCategoryForNewsAndWebLastPostDate = $scope.allCategoryAndSubCategoryForNewsAndWeb1[$scope.allCategoryAndSubCategoryForNewsAndWeb1.length - 1].postDate;
                      
                     // console.log($scope.allCategoryAndSubCategoryForNewsAndWebLastPostDate);
                 //console.log($scope.allCategoryAndSubCategoryForNewsAndWeb1);
                 angular.forEach($scope.allCategoryAndSubCategoryForNewsAndWeb1, function(value, key) { 
                                if(key>0){
                 var imgsrc = $scope.getIcons(value.subCategory);                          
                 $("div.clearfix.margin-right-less").append(
                                                                $('<div>').attr('class', "col-md-4 padding_right_less").append(
                                                                $('<div>').attr('class', "news_tile").append(
                                                                $('<div>').attr('class', "media").append(
                                                                $('<a>').attr({'class':"media-left"}).append(
                                                                $('<img>').attr({'src': imgsrc,'class': "media-object"}).append(                                                                                                 
                                                                $('</a>')))).append(
                                                                $('<div>').attr('class', "media-body").append(
                                                                $('<h5>').attr('class', "media-heading").append(value.subCategory).append(
                                                                $('</h5>'))).append(
                                                                $('<span>').attr('class', "calander_wrap").append(
                                                                $('<span>').attr({'aria-hidden':"true",'class': "glyphicon glyphicon-time"}).append(          
                                                                $('</span>'))).append(
                                                                $('<span>').append('Posted on ' + formatPostDate(value.postDate)).append(
                                                                $('</span>'))).append(
                                                                $('</span>'))).append(
                                                                $('</div>'))).append(
                                                                $('<div>').attr('class', "media_text_box").append(
                                                                $('<h3>').attr('class', "media_text_heading").append(
                                                                $('<a>').attr({'target':"_blank",
                                                                                                                'href': value.url}).append(value.title).append(
                                                                $('</a>'))).append(                                         
                                                                $('</h3>'))).append(
                                                                $('<div>').attr('class', "hidden-lg hidden-md visible-sm visible-xs").append(
                                                    $('<span>').attr('class', "glyphicon glyphicon-thumbs-up hover_icons margin-right-less").append(
                                                    $('</span>'))).append(
                                                                $('<span>').attr('class', "glyphicon glyphicon-trash hover_icons margin-right-less").append(
                                                    $('</span>'))).append(
                                                    $('<span>').attr('class', "glyphicon glyphicon-envelope hover_icons margin-right-less").append(
                                                    $('</span>'))).append(
                                                    $('</div>')))).append(
                                                    $('<p>').append(
                                                    $('<img>').attr({'src': value.imageUrl,'class': "pull-left sub_left_img",
                                                                                                'alt':'','style':"height:40px;width:50px", 'onerror': 'this.style.display = "none"' }).append(
                                                                                                                                )).append(
                                                                                                                                                                value.summary).append(
                                                    $('</p>'))).append(
                                                    $('</div>')).append(
                                                    $('</div>')).append(
                                                    $('</div>'))).append(                                   
                                                    $('</div>')))); }         
                                 
                                          
                 });
                }
                                
              });
       /* }*/
                
          }
       }
      }
     
      
      /* Scroll for more records for TwitterAndFaceBook source */
      $scope.scrollCheck_click = function () { 
    	 if(!$scope.isAdminUser){
                numberOfPosts = NumberOfRecords;
         toDate =  $scope.allCategoryAndSubSategoryForTwitterAndFaceBookLastPostDate ; 
          valtosend = $scope.searchText;
          if($('div').hasClass('popover fade')){
                  wordCloudOpen = true;
                  // popover is visible
                }
          if(valtosend!=null && valtosend!="" && !wordCloudOpen)
                {
                //console.log(BASE_URL+'rest/user/post/SearchForKeyWords?Keywords='+valtosend+'&category='+$scope.selectedCategory+'&source='+Twitter_Fb_Source+'&toDate='+toDate);
                $http.get(BASE_URL+'rest/user/post/SearchForKeyWords?Keywords='+encodeURIComponent(valtosend)+'&category='+$scope.selectedCategory+'&source='+Twitter_Fb_Source+'&toDate='+toDate).then(function(result){
                 
                                $scope.allCategoryAndSubSategoryForTwitterAndFaceBookLastPostDate1 = result.data.categoriesResponse;
                if( $scope.allCategoryAndSubCategoryForNewsAndWeb1.length >1){
                                 $scope.allCategoryAndSubSategoryForTwitterAndFaceBookLastPostDate=  $scope.allCategoryAndSubSategoryForTwitterAndFaceBookLastPostDate1[ $scope.allCategoryAndSubSategoryForTwitterAndFaceBookLastPostDate1.length - 1].postDate;
                      
                  //  console.log( $scope.allCategoryAndSubSategoryForTwitterAndFaceBookLastPostDate);
                 // console.log( $scope.allCategoryAndSubSategoryForTwitterAndFaceBookLastPostDate1);
                  angular.forEach( $scope.allCategoryAndSubSategoryForTwitterAndFaceBookLastPostDate1, function(value, key) {
                                if(key>0){
                 var imgsrc = $scope.getIcons(value.subCategory);
                 var socialMediaImgsrc = $scope.getSocialMediaIcon(value.source);
                if(value.url!=null){
                 $("div#chatter_scroll").append(
                                                                  $('<div>').attr('class', "chatter_tile  chatter_tile-right-less").append(
                                                                                                  $('<div>').attr('class', "chatter_header_wrap clearfix").append(
                                                                                                  $('<span>').append(
                                                                                                  $('<img>').attr({
                                             'src': imgsrc,
                                             'class': "img-cichatter_tile-right-lesscle img-circle img-responsive",
                                             'alt':'',
                                             'style':"width:40px"
                                         }).append(
                                   
                                      $('</span>')))).append(
                                      $('<span>').attr('class', "chatter_head_txt").append(
                                      $('<p>').append(value.subCategory).append(
                                      $('</p>')).append(
                                      $('<p>').append('Posted on ' + formatPostDate(value.postDate)).append(
                                      $('</p>')))).append(
                                      $('</span>'))).append(
                                      $('<span>').attr('class', "pull-right no-padding").append(
                                      $('<img>').attr({'src': socialMediaImgsrc,'class': "img-circle img-responsive img_width",
                                       'alt':'',
                                       'style':"width:40px"}).append(
                            
                                      $('</span>')))).append(                                                
                                                  $('<span>').attr({'class': "img-circle img-responsive img_width",
                                                                        'alt':'',
                                                                       'style':"width:40px"
                                                  }).append(
                                                 
                                                  $('</span>'))).append(
                                                  $('</div>'))).append(
                                                  $('<div>').attr('class', "chatter_txt_wrap").append(
                                                  $('<p>').append(value.summary).append(
                                                  $('<a>').attr({
                                                 'href': value.url,
                                                 'target': "_blank"
                                      }).append(
                                      $('<u>').append('Read More').append(
                                                  $('</u>')).append(
                                                   $('</a>'))).append(
                                                   $('</p>'))).append(
                                                                $('</div>')))).append(
                                                                $('</div>')).append(
                                                                $('</div>')));
                                }
                                }
                 });          
                }
                
          });
                }
          else if(wordCloudOpen){
                
               // console.log(BASE_URL+'rest/user/post/SearchForKeyWords?Keywords='+valtosend+'&category='+$scope.selectedCategory+'&subCategory='+$scope.selectedSubcategory+'&source='+Twitter_Fb_Source+'&toDate='+toDate);
                $http.get(BASE_URL+'rest/user/post/SearchForKeyWords?Keywords='+encodeURIComponent(valtosend)+'&category='+$scope.selectedCategory+'&subCategory='+$scope.selectedSubcategory+'&source='+Twitter_Fb_Source+'&fromDate='+$scope.fromDate+'&toDate='+$scope.toDate).then(function(result){
                 
                                $scope.allCategoryAndSubSategoryForTwitterAndFaceBookLastPostDate1 = result.data.categoriesResponse;
                if( $scope.allCategoryAndSubCategoryForNewsAndWeb1.length >1){
                                 $scope.allCategoryAndSubSategoryForTwitterAndFaceBookLastPostDate=  $scope.allCategoryAndSubSategoryForTwitterAndFaceBookLastPostDate1[ $scope.allCategoryAndSubSategoryForTwitterAndFaceBookLastPostDate1.length - 1].postDate;
                      
                  //  console.log( $scope.allCategoryAndSubSategoryForTwitterAndFaceBookLastPostDate);
                //  console.log( $scope.allCategoryAndSubSategoryForTwitterAndFaceBookLastPostDate1);
                  angular.forEach( $scope.allCategoryAndSubSategoryForTwitterAndFaceBookLastPostDate1, function(value, key) {
                                if(key>0){
                 var imgsrc = $scope.getIcons(value.subCategory);
                 var socialMediaImgsrc = $scope.getSocialMediaIcon(value.source);
                 if(value.url!=null){
                 $("div#chatter_scroll").append(
                                                                  $('<div>').attr('class', "chatter_tile  chatter_tile-right-less").append(
                                                                                                  $('<div>').attr('class', "chatter_header_wrap clearfix").append(
                                                                                                  $('<span>').append(
                                                                                                  $('<img>').attr({
                                             'src': imgsrc,
                                             'class': "img-cichatter_tile-right-lesscle img-circle img-responsive",
                                             'alt':'',
                                             'style':"width:40px"
                                         }).append(
                                   
                                      $('</span>')))).append(
                                      $('<span>').attr('class', "chatter_head_txt").append(
                                      $('<p>').append(value.subCategory).append(
                                      $('</p>')).append(
                                      $('<p>').append('Posted on ' + formatPostDate(value.postDate)).append(
                                      $('</p>')))).append(
                                      $('</span>'))).append(
                                      $('<span>').attr('class', "pull-right no-padding").append(
                                      $('<img>').attr({'src': socialMediaImgsrc,'class': "img-circle img-responsive img_width",
                                       'alt':'',
                                       'style':"width:40px"}).append(
                            
                                      $('</span>')))).append(                                                
                                                  $('<span>').attr({'class': "img-circle img-responsive img_width",
                                                                        'alt':'',
                                                                       'style':"width:40px"
                                                  }).append(
                                                 
                                                  $('</span>'))).append(
                                                  $('</div>'))).append(
                                                  $('<div>').attr('class', "chatter_txt_wrap").append(
                                                  $('<p>').append(value.summary).append(
                                                  $('<a>').attr({
                                                 'href': value.url,
                                                 'target': "_blank"
                                      }).append(
                                      $('<u>').append('Read More').append(
                                                  $('</u>')).append(
                                                   $('</a>'))).append(
                                                   $('</p>'))).append(
                                                                $('</div>')))).append(
                                                                $('</div>')).append(
                                                                $('</div>')));}
                                }
                                
                 });          
                }
                
          });
                
          }
          else{
    /*   if($scope.isAdminUser){
                 
                   toDate =  $scope.allCategoryAndSubSategoryForTwitterAndFaceBookTestLastPostDate ;
               // console.log(BASE_URL+'rest/user/post/GetPostBy/categoryAndSubCategory?category='+ $scope.selectedCategory+'&subCategory='+$scope.selectedSubcategory+'&numberOfPosts='+numberOfPosts+'&source='+Twitter_Fb_Source+'&toDate='+toDate);
                $http.get(BASE_URL+'rest/user/post/GetPostBy/categoryAndSubCategory?category='+ $scope.selectedCategory+'&subCategory='+$scope.selectedSubcategory+'&numberOfPosts='+numberOfPosts+'&source='+Twitter_Fb_Source+'&toDate='+toDate).then(function (result) {
                 
                                $scope.allCategoryAndSubCategoryForNewsAndWeb1 = result.data;
                if( $scope.allCategoryAndSubCategoryForNewsAndWeb1.length >1){
                      $scope.allCategoryAndSubSategoryForTwitterAndFaceBookTestLastPostDate = $scope.allCategoryAndSubCategoryForNewsAndWeb1[$scope.allCategoryAndSubCategoryForNewsAndWeb1.length - 1].postDate;
                      
                      console.log($scope.allCategoryAndSubSategoryForTwitterAndFaceBookTestLastPostDate);
                 console.log($scope.allCategoryAndSubCategoryForNewsAndWeb1);
                 angular.forEach($scope.allCategoryAndSubCategoryForNewsAndWeb1, function(value, key) {
                                if(key>0){
                 var imgsrc = $scope.getIcons(value.subCategory);
                 var socialMediaImgsrc = $scope.getSocialMediaIcon(value.source);
                 
                 
                 $scope.allCategoryAndSubSategoryForTwitterAndFaceBookLastPostDate1 = result.data.categoriesResponse;
                 if( $scope.allCategoryAndSubSategoryForTwitterAndFaceBookLastPostDate1.length >1){
                                  $scope.allCategoryAndSubSategoryForTwitterAndFaceBookTestLastPostDate=  $scope.allCategoryAndSubSategoryForTwitterAndFaceBookLastPostDate1[ $scope.allCategoryAndSubSategoryForTwitterAndFaceBookLastPostDate1.length - 1].postDate;
                       
                    // console.log( $scope.allCategoryAndSubSategoryForTwitterAndFaceBookTestLastPostDate);
                  // console.log( $scope.allCategoryAndSubSategoryForTwitterAndFaceBookLastPostDate1);
                   angular.forEach( $scope.allCategoryAndSubSategoryForTwitterAndFaceBookLastPostDate1, function(value, key) {
                                 if(key>0){
                  var imgsrc = $scope.getIcons(value.subCategory);
                  $scope.selectedEditPost = value;
                  var socialMediaImgsrc = $scope.getSocialMediaIcon(value.source);
                  if(value.url!=null){
                 $("div#chatter_scroll").append(
                                                                  $('<div>').attr('class', "chatter_tile  chatter_tile-right-less").append(
                                                                                                  $('<div>').attr('class', "chatter_header_wrap clearfix").append(
                                                                                                  $('<span>').append(
                                                                                                  $('<img>').attr({
                                             'src': imgsrc,
                                             'class': "img-cichatter_tile-right-lesscle img-circle img-responsive",
                                             'alt':'',
                                             'style':"width:40px"
                                         }).append(
                                   
                                      $('</span>')))).append(
                                      $('<span>').attr('class', "chatter_head_txt").append(
                                      $('<p>').append(value.subCategory).append(
                                      $('</p>')).append(
                                      $('<p>').append('Posted on ' + formatPostDate(value.postDate)).append(
                                      $('</p>')))).append(
                                      $('</span>'))).append(
                                      $('<span>').attr('class', "pull-right no-padding").append(
                                      $('<img>').attr({'src': socialMediaImgsrc,'class': "img-circle img-responsive img_width",
                                        'alt':'',
                                       'style':"width:40px"}).append(
                            
                                      $('</span>')))).append(                                                
                                                  $('<span>').attr({'class': "img-circle img-responsive img_width",
                                                                        'alt':'',
                                                                       'style':"width:40px"
                                                  }).append(
                                                 
                                                  $('</span>'))).append(
                                     $('<img>').attr({'src': "images/edit.jpg",'class': "media-body editPost",
                                                       'alt':'',
                                                       'style':"width:60px;float:right;cursor:pointer"
                                                       'onclick': $scope.editDialog.open($scope.allSubCategory, value)}).append(
                                                  $('</div>')))).append(
                                                		  
       <img class="media-body" style="width:60px; float:right; cursor:pointer" ng-src="images/edit.jpg" alt="" 
                      										ng-click="editDialog.open(allSubCategory, catSubCat)" />
                                                  $('<div>').attr('class', "chatter_txt_wrap").append(
                                                  $('<p>').append(value.summary).append(
                                                  $('<a>').attr({
                                                 'href': value.url,
                                                 'target': "_blank"
                                      }).append(
                                      $('<u>').append('Read More').append(
                                                  $('</u>')).append(
                                                   $('</a>'))).append(
                                                   $('</p>'))).append(
                                                                $('</div>')))).append(
                                                                $('</div>')).append(
                                                                $('</div>'))); } }                   
                                         
                 });
                }
              });
                   }
       else
                   {*/
               // console.log(BASE_URL+'rest/user/post/GetPostBy/categoryAndSubCategory?category='+ $scope.selectedCategory+'&subCategory='+$scope.selectedSubcategory+'&numberOfPosts='+numberOfPosts+'&source='+Twitter_Fb_Source+'&toDate='+toDate);
                $http.get(BASE_URL+'rest/user/post/GetPostBy/categoryAndSubCategory?category='+ $scope.selectedCategory+'&subCategory='+$scope.selectedSubcategory+'&numberOfPosts='+numberOfPosts+'&source='+Twitter_Fb_Source+'&toDate='+toDate).then(function (result) {
                  
                    $scope.allCategoryAndSubSategoryForTwitterAndFaceBookLastPostDate1 = result.data.categoriesResponse;
                    if( $scope.allCategoryAndSubSategoryForTwitterAndFaceBookLastPostDate1.length >1){
                                     $scope.allCategoryAndSubSategoryForTwitterAndFaceBookLastPostDate=  $scope.allCategoryAndSubSategoryForTwitterAndFaceBookLastPostDate1[ $scope.allCategoryAndSubSategoryForTwitterAndFaceBookLastPostDate1.length - 1].postDate;
                          
                       // console.log( $scope.allCategoryAndSubSategoryForTwitterAndFaceBookLastPostDate);
                      //console.log( $scope.allCategoryAndSubSategoryForTwitterAndFaceBookLastPostDate1);
                      angular.forEach( $scope.allCategoryAndSubSategoryForTwitterAndFaceBookLastPostDate1, function(value, key) {
                                    if(key>0){
                     var imgsrc = $scope.getIcons(value.subCategory);
                     var socialMediaImgsrc = $scope.getSocialMediaIcon(value.source);
                     if(value.url!=null){
                 $("div#chatter_scroll").append(
                                                                  $('<div>').attr('class', "chatter_tile  chatter_tile-right-less").append(
                                                                                                  $('<div>').attr('class', "chatter_header_wrap clearfix").append(
                                                                                                  $('<span>').append(
                                                                                                  $('<img>').attr({
                                             'src': imgsrc,
                                             'class': "img-cichatter_tile-right-lesscle img-circle img-responsive",
                                             'alt':'',
                                             'style':"width:40px"
                                         }).append(
                                   
                                      $('</span>')))).append(
                                      $('<span>').attr('class', "chatter_head_txt").append(
                                      $('<p>').append(value.subCategory).append(
                                      $('</p>')).append(
                                      $('<p>').append('Posted on ' + formatPostDate(value.postDate)).append(
                                      $('</p>')))).append(
                                      $('</span>'))).append(
                                      $('<span>').attr('class', "pull-right no-padding").append(
                                      $('<img>').attr({'src': socialMediaImgsrc,'class': "img-circle img-responsive img_width",
                                        'alt':'',
                                       'style':"width:40px"}).append(
                            
                                      $('</span>')))).append(                                                
                                                  $('<span>').attr({'class': "img-circle img-responsive img_width",
                                                                        'alt':'',
                                                                       'style':"width:40px"
                                                  }).append(
                                                 
                                                  $('</span>'))).append(
                                                  $('</div>'))).append(
                                                  $('<div>').attr('class', "chatter_txt_wrap").append(
                                                  $('<p>').append(value.summary).append(
                                                  $('<a>').attr({
                                                 'href': value.url,
                                                 'target': "_blank"
                                      }).append(
                                      $('<u>').append('Read More').append(
                                                  $('</u>')).append(
                                                   $('</a>'))).append(
                                                   $('</p>'))).append(
                                                                $('</div>')))).append(
                                                                $('</div>')).append(
                                                                $('</div>'))); } }                   
                                         
                 });
                }
              });
                  
                   }}
                
        /*  }*/
          } 
    
});

mightApp.directive('editDialog', [function() {
  return {
    restrict: 'E',	
	transclude: true,
    scope: {
      model: '=',
	  onSubmit: '&'
    },
    link: function(scope, element, attributes) {
      scope.$watch('model.visible', function(newValue) {
        var modalElement = element.find('.modal');
        modalElement.modal(newValue ? 'show' : 'hide');
      });
	  
	  scope.submit = function(){scope.onSubmit();};	
      
      element.on('shown.bs.modal', function() {
        scope.$apply(function() {
          scope.model.visible = true;
        });
      });

      element.on('hidden.bs.modal', function() {
        scope.$apply(function() {
			//console.log(scope.model.selectedCategory);
          scope.model.visible = false;
        });
      });
      
    },
    templateUrl: 'view/editDialog.html',
	/*controller: 'editDialogController',*/
  };
}]);