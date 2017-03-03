<template>
	<div class="progress">
		<div class="progress-title">{{title}}</div>
		<div class="progress-bg"></div>
		<div class="progress-bar" :style="{width: `${percent}%`}"></div>
		<div class="progress-text">
			<div class="lt">空间总数 {{all}} TB, 使用 {{used}} TB</div>
			<div class="rt">使用率 {{percent}}%</div>
		</div>
	</div>
</template>
<script>
	
	export default {
		props: {
			title: {
				type: String,
				default: ''
			},
			used: {
				type: Number,
				default: 0
			},
			all: {
				type: Number,
				default: 1
			}
		},
		data () {
			return {};
		},
		computed: {
			percent () {
				let all = this.all || 1;
				return (this.used / all * 100).toFixed(1);
			}
		}
	}

</script>
<style lang="less">
	.progress{
		width: 100%;
		height: 60px;
		position: relative;
		.progress-title, .progress-text{
			font-size: 12px;
			color: #7bc9ff;
			height: 12px;
		}
		.progress-bg, .progress-bar{
			position: absolute;
			left: 0;
		}
		.progress-bg{
			width: 100%;
			background: #082539;
			border-top: 1px solid #0c3653;
			border-bottom: 1px solid #254861;
			top: 25px;
			height: 8px;
		}
		.progress-bar{
			top: 26px;
			height: 6px;
			background: #19ffdc;
			transition: all 1.5s ease-in-out;
		}
		.progress-text{
			position: absolute;
			left: 0;
			right: 0;
			top: 50px;
		}
	}
</style>