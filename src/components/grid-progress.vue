<template>
	<div class="grid-progress">
		<div class="position-left">
			<div :class="{'box': true, 'bright': (used/all) >= 0.8}" :style="{'width': precent}"></div>
			<div class="text">{{used}}/{{all}}</div>
		</div>
		<div class="position-right">{{precent}}</div>
	</div>
</template>
<script>
	export default {
		props: {
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
			precent () {
				if (this.all == 0)
					return '0%';
				return (this.used/this.all*100).toFixed(0)+"%";
			}
		}
	}
</script>
<style lang="less">
	.grid-progress{
		width: 100%;
		height: 100%;
		max-width: 190px;
		position: relative;
		.position-left{
			position: absolute;
			left: 0;
			top: 10px;
			bottom: 10px;
			right: 36px;
			background: rgba(0, 0, 0, 0.3);
			.text, .box{
				position: absolute;
				top: 0;
				bottom: 0;
				left: 0;
				text-align: right;
			}
			.text{
				right: 8px;
				color: #dbefff;
				line-height: 14px;
			}
			.box{
				background: #00e7c4;
			}
			.bright{
				background: #f16060 !important;
			}
		}
		.position-right{
			position: absolute;
			right: 5px;
			width: 30px;
			text-align: center;
		}
	}
</style>