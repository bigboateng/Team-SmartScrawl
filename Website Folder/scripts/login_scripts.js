var isLoggedInFacebook = false;
var isLoggedInTwitter = false;
var userName = "";
var message;
var ref;
// google maps stuff
var initialLocation;
var browserSupportFlag = new Boolean();
var imageName;
var canvas;
var canvasImage;
var childTable;
var usersRef;
var UID;
var canvasRef;
var currentUsersRef;
var imageData;
// cookies information
var cookieUID;
var cookieUSERNAME;
var cookieIMAGE_URL;
// image stuff
var imageUrl;
var refDrawing;

$(document).ready(function(){


	$.getScript('https://cdn.firebase.com/js/client/2.2.8/firebase.js', function() {
		ref = new Firebase("https://coolbean.firebaseio.com");
		usersRef = ref.child("users");
		canvasRef = ref.child("Canvas");
		refDrawing = ref.child("drawing");

		//loginFacebook();
});

	$('#draw').css('background', 'white');







	$( "#dialog" ).dialog({
      resizable: false,
      //height:140,
      modal: true,
      title: "Name your canvas",
      hide: true,
      autoOpen: false,
      buttons: [
      	{
	        text: "Save",
	        click: function() {
	          
	          var theName = document.Cform.Cinput.value;
	          $( this ).dialog( "close" );

			var loadImg = $('<img></img>').attr('src', '/images/ajax-loader.gif').attr('id', 'loading').addClass('loadingGif');
			$('#tab-2').html('');
			$('#tab-2').append(loadImg);

	          if(isLoggedInFacebook || isLoggedInTwitter){

	  			saveImageToFirebase();
		      		}else{
		      			loginFacebook();
		      			//saveImageToFirebase();
		      		}

		      	}
	        
	    },
	    {
	    	text: "Cancel",
	    	click: function() {
          		$( this ).dialog( "close" );
        	}
	    }] 
    });

    $('#show-dialog').click(function(){
		$('#dialog').dialog('open');
		
	});

	    $('#facebook').click(function(){
	    	if(isLoggedInTwitter || isLoggedInFacebook)
	    	{
	    		alert(isLoggedInFacebook? "You are already logged into facebook, " + userName : "You are already logged into twitter, " + userName);
	    	}else
	    	{
	    		loginFacebook();
	    	}
		
		
	});

    $('#twitter').click(function(){
    	if(isLoggedInFacebook || isLoggedInTwitter)

			if(isLoggedInTwitter || isLoggedInFacebook)
	    	{
	    		alert(isLoggedInFacebook? "You are already logged into facebook, " + userName : "You are already logged into twitter, " + userName);
	    	}else
	    	{
	    		loginTwitter();
	    	}
		
	});


});


 function handleNoGeolocation(errorFlag) {
    if (errorFlag == true) {
      alert("Geolocation service failed.");
      initialLocation = newyork;
    } else {
      alert("Your browser doesn't support geolocation. We've placed you in Siberia.");
      initialLocation = siberia;
    }
    map.setCenter(initialLocation);
  }






function loginFacebook()
{
	if(isLoggedInTwitter || isLoggedInFacebook)
	{
		alert(isLoggedInFacebook? "You are already logged into facebook, " + userName : "You are already logged into twitter, " + userName);
	}else
	{

			
		ref.authWithOAuthPopup("facebook", function(error, authData) {
			
  if (error) {
    console.log("Login Failed!", error);
  } else {
  	isLoggedInFacebook = true;
    console.log("Authenticated successfully with payload:", authData);
    userName = authData.facebook.displayName;
    ///
	UID = authData.facebook.id;
	imageUrl = authData.facebook.profileImageURL;
	//console.log("facebook function: " + UID);
	usersRef.child(UID).set({
	  full_name: userName,
	  image_url: imageUrl

	});



	saveImageToFirebase();
	




    ///
  }
});
	}
}

function loginTwitter()
{
	ref.authWithOAuthPopup("twitter", function(error, authData) {
  if (error) {
    console.log("Login Failed!", error);
  } else {
  	isLoggedInTwitter = true;
    console.log("Authenticated successfully with payload:", authData);
  }
});

}



// Converts canvas to an image

// function getBase64Image() {
// // imgElem must be on the same server otherwise a cross-origin error will be thrown "SECURITY_ERR: DOM Exception 18"
//     canvas = document.drawCanvas;
//     var ctx = canvas.getContext("2d");
//     ctx.drawImage(imgElem, 0, 0);
//     var dataURL = canvas.toDataURL("image/png");
//     return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
// }


// Converts image to canvas; returns new canvas element
function convertImageToCanvas(image) {
	var canvas = document.createElement("canvas");
	canvas.width = image.width;
	canvas.height = image.height;
	canvas.getContext("2d").drawImage(image, 0, 0);

	return canvas;
}



var saveImageToFirebase = function()
{
	navigator.geolocation.getCurrentPosition(function(position) {
		 var Lat = position.coords.latitude;
		 var Lng = position.coords.longitude;  
		 var imageName = document.Cform.Cinput.value;
		 ///
		 var the64 = convertCanvasToImage();
		//alert(UID);
		var pRef = refDrawing.child(UID);


		// pRef.child(UID).set({
		//   full_name: userName,
		//   lat: Lat,
		//   lng: Lng,
		//   name: imageName,
		//   base64: the64
		// });


    pRef.push({ 'canvas_id': '124', 'image_name': imageName, 'base_64': the64 });

		 ////	
	});

	loadScrawl();

}


function convertCanvasToImage() {
	var CANVAS = document.getElementById("draw");
	var image = new Image();
	image.src = CANVAS.toDataURL("image/png");
	return getBase64Image(image);
}


// Code taken from MatthewCrumley (http://stackoverflow.com/a/934925/298479)
function getBase64Image(img) {
    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to guess the
    // original format, but be aware the using "image/jpg" will re-encode the image.
    var dataURL = document.getElementById("draw").toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}




function setCookie(cname, uid, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}
function retrieveCookies()
{
		
}

function loadScrawl()
{

	//var personRef = refDrawing.child(UID);
	//var messagesRef = new Firebase("https://docs-examples.firebaseio.com/samplechat/messages");
	var pRef = refDrawing.child(UID);
	pRef.once("value", function(allMessagesSnapshot) {
		 	allMessagesSnapshot.forEach(function(messageSnapshot) {
		    // Will be called with a messageSnapshot for each child under the /messages/ node
		    //var key = messageSnapshot.key();  // e.g. "-JqpIO567aKezufthrn8"
		    var base_64 = messageSnapshot.child("base_64").val();  // e.g. "barney"
		    var canvas_id = messageSnapshot.child("canvas_id").val();  // e.g. "Welcome to Bedrock City!"
		    var divPreview = $('<div></div>').css('background', 'white').css('display', 'inline-block').css('border','2px solid black');
		    var imagePreview = $('<img></img>')
		    	.attr('src', 'data:image/png;base64,' + base_64)
		    	.attr('width', '80px')
		    	.attr('style', 'border: 1px;')
		    	.addClass('image-list')
		    	.attr('height', '80px');
		    divPreview.append(imagePreview);
		    // $('#tab-2').append("desc: ");
		    $('#tab-2').append(divPreview);
	  	});
		 	$('#loading').remove();
	});

	
}

function setProfileStuff()
{

}

