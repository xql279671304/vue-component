<template>
	<div>
		<h1>横版日历，日期安排，适合手机端</h1>
		<schedule-calendar></schedule-calendar>
	</div>
</template>
<script>
	import scheduleCalendar from '../../components/calendarSchedule/scheduleCalendar.vue'
	export default{
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