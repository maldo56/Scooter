const WebSocket = require('ws');
var fs = require("fs");

function main() {

    var connection = new WebSocket('ws://localhost:8080/Proyecto-2019Web/servicios');
    var guid = 'be039aae-3798-4c98-95f8-37cbc68c6a5c';
    var msg = '{"alquilado":false,"id":"' + guid + '","alquiler":" ","latitude":0,"longitude":0}';
    var alquilerGuid = '';

    var alquilado = false;

    connection.onopen = function () {

        fs.writeFile("temp.txt", (err) => {
            console.log("Connect.");
        });

        // process.stdout.write = process.stderr.write = access.write.bind(access);

        connection.send(msg);
        console.log("Connect.");

    };

    connection.onerror = function (error) {
    // an error occurred when sending/receiving data
        fs.writeFile("temp.txt", (err) => {
            if (err) console.log(err);
            console.log(error);
        });
    };

    connection.onmessage = function (message) {
        // try to decode json (I assume that each message
        // from server is json)
        try {

            fs.writeFile("temp.txt", message.data);
            
            // '{"alquilado":true,"id":"","alquiler":"","latitude":-1,"longitude":-1}'
            var json = JSON.parse(message.data);

            var i = 0;
            var xs = ["-34.898995","-34.898696","-34.898326","-34.897904","-34.897499","-34.896496","-34.895633","-34.895007","-34.894668","-34.894747","-34.894834","-34.894950","-34.895045","-34.896059","-34.896397","-34.897293","-34.898177","-34.898880"];
            var ys = ["-56.168794","-56.167764","-56.166905","-56.165618","-56.164609","-56.164781","-56.164996","-56.164893","-56.165002","-56.166221","-56.167352","-56.168707","-56.169773","-56.169872","-56.169854","-56.169612","-56.169170","-56.168868"];

            var alquilado = json.alquilado;

            if ( alquilado ) {

                alquilerGuid = json.alquiler;
				msg = "{\"alquilado\":" + alquilado + ",\"id\":\"" + guid + "\",\"alquiler\":\"" + alquilerGuid + "\",\"latitude\":" + xs[i] + ",\"longitude\":" +  ys[i] + "}";
                
                if ( i = xs.length ) {
                    i = 0;
                } else {
                    i ++;
                }
                
            } else {
                msg = '{"alquilado":false,"id":"' + guid + '","alquiler":" ","latitude":0,"longitude":0}';
            }

            setTimeout(enviarMsg, 5000);
            
        } catch (e) {
            fs.writeFile("temp.txt", (err) => {
                if (err) console.log(err);
                console.log('This doesn\'t look like a valid JSON: ', message.data);
            });
            
            return;
        }
        // handle incoming message
    };

    enviarMsg = function() {
        connection.send(msg);
    }
}

main();