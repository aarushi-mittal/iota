    console.log("welcome to rpi2");
    var IOTA = require('iota.lib.js');

    //    var IOTA_HOST = 'http://52.58.212.188';
    var IOTA_HOST = 'http://p101.iotaledger.net';
    var IOTA_PORT = 14700;
    var IOTA_SEED1 = "QWERTYUIOP999999999999999999999999999999ASDFGHJKL9999999999999999999999ZXCVBNM999";
    var IOTA_ADDRESS1;
    //account 2
    var IOTA_SEED2 = "QWERTYUIOP999999999999999999999999999999ASDFGHJKL99999999999999999999999999999999";
    var IOTA_ADDRESS2;
    var IOTA_TAG = 'iota-mqtt-poc';
    var prev_address_index = 0;
    var curr_address_index = 0;

    // Instantiate IOTA
    var iotajs = new IOTA({
        'host': IOTA_HOST,
        'port': IOTA_PORT
    });

    var mqtt_msg = " ";

    //
    //generate trigger
    //
    var accountInfo;
    console.log("date is " + new Date());

    console.log("iota js version is : " + iotajs.version);

    //check for new transactions every 60 seconds
    var intervalFunction = setInterval(function () {
        iotajs.api.getAccountData(IOTA_SEED2, function (error, myObject) {
            if (error) {
                console.log(error);
            } else {
                accountInfo = myObject;
                console.log("\naccountInfo at " + new Date());
                var categorizedTransfers = iotajs.utils.categorizeTransfers(accountInfo.transfers, accountInfo.addresses);
                console.log("CURR_ADDRESS_INDEX " + curr_address_index + " PREV_ADDRESS_INDEX IS :  " + prev_address_index);
                var msg = (categorizedTransfers.received[curr_address_index])[0].signatureMessageFragment;
                msg = msg.replace("9", "   ");
                msg = msg.split(" ")[0];
                (categorizedTransfers.received[curr_address_index])[0].signatureMessageFragment = msg;
                console.log("categorized transfers are : " + JSON.stringify((categorizedTransfers.received[curr_address_index])[0]));


            }
        });


    }, 5000);
