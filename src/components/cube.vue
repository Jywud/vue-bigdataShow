<template>
	<div class="cube-pic">
		<svg class="svg-cube" :viewBox="viewBox">
			<defs>
				<linearGradient :id="`colorCube${index}`" x1="0%" y1="0%" x2="0%" y2="100%" v-for="(item, index) of cubeData">
					<stop offset="0%" :style="{
						stopColor: item.color, 
						stopOpacity: 0
					}" />
					<stop offset="100%" :style="{
						stopColor: item.color, 
						stopOpacity: 0.6
					}" />
				</linearGradient>
			</defs>
			<g class="cube" v-for="(item, index) of cubeData" :transform="translates[index]" @click="clickFn(index, index%2 == 0? 1: 0)">
				<pillar
					:py="getY[index]"
					:value="item.value"
					:color="{
						top: {
							fill: item.color,
							stroke: item.color
						},
						ab: {
							fill: `url(#colorCube${index})`,
							stroke: item.color
						},
						cd: {
							fill: `url(#colorCube${index})`,
							stroke: item.color
						},
						ef: {
							fill: `url(#colorCube${index})`,
							stroke: 'none'
						},
						gh: {
							fill: `url(#colorCube${index})`,
							stroke: 'none'
						},
						bottom: {
							fill: item.color,
							stroke: item.color
						}
					}"
				></pillar>
				<text x="34" y="240" fill="#89ccff" text-anchor="middle" font-size="10">{{index%2 === 0? '正常节点': '故障节点'}}</text>
			</g>
		</svg>
	</div>
</template>
<script>

	import pillar from './pillar.vue';

	/**
	 * params: {
	 * 	cubeData: [
	 * 		{value, color}
	 * 	],
	 * 	translates: [
	 * 		'translate(0, 0)', ...
	 * 	],
	 * 	cubeViewBox: '0, 0, 310, 265'
	 * }
	 */
	export default {
		props: {
			cubeData: {
				type: Array,
				default () {
					return [];
				}
			},
			translates: {
				type: Array,
				default () {
					return [];
				}
			},
			viewBox: {
				type: String,
				default: ''
			}
		},
		computed: {
			getY () {
				return _.map(this.cubeData, item => {
					let min = Math.max(item.value/this.maxY, 0.03)
					return item.value > 0 ? Math.max(0.06, min) : 0.03;
				});
			},
			maxY () {
				let y = 0;
				_.map(this.cubeData, item => {
					if (item.value > y)
						y = item.value;
				});
				return y;
			}
		},
		data () {
			return {};
		},
		methods: {
			clickFn (idx, key) {
				this.$emit('clickFn', idx, key);
			}
		},
		components: {
			pillar
		}
	}

</script>
<style lang="less">
	.cube-pic{
		&, .svg-cube{
			width: 100%;
			height: 100%;
		}
		.cube{
			cursor: pointer;
		}
	}
</style>