<template>
	<div class="grid-html">
		<gridProgress v-if="type == 'dropdown'"
			:used="params.used"
			:all="params.all"
		></gridProgress>
		<div class="grid-flow" v-if="type == 'up-down'">
			<div class="flow-up">
				<span class="icon-flow-up"></span> {{getFlowUnit(params.up)}}
			</div>
			<div class="flow-down">
				<span class="icon-flow-down"></span> {{getFlowUnit(params.down)}}
			</div>
		</div>
		<div v-if="type == 'node-status'" :class="{'higher': params == 0}">{{params | getNodeStatus}}</div>
	</div>
</template>
<script>

	import gridProgress from '../grid-progress.vue';

	let BIn = {
	    "G" : 1024*1024*1024,
	    "M" : 1024*1024,
	    "K" : 1024
	};

	export default {
		props: {
			type: String,
			params: null
		},
		data () {
			return {};
		},
		methods: {
			getFlowUnit (value) {
				value= value*1;
				if(value/BIn.G>1){
				    return (Math.round(100*value/BIn.G)/100).toFixed(2) + " Gbps";
				}else if(value/BIn.M>1){
				    return (Math.round(100*value/BIn.M)/100).toFixed(2) + " Mbps";
				}else if(value/BIn.K>1){
				    return (Math.round(100*value/BIn.K)/100).toFixed(2) + " Kbps";
				}else{
				    return value.toFixed(2) + "bps";
				}
			}
		},
		components: {
			gridProgress
		}
	}
</script>
<style lang="less">
	.grid-html{
		position: relative;
		width: 100%;
		height: 100%;
		.grid-flow{
			width: 100%;
			height: 100%;
		}
		.flow-up, .flow-down{
			width: 90px;
			height: 100%;
			display: inline-block;
		}
		.icon-flow-up, .icon-flow-down{
			vertical-align: middle;
		}
		.higher{
			color: #ff3939;
		}
	}
</style>