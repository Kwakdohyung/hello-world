const knex = require("../config/knexEnv");
const handleError = require("../common/errorHandling.js");
const moment = require('moment');
var _ = require("underscore");

class Renewal {
    constructor(time, tableName, created_who) {
        this.time = time;
        this.tableName = tableName;
        this.intervalCnt = 0;
        this.intervalTime = 0;
        this.timer = null;
        this.status = 0; //0 첫 상태 1 시작 2 정지
        this.created_who = created_who;
    }

    //1초마다 데이터를 집어넣는다
    realtimeInput() {
        // 버튼 같은거 눌렀을 때 카운트 증가.
        this.intervalCnt++;
        // 몇 번 돌았는지 확인하기 위한 변수. 다시 시작했을 때 1부터 시작해야 하기 때문에 0으로 초기화
        this.intervalTime = 0;
        // 정지하고 다시 시작이 아닌 그냥 시작을 또 눌렀을 때 상태값이 1이기 때문에 여기 들어와서 그 전에 하던 timer를 중단 시키고 다시 새롭게 시작한다.
        if (this.status === 1) {
            clearInterval(this.timer);
        }
        console.log('1sec data input start');
        this.timer = setInterval(async () => {
            this.intervalTime++;
            //여기서 매 초 시간이 변하는데 tablea.js 에서 데이터를 집어 넣으면 처음 데이터를 집어 넣었을 때의 값만 들어가지
            //이렇게 해야 매 초 변하는걸 넣을 수 있다.
            var insertItem = {
                idata: moment().format("YYYY-MM-DD HH:mm:ss"),
                created_who: this.created_who,
                created_at: moment().format("YYYY-MM-DD")
            }
            var dataInsert = await knex(this.tableName).insert(insertItem);
            //
            console.log('현재 시간 : ', moment().format("YYYY-MM-DD HH:mm:ss"));
            console.log('Table Name : ', this.tableName, ' ', ' Interval Time : ', this.intervalTime, ' time');
            console.log('Interval Count: ', this.intervalCnt);
        }, this.time * 1000);
        this.status = 1;
    }

    stop() {
        clearInterval(this.timer);
        console.log('interval stop');
        this.status = 2;
    }
}



class Renewals extends Renewal {
    constructor(time, tableName, tableName2, created_who){
        super(time, tableName, created_who);
        this.tableName2 = tableName2;
        this.message = null;
        this.dataStatus = 0;
    }
    //60초마다 tablea의 데이터를 뽑아서 한개씩 tableb에 넣고 해당하는 그 데이터의 status와 process_message를 가져온다.
    dataRenewal() {
        this.intervalCnt++;
        this.intervalTime = 0;
        if (this.status === 1) {
            clearInterval(this.timer);
        }
        console.log(this.time,'60sec data renewal');
        this.timer = setInterval(async (res) => {

            this.intervalTime++;

            var dataCount = await knex(this.tableName).select(knex.raw("COUNT(1) as total_count")).where('status', 0);

            // 데이터가 있는 경우에만 데이터를 갱신한다. 한개라도 있으면 갱신.
            if(dataCount[0].TOTAL_COUNT !== 0 ){
                var dataResult = await knex(this.tableName).select().where('status', 0);
                for(var i = 0; i < dataCount[0].TOTAL_COUNT; i++){
                    try{
                        var dataInput = await knex(this.tableName2).insert({idata : dataResult[i].IDATA, created_who : this.created_who, created_at : moment().format("YYYY-MM-DD")});
                        this.dataStatus = 1;
                        this.message = 'ok'
                    }catch(error){
                        this.dataStatus = 0;
                        this.message = error.message;
                    }
                    var dataUpdata = await knex(this.tableName).update({status : this.dataStatus, process_message : this.message}).where('idata', dataResult[i].IDATA);
                }
                console.log(dataCount[0].TOTAL_COUNT, '개 데이터 갱신 완료');
            }else{
                console.log('갱신할 데이터가 없습니다.');
            }
            this.status = 1;
        }, this.time * 1000);
    }
}

class RenewalOne {
    constructor(time, tableName) {
        this.time = time;
        this.tableName = tableName;
        this.timer = null;
    }

    renewal() {
        this.timer = setTimeout(() => {
            console.log('Table Name : ', this.tableName, ' ', ' data renewal complete!');
        }, this.time * 1000);
    }

    stop() {
        clearTimeout(this.timer);
        console.log('data renewal stop');
    }
}
module.exports = {
    Renewal,
    RenewalOne,
    Renewals
}