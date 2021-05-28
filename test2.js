const schedule = require('node-schedule');
var startDate = new Date();

class Renewal {
    constructor() {
        this.tableName = tableName;
        //만약 집어넣는 date가 달라진다면 다시 이 date를 가져와서 다음달에 적용시켜야함.
        this.ealryDate = startDate;
        //바뀌는 데이터
        this.nextDate = startDate;
        this.dateLimit = 0;
        this.scheduled = null;
    }
    scheduling(){
        this.scheduled = schedule.scheduleJob({second : this.ealryDate.getSeconds + 1},this.getDate, () => {
            //처음에 데이터를 보낸다.
            //처음 실행했을 때 바로 실행을 해야하는데 저 데이터가 들어온 시간으로 하면 처음에는 실행하지 않고 다음부터 실행을 한다. 
            //이 문제점을 해결해야함. 그냥 현재 날짜에서 몇 초 뒤에 실행한다 라고 해놓으면 될 듯? 한 +5초정도? 그럼 바로 시작할 듯.
            console.log('데이터 삽입');
            //만약 일이 바꼈으면 초기 일로 돌아가기 위해서.
            this.nextDate.setDate(this.ealryDate.getDate());
            //현재 들어온 날짜가 12월인지 검사한다.
            //12월이면 년도에 +1 해주고 1월로 돌아간다
            if((this.nextDate.getMonth+1) == 11){
                this.nextDate.setFullYear(this.nextDate.getFullYear()+1);
                this.nextDate.setMonth(0);
            }else {
                this.nextDate.setMonth(this.nextDate.getMonth()+1);
            }
            
            switch(this.nextDate.getMonth()+1){
                case 1: case 3: case 5: case 7: case 8: case 10: case 12:
                    this.dateLimit = 31;
                    break;
                case 4: case 6: case 9: case 11:
                    this.dateLimit = 30;
                    break;
                case 2:
                    //윤년인지도 검사해줘야함.
                    if(this.nextDate.getFullYear() / 4 == 0 && this.nextDate.getFullYear() / 100 != 0){
                        //2월을 29일 까지라고 변경해줘야함.
                        this.dateLimit = 29;
                    }else{
                        this.dateLimit = 28;
                    }
                    break;
                default:
                    console.log('잘못된 월입니다.');
                    break;
            }
            //다음주가 주말인지 검사하려면 
            var nextDay = new Date(this.nextDate).getDay();

            if(nextDay == 0){
                //일요일인데 다음주 월요일이 다음달로 넘어가면 그 주 금요일날 실시
                if((this.nextDate.getDate() + 1) > this.dateLimit){
                    this.nextDate.setDate(this.nextDate.getDate() - 2);
                }else{
                    this.nextDate.setDate(this.nextDate.getDate() + 1);
                }
            }else if(nextDay == 6){
                //토요일인데 다음주 월요일이 다음달로 넘어가면 그 주 금요일날 실시
                if((this.nextDate.getDate() + 2) > this.dateLimit){
                    this.nextDate.setDate(this.nextDate.getDate() - 1);
                }else{
                    this.nextDate.setDate(this.nextDate.getDate() + 2);
                }
            }else{
                //둘 다 아니면 당일 실시
                console.log('평일입니다^^ 문제 없이 진행하세요^^')
            }
            console.log('끝~');
            console.log(this.nextDate);
        });
    }
    stop(){
        this.scheduled.cancel();
    }
}


exports.module ={
    Renewal
}
