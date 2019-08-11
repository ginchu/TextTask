require('dotenv').config();
const client = require('twilio')(process.env.ACC_SID, process.env.AUTH_TOKEN);


var mysql = require('mysql');
var async = require("async");

module.exports.checkTime = function(){
    async.forever(
        function(next){
            var today = new Date();

            var hour = parseInt(today.getHours());
            var estHour = (hour - 4).toString();
            if (estHour == '0') {
                estHour = (24).toString();
            } else if (estHour == '-1'){
                estHour = (23).toString();
            } else if (estHour == '-2'){
                estHour = (22).toString();
            } else if (estHour == '-3'){
                estHour = (21).toString();
            }
                
            var min = today.getMinutes();  
            if (min < 10) {
                min = '0' + today.getMinutes();
            }           
            
            var time = estHour + ":" + min;
            
            var pool  = mysql.createPool({
                host: process.env.HOST,
                user: process.env.USER,
                password: process.env.PASSWORD,
                database: process.env.DATABASE,
            });
            
            pool.getConnection(function(err, connection) {
                connection.query("SELECT Name, Task, Phone FROM userinfo WHERE Time = '" + time + "'", function (err, result, fields) {
                    if (err) throw err;
                    //result is [RowDataPacket array]
                    console.log(result);
                    console.log(result.length);
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
                    connection.release();
                    if (err) throw err;
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