//make connection- this is client
var socket = io.connect('http://localhost:5000');
var uname = localStorage.getItem('userName');



//query dom
document.querySelector('#u-name').textContent = uname;
var onlineList = document.querySelector('#online ul');
let output = document.getElementById('out');
let text = document.getElementById('message');
let sendbtn = document.querySelector('#send');
var feedback = document.getElementById('feedback');


//console.log(uname);
socket.emit('name', uname);
var nameList=[''];
var x=[''];
var nameL=[''];

nameList[0]=uname;
nameL[0]=uname;

let lis = new Set();

//add to online list

socket.on('userName', function(ar) {

	ar.forEach(function(data) {
		console.log(data);
		if(nameList.indexOf(data) == -1) {  //if data is not in nameList
			onlineList.innerHTML +='<li>' + data + '</li>';
			nameList.push(data);	
		}
	});
		
});

//remove people from online list

socket.on('close', function(ob) {
	//console.log(ob);

	onlineList.innerHTML ="";
	nameL.push(ob.u);
	var x=[''];
	
	console.log(ob.u + ' closed connection');

	for(var i=0; i<nameL.length; i++) {
		x.push(nameL[i]);
	}

	//console.log('x ' + x + ' and nameL '+ nameL );

	Array.from(ob.ar).forEach(function(data) {
		//console.log(nameL);
		if(x.indexOf(data) == -1) {  //if data is not in nameList

			onlineList.innerHTML +='<li>' + data + '</li>';
			x.push(data);
		}

	});

	console.log(' Now, nameL ' + nameL );

});


//add what you type to output
	//when you select the send button
sendbtn.addEventListener('click', function() {
	msg();		
});
	//when you hit enter key
text.addEventListener('keyup',function(e) {
	if((e.keyCode || e.which)=='13') {
		msg();
	}
});


var msg = function() {
	//alert("Hello 3");
	socket.emit('msg', {text: text.value, user : uname} );
	text.value='';
};

socket.on('texts', function(ob) {
		feedback.innerHTML='';
		output.innerHTML += '<p><strong>'+ ob.user + ': </strong>' + ob.text +'</p>';	
});



//to display typing
text.addEventListener('keypress', function(e){
	socket.emit('typing', uname);
	console.log('from client, user name is ' + uname);
});

socket.on('typing', function(usr) {
	feedback.innerHTML = '<p><em>' + usr + ' is typing.. </em></p>';

});

