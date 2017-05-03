<template lang="html">
	<div class="test">
		<h4>手机端裁剪demo</h4>
		<div>
			<input type="file" @change="chooseCropImg">
			<crop :crop-option="cropOption" :crop-show="cropShow"></crop>
		</div>
	</div>
</template>

<script>
	import crop from '../../components/crop/crop.vue'
	export default{
		data:()=>({
			cropOption: {
				show: false,
				ratio: '1:1',
				sourceSrc: ''
			},
			cropShow: false
		}),
		methods: {
			// 选择图片
			chooseCropImg (e){
				const file = e.target;
				const self = this;
				if(!file.files || !file.files[0]){
					return;
				}
				this.$emit('aaaaaa', 'asdfasdfasdf')
				this.cropOption.file = file.files[0];
				var reader = new FileReader();
				reader.onload = function(evt){
					self.cropOption.show = true;
					self.cropShow = true;
					self.cropOption.sourceSrc = evt.target.result;
					e.target.value = '';
				};
				reader.readAsDataURL(file.files[0]);
			}
		},
		components: {
			crop
		}
	}
</script>
<style>

</style>