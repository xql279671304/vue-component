<template>
	<div class="time-picker" v-show="show">
		<div class="time-picker-con">
			<div class="time-picker-btn">
				<span @click="sureTime('cancel')">取消</span>
				<span @click="sureTime('sure')">确定</span>
			</div>
			<div class="time-picker-time">
				<div class="time-picker-hour" ref="timePickerHour">
					<p class="top"></p>
					<ul>
						<li v-for="H in hour" :class="{active: activeHour==H}">{{H<10?'0'+H:H}}</li>
					</ul>
					<p></p>
				</div>
				<div class="time-picker-min" ref="timePickerMin">
					<p class="top"></p>
					<ul>
						<li v-for="M in 59" :class="{active: activeMin==M-1}">{{M-1<10?'0'+(M-1):M}}</li>
					</ul>
					<p></p>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default{
		props: {
			/**
			 * {
			 * 	time: 12:00, 显示的时间 必填
			 * 	maxTime: 23:00, 最大时间
			 * 	minTime: 8:00 最小时间
			 * }
			 */
			timePickerOption: Object,
			show: Boolean
		},
		data: ()=>({
			minHour: 0,
			maxHour: 23,
			activeHour: 0,
			activeMin: 0
		}),
		computed: {
			hour (){
				let hour = [];
				let minHour = this.minHour;
				let maxHour = this.maxHour;
				for(let i=minHour;i<maxHour+1;i++){
					hour.push(i);
				}
				return hour;
			}
		},
		watch:{
			show (){
				if(this.show){
					if(!this.show) return;
					this.init();
				}
			}
		},
		methods: {
			init (){
				let option = this.timePickerOption;
				if(option.time){
					this.activeHour = option.time.split(':')[0]*1;
				}
				if(option.minTime){
					this.minHour = option.minTime.split(':')[0]*1;
					if(this.activeHour<this.minHour){
						this.activeHour = this.minHour;
					}
				}
				if(option.maxTime){
					this.maxHour = option.maxTime.split(':')[0]*1;
				}
				this.setHour();
				this.$nextTick(function(){
					this.chooseTime();
				})
				this.initScrollTop(this.$refs.timePickerHour, this.activeHour-this.minHour)
				this.initScrollTop(this.$refs.timePickerMin, this.activeMin)
			},
			setHour (){
				let hour = [];
				let minHour = this.minHour;
				let maxHour = this.maxHour;
				for(let i=minHour;i<maxHour+1;i++){
					hour.push(i);
				}
				this.hour = hour;
			},
			sureTime (type){
				let option = {
					time: (this.activeHour<10?'0'+this.activeHour:this.activeHour)+':'+(this.activeMin<10?'0'+this.activeMin:this.activeMin),
					status: type
				};
				this.$emit('childChooseTime', option);
			},
			//get cur minutes
			getCurM() {
				var date = new Date();
				return date.getHours() * 60 + date.getMinutes();
			},
			//选择日期
			chooseTime (){
				const timePickerHour = this.$refs.timePickerHour;
				const timePickerMin = this.$refs.timePickerMin;
				this.chooseFn(timePickerHour, 'Hour');
				this.chooseFn(timePickerMin, 'Min');
			},
			chooseFn (obj, type){
				obj.addEventListener('scroll', (e)=>{
					const oneH = 30;
					let scrollTop = e.target.scrollTop;
					let index = index?index:Math.round(scrollTop/oneH);
					type == 'Hour' && (this['active'+type] = index+this.minHour);
					type == 'Min' && (this['active'+type] = index);
				})
			},
			initScrollTop (obj, index){
				const oneH = 30;
				this.$nextTick(function(){
					obj.scrollTop = oneH*index;
				})
			}
		}
	}
</script>
<style scoped>
	.time-picker{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,0.2);
	}
	.time-picker-con{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 240px;
		color: #808080;
		background: #ffffff;
	}
	.time-picker-btn{
		padding: 6px 8px;
		border-bottom: 1px solid #eae7e7;
		font-size: 12px;
	}
	.time-picker-btn>span:last-child{
		float: right;
		color: #ebce44;
	}
	.time-picker-time{
		position: relative;
		width: 100%;
		display: block;
		margin: auto;
		padding: 0;
		height: 100%;
	}
	.time-picker-time:before{
		content: ' ';
		position: absolute;
		top: 38.4%;
		left: 0;
		right: 0;
		background: #ebce44;
		height: 30px;
		z-index: -1;
	}
	.time-picker-time>div{
		position: relative;
		margin: 0;
		padding: 0;
		width: 49%;
		display: block;
		float: left;
		height: 210px;
		overflow: scroll;
		border-right:1px solid #c0c0c0;
	}
	.time-picker-time>div:last-child{
		border-right: none;
	}
	.time-picker-time>div>span.active{
		color: #ebce44;
	}
	.time-picker-time>div>p{
		margin: 0;
		padding: 0;
		height: 72px;
	}
	.time-picker-time>div>p.top{
		height: 74px;
	}
	.time-picker-time>div ul li{
		font-size: 14px;
		text-align: center;
		line-height: 30px;
		height: 30px;
		list-style: none;
	}
	.time-picker-time>div ul li.active{
		color: #ffffff;
	}
	.time-picker-hour li{
		position: relative;
	}
	.time-picker-hour li:before{
		content: ':';
		position: absolute;
		right: 8px;
	}
	.time-picker-hour li.active:before{
		color: #ffffff;
	}
</style>