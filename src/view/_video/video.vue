<template>
<div id="body" class="single-video">
	<div class="grid-box">
		<div class="title">录像管理</div>
		<div class="video-message">
			<div class="list-l lt">
				<!-- <div class="video-cameraName"><div class="label">摄像机名称：</div>{{message.cameraName}}</div> -->
				<div class="video-channelName"><div class="label">通道名称：</div>{{message.name}}</div>
				<div class="video-time"><div class="label">录像时长：</div>{{message.period | getDay4Millisecond}}</div>
				<div class="video-node"><div class="label">所属节点：</div>{{message.storageNodeList}}</div>
			</div>
			<div class="list-r lt">
				<div class="video-num"><div class="label">录像时间段个数：</div>{{message.segNum}}</div>
				<div class="video-frame"><div class="label">帧数量：</div>{{message.frameCount}}</div>
				<div class="video-size"><div class="label">录像大小：</div>{{message.size | formatUnit}}</div>
			</div>
		</div>
		<div class="video-tab">
			<Tab
				:items="tabs"
				@clickFn="tabFn"
			></Tab>
		</div>
		<div class="grid-content video-content">
			<transition name="fade" mode="out-in">
				<div class="details-content" v-if="active ==1">
					<div class="rt-video">
						查看实时录像
						<div class="icon-rt-bg" @click="openRt">
							<div :class="{'btn': true, 'active': open}">
								<div class="icon-rt-circle">
									<div class="icon-rt-point"></div>
								</div>
							</div>
						</div>
					</div>
					<div class="show-start">{{new Date(start) | format('yyyy-MM-dd hh:mm:ss')}}</div>
					<div class="show-over">{{new Date(over) | format('yyyy-MM-dd hh:mm:ss')}}</div>
					<div class="show-now" v-show="open">{{new Date(now) | format('yyyy-MM-dd hh:mm:ss')}}</div>
					<div class="space-content">
						<Space
							:clz="clz"
							:name="name"
							:details="details"
							:checked="checked"
							:startTime="start"
							:overTime="over"
							@activeFn="activeFn"
						></Space>
					</div>
					<div class="btn-list" v-show="!open">
						<div :class="{
							'btn': true,
							'disabled': prev == 'min'
						}" @click="checkedFn(-1)">上一间隙</div>
						<div :class="{
							'btn': true,
							'disabled': next == 'max'
						}" @click="checkedFn(1)">下一间隙</div>
						<div class="legend">
							<span class="normal"></span>
							<span>正常录像</span>
							<span class="trouble"></span>
							<span>故障录像</span>
						</div>
					</div>
					<div class="shaft-content" v-if="!open">
						<Shaft
							:startTime="startTime"
							:overTime="overTime"
							@changeTime="changeTimeFn"
						></Shaft>
					</div>
				</div>
				<Grid
					:clz="grid.clz"
					:tools="grid.tools"
					:hasCheckbox="grid.hasCheckbox"
					sequence="序号"
					:headers="grid.headers"
					:html="grid.html"
					:items="grid.items"
					:total="total"
					:params="params"
					@toolFn="toolFn"
					@checkFn="checkFn"
					@pageFn="pageFn"
					v-else
				></Grid>
			</transition>
		</div>
	</div>
</div>
</template>
<script>

	import Tab from '../../components/tab.vue';
	import Grid from '../../components/grid/grid.vue';
	import Space from '../../components/space.vue';
	import Shaft from '../../components/shaft.vue'

	export default {
		data () {
			return {
				message: {},
				open: false,
				checked: -1,
				name: '',
				id: null,
				active: 1,
				total: 0,
				prev: 'min',
				next: 'max',
				params: {
					id: null,
					pageNo: 0,
					pageSize: 20
				},
				tabs: [
					{Key: 1, title: '录像明细'},
					{Key: 2, title: '锁定管理'}
				],
				details: [],
				grid: {
					tools: {
						datePicker: {
							placeholder: '新增锁定',
							type: 'datetimerange'
						},
						btns: [
							{Key: 'lock', title: '删除锁定任务', disable: true}
						],
						dropdowns: []
					},
					clz: 'single-video-grid',
					hasCheckbox: true,
					headers: [
						{title: '录像大小', column: 'size'},
						{title: '帧数量', column: 'frameCount'},
						{title: '开始时间', column: 'beginTime'},
						{title: '结束时间', column: 'endTime'},
						{title: '时长', column: 'period'}
					],
					html: [],
					items: []
				},
				start: 0,
				over: 0,
				timer: null,
				rtTimer: null,
				now: new Date().getTime()
			};
		},
		computed: {
			startTime () {
				if (this.details.length)
					return this.details[0].beginTime;
					// return 1479000768749 ;
			},
			overTime () {
				if (this.details.length)
					return this.details[this.details.length-1].endTime;
					// return 1489000768749 ;
			},
			clz () {
				if (this.open)
					return 'rt-v';
				else
					return '';
			}
		},
		methods: {
			key1Fn () {
				UCS.VideoManger('getVideoMessage', {id: this.params.id}, result => {
					this.name = result.name;
					if (result.detail && result.detail.length)
						this.details = result.detail.sort(function(a, b) {
							return a.beginTime - b.beginTime;
						});
					if (result.detail.length) {
						this.start = result.detail[0].beginTime;
						this.over = result.detail[result.detail.length-1].endTime;
					}
				});
			},
			key2Fn () {
				UCS.VideoManger('getSingleVideoList', Object.assign({}, this.params), result => {
					this.total = result.total;
					this.grid.items = result.items;
				});
			},
			init () {
				UCS.VideoManger('getSingleVideoMessage', {id: this.params.id}, result => {
					this.message = result;
				});
				this.key1Fn();
			},
			refresh (key) {
				if (key == 2) 
					return this.key2Fn();
				 else 
					return this.key1Fn();			
			},
			tabFn (item) {
				this.active = item.Key;
				this.refresh(item.Key);
			},
			toolFn (btn, selectData) {
				if (btn == 'date' && selectData && selectData[0]) {
					return UCS.VideoManger('addLock', _.assign({id: this.params.id}, {from: selectData[0].getTime(), to: selectData[1].getTime()}), result => {
						this.refresh(2);
					});
				} 
				if (btn.Key == 'lock') {
					UCS.VideoManger('deleteLock', _.assign({id: this.params.id}, {ids: _.map(selectData, item => {
						return item.id;
					})}), result => {
						this.refresh(2);
					});
				}
			},
			checkFn (arr) {
				if (arr.length)
					this.grid.tools.btns[0].disable = false;
				else
					this.grid.tools.btns[0].disable = true;
			},
			pageFn (no) {
				this.params.pageNo = no;
				this.refresh(2);
			},
			rtVideo () {
				UCS.VideoManger('getVideoMessage', {id: this.params.id}, result => {
					this.name = result.name;
					if (result.detail && result.detail.length)
						this.details = result.detail.sort(function(a, b) {
							return a.beginTime - b.beginTime;
						});
				});
			},
			rtTime () {
				this.now = new Date().getTime();
				if (this.now > this.over) {
					this.start = this.now - 6*60*1000;
					this.over = this.now + 4*60*1000;
				}
			},
			openRt () {
				this.open = !this.open;
				if (this.open) {
					let dateTime = new Date().getTime();
					this.start = dateTime - 6*60*1000;
					this.over = dateTime + 4*60*1000;
					this.timer = setInterval(() => this.rtVideo(), 5000);
					this.rtTimer = setInterval(() => this.rtTime(), 1000);
					this.rtVideo();
					this.rtTime();
				} else {
					this.start = this.startTime;
					this.over = this.overTime;
					clearInterval(this.timer);
					clearInterval(this.rtTimer);
				}
			},
			checkedFn (idx) {
				event.stopPropagation();
				if (event.target.className.indexOf('disabled') != -1)
					return;
				this.checked += idx;
			},
			activeFn (key, k1) {
				if (k1 == 'one') {
					this.prev = 'min';
					this.next = 'max';
				} else if (k1 == 'max') {
					this.prev = null;
					this.next = k1;
				} else if (key == 0) {
					this.next = null;
					this.prev = 'min';
				} else if (key == -1) {
					this.prev = 'min';
					this.next = 'max';
				} else {
					this.prev = null;
					this.next = null;
				}
				this.checked = key;
			},
			changeTimeFn (start, over) {
				this.start = start;
				this.over = over;
			}
		},
		components: {
			Tab,
			Grid,
			Space,
			Shaft
		},
		mounted () {
			this.params.id = this.$route.params.id;
			this.init();
		}
	}
</script>
<style lang="less">
	.single-video{
		.video-message{
			position: absolute;
			top: 77px;
			left: 30px;
			right: 30px;
			overflow: hidden;
			height: 68px;
			background: rgba(0, 26, 45, 0.4);
			padding: 24px 38px;
			margin-bottom: 22px;
			box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.2) inset;
			&:before{
				content: '';
				position: absolute;
				top: 68px;
				left: 1px;
				right: 1px;
				box-shadow: 0 0 1px 1px rgba(255, 255, 255, 0.1);
			}
			[class^="list-"]{
				margin-bottom: 10px;
			}
			.list-l{
				min-width: 800px;
			}
			.list-r{
				min-width: 620px;
				// &>div{
				// 	min-width: 140px;
				// }
			}
			[class^="video-"]{
				display: inline-block;
				height: 20px;
				line-height: 20px;
				font-size: 12px;
				color: #fff;
				margin-right: 10px;
			}
			.video-cameraName, .video-channelName, .video-time{
				min-width: 295px;
			}
			.video-num, .video-frame, .video-size{
				min-width: 180px;
			}
		}
		.video-tab{
			position: absolute;
			top: 190px;
			z-index: 50;
			left: 40px;
			right: 40px;
			height: 24px;	
		}
		.video-content{
			top: 250px;
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
			.show-now{
				top: 50px !important;
				color: #00c6ff !important;
				right: 1%;
			}
			.rt-video{
				position: absolute;
				right: 5px;
				top: -55px;
				line-height: 20px;
				width: 130px;
				height: 20px;
				color: #fff;
				font-size: 12px;
				.icon-rt-bg{
					position: absolute;
					right: 0;
					top: 0;
					cursor: pointer;
				}
				.btn{
					position: absolute;
					top: 3px;
					width: 17px;
					height: 17px;
					left: 0;
					transition: all 0.3s;
					&.active{
						left: 24px;
					}
				}
				.icon-rt-point{
					position: absolute;
					top: 5px;
					left: 5px;
				}
			}
		}
		.space-content{
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 135px;
			overflow-y: auto;
			.rt-v .record{
				transition: width 0.5s;
			}
		}
		.details-content{
			position: absolute;
			left: 20px;
			right: 30px;
			top: 20px;
			bottom: 20px;
			&.rt{
				.record{
					background: linear-gradient(to right, rgba(0, 204, 255, 0.3), rgba(0, 204, 255, 1));
				}
			}
			.btn-list{
				position: absolute;
				bottom: 110px;
				left: 0;
				right: 0;
				text-align: center;
				.legend{
					top: -5px;
				}
				.btn{
					text-align: center;
					width: 72px;
					height: 25px;
					line-height: 25px;
					font-size: 12px;
					color: #fff;
					background: rgba(0, 157, 220, 1);
					&.disabled{
						background: rgba(0, 157, 220, 0.5);
						cursor: default;
					}
				}
			}
			.shaft-content{
				position: absolute;
				bottom: 10px;
				left: 100px;
				right: 100px;
				height: 100px;
				text-align: center;
			}
		}
		.icon-btn-lock, .icon-btn-lock-hover, .icon-btn-addLock, .icon-btn-addLock-hover{
			height: 25px;
			border: 1px solid #00f0ff;
			line-height: 25px;
			padding: 0 8px;
			color: #fff;
			font-size: 12px;
		}
		.icon-btn-lock, .icon-btn-addLock{
			background: rgba(0, 157, 220, 0.5);
		}
		.icon-btn-lock-hover, .icon-btn-addLock-hover{
			background: rgba(0, 157, 220, 1);
		}
		.icon-btn-lock-disable{
			cursor: default;
			height: 25px;
			line-height: 25px;
			padding: 0 8px;
			color: #fff;
			font-size: 12px;
			border: 1px solid rgba(0, 157, 220, 0.3);
			background: rgba(0, 157, 220, 0.3);
			opacity: 0.5;
		}
		.single-video-grid{
			.col-size, .col-frameCount{
				width: 12%;
			}
			.col-beginTime, .col-endTime{
				width: 20%;
			}
			.row:hover{
				cursor: default !important;
			}
		}
	}
</style>