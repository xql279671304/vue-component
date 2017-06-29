<template>
	<transition name="time-picker">
		<div class="time-picker" v-show="show">
			<div class="time-picker-con">
				<div class="time-picker-btn">
					<span @click="sureTime('cancel')">取消</span>
					<span @click="sureTime">确定</span>
				</div>
				<div class="time">
					<div class="sec" ref="timePickerSec">
						<ul>
							<li :class="{active: curSec==1}">上午</li>
							<li :class="{active: curSec==2}">下午</li>
						</ul>
					</div>
					<div class="hour" ref="timePickerHour">
						<ul>
							<li v-for="H in hour" :key="H" :class="{active: curHour==H}">{{H}}</li>
						</ul>
					</div>
					<div class="min" ref="timePickerMin">
						<ul>
							<li v-for="M in 60" :key="M" :class="{active: curMin==M-1}">{{M-1<10?'0'+(M-1):(M-1)}}</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>
<script>
	import scheme from '../../assets/scheme.js'

	export default{
		props: {
			show: Boolean // true显示 false隐藏
		},
		data: ()=>({
			hour: 12,
			curSec: 1,
			curHour: 1,
			curMin: 1,
			chooseTime: null,
			hasEvent: false
		}),
		watch: {
			show () {
				if(this.show){
					this.initTime();
				}
			}
		},
		mounted (){

		},
		methods: {
			initTime (){
				const date = new Date();
				const timePickerSec = this.$refs.timePickerSec;
				const timePickerHour = this.$refs.timePickerHour;
				const timePickerMin = this.$refs.timePickerMin;
				const H = date.getHours();
				const M = date.getMinutes();
				if(H>12){
					this.curSec = 2;
					this.curHour = H-12;
				}else{
					this.curSec = 1;
					this.curHour = H;
				}
				this.curMin = M;
				this.$nextTick(function(){
					timePickerSec.scrollTop = (this.curSec-1)*30;
					timePickerHour.scrollTop = (this.curHour-1)*30;
					timePickerMin.scrollTop = this.curMin*30;
					if(this.hasEvent) return;
					this.hasEvent = true;
					this.addEvent(timePickerSec, 'curSec');
					this.addEvent(timePickerHour, 'curHour');
					this.addEvent(timePickerMin, 'curMin');
				})
			},
			addEvent (obj, name){
				const self = this;
				var st = '';
				scheme.bindEvent(obj, 'scroll', (e)=>{
					let target = e.target;
					let t = target.scrollTop;
					clearTimeout(st);
					st = setTimeout(function(){
						const num = Math.round(t/30);
						target.scrollTop = num*30;
						self[name] = name=='curMin'?num:num+1;
					}, 500);
					e.stopPropagation();
				})
				return true;
			},
			sureTime (type){
				if(type=='cancel'){
					this.$emit('timePickerData', {type: 'cancel'})
					return;
				}
				let m = this.curMin<10?'0'+this.curMin:this.curMin;
				if(this.curSec==2){
					this.chooseTime = (this.curHour+12)+':'+m;
				}else{
					this.chooseTime = this.curHour+' : '+m;
				}
				console.log(this.chooseTime)
				this.$emit('timePickerData', {type: 'sure', time: this.chooseTime})
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
		z-index: 9999;
	}
	.time-picker-con{
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		color: #808080;
		background: #ffffff;
	}
	.time-picker-btn{
		background: #363636;
		color: #ffffff;
		font-size: 0.24rem;
		display: flex;
		justify-content: space-between;
	}
	.time-picker-btn>span:last-child{
		color: #ebce44;
	}
	.time-picker-btn>span{
		display: block;
		padding: 0.2rem 0.1rem;
	}
	.time{
		display: flex;
		justify-content: center;
		background: #000000;
		color: #505050;
		position: relative;
		height: 210px;
		overflow: hidden;
	}
	.time .sec{
		height: 100%;
		overflow-y: auto;
	}
	.time .hour{
		padding: 0 0.2rem;
		overflow-y: auto;
	}
	.time .min{
		padding-left: 0.2rem;
		overflow-y: auto;
	}
	.time:before,
	.time:after{
		position: absolute;
		content: ' ';
		left: 0;
		width: 100%;
		height: 1px;
		background: #505050;
	}
	.time:before{
		top: 90px;
	}
	.time:after{
		top: 120px;
	}
	.time ul li{
		height: 18px;
		padding: 6px 0;
		font-size: 14px;
		text-align: center;
	}
	.time ul li.active{
		color: #ffffff;
	}
	.time .sec ul{
		height: 100%;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		align-content: center;
		padding: 15px 0;
	}
	.time .hour ul,
	.time .min ul{
		padding: 90px 0;
		width: 0.6rem;
	}
	.time .sec ul li{
		width:100%;
		font-size: 0.3rem;
	}
	.time .sec::-webkit-scrollbar,
	.time .hour::-webkit-scrollbar,
	.time .min::-webkit-scrollbar{
		width: 0;
		height: 0;
	}
	.time-picker-enter-active, .time-picker-leave-active {
		transition: all .3s ease;
		bottom: 0;
	}
	.time-picker-enter, .time-picker-leave-active {
		bottom: -100%;
	}
</style>