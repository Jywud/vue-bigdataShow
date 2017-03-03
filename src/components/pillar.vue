<template>
	<g class="pillar">
		<text x="36" :y="200-y" fill="#fff" text-anchor="middle" font-size="16">{{value}}</text>
		<polygon class="top" :points="points.top" :fill="color.top.fill" fill-opacity="0.05" :stroke="color.top.stroke" stroke-width="0.7"></polygon>
		<polygon class="ab" :points="points.ab" :fill="color.ab.fill" :stroke="color.ab.stroke" stroke-width="0.7"></polygon>
		<polygon class="cd" :points="points.cd" :fill="color.cd.fill" :stroke="color.cd.stroke" stroke-width="0.7"></polygon>
		<polygon class="ef" :points="points.ef" :fill="color.ef.fill" :stroke="color.ef.stroke" stroke-width="0.7"></polygon>
		<polygon class="gh" :points="points.gh" :fill="color.gh.fill" :stroke="color.gh.stroke" stroke-width="0.7"></polygon>
		<polygon class="bottom" points="20,215 35,205 52,215 37,225" :fill="color.bottom.fill" :stroke="color.bottom.stroke" stroke-width="0.7"></polygon>
	</g>
</template>
<script>
	/**
	 * params: {
	 * 	py //高度百分比
	 * 	color: {
	 * 		top: {
				fill: '#fff',
				stroke: item.color
			},
			ab, cd, ef, gh, bottom
	 * 	}
	 * }
	 */
	export default {
		props: {
			value: Number,
			py: {
				type: Number,
				default: 0
			},
			color: {
				type: Object,
				default () {
					return {
						top: {},
						ab: {},
						cd: {},
						ef: {},
						gh: {},
						bottom: {}
					};
				}
			}
		},
		data () {
			return {
				y: 0
			};
		},
		computed: {
			points () {
				if (this.py === 0)
					return {
						top: '20,215 35,205 52,215 37,225',
						ab: '20,215 35,205 52,215 37,225',
						cd: '20,215 35,205 52,215 37,225',
						ef: '20,215 35,205 52,215 37,225',
						gh: '20,215 35,205 52,215 37,225'
					};
				return {
					top: `20,${215-this.y} 35,${205-this.y} 52,${215-this.y} 37,${225-this.y}`,
					ab: `20,${215-this.y} 37,${225-this.y} 38,225 20,215`,
					cd: `37,${225-this.y} 52,${215-this.y} 52,215 38,225`,
					ef: `35,${205-this.y} 52,${215-this.y} 52,215 35,205`,
					gh: `20,${215-this.y} 35,${205-this.y} 35,205 20,215`
				}
			}
		},
		methods: {
			update (value) {
				let vm = this;
			      function animate (time) {
					requestAnimationFrame(animate)
					TWEEN.update(time)
			      }
		            new TWEEN.Tween({ tween: vm.y })
		      		.easing(TWEEN.Easing.Linear.None)
		      		.onUpdate(function () { 
		      			vm.y = this.tween;
		      		})
		      		.to({ tween: value }, 1000)
		      		.start();
		      		animate();
			}
		},
		watch: {
			py (newValue, oldValue) {
				this.update(newValue * 140);
			}
		},
		mounted () {
			this.update(this.py * 140);
		}
	}

</script>
<style>

</style>