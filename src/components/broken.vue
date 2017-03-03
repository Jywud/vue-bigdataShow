<template>
	<div class="broken-line">
		<div class="broken-tabs">
			<a :class="{'icon-circle-rect': time == 'day'}" @click="clickTimeFn('day')">最近1小时</a>
			<a :class="{'icon-circle-rect': time == 'now'}" @click="clickTimeFn('now')">实时</a>
		</div>
		<svg class="broken" viewBox="0 -35 570 160">
			<defs>
				<clipPath :id="`${type}-clip`">
					<rect x="0" y="-5" :width="w" height="170" />
				</clipPath>
				<linearGradient :id="`${type}${index}`" x1="0%" y1="0%" x2="0%" y2="100%" v-for="(item, index) of color">
					<stop offset="0%" :style="{
						stopColor: item[0].color, 
						stopOpacity: item[0].opacity
					}" />
					<stop offset="100%" :style="{
						stopColor: item[1].color, 
						stopOpacity: item[1].opacity
					}" />
				</linearGradient>
			</defs>
			<g class="scope-line" :clip-path="`url(#${type}-clip)`">
				<polyline v-for="(point, index) of points" 
					:points="point"
					:style="{
						fill: 'none',
						stroke: color[index][0].color,
						strokeWidth: 2
					}"/>
				<path v-for="(item, index) of color" :d="pathD[index]" :fill="`url(#${type}${index})`"></path>
			</g>
			<g class="scope-bg">
				<line v-for="n of 5" class="svg-row" x1="60" :y1="160-(n-1)*40" x2="540" :y2="160-(n-1)*40" style="stroke: #eee; stroke-width: 0.2"></line>
				<line v-for="(col, index) of cols" class="svg-col" :x1="8*col*(time == 'now' ? 1 : 5)+60" y1="0" :x2="8*col*(time == 'now' ? 1 : 5)+60" y2="160" :stroke= "showNo == index ? '#fff': '#eee'" :stroke-width= "showNo == index ? 1: 0.2"></line>
				<text v-for="col of cols" :x="8*col*(time == 'now' ? 1 : 5)+63" y="175" :dx="-col.toString().length*5" fill="#87ccff" style="font-size: 10px;">{{col}}</text>
				<text v-for="n of 5" :x="getX(n)" :y="165-(n-1)*40" fill="#87ccff" style="font-size: 10px;">{{rows[n-1]}}</text>
				<text x="56" y="-15" fill="#87ccff" style="font-size: 10px;">{{unit}}</text>
			</g>
			<g class="broken-circle" v-for="(point, index) of points" :clip-path="`url(#${type}-clip)`">
				<circle v-for="(coord, idx) of point.split(' ')" r="3" stroke-width="2" fill="#3d4a6d" 
					:class="{
						'circle-point': true,
						'able': idx == showNo
					}" 
					:cx="coord.split(',')[0]" 
					:cy="coord.split(',')[1]" 
					:stroke="color[index][0].color" 
				></circle>
			</g>
		</svg>
		<div class="broke-mark">
			<div class="mark-content" v-show="showNo > -1" :style="{
					left: markLeft,
					right: markRight
				}">
				<div><div class="label">时&nbsp;&nbsp;&nbsp;间:</div> {{showTime | format("hh:mm:ss")}}</div>
				<div class="write"><div class="label">写速度:</div> {{showWrite | formatBrokenUnit}}</div>
				<div class="read"><div class="label">读速度:</div> {{showRead | formatBrokenUnit}}</div>
			</div>
			<div class="mark-item lt" v-for="n of 13" @mouseover="overFn(n)" @mouseleave="leaveFn"></div>
		</div>
	</div>
</template>
<script>
	
	/**
	 * params: {
	 * 	brokenData: [
	 * 		[{time, value}, ...],
	 * 		[{time, value}, ...]
	 * 	]
	 * }
	 */
	export default {
		props: {
			brokenData: {
				type: Array,
				default () { return [
					[],
					[]
				];}
			},
			color: {
				type: Array,
				default () { return []; }
			},
			type: {
				type: String,
				default: 'color'
			}
		},
		data () {
			return {
				w: 0,
				showNo: -1,
				markLeft: -999,
				markRight: false,
				isInit: false,
				time: 'now',
				max: 0
			};
		},
		computed: {
			speeds () {
				let obj = {};
				function getArr (arr) {
					return arr.length ? _.map(arr, item => {
						return {
							time: item.time,
							value: item.value
						};
					}) : _.times(13, _idx => {
						return {
							time: '',
							value: ''
						}
					});
				}
				_.map(this.brokenData, (arr, idx) => {
					if (idx) 
						obj.read = getArr(arr);
					else 
						obj.write = getArr(arr);
				});
				return obj;
			},
			showTime () {
				if (this.showNo === -1 || !this.speeds.read)
					return '';
				return new Date(this.speeds.read[this.showNo].time);
			},
			showWrite () {
				if (this.showNo === -1 || !this.speeds.write)
					return '';
				return this.speeds.write[this.showNo].value;
			},
			showRead () {
				if (this.showNo === -1 || !this.speeds.read)
					return '';
				return this.speeds.read[this.showNo].value;
			},
			unit () {
				return '速率';
			},
			points () {
				return _.map(this.brokenData, data => {
					return this.getPoint(data);
				});
			},
			pathD () {
				let vm = this;
				if (vm.points.length)
					return _.map(vm.points, (point, index) => {
						if (index === vm.points.length-1) 
							return `M60, 0 L${point.split(' ').join(' L')} L540, 160 L60, 160`;
						return `M60, 0 L${point.split(' ').join(' L')} L${vm.points[index+1].split(' ').reverse().join(' L')}`;
					});
				return '';
			},
			rows () {
				if (this.max > 1000*1024*1024)
					return [0, '10k', '500k', '1M', (this.max/(1024*1024)).toFixed(0)+'M'];
				return [0, '10k', '500k', '1M', '1000M'];
			},
			cols () {
				switch (this.time) {
					case 'now':
						return _.times(13, i => i * 5);
					case 'day':
						return _.times(13, idx => idx);
				}
			}
		},
		methods: {
			getX (n) {
				switch (n) {
					case 1:
						return 45;
					case 2:
						return 34;
					case 3:
						return 28;
					case 4:
						return 36;
					case 5:
						return 18;
				}
			},
			getY (value) {
				if (value >= 0 && value <= 10*1024)
					return value / (10*1024) * 40;
				if (value > 10 && value <= 500*1024 )
					return (value-10*1024) / (500*1024-10*1024) * 40 + 40;
				if (value > 500*1024 && value <= 1024*1024)
					return (value-500*1024) / (1024*1024-500*1024) * 40 + 80;
				if (value > 1024*1024 && value <= 1024*1024*10)
					return (value-1024*1024) / (10*1024*1024-1024*1024) * 20 + 120;
				if (value > 10*1024*1024 && value <= 1024*1024*100)
					return (value-10*1024*1024) / (100*1024*1024-10*1024*1024) * 10 + 130;
				if (value > 100*1024*1024 && value <= 1024*1024*1000)
					return (value-100*1024*1024) / (1000*1024*1024-100*1024*1024) * 10 + 140;
				return (value-1000*1024*1024) / (this.max-1000*1024*1024) * 10 + 150;
			},
			getPoint (arr) {
				return _.map(arr, (point, idx) => {
					return `${idx * 40+60},${160 - this.getY(point.value)}`;
				}).join(' ');
			},
			clickTimeFn (key) {
				this.time = key;
				this.isInit = false;
				this.$emit('editTime', key);
			},
			init () {
				let vm = this;
			      function animate (time) {
					requestAnimationFrame(animate)
					TWEEN.update(time)
			      }
			      if (!vm.isInit) {
				      new TWEEN.Tween({ tween: 0 })
						.easing(TWEEN.Easing.Linear.None)
						.onUpdate(function () { 
							vm.w = this.tween;
						})
						.to({ tween: 545 }, 1500)
						.start();
				      animate();
					vm.isInit = true;
				}
			},
			overFn (n) {
				this.showNo = n -1;
				let width = event.target.clientWidth;
				if (n === 1) {
					this.markLeft = '-20px';
					return this.markRight = width*13-180 + 'px';
				}
				if (n === 12 || n === 13) {
					this.markLeft = width*13-160 + 'px';
					return this.markRight = 0;
				}
				if (n <= 8) {
					this.markLeft = width * n - 80 + 'px';
					return this.markRight = false;					
				}
				if (n > 8 & n < 13) {
					this.markLeft = width * (n-4) +70 + 'px';
					return this.markRight = false;					
				}
			},
			leaveFn () {
				this.showNo = -1;
			}
		},
		watch: {
			brokenData (newValue, oldValue) {
				this.max = 0;
				_.forEach(this.brokenData, arr => {
					_.forEach(arr, point => {
						if (!this.max)
							this.max = point.value;
						this.max = Math.max(this.max, point.value);
					});
				});
				this.init();
			}
		},
		mounted () {
			this.init();
		}
	}
</script>
<style lang="less">
	.broken-line{
		width: 100%;
		height: 100%;
		position: absolute;
		.broken-tabs{
			position: absolute;
			right: 20px;
			top: 75px;
			height: 24px;
			width: 180px;
			z-index: 30;
			.icon-circle-rect{
				color: #00c6ff;
			}
			&>*{
				color: #fff;
				width: 84px;
				line-height: 24px;
				text-align: center;
				display: inline-block;
				font-size: 12px;
				cursor: pointer;
			}
		}
		.broken{
			width: 100%;
			height: 100%;
			transition: all 1s ease;
			position: absolute;
			z-index: 10;
		}
		.circle-point{
			display: none;
			&.able{
				display: block;
			}
		}
		.broke-mark{
			position: absolute;
			z-index: 40;
			top: 35%;
			left: 8%;
			right: 2%;
			bottom: 30px;
			.mark-content{
				position: absolute;
				width: 160px;
				height: 64px;
				top: -64px;
				border-radius: 5px;
				background: rgba(4, 31, 51, 0.8);
				color: #fff;
				font-size: 12px;
				padding: 8px;
				&>div{
					margin: 3px 4px;
					&.write{
						color: #ff5585;
					}
					&.read{
						color: #03d09d;
					}
					.label{
						display: inline-block;
						width: 40px;
						color: #fff;
					}
				}
			}
			.mark-item{
				width: 7.65%;
				height: 100%;
			}
		}
	}
</style>