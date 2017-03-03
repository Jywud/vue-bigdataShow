<template>
	<div class="shaft">
		<div class="tab">
			<div :class="{'icon-circle-normal': active != 'day', 'icon-circle-rect': active == 'day'}" @click="checkTab('day')">天</div>
			<div :class="{'icon-circle-normal': active != 'hour', 'icon-circle-rect': active == 'hour'}" @click="checkTab('hour')">小时</div>
			<div :class="{'icon-circle-normal': active != 'minute', 'icon-circle-rect': active == 'minute'}" @click="checkTab('minute')">分钟</div>
		</div>
		<div :class="{
			'prev-time': true,
			'icon-dis-prev-time': begin == 0,
			'icon-prev-time': !prevHover && begin > 0,
			'icon-prev-time-hover': prevHover
		}" @click="prevFn" @mouseover="begin > 0 ? (prevHover = true) : ''" @mouseleave="prevHover = false"></div>
		<div class="start-time">
			<DatePicker 
				type="datetime"
			      v-model="startDate"
			      @change="changeStartFn"
			></DatePicker>
			<div class="text">{{format(new Date(start))}}</div>
		</div>
		<div class="timer">
			<div class="timer-bg"></div>
			<div class="timer-begin" @mousedown="downFn('begin')" @mouseup="upFn()"
				:style="{'left': `${(begin/length*100).toFixed(2)}%`}">
				<div class="icon-anchor"></div>
				<div class="border"></div>
				<div class="timer-date" :style="{'left': position}">{{beginTime}}</div>
			</div>
			<div class="timer-choose" @mousedown="downFn('choose')" @mouseup="upFn()"
				:style="{
					'width': `${((end-begin)/length*100)}%`,
					'left': `${(begin/length*100).toFixed(2)}%`
				}"
			></div>
			<div class="timer-end" @mousedown="downFn('end')" @mouseup="upFn()"
				:style="{'left': `${(end/length*100).toFixed(2)}%`}">
				<div class="icon-anchor"></div>
				<div class="border"></div>
				<div class="timer-date" :style="{'right': position}">{{endTime}}</div>
			</div>
		</div>
		<div class="end-time">
			<DatePicker 
				type="datetime"
			      v-model="overDate"
			      @change="changeOverFn"
			></DatePicker>
			<div class="text">{{format(new Date(over))}}</div>
		</div>
		<div :class="{
			'next-time': true,
			'icon-dis-next-time': end == length,
			'icon-next-time': !nextHover && end < length,
			'icon-next-time-hover': nextHover
		}" @click="nextFn" @mouseover="end < length ? (nextHover = true) : ''" @mouseleave="nextHover = false"></div>
	</div>
</template>
<script>

	import EventListener from '../lib/eventListener.js';
	import {DatePicker} from 'element-ui';
	import {format} from '../filters.js';

	export default {
		props: {
			startTime: {
				type: Number,
				default: 0
			},
			overTime: {
				type: Number,
				default: 0
			}
		},
		data () {
			return {
				prevHover: false,
				nextHover: false,
				picker: {
					readonly: true
				},
				active: '',
				allow: false,
				key: null,
				parentLeft: 0,
				length: 1,
				mouse: 0,
				begin: 0,
				end: 0,
				beginPoint: 0,
				endPoint: 0,
				width: 0,
				start: 0,
				over: 0,
				startDate: 0,
				overDate: 0
			};
		},
		computed: {
			position () {
				let x = this.end - this.begin;
				return x < 130 ? x/2-130+'px': '-65px';
			},
			beginDate () {
				return this.begin / this.length * (this.over - this.start) + this.start;
			},
			beginTime () {
				return format(new Date(this.beginDate), 'yyyy-MM-dd hh:mm:ss');
			},
			endDate () {
				return this.end / this.length * (this.over - this.start) + this.start;
			},
			endTime () {
				if (this.active == 'day')
					return format(new Date(this.beginDate+24*60*60*1000), 'yyyy-MM-dd hh:mm:ss');
				if (this.active == 'hour')
					return format(new Date(this.beginDate+60*60*1000), 'yyyy-MM-dd hh:mm:ss');
				if (this.active == 'minute')
					return format(new Date(this.beginDate+60*1000), 'yyyy-MM-dd hh:mm:ss');
				return format(new Date(this.endDate), 'yyyy-MM-dd hh:mm:ss');
			}
		},
		methods: {
			format (date) {
				return format(new Date(date), 'yyyy-MM-dd hh:mm:ss');
			},
			checkTab (key) {
				// event.stopPropagation();
				let length = this.over - this.start;
				let width = 0;
				if (key == 'day') 
					width = Math.min((24*60*60*1000 / length * this.length).toFixed(2), this.length);
				 else if (key == 'hour') 
				 	width = Math.min((60*60*1000 / length * this.length).toFixed(2), this.length);
				 else 
				 	width = Math.min((60*1000 / length * this.length).toFixed(2), this.length);
				 if (width < 11) 
				 	return this.$store.commit('alertShow', '起止时间范围太大, 请重新选择');
				this.begin = 0;
				this.active = key;
				this.end = width;
				this.upFn();
			},
			downFn (key) {
				event.stopPropagation();
				this.allow = true;
				let el = this.$el;
				this.begin =  el.clientWidth/ this.length * this.begin;
				this.end = el.clientWidth / this.length * this.end;
				this.length = el.clientWidth;
				this.parentLeft = 0;
				while (el) {
					this.parentLeft += el.offsetLeft;
					el = el.parentElement;
				}
				this.key = key;
			},
			upFn () {
				this.allow = false;
				this.beginPoint = 0;
				this.endPoint = 0;
				this.width = 0;
				this.$emit('changeTime', this.beginDate, this.endDate);
			},
			getLeft () {
				let left = this.mouse - this.parentLeft;
				if (this.key != 'choose')
					this.active = '';
				if (this.key == 'begin') 
					return this.begin = Math.max(Math.min(left, this.end-11), 0);
				 else if (this.key == 'end')
					return this.end = Math.min(Math.max(this.begin+11, left), this.length);
				if (this.begin == 0 && this.end == this.length)
					return;
				if (!this.beginPoint)
					this.beginPoint = left - this.begin;
				if (!this.endPoint)
					this.endPoint = this.end - left;
				if (!this.width)
					this.width = this.end - this.begin;
				this.begin = Math.min(Math.max(left - this.beginPoint, 0), this.length - this.width);
				this.end = Math.max(Math.min(left + this.endPoint, this.length), this.width);
			},
			changeStartFn (date) {
				let time = new Date(date).getTime();
				this.active = '';
				if (time >= this.over)
					return this.startDate = new Date(this.startTime);
				this.begin = 0;
				this.end = this.length;
				if (time != this.start)
					this.start = time;
				this.upFn();
			},
			changeOverFn (date) {
				let time = new Date(date).getTime();
				this.active = '';
				if (time <= this.start)
					return this.overDate = new Date(this.overTime);
				this.begin = 0;
				this.end = this.length;
				if (time != this.over)
					this.over = time;
				this.upFn();
			},
			prevFn () {
				if (!this.begin)
					return;
				let width = this.end - this.begin;
				this.begin = Math.max(0, this.begin - width);
				this.end = this.begin + width;
				this.upFn();
			},
			nextFn () {
				if (this.end == this.length)
					return;
				let width = this.end - this.begin;
				this.end = Math.min(this.length, this.end+width);
				this.begin = this.end - width;
				this.upFn();
			}
		},
		watch: {
			startTime (newValue) {
				this.start = newValue;
				this.startDate = new Date(newValue);
			},
			overTime (newValue) {
				this.over = newValue;
				this.overDate = new Date(newValue);
			}
		},
		components: {
			DatePicker
		},
		mounted () {
			this._moveEvent = EventListener.listen(document, 'mousemove', e => {
				if (!this.allow)
					return;
				this.mouse = e.pageX;
				this.getLeft();
			});
			this._upEvent = EventListener.listen(document, 'mouseup', e => {
				this.upFn();
			});
			this.length = this.$el.clientWidth;
			this.end = this.length;
			if (this.startTime) {
				this.start = this.startTime;
				this.startDate = new Date(this.startTime);
				this.over = this.overTime;
				this.overDate = new Date(this.overTime);
			}
		},
		beforeDestroy () {
			if (this._moveEvent) this._moveEvent.remove();
			if (this._upEvent) this._upEvent.remove();
		}
	}
</script>
<style lang="less">
	.shaft{
		width: 100%;
		height: 90px;
		margin: 0 auto;
		position: relative;
		.tab{
			position: absolute;
			right: 0;
			top: 0;
			font-size: 12px;
			font-weight: normal;
			.icon-circle-normal, .icon-circle-rect{
				cursor: pointer;
				line-height: 24px;
				margin-left: 12px;
			}
			.icon-circle-normal{;
				color: #fff;
			}
			.icon-circle-rect{
				color: #00c6ff;
			}
		}
		.start-time, .end-time{
			position: absolute;
			width: 150px;
			bottom: 33px;
			.text{
				position: absolute;
				top: -12px;
				color: #fff;
				font-size: 12px;
				width: 150px;
			}
			input{
				border: none;
				color: transparent;
				width: 19px;
				height: 19px;
				padding: 0;
				position: absolute;
				background: url('../assets/bg/shaft-date.png');
			}
			.el-input__icon{
				display: none;
			}

		}
		.start-time{
			left: -120px;
			.text{
				left: 100px;
			}
			.el-input__inner{
				left: 80px;
			}
		}
		.end-time{
			right: -110px;
			.text{
				left: -90px;
			}
			.el-input__inner{
				right: 110px;
			}
		}
		.timer{
			position: absolute;
			z-index: 100;
			top: 40px;
			width: 100%;
			height: 50px;
			.timer-bg{
				position: absolute;
				top: 21px;
				width: 100%;
				height: 8px;
				background: rgba(255, 255, 255, 0.2);
			}
			.timer-choose{
				position: absolute;
				top: 13px;
				height: 24px;
				cursor: pointer;
				z-index: 150;
				background: linear-gradient(to bottom, rgba(0, 234, 255, 0.1), rgba(0, 234, 255, 0.9) 50%, rgba(0, 234, 255, 0.1));
			}
			.timer-begin, .timer-end{
				position: absolute;
				width: 1px;
				height: 24px;
				top: 4px;
				z-index: 200;
				text-align: center;
				.icon-anchor{
					position: absolute;
					top: 0;
					cursor: pointer;
				}
				.border{
					position: absolute;
					top: 10px;
					width: 1px;
					height: 24px;
					background: #29c6fd;	

				}
			}
			.timer-begin{
				.icon-anchor{
					left: -5px;
				}
				.border{
					left: 0;
				}
			}
			.timer-end{
				left: 100%;
				.icon-anchor{
					right: -5px;
				}
				.border{
					right: 0;
				}
			}
			.timer-date{
				position: absolute;
				font-size: 12px;
				color: #fff;
				width: 130px;
				bottom: -30px;
			}
		}
		.el-input__inner{
			cursor: pointer;
		}
		.prev-time, .next-time{
			position: absolute;
			top: 58px;
		}
		.prev-time{
			left: -80px;
		}
		.next-time{
			right: -85px;
		}
		.icon-prev-time, .icon-next-time, .icon-prev-time-hover, .icon-next-time-hover{
			cursor: pointer;
		}
	}
</style>