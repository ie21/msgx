


     $.getJSON( "http://localhost:3000/latest", function( data ) {
      var items = [];

      $.each( data, function( key, val ) {
         items.push( "<p>" + val + "</p>" );
      });
 
      $( "<tr/>", {
         "class": "my-new-list",
            html: items.join( "" )
              }).appendTo( "#LatestDiv" );
      });


 $.getJSON( "http://localhost:3000/count", function( data1 ) {
      var items = [];
      $.each( data1, function( key, val ) {
         items.push( "<h4>Total messages in DB: " + val + "</h4>" );
      });
 
      $( "<p/>", {
         "class": "h1",
            html: items.join( "**" )
              }).appendTo( "#counter" );
      });




 $.getJSON("http://localhost:3000/api/testdata", function(data) {
    $('#summary').text(data.result);
    $('#summary').text("testiranje prijenosa putem getJSON-a u HTML");
});




var socket = io.connect('http://localhost:3020');

socket.on('latest', function (msg) {
    console.log(msg);
    $('#mydiv').html(msg);
     $('#mydiv').html(msg);


    var tr;
    for (var i = 0; i < msg.length; i++) {
            tr = $('<tbody>');
            tr.append("<tr>" + msg[i].id + "</tr>");
            tr.append("<tr>" + msg[i].client + "</tr>");
            tr.append("<tr>" + msg[i].status + "</tr>");
            $('#mydiv').html(msg);
        }
});

socket.on('logline', function (msg) {
    console.log(msg);
      //$('#logline1').prepend($('<tr>').text(msg));
      var returnString = (msg)
      var jsondata = $.parseJSON(returnString);

      id = "<b>" + jsondata.id + "</b>" + " > ";
      client = "<b>" + jsondata.client + "</b>" + " > " ;
      service = jsondata.service + " > ";
      status = jsondata.status + " > ";
      datetime = " ( " + jsondata.datetime + " ) ";
       $('#logline1').empty();
     $('#logline1').prepend($('<tr>').html(id + client + service + status + datetime));
    
  

});

socket.on('avgCnt', function(msg) {
  console.log(msg);

$.each(msg, function (key, obj) {
            console.log(key, obj)
            $('<div />', {
                id: key,
                text: obj
            }).appendTo('body')
        });

   var returnString = (msg)
      var jsondata = $.parseJSON(returnString);

      id = "<b>" + jsondata + "</b>" + " > ";
      console.log(jsondata)

    //$('#dashAvgCnt').append($('<h1>').html(id));
   // $('#dashAvg').replaceWith.text(msg);
})





// Generiraj box za klijente 

socket.on('clientList', function(msg) {
  console.log(msg);

      //var returnString = (msg)
      //var jsondata = $.parseJSON(returnString);

$.each(msg, function (key, obj) {
            console.log(key, obj)
            $('<div />', {
                id: key,
                text: obj
            }).appendTo('#clientList');
        });

//   var returnString = (msg)
  //    var jsondata = $.parseJSON(returnString);

      // id = "<b>" + jsondata + "</b>" + " > ";
    //  console.log(jsondata)

 //  $('#dashAvgCnt').append($('<h1>').html(id));
   // $('#dashAvg').replaceWith.text(msg);
})

socket.on('clientList', function (msg) {
    console.log(msg);
      //$('#logline1').prepend($('<tr>').text(msg));
      var returnString = (msg)
      var jsondata = $.parseJSON(returnString);

      id = "<b>" + jsondata.id + "</b>" + " > ";
      client = "<b>" + jsondata.client + "</b>" + " > " ;
      //service = jsondata.service + " > ";
      //status = jsondata.status + " > ";
      //datetime = " ( " + jsondata.datetime + " ) ";
     //  $('#logline1').empty();
     $('#clientList').append($('<p>').html(id + client));
    
//
    
  


 //     var json_obj = $.parseJSON(msg);//parse JSON
   //         
   //         var output="<ul>";
   //         for (var i in json_obj) 
    //        {
     //           output+="<li>" + json_obj[i].client + ",  " + json_obj[i].service + "</li>";
     //       }
      //      output+="</ul>";
       ///        

});




