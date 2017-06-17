<template>
	<div class="date-picker" v-show="show"><!---->
		<div class="date-picker-con">
			<div class="date-picker-btn clearfix">
				<span @click="sureDate('cancel')">取消</span>
				<span @click="sureDate('sure')">确定</span>
			</div>
			<div class="date-picker-date">
				<div class="date-picker-year" ref="datePickerYear">
					<p class="top"></p>
					<ul>
						<li v-for="Y in rangeYear" :class="{active: activeYear==Y-1}">{{startYear+Y-1}}年</li>
					</ul>
					<p></p>
				</div>
				<div class="date-picker-month" ref="datePickerMonth">
					<p class="top"></p>
					<ul>
						<li v-for="M in 12" :class="{active: activeMonth==M}">{{M}}月</li>
					</ul>
					<p></p>
				</div>
				<div class="date-picker-day" ref="datePickerDay">
					<p class="top"></p>
					<ul>
						<li v-for="D in days" :class="{active: activeDay==D}">{{D}}日</li>
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
			datePickerOption: Object,
			show: Boolean
		},
		data (){
			return {
				rangeYear: 0,
				imgTag: '',
				activeYear: null,
				activeMonth: null,
				activeDay: null,
				days: '',
				startYear: '',
				chooseYear: '',
				chooseMonth: '',
				chooseDay: '',
				type: '',
				endYear: ''
			}
		},
		created (){

		},
		computed: {

		},
		watch:{
			show (){
				if(this.show){
					this.initDate();
				}
			}
		},
		methods: {
			initDate (){
				for(let i in this.datePickerOption){
					if(i=='chooseMonth'){
						this.activeMonth = this.datePickerOption[i];
						this.sumDays();
					}else if(i=='chooseDay'){
						this.activeDay = this.datePickerOption[i];
					}
					this[i] = this.datePickerOption[i];
				}
				if(!this.endYear){
					let date = new Date();
					this.endYear = date.getFullYear();
					this.rangeYear = this.endYear-this.startYear+1;
				}
				if(!this.startYear){
					this.startYear = 1980;
				}
				this.activeYear = this.chooseYear-this.startYear;

				this.$nextTick(function(){
					if(this.chooseYear-this.startYear>0){
						this.initScrollTop(this.$refs.datePickerYear, this.activeYear);
					}
					if(this.chooseMonth>0){
						this.initScrollTop(this.$refs.datePickerMonth, this.chooseMonth-1);
					}
					if(this.chooseDay>0){
						this.initScrollTop(this.$refs.datePickerDay, this.chooseDay-1);
					}
					this.chooseDate();
				})
			},
			//计算月多少天
			sumDays (){
				let month = this.chooseMonth;
				let day = this.chooseDay;
				let year = this.chooseYear;
				let bM = [1,3,5,7,8,10,12];
				if(month!=2){
					if(bM.indexOf(month)>-1){
						this.days = 31;
					}else{
						this.days = 30;
					}
				}else{
					if(!(year%400)){
						this.days = 29;
					}else if(year%100&&!(year%4)){
						this.days = 29;
					}else{
						this.days = 28;
					}
				}
				if(day>this.days){
					this.chooseDay = this.days;
				}
			},
			// 确定 取消
			sureDate (status){
				let date = '';
				date = this.chooseYear+'-'+(this.chooseMonth<10?'0'+this.chooseMonth*1:this.chooseMonth)+'-'+(this.chooseDay<10?'0'+this.chooseDay*1:this.chooseDay);
				let option = {
					type: this.datePickerOption.type,
					date: date,
					status: status
				};
				this.$emit('childChooseDate', option);
			},
			//选择日期
			chooseDate (){
				const datePickerYear = this.$refs.datePickerYear;
				const datePickerMonth = this.$refs.datePickerMonth;
				const datePickerDay = this.$refs.datePickerDay;
				this.chooseFn(datePickerYear, 'Year');
				this.chooseFn(datePickerMonth, 'Month');
				this.chooseFn(datePickerDay, 'Day');
			},
			chooseFn (obj, type){
				var st = '';
				const oneH = 30;
				obj.addEventListener('scroll', (e)=>{
					clearTimeout(st);
					st = setTimeout(()=>{
						const target = e.target;
						let scrollTop = target.scrollTop;
						let index = index?index:Math.round(scrollTop/oneH);
						this['active'+type] = index;
						type=='Year' && (this['choose'+type] = this.startYear+index);
						type!='Year' && (this['active'+type] = index+1);
						type!='Year' && (this['choose'+type] = index+1);
						target.scrollTop = index*oneH;
						if(type=='Month'||type=='Year'){
							this.sumDays();
						}
					}, 500)
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
	ul{
		margin: 0;
		padding: 0;
	}
	ul li{
		list-style: none;
	}
	.date-picker{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,0.8);
		z-index: 999;
		font-size: 0.24rem;
	}
	.date-picker-con{
		background: #ffffff;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 240px;
		font-size: 0.24rem;
	}
	.date-picker-btn{
		color: #808080;
		padding: 10px 8px;
		border-bottom: 1px solid #eae7e7;
	}
	.date-picker-btn>span{
		color: #808080;
		display: block;
		float: left;
		font-size: 0.24rem;
		cursor: pointer;
	}
	.date-picker-btn>span:last-child{
		display: block;
		float: right;
		color: #ebce44;
	}
	.date-picker-date{
		position: relative;
		width: 100%;
		display: block;
		margin: auto;
		padding: 0;
		height: 100%;
	}
	.date-picker-date:before{
		content: ' ';
		position: absolute;
		top: 38.4%;
		left: 0;
		right: 0;
		background: #ebce44;
		height: 30px;
		z-index: -1;
	}
	.date-picker-date>div{
		position: relative;
		margin: 0;
		padding: 0;
		width: 33%;
		display: block;
		float: left;
		height: 203px;
		overflow: scroll;
		border-right:1px solid #c0c0c0;
	}
	.date-picker-date>div:last-child{
		border-right: none;
	}
	.date-picker-date>div:first-child{
		width: 33%;
	}
	.date-picker-date>div>span.active{
		color: #ebce44;
	}
	.date-picker-date>div ul{

	}
	.date-picker-date>div>p{
		margin: 0;
		padding: 0;
		height: 80px;
	}
	.date-picker-date>div>p.top{
		height: 90px;
	}
	.date-picker-date>div ul li{
		font-size: 14px;
		text-align: center;
		line-height: 30px;
		height: 30px;
	}
	.date-picker-date>div ul li.active{
		color: #ffffff;
	}
</style>