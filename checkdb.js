require('dotenv').config();
const client = require('twilio')(process.env.ACC_SID, process.env.AUTH_TOKEN);


var mysql = require('mysql');
var async = require("async");

module.exports.checkTime = function(){
    async.forever(
        function(next){
            var con = mysql.createConnection({
                host: "localhost",
                user: "user1",
                password: "qaz123",
                database: "reminderdb",
            });

            var today = new Date();        
            var min = today.getMinutes();  
            if (min < 10) {
                min = '0' + today.getMinutes();
            }
            var time = today.getHours() + ":" + min;

            con.connect(function(err) {
                if (err) throw err;
                con.query("SELECT Name, Task, Phone FROM userinfo WHERE Time = '" + time + "'", function (err, result, fields) {
                    if (err) throw err;
                    //result is [RowDataPacket array]
                    console.log(result);
                    console.log(result.length);
                    console.log(typeof result[0] === "undefined");
                    if (result.length > 0){
                        client.messages
                            .create({
                                body: 'Hey, '+result[0].Name+'! This is your daily reminder of your task, '+ result[0].Task + '.',
                                from: '+19143593091',
                                to:     '+1' + result[0].Phone
                            })        
                            .then(message => console.log(message.sid));
                    }
                
                    console.log(time);
                });
            });
            setTimeout(function() {
                next();
            }, 60000);
        },
        function(err){
            console.error(err);
        }

    );
};