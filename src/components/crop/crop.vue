<template lang="html">
	<div>
		<img class="crop-img" :src='cropImg'>
		<div class="crop" v-show="cropOption.show">
			<div class="crop-con" ref="cropCon">
				<img ref="sourceImg" :src="cropOption.sourceSrc" style="display: none;">
				<div>
					<div class="crop-cover top"></div>
					<div class="crop-cover bottom"></div>
					<div class="crop-cover left"></div>
					<div class="crop-cover right"></div>
					<canvas class="crop-canvas" ref = "cropCanvas"></canvas>
				</div>
			</div>
			<div class="crop-btn">
				<span @click="cropOption.show=false">取消</span>
				<span class="sure-crop">完成</span>
			</div>
		</div>
		<div class="print">
			<span @click="print=!print">print</span>
			<div v-show="print" class="sole-style"></div>
		</div>
		<span @click="showCropImg" style="position: absolute;width:50px;height:20px;text-align: center;top:10px;right: 10px;color: red;z-index: 99999;">关闭</span>
	</div>
</template>
<script>
import ImagesZoom from './scale'

export default {
	props: {
		cropOption: Object,
		cropShow: Boolean
	},
	data: () => ({
		print: true,
		cropImg: ''
	}),
	watch: {
		'cropShow'(obj) {
			if (obj) {
				const self = this;
				ImagesZoom.init({
					elem: this.$refs.sourceImg,
					elemCanvas: this.$refs.cropCanvas,
					ratio: this.cropOption.ratio,
					imgType: this.cropOption.file.type,
					cropper: function (obj) {
						console.log(obj)
						self.cropImg = obj.crop.elem.toDataURL(obj.imgType);
					}
				});
			}
		}
	},
	methods: {
		showCropImg (){
			if(this.$refs.cropCon.style.display=='none'){
				this.$refs.cropCon.style.display = 'block';
			}else{
				this.$refs.cropCon.style.display = 'none';
			}
		}
	}
}
</script>
<style>
.crop {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 100;
	width: 100%;
	height: 100%;
	background: #ffffff;
}

.crop-con {
	width: 100%;
	height: 100%;
	position: absolute;
	left: 0;
	top: 0;
	overflow: hidden;
}

.crop-con>img {
	position: absolute;
	width: 100%;
	max-width: none;
	top: 50%;
	left: 0;
}

.crop-cover {
	position: fixed;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.6);
	z-index: 9;
}

.crop-cover.top,
.crop-cover.bottom {
	width: 100%;
}

.crop-cover.right,
.crop-cover.left {
	width: 0;
}

.crop-cover.top {
	top: 0;
	/*background: url("./crop_bg_01.png") no-repeat;
		background-size: 100%;*/
}

.crop-cover.bottom {
	bottom: 0;
	/*background: url("./crop_bg_03.png") no-repeat;
		background-size: 100%;*/
}

.crop-cover.right {
	right: 0;
	/*background: url("./crop_bg_04.png") no-repeat;
		background-size: 100% 100%;*/
}

.crop-cover.left {
	left: 0;
	/*background: url("./crop_bg_02.png") no-repeat;
		background-size: 100% 100%;*/
}

.crop-canvas {
	position: absolute;
	z-index: -1;
	/*background: red;*/
}

.crop-btn {
	position: fixed;
	bottom: 0px;
	left: 0;
	width: 100%;
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-pack: end;
	-ms-flex-pack: end;
	justify-content: space-between;
	background: #000;
	z-index: 99;
}

.crop-btn>span {
	color: #ffffff;
	padding: 8px 20px;
	align-items: flex-start;
	font-size: 0.3rem;
}

/*裁剪的图片*/
.crop-img{
	position: absolute;
	top: 20px;
	left: 20px;
	width: 80%;
	z-index: 999;
}
/**
	打印的样式
	 */

.print {
	position: fixed;
	right: 0;
	bottom: 36px;
	background: #000000;
	z-index: 999;
	color: #fff;
	font-size: 12px;
}

.print>span {
	width: 30px;
	display: inline-block;
	height: 20px;
	background: #fff;
	color: #000;
	text-align: center;
}

.sole-style {
	position: relative;
	width: 200px;
	height: 200px;
	overflow: auto;
}
</style>
