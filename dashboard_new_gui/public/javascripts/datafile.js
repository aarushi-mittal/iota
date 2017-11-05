//var IOTA_HOST = 'http://52.58.212.188';
var IOTA_HOST = 'http://p101.iotaledger.net';
var IOTA_PORT = 14700;
var IOTA_SEED1 = "QWERTYUIOP999999999999999999999999999999ASDFGHJKL9999999999999999999999ZXCVBNM999";
var IOTA_ADDRESS1;
//account 2
var IOTA_SEED2 = "QWERTYUIOP999999999999999999999999999999ASDFGHJKL99999999999999999999999999999999";
var IOTA_ADDRESS2;
var IOTA_TAG = 'iota-mqtt-poc';
var options1 = {};
var options2 = {};
var thismessage = " "; //mqtt message published
var mymessage = " ";
var time_sent;
var time_period;
var mqtt_time = " ";

var i = 0;
var prev_address_index = 0;
var curr_address_index = 0;

// Instantiate IOTA
var iotajs = new IOTA({
    'host': IOTA_HOST,
    'port': IOTA_PORT
});

console.log("version of iota : " + iotajs.version);

//generate trigger

var accountInfo;
console.log("date is " + new Date());

$(document).ready(function () {

    console.log("welcome to datafile.js");
    var $mytable = $('#mytable');
    console.log('$' + $mytable);
    console.log('$' + JSON.stringify($mytable));

    //check for new transactions every 60 seconds
    var intervalFunction = setInterval(function () {
        iotajs.api.getAccountData(IOTA_SEED2, function (error, myObject) {
            if (error) {
                console.log(error);
            } else {

                if (localStorage.getItem("mytable")) {
                    $mytable.html(localStorage.getItem("mytable"));
                }

                accountInfo = myObject;
                console.log("\n accountInfo at " + new Date());
                var categorizedTransfers = iotajs.utils.categorizeTransfers(accountInfo.transfers, accountInfo.addresses);
                console.log("CURR_ADDRESS_INDEX " + curr_address_index + " PREV_ADDRESS_INDEX IS :  " + prev_address_index);

                if ((categorizedTransfers.received.length) && (categorizedTransfers.received.length > curr_address_index)) {
                    if ((categorizedTransfers.received[curr_address_index])[0].address != (categorizedTransfers.received[prev_address_index])[0].address) {
                        var msg = (categorizedTransfers.received[curr_address_index])[0].signatureMessageFragment;
                        msg = msg.replace("9", "   ");
                        msg = msg.split(" ")[0];
                        console.log("CATEGORIZED TRANSFER AT " + [curr_address_index] + " IS : " + msg + " \n");
                        mymessage = {
                            deviceid: "RPI_1 to RPI_2",
                            msgintrytes: msg,
                            fromtangle: "Success",
                            timestampSent: (categorizedTransfers.received[curr_address_index])[0].timestamp,
                            timestampAttached: (categorizedTransfers.received[curr_address_index])[0].attachmentTimestamp,
                            txid: (categorizedTransfers.received[curr_address_index])[0].hash
                        };
                        console.log("my deviceid  variables : " + mymessage.deviceid);
                        //  foo();
                        console.log(mymessage.deviceid + " : " + mymessage.msgintrytes + " : " + mymessage.fromtangle + " : " + new Date(mymessage.timestampSent) + " : " + new Date(mymessage.timestampAttached) + " : " + mymessage.txid);
                        $mytable.append('<tr><td>' + mymessage.deviceid + '</td><td>' + mymessage.msgintrytes + '</td><td>' + mymessage.fromtangle + '</td><td>' + mymessage.timestampSent + '</td><td>' + mymessage.timestampAttached + '</td><td>' + mymessage.txid + '</td></tr>');

                        localStorage.setItem("mytable", $mytable.html());

                        prev_address_index = curr_address_index;
                        curr_address_index++;
                    } else {
                        prev_address_index = curr_address_index;
                        curr_address_index++;
                    }
                } else {
                    clearInterval(intervalFunction);
                }

            }
        });
    }, 30000);
});
