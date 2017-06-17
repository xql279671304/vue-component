<template lang="html">
    <div class="demo">
        <h1>时间组件和日期组件</h1>
        <input type='text' v-model="datePicker" placeholder="请选日期" @click="chooseDate">
        <input type='text' v-model="timePicker" placeholder="请选时间" @click="chooseTime">
        <date-picker :date-picker-option="datePickerOption" :show="datePickerShow" v-on:childChooseDate="getChooseDate"></date-picker>
        <time-picker :time-picker-option="timePickerOption" :show="show" v-on:timePickerData="getChooseTime"></time-picker>
    </div>
</template>
<<script>
    import datePicker from '../../components/datePicker/datePicker.vue'
    import timePicker from '../../components/timePicker/timePicker.vue'

    export default{
        data: ()=>({
			datePickerShow: false,
			datePickerOption: {
				startYear: 2000,
				chooseYear: 2016,
				chooseMonth: 1,
				chooseDay: 1
			},
            datePicker: '',
			timePickerOption: {},
			show: false,
            timePicker: ''
        }),
        methods:{
			chooseDate (){
				this.datePickerShow = true;
			},
			chooseTime (){
				this.show = true;
            },
			getChooseDate (obj){
				this.datePickerShow = false;
				if(obj.status=='sure'){
                    this.datePicker = obj.date;
				}
			},
			getChooseTime (data){
				console.log(data)
				this.show = false;
				this.timePicker = data.time;
            }
        },
        components: {
            datePicker,
			timePicker
        }
    }
</script>
<style>
    @import "../../assets/style.css";
    .demo{
        font-size: 0.3rem;
    }
    input{
        display: block;
        width: 90%;
        margin: auto;
        border: 1px solid #ccc;
        border-radius: 4px;
        height: 28px;
        margin-bottom: 10px;
    }
</style>