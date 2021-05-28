const schedule = require('node-schedule');
/* var year = 2021;
var month = 5;
var datee = 7;
var abc = new Date().getDate();

console.log(typeof(abc), abc);

var ssss = `${year}-${month}-${datee}`;
var date = new Date(ssss).getDay();
console.log(`${year}-${month}-${datee}`);
console.log(date); */

var abc = new Date();
const j = schedule.scheduleJob({second : abc.getSeconds() + 1, abc},()=>{
    console.log('바로 시작?');
})
/* abc.setFullYear(abc.getFullYear()+1);

console.log(abc.getFullYear());

abc.setMonth(abc.getMonth()+1);

console.log(abc.getMonth()); */