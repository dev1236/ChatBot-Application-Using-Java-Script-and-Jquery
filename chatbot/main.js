var me = {};
me.avatar = "https://ui-avatars.com/api/?name=U&size=48";

var you = {};
you.avatar = "https://ui-avatars.com/api/?name=HC&size=48";
// var firstLevelAuthQue = ["Please provide one of the following information: Phone Number or Email Id",
// 							 "Please help me with your registered Phone Number or Email Id",
// 							 "To help you further please provide your Phone Number or Email Id",
// 						     "Please provide your Phone Number or Email Id in order to proceed further"];
 // var randomNumber = Math.floor(Math.random() * 4);
var data={
			session:{
				user:{
				},
				lang : "",
	    		conversationHistory: {
	      			conversations: [
	        // {
	        //   answer: text,
	        //   question: "Please provide one of the following information: Phone Number/Email Id"
	        // }
	      ]
	    }
  	  }};

sessionStorage.setItem('sessionDetails', JSON.stringify(data));


function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}            

//-- No use time. It is a javaScript effect.
function insertChat(who, text, time){
    if (time === undefined){
        time = 0;
    }
    var control = "";
    var date = formatAMPM(new Date());
    
    if (who == "me"){
        control = '<div><div class="speech-bubble-right text-white p-2 float-right">'+text +'</div><br/><small class="chat-info text-secondary">'+date+'</small></div>';                    
    }else if(who == "you"){
        control = '<div><div class="speech-bubble-left text-white p-2 float-left">'+text +'</div><br/><small class="chat-info text-secondary">'+date+'</small></div>';
    }else{
		control = '<div>'+text+'</div>';
	}
	if(who != 'img'){
	$("#centerPanel").animate({ scrollTop: $('#centerPanel').prop("scrollHeight")}, 900);
	}

    setTimeout(
        function(){                        
            $("#bubble-wrapper").append(control).scrollTop($("#bubble-wrapper").prop('scrollHeight'));
        }, time);
    
}

// function resetChat(){
//     $("ul").empty();
// }


// function for send text appear in chat bot box 
function runScript(e){
    if (e.which == 13 || e.which == 1){
        var text = $("#txtMessage").val();
        if (text !== ""){
            insertChat("me", text);              
            $("#txtMessage").val('');
        }
		if((text=="What is the pricelist of this wines") || {
			insertChat("Pricelist is ..........", 0);  
		}
		else if((text=="Opening Time "))
		{
			insertChat("10:00am to 10:00pm", 0);
		}
		
		processData(text);
    }
}
// send by defoult msg when they open chatbot
function disableInputBox(){
	$("#txtMessage").prop("disabled", true);
	$("#btnSend").prop("disabled", true);
	$('#content').html('<img style="margin-left: 31%;" src="./images/loader.gif" />');
	setTimeout(function(){ 
		$('#content').html('');
	
	if(sessionObject.session.lang == 'HINDI'){
		insertChat("you", "अब आप किसी विशेषज्ञ से जुड़ गए हैं |", 0); 
	}else{
	insertChat("you", "You are connected to a specialist now!!", 0); 
	}
	}, 5000);
}

var sessionObject = null;
function processData(text){
	sessionObject = $.parseJSON(sessionStorage.getItem("sessionDetails"));
	var len = sessionObject.session.conversationHistory.conversations.length;
	if( len == 0){
		var reply = {
						answer: text,
						question: "To better assist with your need, could you provide your 'Phone Number' or 'Email id'?"
	       			};
		sessionObject.session.conversationHistory.conversations.push(reply);
		sessionObject.session.user.validationID = text;
	    sessionStorage.setItem("sessionDetails",JSON.stringify(sessionObject)); 
	}
	else{
		sessionObject.session.conversationHistory.conversations[len-1].answer = text;
		sessionStorage.setItem("sessionDetails",JSON.stringify(sessionObject)); 
	}

	// calling api need to figure out the exact api to call
	$().ready(function () {
	var url = 'http://usdpod1358.usdev.deloitte.com:8080/ChatBot_HCSC/Chat/query'; 


	// $.post(url,{ query: "John", session: map }).done(function (data) {
 //    insertChat("you", data.text_out.substring(0,40)); 
 //  }) ;
		 $.ajax({
		  type: "POST",
		  url: url,
		  data: JSON.stringify(sessionObject),
		  success: function(text){
			response = text;
			
			  insertChat("you",response.msg);
			 
			  if(response.msg.includes('Let me connect you with a Specialist')
				  || response.msg.includes('आगे की मदद के लिए मैं आपको एक विशेषज्ञ से जोड़ता हूं।')
			      || response.msg.includes('माफ़ करना। मैं आपके रिकॉर्ड का पता नहीं लगा सका। बेहतर तरीके से आपकी सहायता करने के लिए मैं आपको एक विशेषज्ञ से जोड़ता हूं')){
				  disableInputBox();
			  }
			  
		  	var reply = {question:response.msg,answer:null};
			  sessionObject = $.parseJSON(sessionStorage.getItem("sessionDetails"));
			  var len = sessionObject.session.conversationHistory.conversations.length;
			  if(len == 1){
				sessionObject.session.user = response.session.user;
				sessionObject.session.lang = response.session.lang;
			  }
			  sessionObject.session.user = response.session.user;
			  sessionObject.session.lang = response.session.lang;
			  sessionObject.session.validationcount = response.session.validationcount;
             sessionObject.session.secondAuthCount = response.session.secondAuthCount;	
             sessionObject.session.userDetailsCount = response.session.userDetailsCount;			 
		  	sessionObject.session.conversationHistory.conversations.push(reply);
		  	sessionStorage.setItem("sessionDetails",JSON.stringify(sessionObject));
		  },
		  error:function(){alert('error');},
		  contentType: "application/json; charset=utf-8",
		  dataType: "json",
		});
	});
	
}


//-- Print Messages
insertChat("you", "Welcome to our Wines shop Customer Care. I am happy to help you.", 0);  
insertChat("you", "To better assist with your need, could you provide your 'Phone Number', 'Email id' or 'Member id'?", 1000);

//-- NOTE: No use time on insertChat.