var today = new Date();

var hour = parseInt(today.getHours());
var estHour = (hour - 4).toString();
if (estHour == 0) {
    estHour = (24).toString();
} else if (estHour == -1){
    estHour = (23).toString();
} else if (estHour == -2){
    estHour = (22).toString();
} else if (estHour == -3){
    estHour = (21).toString();
}
     
var min = today.getMinutes();  
if (min < 10) {
    min = '0' + today.getMinutes();
}           

var time = estHour + ":" + min;

console.log(time);
var today = new Date();        
            var min = today.getMinutes();  
            if (min < 10) {
                min = '0' + today.getMinutes();
            }
            var time = today.getHours() + ":" + min;