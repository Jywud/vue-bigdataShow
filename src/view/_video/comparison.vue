<template>
	<div id="body" class="comparison">
		<div class="grid-box">
			<div class="title">录像比对</div>
			<div class="grid-content">
				<div class="show-start">{{new Date(start) | format('yyyy-MM-dd hh:mm:ss')}}</div>
				<div class="show-over">{{new Date(over) | format('yyyy-MM-dd hh:mm:ss')}}</div>
				<div class="space-content">
					<Space v-for="item of items"
						:id="item.id"
						:show="item.show"
						:name="item.name"
						:details="item.detail"
						:checked="checked"
						:startTime="start"
						:overTime="over"
						@showFrag="showFn"
					></Space>
				</div>
				<div class="legend">
					<span class="normal"></span>
					<span>正常录像</span>
					<span class="trouble"></span>
					<span>故障录像</span>
				</div>
				<div class="shaft-content">
					<Shaft
						:startTime="startTime"
						:overTime="overTime"
						@changeTime="changeTimeFn"
					></Shaft>
				</div>
			</div>
		</div>
	</div>
</template>
<script>

	import Space from '../../components/space.vue';
	import Shaft from '../../components/shaft.vue';

	export default {
		data () {
			return {
				checked: -1,
				items: [],
				startTime: 0,
				overTime: 0,
				start: 0,
				over: 0,
				init: false
			};
		},
		methods: {
			changeTimeFn (start, over) {
				this.start = start;
				this.over = over;
			},
			showFn (id) {
				_.forEach(this.items, item => {
					item.show = true;
					if (item.id != id)
						item.show = false;
				});
			}
		},
		components: {
			Space,
			Shaft
		},
		mounted () {
			UCS.VideoManger('getComparisonVideo', {ids: _.map(this.$store.state.shopData, item => item.id)}, result => {
				_.forEach(result, item => {
					if (item.detail && item.detail.length)
						item.detail.sort(function(a, b) {
							return a.beginTime - b.beginTime;
						});
					_.forEach(item.detail, detail => {
						if (!this.init) {
							this.startTime = detail.beginTime;
							this.overTime = detail.endTime;
							this.init = true;
						}
						this.startTime = Math.min(this.startTime, detail.beginTime);
						this.overTime = Math.max(this.overTime, detail.endTime);
					});
					item.show = false;
				})
				this.items = result;
				this.start = this.startTime;
				this.over = this.overTime;
			});
		}
	}
</script>
<style lang="less">
	.comparison{
		.space-content{
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 165px;
			overflow-y: auto;
		}
		.legend{
			bottom: 140px;
		}
		.shaft-content{
			position: absolute;
			bottom: 30px;
			left: 100px;
			right: 100px;
			height: 100px;
			text-align: center;
		}
		.show-start, .show-over, .show-now{
			position: absolute;
			top: -18px;
			color: #fff;
			font-size: 12px;
		}
		.show-start{
			left: 5%;
		}
		.show-over{
			right: -10px;
		}
	}
</style>