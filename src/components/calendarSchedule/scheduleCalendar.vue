<template>
	<div class="schedule-calendar">
		 <div class="head">
			 <img :src="arrowIcon" @click="weekFn('up')">
			 <span>{{curDate}}<i><img :src="calendarIcon" @click="monthFn"></i></span>
			 <img :src="arrowIcon" @click="weekFn('next')">
		 </div>
		<div class="week">
			<ul>
				<li>日</li>
				<li>一</li>
				<li>二</li>
				<li>三</li>
				<li>四</li>
				<li>五</li>
				<li>六</li>
			</ul>
		</div>
		<div class="days">
			<ul>
				<li v-for="(item, index) in week" :class="{cur: item.cur, active: item.active}" @click="chooseDay(index)">
					<span>{{item.cDay}}</span>
					<span>{{item.IDayCn}}</span>
				</li>
			</ul>
		</div>
		<div class="cur-date">
			<p>{{curLunar}}</p>
		</div>
		<transition name="months">
		<div class="months" v-show="months.show">
			<div>
				<h4>
					<span><img :src="closeIcon" @click="months.show=false"></span>
					<span>选择月份</span>
					<span><img :src="sureIcon" @click="sureChoose"></span>
				</h4>
				<div class="list">
					<ul ref="yearList">
						<li v-for="i in 10" :class="{active: (2016+i)==curYear}">{{2016+i}}年</li>
					</ul>
					<ul ref="monthList">
						<li v-for="i in 12" :class="{active: i==curMonth}">{{i}}月</li>
					</ul>
				</div>
			</div>
		</div>
		</transition>
	</div>
</template>
<script>
	const arrowIcon = require('./left.png');
	const calendarIcon = require('./calendar.png');
	import closeIcon from './wrong.png'
	import sureIcon from './right.png'
	import calendar from './calendar'

	export default{
		data: ()=>({
			arrowIcon: arrowIcon,
			calendarIcon: calendarIcon,
			sureIcon:sureIcon,
			closeIcon:closeIcon,
			week: [],
			upWeek: [],
			nextWeek: [],
			curDate: '',
			curLunar: '',
			curYear: null,
			curMonth: null,
			months:{
				show: false
			}
		}),
		created (){
			this.init();
		},
		methods: {
			init (){
				this.weekFn();
			},
			weekFn (type){
				const date = new Date();
				const d = date.getDate();
				const w = date.getDay();
				const dayT = 24*60*60*1000;
				let t = date.getTime()-w*dayT;
				if(type=='up'||type=='next'){
					const day = type=='up'?this.week[0]:this.week[6];
					date.setFullYear(day.cYear);
					date.setMonth(day.cMonth-1);
					date.setDate(day.cDay);
					t = type=='up'?(date.getTime() - 7*dayT):(date.getTime() + 1*dayT);
				}else if(type=='choose'){
					date.setFullYear(this.curYear);
					date.setMonth(this.curMonth-1);
					date.setDate(1);
					t = date.getTime();
				}else{
					this.curYear = date.getFullYear();
					this.curMonth = date.getMonth()+1;
				}
				this.week = [];
				for(let i=0;i<7;i++){
					let one = new Date();
					one.setTime(t+i*dayT);
					let cale = calendar.solar2lunar(one.getFullYear(), one.getMonth()+1, one.getDate());
					cale.active = false;
					if(d==cale.cDay){
						cale.cur = true;
						this.curDate = cale.cYear+'年'+cale.cMonth+'月'+cale.cDay+'日';
						this.curLunar = '农历'+cale.IMonthCn+cale.IDayCn+'（'+cale.ncWeek+'）';
					}
					this.week.push(cale);
				}
			},
			monthFn (){
				const self = this;
				const monthList = this.$refs.monthList;
				const yearList = this.$refs.yearList;
				this.months.show = true;
				this.$nextTick(function(){
					monthList.scrollTop = (this.curMonth-1)*30;
					yearList.scrollTop = (this.curYear-2017)*30;
					var st = null;
					this.addEvent(monthList, 'curMonth');
					this.addEvent(yearList, 'curYear');
				})

			},
			addEvent (obj, name){
				const self = this;
				var st = '';
				obj.addEventListener('scroll', (e)=>{
					let target = e.target;
					let t = target.scrollTop;
					clearTimeout(st);
					st = setTimeout(function(){
						const num = Math.round(t/30);
						target.scrollTop = num*30;
						self[name] = name=='curYear'?num+2017:num+1;
					}, 500);
					e.stopPropagation();
				})
			},
			sureChoose (){
				this.weekFn('choose');
				this.months.show = false;
			},
			chooseDay (index){
				for(let i=0;i<this.week.length;i++){
					let one = this.week[i];
					if(i==index){
						one.active = true;
						this.curDate = one.cYear+'年'+one.cMonth+'月'+one.cDay+'日';
						this.curLunar = '农历'+one.IMonthCn+one.IDayCn+'（'+one.ncWeek+'）';
						this.$emit('scheduleDate', {date: one.cYear+' - '+one.cMonth+' - '+one.cDay})
					}else{
						one.active = false;
					}
				}
			}
		}
	}
</script>
<style scoped>
	.schedule-calendar{
		width: 100%;
		box-shadow: 0 1px 3px #f8f8f8;
		margin-bottom: 2px;
	}
	.head{
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 0.3rem;
		background: #f8f8f8;
		padding: 0.3rem 0 0.2rem;
	}
	.head>span{
		display: flex;
		align-items: center;
	}
	.head img{
		width: 0.46rem;
	}
	.head>img:last-child{
		transform: rotate(180deg);
	}
	.head>span i{
		display: inline-block;
		padding: 2px 4px 6px;
		background: #3a444e;
		border-radius: 50%;
		margin-left: 0.2rem;
	}
	.head>span i>img{
		display: block;
		width: 0.34rem;
	}
	/*week*/
	.week ul{
		display: flex;
		margin: 0;
		padding: 0;
		justify-content: space-around;
		font-size: 0.28rem;
		background: #f8f8f8;
		padding: 0.1rem 0;
	}
	.week ul li:first-child,
	.week ul li:last-child{
		color: #bcbcbc;
	}
	/*days*/
	.days{
		background: #ffffff;
	}
	.days ul{
		display: flex;
		margin: 0;
		padding: 0.2rem 0;
		justify-content: space-around;
		font-size: 0.32rem;
	}
	.days ul li{
		position: relative;
		padding: 0.06rem  0.16rem 0.1rem;
	}
	.days ul li span{
		display: block;
		text-align: center;
	}
	.days ul li:last-child span,
	.days ul li:first-child span{
		color: #808080;
	}
	.days ul li.active:last-child span{
		color: #ffffff;
	}
	.days ul li span:last-child{
		color: #bcbcbc;
		font-size: 0.26rem;
	}
	.days ul li.active{
		background: #34aadc;
		border-radius: 50%;
		color: #ffffff;
	}
	.days ul li.active span:last-child{
		color: #ffffff;
	}
	.days ul li.cur{
		border: 2px solid #34aadc;
		border-radius: 50%;
	}
	.days ul li.cur:after{
		position: absolute;
		content: ' ';
		width: 0.06rem;
		height: 0.06rem;
		background: #34aadc;
		border-radius: 50%;
		left: 45%;
	}
	.cur-date{
		background: #ffffff;
		color: #bcbcbc;
		padding: 0.2rem 0 0.2rem 0.2rem;
		font-size: 0.32rem;
	}
	/*months*/
	.months{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,0.3);
		z-index: 9999;
	}
	.months>div{
		position: absolute;
		bottom: 0;
		width: 100%;
	}
	.months>div h4{
		display: flex;
		margin: 0;
		width: 100%;
		justify-content: space-between;
		background: #000;
		color: #ffffff;
		align-items: center;
		font-size: 0.26rem;
		font-weight: normal;
		padding: 0.1rem 0;
	}
	.months>div h4 img{
		width: 0.3rem;
		padding-right: 0.1rem;
	}
	.months>div h4 span{
		padding:0 0.1rem;
	}
	.months .list{
		height: 200px;
		background: #ffffff;
		display: flex;
		position: relative;
	}
	.months .list:before,
	.months .list:after{
		content: ' ';
		position: absolute;
		left: 0;
		border-top: 1px solid #cccccc;
		width: 100%;
	}
	.months .list:before{
		top: 82px;
	}
	.months .list:after{
		top: 112px;
	}
	.months .list ul{
		width: 50%;
		font-size: 14px;
		overflow-y: auto;
		padding-top: 84px;
		padding-bottom: 84px;
	}
	.months .list ul li.active{
		color: #000000;
	}
	.months .list ul li{
		padding-left: 0.28rem;
		color: #ccc;
		font-weight: normal;
		padding-top: 6px;
		padding-bottom: 6px;
		height: 18px;
		line-height: 18px;
	}
	.months .list ul:first-child li{
		text-align: right;
		padding-right: 0.2rem;
		padding-left: 0;
	}

	.months-enter-active, .months-leave-active {
		transition: all .3s ease;
		height: 100%;
	}
	.months-enter, .months-leave-active {
		height: 0;
	}
	.months .list ul::-webkit-scrollbar{
		width: 0;
		height: 0;
	}
</style>