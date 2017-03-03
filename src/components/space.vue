<template>
	<div :class="['space', clz]" :style="{height: isShow ? `${detailList.length * 20 + 140}px`: '45px'}">
		<div class="space-name" :title="name">{{name}}</div>
		<div class="space-box">
			<div class="cut-off" v-for="n of 20" :style="{left: n*5+'%'}"></div>
			<div class="record" :style="{
				'left': recordLeft,
				'width': recordWidth
			}"></div>
			<div :class="{'fragment': true, 'active': active == idx}" v-for="(item, idx) of getFragArr" :style="{
				'left': item.left,
				'width': item.width
			}" @click="showFragFn(item.data, idx)"></div>
		</div>
		<div class="show-details" v-show="isShow" :style="{left: Math.max(Math.min(detailLeft, boxWidth*1.1-550), 0)+'px'}">
			<div class="space-total">
				<span class="space-all-time">间隙总时长: {{detailTotal | getDay4Millisecond}}</span>
				<span>间隙条数: 共{{detailList.length}} 条</span>
				<div class="go-alarm rt" @click="alarmFn">间隙详情 &gt;</div>
			</div>
			<ul class="space-title">
				<li class="col-no">序号</li>
				<li class="col-begin">开始时间</li>
				<li class="col-end">结束时间</li>
				<li class="col-total">总时长</li>
			</ul>
			<ul class="space-detail" v-for="(detail, idx) of detailList">
				<li class="col-no">{{idx+1}}</li>
				<li class="col-begin">{{new Date(detail.begin) | format('yyyy-MM-dd hh:mm:ss.S')}}</li>
				<li class="col-end">{{new Date(detail.end) | format('yyyy-MM-dd hh:mm:ss.S')}}</li>
				<li class="col-total">{{(detail.end - detail.begin) | getDay4Millisecond}}</li>
			</ul>
		</div>
	</div>
</template>
<script>
	
	import EventListener from '../lib/eventListener.js';

	export default {
		props: {
			clz: String,
			id: null,
			name: String,
			show: {
				type: Boolean,
				default: false
			},
			checked: null,
			details: {
				type: Array,
				default () {
					return [];
				}
			},
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
				boxWidth: 0,
				isShow: this.show,
				detailLeft: 0,
				active: this.checked,
				detailList: []
			};
		},
		computed: {
			beginTime () {
				if (!this.details.length)
					return 0;
				return this.details[0].beginTime;
			},
			endTime () {
				if (!this.details.length)
					return 0;
				return this.details[this.details.length-1].endTime;
			},
			recordLeft () {
				if (this.startTime > this.beginTime)
					return 0;
				else
					return `${(Math.max((this.beginTime - this.startTime)/ (this.overTime - this.startTime), 0)).toFixed(2) * 100}%`;
			},
			recordWidth () {
				if (this.endTime < this.startTime)
					return '0%';
				let width = (Math.min((this.endTime-this.startTime) / (this.overTime-this.startTime), 1)).toFixed(2) * 100;
				let left = (Math.max((this.beginTime - this.startTime)/ (this.overTime - this.startTime), 0)).toFixed(2) * 100;
				return `${ width - left || 0}%`;
			},
			allTime () {
				return this.overTime - this.startTime;
			},
			minDate () {
				return Math.floor(this.allTime/this.boxWidth);
			},
			getFragArr () {
				let fragArr = _.difference(_.map(this.details, (item, idx) => {
					if (idx == this.details.length-1)
						return 0;
					if (this.details[idx+1].beginTime - item.endTime < 500)
						return 0;
					return {
						begin: item.endTime,
						end: this.details[idx+1].beginTime
					};
				}), [0]);
				let showFragArr = _.difference(_.map(fragArr, item => {
					if (item.end < this.startTime || item.begin > this.overTime)
						return 0;
					return {
						begin: Math.max(item.begin, this.startTime),
						end: Math.min(item.end, this.overTime)
					};
				}), [0]);
				let block = [];
				let k = 0;
				_.forEach(showFragArr, (item, idx) => {
					if (!block[k])
						block[k] = [];
					block[k].push(item);
					if (!showFragArr[idx+1] || showFragArr[idx+1].begin - item.end > this.minDate*3) 
						k += 1;
				});
				return _.map(block, item => {
					return {
						left: this.scope((item[0].begin - this.startTime) / this.allTime*100)+'%',
						width: Math.max(((item[item.length-1].end - item[0].begin) / this.minDate).toFixed(2), 3)+'px',
						data: item
					}
				});
			},
			detailTotal () {
				let total = 0;
				_.forEach(this.detailList, detail => {
					total += detail.end - detail.begin;
				});
				return total;
			}
		},
		methods: {
			scope (value) {
				return Math.max(0, Math.min(value, 100)).toFixed(2);
			},
			showFragFn (data, idx) {
				this.isShow = true;
				let el = null;
				if (event.target.className.indexOf('fragment') == -1)
					el = this.$el.getElementsByClassName('active')[0][(idx > this.active ? 'nextSibling': 'previousSibling')];
				else
					el = event.target;
				this.active = idx;
				this.detailList = data;
				this.detailLeft = Math.floor(this.boxWidth*0.1+el.offsetLeft+Number(el.style.width.slice(0, -2))/2-275);
				this.$emit('showFrag', this.id);
			},
			alarmFn () {
				let begin = this.detailList[0].begin;
				let end = this.detailList[this.detailList.length - 1].end;
				this.$router.push({name: 'log', params: {date: [new Date(begin), new Date(end)]}});
			}
		},
		watch: {
			active (newValue) {
				if (newValue == -1)
					return this.$emit('activeFn', -1);
				if (newValue == this.getFragArr.length -1) {
					if (!newValue)
						return this.$emit('activeFn', newValue, 'one');
					return this.$emit('activeFn', newValue, 'max');
				}
				this.$emit('activeFn', newValue);
			},
			checked (newValue) {
				if (newValue == -1)
					return;
				this.showFragFn(this.getFragArr[newValue].data, newValue);
			},
			show (newValue) {
				if (!newValue) 
					this.active = -1;
				this.isShow = newValue;
			}
		},
		mounted () {
			let boxEl = document.getElementsByClassName('space-box');
			this.boxWidth = boxEl[0].scrollWidth;
			this._closeEvent = EventListener.listen(window, 'resize', (e)=> {
				this.boxWidth = boxEl[0].scrollWidth;
			});
			this._closeClick = EventListener.listen(window, 'click', (e)=> {
				if (event.target.className.indexOf('fragment') == -1) {
					this.isShow = false;
					this.active = -1;
				}
			});
		},
		beforeDestroy() {
			if (this._closeEvent) this._closeEvent.remove();
			if (this._closeClick) this._closeClick.remove();
		}
	}

</script>
<style lang="less">
	.space{
		width: 100%;
		position: relative;
		overflow: hidden;
		transition: all 0.5s;
		margin-bottom: 10px;
		& *{
			display: inline-block;
			vertical-align: middle;
			color: #fff;
			font-size: 12px;
			line-height: 45px;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
		.space-name{
			overflow: hidden;
			width: 8%;
			height: 45px;
		}
		.space-box{
			width: 90%;
			height: 45px;
			margin-left: 8px;
			border: 1px solid rgba(255, 255, 255, 0.3);
			position: relative;
		}
		.cut-off{
			position: absolute;
			bottom: 0;
			height: 5px;
			width: 0;
			border-right: 1px solid rgba(255, 255, 255, 0.3);
		}
		.record, .fragment{
			position: absolute;
			top: 0;
			bottom: 0;
		}
		.record{
			background: rgba(0, 204, 255, 0.3);
		}
		.fragment{
			background: #c3f5ff;
			cursor: pointer;
			&.active{
				top: -1px;
				bottom: -1px;
				border: 1px solid #f00;
			}
		}
		.show-details{
			position: relative;
			top: 10px;
			width: 550px;
			max-height: 190px;
			padding-bottom: 10px;
			background: rgba(0, 0, 0, 0.4);
			border-radius: 5px;
			// transition: all 0.5s;
			overflow-y: auto;
			.space-total{
				position: relative;
				margin: 0px 5px;
				padding-left: 10px;
				width: 540px;
				border-bottom: 1px solid rgba(0, 0, 0, 0.5);
				.space-all-time{
					width: 39%;
				}
				&, span{
					vertical-align: top;
					height: 40px !important;
					line-height: 40px;
					color: #00c6ff;
				}
				&:after{
					content: "";
					position: absolute;
					bottom: -2px;
					left: 0;
					right: 0;
					border-top: 1px solid rgba(171, 224, 255, 0.2);
				}
				.go-alarm{
					margin: 10px 5px 0 0;
					height: 20px;
					border: 1px solid #00f0ff;
					line-height: 18px;
					padding: 0 8px;
					color: #fff;
					font-size: 12px;
					background: rgba(0, 157, 220, 0.5);
					cursor: pointer;
					&:hover{
						background: rgba(0, 157, 220, 1);
					}
				}
			}
			.space-title{
				margin-top: 5px;
			}
			.space-title, .space-detail{
				display: block;
				width: 99%;
				height: 20px;
				padding-left: 15px;
				overflow: hidden;
			}
			[class^="col-"]{
				height: 20px;
				line-height: 20px;
				display: inline-block;
				width: 31%;
				vertical-align: top;
			}
			.col-no{
				width: 40px !important;
			}
		}
	}
</style>