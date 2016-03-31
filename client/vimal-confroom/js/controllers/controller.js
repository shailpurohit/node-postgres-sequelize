'use strict';

confRoomBooking.controller('confRoomCtrl', ['$scope', 'confRoomFactory', function($scope, confRoomFactory){

    $scope.title = 'Conference Room Booking System';

    $scope.heading = 'Room Search';

    //to populate the form data with initial value
    $scope.formData = {};
    $scope.formData.capacity = 1;
    $scope.formData.priority1Facility = '';
    $scope.formData.priority2Facility = '';
    $scope.formData.timeHours = '1';
    $scope.formData.timeMinutes = '00';
    $scope.formData.timeCycle = 'AM';
    $scope.formData.durationHours = '0';
    $scope.formData.durationMinutes = '00';

    //fetching the locations data
    confRoomFactory.getLocations()
        .then(function(data){
            $scope.locations = data;
        }, function(reason){
            console.log('Error in fetching locations data with reason: '+ JSON.stringify(reason));
        });

    //fetching the facilities data
    confRoomFactory.getFacilities()
        .then(function(data){
            $scope.facilities = data;
        }, function(reason){
           console.log('Error in fetching facilities data with reason: '+ JSON.stringify(reason));
        });


    //fetching the facilities data
    confRoomFactory.getPurposes()
        .then(function(data){
            $scope.purposes = data;
            //set initial value of purpose
            $scope.formData.purpose = $scope.purposes[0].id;
        }, function(reason){
           console.log('Error in fetching purposes data with reason: '+ JSON.stringify(reason));
        });


    $scope.priorityFacilities = [];
    //on selection of Facilities, to show the Priority Facilities
    $scope.isChecked = function(event, facility) {
        if(event.currentTarget.checked) {
            $scope.priorityFacilities.push(facility);
        }
        else {
            var index = $scope.priorityFacilities.indexOf(facility);
            if(index > -1) {
                $scope.priorityFacilities.splice(index, 1);
            }
        }
    };

    //on selection of Locations, handle the check all and uncheck all
    $scope.checkAll = function(location){
        var isCheckAll = false;
        if(location.name == 'All') { //handle when All checkbox is clicked
            if(location.selected) {
                isCheckAll = true;
            }
            angular.forEach($scope.locations, function(item){
                item.selected = isCheckAll;
            });
        }
        else { //handle when other checkboxes are clicked
            var checkedCount = 0;
            angular.forEach($scope.locations, function(item){
                if(item.name != 'All' && item.selected) {
                    checkedCount++;
                }
            });
            var totalLen = Object.keys($scope.locations).length;
            if(checkedCount == (totalLen-1)) { //if remaining are checked
                isCheckAll = true;
            }
            for(var h in $scope.locations){
                if($scope.locations[h].name == 'All') {
                    $scope.locations[h].selected = isCheckAll;
                    break;
                }
            }
        }
    };

    //on search of conference rooms
    $scope.searchRooms = function() {
        //preparing locations array for post request
        $scope.formData.locations = [];
        angular.forEach($scope.locations, function(item){
            if(item.selected) {
                $scope.formData.locations.push(item.id);
            }
        });
        //preparing locations array for post request
        $scope.formData.facilities = [];
        angular.forEach($scope.facilities, function(item){
            if(item.selected) {
                $scope.formData.facilities.push(item.id);
            }
        });

        //post search criteria for Rooms search
        confRoomFactory.searchForRooms($scope.formData)
            .then(function(result){
                console.log('Result of Rooms search: '+JSON.stringify(result));
            }, function(error){
                console.log('Error in Rooms search: '+JSON.stringify(error));
            });
    };

    //on cancel of search rooms
    $scope.cancelSearch = function() {

    };

    //on showing occupancy of rooms
    $scope.showOccupancy = function() {

    };

}]);
