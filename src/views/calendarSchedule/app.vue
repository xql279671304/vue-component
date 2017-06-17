<template>
	<div>
		<h1>横版日历，日期安排，适合手机端</h1>
		<p>选择的日期：{{date}}</p>
		<schedule-calendar v-on:scheduleDate="scheduleDate"></schedule-calendar>
	</div>
</template>
<script>
	import scheduleCalendar from '../../components/calendarSchedule/scheduleCalendar.vue'
	export default{
		data: ()=>({
			date: null
		}),
		methods: {
			scheduleDate (data){
				this.date = data.date;
			}
		},
		components: {
			scheduleCalendar
		}
	}
</script>
<style>
	@import "../../assets/style.css";
	body{
		margin: 0;
		padding: 0;
		font-size: 0.2rem;
	}
</style>