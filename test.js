const schedule = require('node-schedule');
//이건 단순히 시작한 날짜잖아?
var startDate = new Date();
/* const j = schedule.scheduleJob({second : sec},() =>{
    console.log('매 ',sec,'초에 실행');
}); */
//그럼 시작할 때 년월일 시분초 다 받아와서
// date에 일,시,분,초
// 분기마다 하려면 
const j = schedule.scheduleJob({second : startDate.getSeconds()},() =>{
    //다음 달 같은 일에 다시 시작을 하잖아 그러면 맨 처음에 일에 해당하는 요일을 뽑아내고 if로 검사를 하는거지
    //var renewalDate = new Date(); 이런식으로 뽑아내 (요일을 뽑아내지 말고 그 날의 모든것을 뽑아내자.)
    //시작한 날의 요일 값 가져오기
    //var startDay = startDate.getDay();
    //매월 시작한 날의 일 요일 값 가져오기
    //var renewalDay = renewalDate.getDay();
    //토, 일 두 상황이 변수의 값을 지정하는게 다르다.
    //if(renewalDay === 0){
    //  renewalDay += startDay;
    //  switch(renewalDate.getMonth()){
    //      case 1 : case 3 : case 5: case 7: case 8: case 10: case 12:
    //      if(renewalDay > 31){

    //} else {
    //      이때는 그냥 다음주로 하면 된다.
    //      근데 다음주로 미룰라면 저 스케쥴잡에 있는 파라미터를 변경해야하잖아? 
    //      그럼 startDate 를 constructor로 지정해서 바꾸고 어차피 바꾼 요일로 들어오면 주말이 아닐테니까 저 밑에서 데이터를 갱신할거잖아? 
    //      아 초기값은 변하면 안되겠다.
    //      그냥 처음 들어왔을 때 저거로 해놓고 this.뭐시기에 지정해놓고 바꿔서 쓰던가 해야할듯
    //
    //} 
    //}
    //} else if(renewalDay === 6){
    //  
    //}
    //} else{
    //  데이터 갱신
    //}
    var renewalDate = new Date();

    if(renewalDate.getMinutes === 29 || renewalDate.getMinutes === 31){
        console.log('다음으로 넘어간다.');
        continue;
    }
    console.log('매 ',startDate.getSeconds() ,'초에 실행');
    console.log('현재 요일 : ', startDate.getDay());
});



