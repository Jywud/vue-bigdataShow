<template>
	<svg class="pie">
		<circle cx="90" cy="90" r="84" class="arc" stroke-width="6"  fill="none" v-for="(pie, index) of pieData" 
			:stroke-dasharray="`${Math.floor(pie.value / all * 528)} 528`"
			:style="{transform: `rotate(${index === 0 ? -90: deg[index-1]}deg)`}"
			:stroke="`${pie.color}`"
		></circle>
	</svg>
</template>
<script>
	
	/**
	 * params: {
	 * 	pieData: [
	 * 		{value, color}
	 * 	]
	 * }
	 */
	export default {
		props: {
			pieData: {
				type: Array,
				default () {
					return [];
				}
			}
		},
		data () {
			return {};
		},
		computed: {
			all () {
				let total = 0;
				_.map(this.pieData, obj => {
					total += obj.value;
				});
				return total || 1;
			},
			deg () {
				let init = -90;
				return _.map(this.pieData, (obj, idx) => {
					init += Math.ceil(obj.value / this.all * 360);
					return init;
				});
			}
		}
	}

</script>
<style lang="less">
	.pie{
		width: 100%;
		height: 100%;
		.arc{
			transition: all 1s linear;
			transform-origin: 90px 90px;
		}
	}
</style>