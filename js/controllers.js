angular.module('starter.controllers', ['firebase', 'ui.calendar', 'uiGmapgoogle-maps'])


.config(function($ionicConfigProvider) {
  // back button text always displays "Back"
  $ionicConfigProvider.backButton.previousTitleText(false);
})

        



.controller('CalendarController', ['$scope', '$state', 'SchemaDetail', '$firebaseArray', function($scope, $state, SchemaDetail, $firebaseArray) {
    var refEvents = new Firebase('https://brollan87.firebaseio.com/events/');
  $scope.eventsarr = $firebaseArray(refEvents);
  console.log($scope.eventsarr);
      $scope.events = [
      {id: 1, title: 'Los Angeles',start: new Date('Tor Jun 11 2015 '),end: new Date('Tis Jun 16 2015'), allDay: true, hotell: {namn: 'test', adress: 'test'}},
       {id: 2, title: 'Las Vegas',start: new Date('Mån Jun 15 2015 '),end: new Date('Fre Jun 19 2015'), allDay: true, hotell: {namn: 'test', adress: 'test'}},
       {id: 3, title: 'San Fransisco',start: new Date('Tor Jun 25 2015 '),end: new Date('Tis Jun 30 2015'), allDay: true, hotell: {namn: 'test', adress: 'test'}},
       {id: 4, title: 'Alaskakryssning',start: new Date('Fre Jul 03 2015 '),end: new Date('Lör Jul 11 2015'), allDay: true, hotell: {namn: 'test', adress: 'test'}},

    ];

    // $scope.event = {id: 1, title: 'Los Angeles',start: new Date('Tor Jun 11 2015 '),end: new Date('Tis Jun 16 2015'), allDay: true, hotell: {namn: 'test', adress: 'test'}}

   // $scope.event =  {id: 2, title: 'Las Vegas',start: new Date('Mån Jun 15 2015 '),end: new Date('Fre Jun 19 2015'), allDay: true, hotell: {namn: 'test', adress: 'test'}}
  // $scope.event = {id: 3, title: 'San Fransisco',start: new Date('Tor Jun 25 2015 '),end: new Date('Tis Jun 30 2015'), allDay: true, hotell: {namn: 'test', adress: 'test'}}
  //$scope.eventsarr.$add($scope.event);

 // $scope.event2 = {id: 4, title: 'Alaskakryssning',start: new Date('Fre Jul 03 2015 '),end: new Date('Lör Jul 11 2015'), allDay: true, hotell: {namn: 'test', adress: 'test'}}
//$scope.eventsarr.$add($scope.event2);

  $scope.eventSource = {
            url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
            className: 'gcal-event',           // an option!
            currentTimezone: 'Sweden/Stockholm'
    };

    /* event sources array*/
    $scope.eventSources = [$scope.events, $scope.eventSource];

    $scope.onSelect=function(start, end){
      console.log("Event select fired");
    };
    $scope.eventClick=function(event, allDay, jsEvent, view) {

      console.log(event.id);
      console.log($scope.eventsarr.$keyAt(event.id));
      SchemaDetail.setSelected($scope.eventsarr.$keyAt(event.id-1));
      $state.go('tab.schema-detail')
    };


   //with this you can handle the events that generated by each page render process
    $scope.renderView = function(view){    
        var date = new Date(view.calendar.getDate());
        $scope.currentDate = date.toDateString();
        $scope.$apply(function(){
          $scope.alertMessage = ('Page render with date '+ $scope.currentDate);
        });
    };



  $scope.uiConfig = {
        defaultView : 'month',
        disableDragging : true,
        allDaySlot : false,
        selectable : true,
        unselectAuto : true,
        selectHelper : true,
        editable : false,
         defaultDate: new Date(2015, 05, 11),
        monthNames : ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"],
        dayNamesShort : ["Sön", "Mån", "Tis", "Ons", "Tors", "Fre", "Lör"],
        maxTime : "21:00:00",
        minTime : "8:00:00",
        eventDurationEditable : true, // disabling will show resize
        columnFormat : {
            week : 'dd-MM-yyyy',
            day : 'D-MMM-YYYY'
        },
        height : 300,
        maxTime : "21:00:00",
        minTime : "8:00:00",
        eventDurationEditable : false, // disabling will show resize
        columnFormat : {
            week : 'dd-MM-yyyy',
            day : 'D-MMM-YYYY'
        },
        titleFormat : {
          day : 'dd-MM-yyyy'
        },
        axisFormat : 'H:mm',
        weekends : true,
        header : {
            left : 'prev',
            center : 'title',
            right : 'next'
        },
        select: $scope.onSelect,
        eventClick : $scope.eventClick,
        viewRender: $scope.renderView
    };


    
}])

.controller('SchemaDetailCtrl', function($scope, SchemaDetail, $http, $firebaseObject) {
  $scope.plats = 'test';
  $scope.hotell;
    $scope.getPos = function(adress){
   // adress.replace(' ','+');
   // console.log(adress);
    //8585+Santa+Monica+Blvd,West+Hollywood
      $http.get('http://maps.google.com/maps/api/geocode/json?address='+adress+'&sensor=false').success(function(mapData) {
      console.log(mapData);
      console.log(mapData.results[0].geometry.location.lat);
        $scope.map = {
          center: { latitude: mapData.results[0].geometry.location.lat, longitude: mapData.results[0].geometry.location.lng },
          markerpos: { latitude: mapData.results[0].geometry.location.lat, longitude: mapData.results[0].geometry.location.lng },
          zoom: 15,
          zoomControl: true
           };
    });
  }
  var id = SchemaDetail.getSelected();
  var refEvent = new Firebase('https://brollan87.firebaseio.com/events/'+id);
  $scope.eventet = $firebaseObject(refEvent);

  $scope.eventet.$loaded().then(function () {
   console.log($scope.eventet.title);
// var event = SchemaDetail.getSelected();
  $scope.plats = $scope.eventet.title;
  console.log($scope.plats);
  $scope.hotell = $scope.eventet.hotell; 
  
   if($scope.hotell){
     $scope.getPos($scope.hotell.adress);
 }


});


  $scope.sparaHotell = function(hotell){
    var pos = $scope.getPos(hotell.adress);
    $scope.eventet.hotell = hotell;
    $scope.eventet.$save();
    $scope.hotell = hotell;
    if(hotell.adress){
    $scope.getPos(hotell.adress);
  }
  }

  $scope.raderaHotell = function(){
    $scope.eventet.hotell = '';
    $scope.hotell = null;
    $scope.eventet.$save();

  }





})


.controller('BetalaCtrl', function($scope) {
 $scope.data = {};
  $scope.data.columns = [{"id":"1453","name":"Vad"},{"id":"1355","name":"Pris/tot"},{"id":"0393","name":"Att betala"},{"id":"3","name":""},{"id":"4","name":"(p.p.)"}];
    
  $scope.data.items = [{"1234":"Pink","1355":"32000 (8000)","1453":"Kryssning","2939":"3 in.","3932":"29  in.","0393":"500"},{"1234":"Black","1355":"16000 (4000)","1453":"Hotell LA","2939":"13 in.","3932":"9  in.","0393":"0"}];

})

.controller('DashCtrl', function($scope) {})

.controller('FixaCtrl', function($scope, $firebaseArray, $location, $state, Fixa, $filter) {
   $scope.item = {text: ""};
   var ref = new Firebase('https://brollan87.firebaseio.com/fixalista');

    $scope.fixa = $firebaseArray(ref);

    $scope.viewDetails = function(fixa){
      Fixa.setSelected(fixa);

      $state.go('tab.fixa-detail')

    }

    $scope.getBildUrl = function(f){
      $scope.images = [{url : 'img/bil.jpg', id: 11}, {url: 'img/helikopter.jpg', id: 12}, {url: 'img/roadtripicon.jpg',  id: 13}];
$scope.images2 = [{url : 'img/hollywood.jpg', id: 21}, {url: 'img/pride.jpg', id: 22}, {url: 'img/sanfran.jpg',  id: 23}];
$scope.images3 = [{url : 'img/bil.jpg', id: 31}, {url: 'img/helikopter.jpg', id: 32}, {url: 'img/roadtripicon.jpg',  id: 33}];
     var single_object;
    if(f.bildid){
       single_object = $filter('filter')($scope.images, function (d) {return d.id === f.bildid;})[0];
      if(!single_object){
        single_object =  $filter('filter')($scope.images2, function (d) {return d.id === f.bildid;})[0];
      }
      if(!single_object){
        single_object =  $filter('filter')($scope.images3, function (d) {return d.id === f.bildid;})[0];
      }
     return single_object.url;
    }
    }

    $scope.addItem = function(){
      $scope.fixa.$add({ text: $scope.item.text, info: '', bildid: 0});
      $scope.item = {text: ""};
    }

    $scope.removeItem = function(fixa){
      $scope.fixa.$remove(fixa);
    }

    $scope.updateItem = function(fixa){
       $scope.fixa.$save(fixa);
    }
})

.controller('FixaDetailCtrl', function($scope, $stateParams, $firebaseObject, Fixa, $firebaseArray, $ionicModal, $ionicSlideBoxDelegate, $filter ) {

$scope.showImages = false;

 $scope.images = [{url : 'img/bil.jpg', id: 11}, {url: 'img/helikopter.jpg', id: 12}, {url: 'img/roadtripicon.jpg',  id: 13}];
$scope.images2 = [{url : 'img/hollywood.jpg', id: 21}, {url: 'img/pride.jpg', id: 22}, {url: 'img/sanfran.jpg',  id: 23}];
$scope.images3 = [{url : 'img/bil.jpg', id: 31}, {url: 'img/helikopter.jpg', id: 32}, {url: 'img/roadtripicon.jpg',  id: 33}];


  $scope.showLaggtill = false;
   $scope.forslag = {text: '', lank: ''};
   $scope.information = {text : ''};

    $scope.selectedFixa = Fixa.getSelected();
   
       var ref = new Firebase('https://brollan87.firebaseio.com/fixalista/'+$scope.selectedFixa.$id);
      $scope.fixa = $firebaseObject(ref);
      var refForslag = new Firebase('https://brollan87.firebaseio.com/fixalista/'+$scope.selectedFixa.$id+ '/forslag');
      $scope.forslagarr = $firebaseArray(refForslag);

    $scope.getBildUrl = function(){
      var f = $scope.selectedFixa;
 
     var single_object;
    if(f.bildid){
       single_object = $filter('filter')($scope.images, function (d) {return d.id === f.bildid;})[0];
      if(!single_object){
        single_object =  $filter('filter')($scope.images2, function (d) {return d.id === f.bildid;})[0];
      }
      if(!single_object){
        single_object =  $filter('filter')($scope.images3, function (d) {return d.id === f.bildid;})[0];
      }
     return single_object.url;
    }
    }

    $scope.bildurl = $scope.getBildUrl($scope.selectedFixa);

    $scope.like = function(f){
      f.likes++;
       $scope.forslagarr.$save(f);
    }

    $scope.clickShowLaggtill = function(){
      if($scope.showLaggtill){
        $scope.showLaggtill = false;
      }
      else{
        $scope.showLaggtill = true;
      }
    }

    $scope.showImagesList = function(){
   if($scope.showImages){
    $scope.showImages = false
   }else{
    $scope.showImages = true;
   }
}

$scope.setImage = function(id){
  if($scope.fixa){
  $scope.fixa.bildid= id;
  $scope.fixa.$save();
  $scope.selectedFixa = $scope.fixa;
  $scope.showImages = false;
  $scope.bildurl = $scope.getBildUrl($scope.selectedFixa);
}

}

    $scope.laggtillClass = function(){
      if($scope.showLaggtill){
        return "item item-divider ion-minus-round";
      }
      else{
        return "item item-divider ion-plus-round";
      }
    }

    $scope.sparaInfotext = function(infotext){
        if($scope.fixa){
        $scope.fixa.info = infotext;
        $scope.fixa.$save();
        $scope.information = {text: ""};
      }
    }

    $scope.raderaInfotext = function(){
      if($scope.fixa){
      $scope.fixa.info = '';
      $scope.fixa.$save();
      $scope.information = {text: ""};
    }
  }

  $scope.sparaForslag = function(forslag){
    if($scope.fixa){
       var forslaglankString ='';
       var forslagtextString = '';
       if(forslag.text){
        forslagtextString = forslag.text;
       }
       if(forslag.lank){
        forslaglankString = forslag.lank;
       }
         $scope.forslagarr.$add({forslagtext: forslagtextString, link: forslaglankString, likes: 0});
     $scope.showLaggtill = false;
     $scope.forslag = {text: '', lank: ''};
   }

  }

})

.controller('PackaCtrl', function($scope, $firebaseArray){
  $scope.item = {text: ""};
var ref = new Firebase('https://brollan87.firebaseio.com/packlista');

    $scope.packa = $firebaseArray(ref);

    $scope.addItem = function(){
      $scope.packa.$add({ text: $scope.item.text, checked: false });
      $scope.item = {text: ""};
    }

    $scope.removeItem = function(packa){
      console.log(packa.text);
      $scope.packa.$remove(packa);
    }

    $scope.updateItem = function(packa){
       $scope.packa.$save(packa);
    }
})
;
