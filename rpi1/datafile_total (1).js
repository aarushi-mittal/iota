console.log("welcome to rpi_1");
var IOTA = require('iota.lib.js');
    
   // var IOTA_HOST = 'http://52.58.212.188';
    var IOTA_HOST = 'http://p101.iotaledger.net' ;
    var IOTA_PORT = 14700;
    var IOTA_SEED1 = "QWERTYUIOP999999999999999999999999999999ASDFGHJKL9999999999999999999999ZXCVBNM999"; 
    var IOTA_ADDRESS1 ;
    //account 2
    var IOTA_SEED2 = "QWERTYUIOP999999999999999999999999999999ASDFGHJKL99999999999999999999999999999999";
    var IOTA_ADDRESS2 ;
    var IOTA_TAG = 'iota-mqtt-poc';
//    var i = 0;
    var options1 = {
	index:0,
	total:1,
	security:2,
	checksum:false
	};
	//console.log(options1.index) ;
    var options2 = {};
    var mymessage =" " ;
    var time_sent ;
    var time_period ;
    var mqtt_time =" ";
    var generatedAddress ; 
    
    // Instantiate IOTA
var iotajs = new IOTA({
        'host': IOTA_HOST,
        'port': IOTA_PORT
});
//  var mqtt_msg = "ID : RPI_1 , TMP : 27.33";
    var mqtt_msg = "HI" ; 	

    //  Generate address function
    mymessage = iotajs.utils.toTrytes(mqtt_msg);
    //console.log("TRYTE MESSAGE : "+mymessage+" AND MQTT_MESSAGE IS : "+mqtt_msg+" msg sent at "+new Date());

setInterval(function(){
iotajs.api.getNewAddress(IOTA_SEED2,options1,function(error, address){ //since we want to generate an address for seed 2
        console.log("\n NEW ADDRESS IS : "+address+"TIME IS "+new Date());
        //time_sent = new Date();    //entered the tangle 
        //device_id = "Rpi1";
	mqtt_msg += options1.index 
        mymessage = iotajs.utils.toTrytes(mqtt_msg);
        generatedAddress = address ;
	console.log("TRYTE MESSAGE : "+mymessage+" AND MQTT_MESSAGE IS : "+mqtt_msg+" msg sent at "+new Date());
	console.log("\n INDEX IS : "+options1.index);

    var transfers = [{
        'address': generatedAddress[0],    //address of the recipient-total generates an array
        'value': 0,     //used to transfer iota tokens
        'message': mymessage, //mqtt msg converted to trytes
        'tag': iotajs.utils.toTrytes(IOTA_TAG)
	//'obsoleteTag': iotajs.utils.toTrytes(IOTA_TAG)

    }];

    var seed = IOTA_SEED1;
    var depth = 9;
    var minWeightMagnitude = 9; //as suggested by @dom

iotajs.api.sendTransfer(seed, depth, minWeightMagnitude, transfers, function(error,success) {
    if (!error) {
 	// Only one transfer so we can get the new TX hash by accessing .hash on first element of success.
    	var timestamp = new Date();
        console.log("Successfully made transfer for device id : RPI_1, with transaction ID: " + success[0].hash +" with mqtt message string "+iotajs.utils.fromTrytes(mymessage)+" == "+mqtt_msg + "my timestamp is : "+timestamp); 
        mymessage = {
        	// deviceid : device_id,
                msgsent : mqtt_msg,
                msgrec : mqtt_msg,
                msgintrytes : mymessage,
                fromtangle : "Success",
                timestamp :timestamp ,
                txid : success[0].hash
        };
        console.log("my deviceid  variables : "+mymessage.msgsent+" msg in trytes "+mymessage.msgintrytes);
        console.log("msg received "+new Date());
     }
     else {
     	mymessage = {
               // deviceid : device_id ,
                msgsent : mqtt_msg,
                msgrec : mqtt_msg,
                msgintrytes : mymessage,
                fromtangle : "failed",
                timestamp : timestamp,
                txid : "empty"
	};
        console.log("Failed to make transfer with error: "+ error);
       // console.log("failed to make transfer with my deviceid  variables : "+mymessage.msgsent+" msg in trytes "+mymessage.msgintrytes);
    }
});	//sendTransfer closed
options1.index ++ ;	//creating a new address by incrementing the 

});	//getNewAddress closed
},60000 );	//setInterval closed
