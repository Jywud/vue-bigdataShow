<template>
	<div :id="id" class="chart-el"></div>
</template>
<script>
	// import echarts from 'echarts';
	import echarts from '../lib/echarts.min.js';

	export default {
		props: {
			id: {
				type: String,
				default: "main"
			},
			option: {
				type: Object,
				default(){
					return {};
				}
			}
		},
		data() {
			return {
				chart: null
			};
		},
		mounted () {
			this.chart = echarts.init(this.$el);
			this.chart.setOption(this.option);
		},
		watch: {
			option (newV, old) {
				this.chart.setOption(newV);
			}
		}
	}
</script>
<style lang="less">
	.chart-el{
		width: 100%;
		height: 100%;
	}
</style>