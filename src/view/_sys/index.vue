<template>
<div id="body" class="sys">
	<div class="col-1">
		<div class="sys-pie">
			<div class="sys-title">系统设备统计</div>
			<div class="pie-box">
				<div class="icon-pie-outside"></div>
				<div class="pie-chart">
					<Pie
						:option="devicePoint"
						id="sys"
					></Pie>
					<div class="pie-text icon-pie-inside">
						<div class="text">{{sysPieTotal}}</div>
						<div class="desc">存储节点总数</div>
					</div>
				</div>
			</div>
			<div class="node-list">
				<div class="node lt">
					<div class="num">{{sysPieLegend.rofs}}</div>
					<div class="desc">视频节点个数</div>
					<div class="point"></div>
				</div>
				<div class="node">
					<div class="num">{{sysPieLegend.pfs}}</div>
					<div class="desc">文件节点个数</div>
					<div class="point"></div>
				</div>
				<div class="node rt">
					<div class="num">{{sysPieLegend.err}}</div>
					<div class="desc">故障节点个数</div>
					<div class="point"></div>
				</div>
			</div>
		</div>
		<div class="sys-cube">
			<div class="cube-title">
				<div class="cube-rofs">视频云</div>
				<div class="cube-pfs">文件云</div>
			</div>
			<Cube
				:cubeData="cubeData"
				:translates="translates"
				:viewBox="cubeViewBox"
				@clickFn="clickCubeFn"
			></Cube>
			<div class="bottom"></div>
		</div>
	</div>
	<div class="col-2">
		<div class="sys-wave">
			<div class="sys-title">存储空间统计</div>
			<Wave 
				:used="waveData.used"
				:all = "waveData.all"
			></Wave>
		</div>
		<div class="sys-progress">
			<div class="rofs">
				<div class="icon">
					<div class="icon-folder"></div>
					<div class="text">视频集群</div>
				</div>
				<div class="rofs-box">
					<Grogress
						title="存储空间"
						:used="rofsStorage.used"
						:all="rofsStorage.all"
					></Grogress>
				</div>
			</div>
			<div class="pfs">
				<div class="pfs-content">
					<div class="icon">
						<div class="icon-folder"></div>
						<div class="text">文件集群</div>
					</div>
					<div class="pfs-box">
						<Grogress
							title="大文件存储空间"
							:used="pfsBigStorage.used"
							:all="pfsBigStorage.all"
						></Grogress>
						<Grogress
							title="小文件存储空间"
							:used="pfsSmallStorage.used"
							:all="pfsSmallStorage.all"
						></Grogress>
					</div>
				</div>
			</div>
			<div class="bottom"></div>
		</div>
	</div>
	<div class="col-3">
		<div class="sys-r-broken">
			<div class="sys-title">视频集群</div>
			<div class="tabs">
				<div :class="{
					'tab': true,
					'active':  showVideo == 'rw'
				}" @click="clickVideoFn('rw')">读写性能</div>
				<div class="segmentation tab"></div>
				<div :class="{
					'tab': true,
					'active':  showVideo == 'video'
				}" @click="clickVideoFn('video')">录像统计</div>
			</div>
			<transition name="fade" mode="out-in">
				<Broken 
					:brokenData="rofsBroken"
					:color="brokenColor"
					v-if="showVideo == 'rw'"
					@editTime="editTimeFn4Video"
				></Broken>
				<div class="rofs-pie" v-else>
					<div class="rofs-chart">
						<Pie
							:option="rofsPoint"
							id="rofs"
						></Pie>
						<div class="pie-text icon-pie-inside">
							<div class="text">{{rofsPieTotal}}</div>
							<div class="desc">录像通道总数</div>
						</div>
					</div>
					<div class="rofs-text">
						<div class="gallery">
							<div class="point"></div>
							<div class="label desc">正常个数：</div>
							<div class="num" @click="goVideo(1)">{{rofsPieLegend.normal}}</div>
						</div>
						<div class="gallery err">
							<div class="point"></div>
							<div class="label desc">故障个数：</div>
							<div class="num" @click="goVideo(0)">{{rofsPieLegend.err}}</div>
						</div>
					</div>
				</div>
			</transition>
		</div>
		<div class="sys-p-broken">
			<div class="sys-title">文件集群</div>
			<div class="tabs">
				<div :class="{
					'read-write': true, 
					'tab': true
				}">读写性能</div>
			</div>
			<Broken 
				:brokenData="pfsBroken"
				:color="brokenColor"
				type="file"
				@editTime="editTimeFn4File"
			></Broken>
		</div>
	</div>
</div>
</template>
<script>

	import Cube from '../../components/cube.vue';
	import Wave from '../../components/wave.vue';
	import Broken from '../../components/broken.vue';
	import Grogress from '../../components/progress.vue';
	import Pie from '../../components/echarts.vue';

	export default {
		data () {
			return {
				waveData: {},
				sysPieTotal: 0,
				rofsPieTotal: 0,
				sysPieLegend: {rofs: 0, pfs: 0, err: 0},
				rofsPieLegend: {normal: 0, err: 0},
				devicePoint: {
					tooltip: {
						trigger: 'item',
						formatter: "{b}: {c} ({d}%)",
						position: function (point, params, dom) {
							return [point[0], '40%'];
						}
					},
					color: ['#00b5ff', '#03d979'],
					series: [{
						name: '设备统计',
						type: 'pie',
						hoverAnimation: false,
						radius: ['88%', '98%'],
						label: {
							normal: {show: false},
							emphasis: {show: false}
						},
						animationDuration: 1500,
						animationDurationUpdate: 1200,
						data: [
							{name: '视频节点', value: 0},
							{name: '文件节点', value: 0}
						]
					}]
				},
				cubeData: [],
				translates: ['translate(0, 0)', 'translate(70, 0)', 'translate(170, 0)', 'translate(240, 0)'],
				cubeViewBox: '0, 0, 310, 265',
				rofsBroken: [],
				rofsPoint: {},
				pfsBroken: [],
				rofsStorage: {},
				pfsBigStorage: {},
				pfsSmallStorage: {},
				brokenColor: [
					[
						{color: '#ff5585', opacity: 0.5},
						{color: '#ff5585', opacity: 0}
					],
					[
						{color: '#03d09d', opacity: 0.5},
						{color: '#03d09d', opacity: 0}
					]
				],
				showVideo: 'rw',
				showFile: 'rw',
				timer: null,
				timeV: 'now',
				timeF: 'now',
				timeRofs: null,
				timePfs: null
			};
		},
		methods: {
			getPieTotal (arr, key) {
				let total = 0;
				let vm = this;
				_.map(arr, obj => total += obj.value);
			      function animate (time) {
					requestAnimationFrame(animate)
					TWEEN.update(time)
			      }
			      new TWEEN.Tween({ tweenPie: vm[key] })
					.easing(TWEEN.Easing.Quadratic.Out)
					.onUpdate(function () { 
						vm[key] = this.tweenPie.toFixed(0);
					})
					.to({ tweenPie: total }, 1200)
					.start();
			      animate();
			},
			clickVideoFn (key) {
				this.showVideo = key;
			},
			editTimeFn4Video (key) {
				this.timeV = key;
				UCS.SysManger('getRofsBroken', {time: this.timeV}, (data) => {
					this.rofsBroken = data;
				});
				clearInterval(this.timerRofs);
				if (this.timeV != 'now') return;
				this.timerRofs = setInterval(() => {
					this.editTimeFn4Video (this.timeV);
				}, 5000);
			},
			editTimeFn4File (key) {
				this.timeF = key;
				UCS.SysManger('getPfsBroken', {time: this.timeF}, (data) => {
					this.pfsBroken = data;
				});
				clearInterval(this.timerPfs);
				if (this.timeF != 'now') return;
				this.timerPfs = setInterval(() => {
					this.editTimeFn4File (this.timeF);
				}, 5000);
			},
			getPieArr (data, keys) {
				let arr = [];
				for (let key in data) {
					if (keys[key])
						arr.push({ name: keys[key], value: data[key]});
				}
				return arr;
			},
			clickCubeFn (idx, key) {
				this.$router.push({ name: 'node', params: {type: idx > 1 ? 0: 1, status: key}});		
			},
			goVideo (key) {
				this.$router.push({ name: 'video', params: {status: key}});
			},
			init () {
				UCS.SysManger('getSysData', {}, data => {
					//文件存储空间
					function getT (value) {
						return Number((value  / 1024 /1024 /1024/1024).toFixed(2));
					}
					this.waveData = {
						used: getT(data.video.storageSpace.used +  data.files.storageSpace.used),
						all: getT(data.video.storageSpace.total +  data.files.storageSpace.total)
					};
					this.rofsStorage = {
						used: getT(data.video.storageSpace.used),
						all: getT(data.video.storageSpace.total)
					};
					this.pfsBigStorage = {
						used: getT(data.files.bigFile.used),
						all: getT(data.files.bigFile.total)
					};
					this.pfsSmallStorage = {
						used: getT(data.files.smFile.used),
						all: getT(data.files.smFile.total)
					};
					//系统设备统计
					this.sysPieLegend = {
						rofs: data.video.storageNode.total,
						pfs: data.files.storageNode.total,
						err: data.video.storageNode.fault+data.files.storageNode.fault
					};
					this.devicePoint = _.assign({}, this.devicePoint, {
						series: [{
							data: this.getPieArr(this.sysPieLegend, {
								rofs: '视频节点',
								pfs: '文件节点'
							})
						}]
					});
					this.getPieTotal(this.devicePoint.series[0].data, 'sysPieTotal');

					let arr = [];
					arr.push({
						value: data.video.storageNode.normal,
						color: '#39d2a1'
					});
					arr.push({
						value: data.video.storageNode.fault,
						color: '#da8d1b'
					});
					arr.push({
						value: data.files.storageNode.normal,
						color: '#0ac1e1'
					});
					arr.push({
						value: data.files.storageNode.fault,
						color: '#da8d1b'
					});
					this.cubeData = arr;

					//录像统计
					this.rofsPieLegend = {
						normal: data.video.channel.normal,
						err: data.video.channel.fault
					};
					this.rofsPoint = _.assign({}, {
						tooltip: {
							trigger: 'item',
							formatter: "{b}: {c} ({d}%)"
						},
						color: ['#03d979', '#ffa800'],
						series: [{
							name: '录像通道统计',
							type: 'pie',
							hoverAnimation: false,
							radius: ['90%', '98%'],
							label: {
								normal: {show: false},
								emphasis: {show: false}
							},
							animationDuration: 1500,
							animationDurationUpdate: 1200,
							data: this.getPieArr(this.rofsPieLegend, {
								normal: '正常个数',
								err: '故障个数'
							})
						}]
					});
					this.getPieTotal(this.rofsPoint.series[0].data, 'rofsPieTotal');

				});
			}
		},
		components: {
			Pie,
			Cube,
			Wave,
			Broken,
			Grogress
		},
		mounted () {
			this.init();
			this.editTimeFn4Video (this.timeV);
			this.editTimeFn4File (this.timeF);  
			this.timer = setInterval(() => {
				this.init();
				this.editTimeFn4Video (this.timeV);
				this.editTimeFn4File (this.timeF);  
			}, 10000);
		},
		beforeDestroy () {
			clearInterval(this.timer);
			clearInterval(this.timerRofs);
			clearInterval(this.timerPfs);
		}
	}

</script>
<style lang="less">
	.sys{
		.col-1{
			width: 28%;
			left: 1.5%;
		}
		.col-2{
			width: 28%;
			left: 30.5%;
		}
		.col-3{
			width: 39%;
			left: 59.5%;
		}
		.col-1, .col-2, .col-3{
			position: absolute;
			bottom: 20px;
			top: 70px;
		}
		.col-1, .col-2{
			box-shadow: 0 0 3px 1px rgba(130, 164, 197, 0.3) inset;
			&:before{
				content: "";
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.2);
			}
		}
		.sys-pie, .sys-wave{
			width: 100%;
			height: 55%;
		}
		.sys-cube, .sys-progress{
			width: 100%;
			height: 45%;
		}
		.sys-r-broken, .sys-p-broken{
			width: 100%;
			height: 49%;
		}
		.sys-p-broken{
			margin-top: 2%;
		}
		.sys-pie, .sys-wave, .sys-r-broken, .sys-p-broken{
			background: rgba(30, 82, 120, 0.3);
			position: relative;
		}
		.sys-pie{
			display: flex;
			justify-content: center;
			align-items: center;
			.pie-box{
				display: flex;
				justify-content: center;
				align-items: center;
				margin-top: -14px;
				position: relative;
				width: 289px;
				height: 289px;
			}
			@keyframes auto {
				0% {
					transform: scale(1) rotate(0deg);
				}
				4%{
					transform: scale(1.05) rotate(0deg);
				}
				24%{
					transform: scale(1.05) rotate(-180deg);
				}
				28% {
					transform: scale(1) rotate(-180deg);
				}
				100% {
					transform: rotate(-180deg);
				}
			}
			.icon-pie-outside{
				position: absolute;
				top: 0;
				left: 0;
				transform-origin: 50% 50%;
				animation:  auto 10s ease-in-out infinite;
			}
			.node-list{
				position: absolute;
				bottom: 2%;
				left: 40px;
				right: 40px;
				height: 60px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.node{
					width: 80px;
					height: 40px;
					text-align: center;
				}
				.num{
					color: #fff;
					font-size: 20px;
					height: 20px;
					margin-bottom: 3px;
				}
				.point{
					width: 7px;
					height: 7px;
					border-radius: 50%;
					margin-left: 37px;
					background: #03d979;
					margin-top: 3px;
				}
				.lt .point{
					background: #00b5ff;
				}
				.rt .point{
					background: #ffa800;
				}
			}
		}
		.sys-cube, .sys-progress{
			background: rgba(0, 26, 45, 0.4);
			position: relative;
			.bottom{
				position: absolute;
				bottom: 0px;
				right: 0;
				left: 0;
				height: 20px;
				background: rgba(30, 82, 120, 0.3);
			}
		}
		.sys-progress:before{
			content: "";
			position: absolute;
			top: -4px;
			left: 50%;
			right: 50%;
			border: none;
			border-top: 7px solid rgba(0, 26, 45, 0.4);
			border-right: 7px solid rgba(0, 26, 45, 0.4);
			border-left: 7px solid transparent;
			border-bottom: 7px solid transparent;
			transform: rotate(-45deg);
			transform-origin: left bottom;
		}
		.sys-r-broken, .sys-p-broken{
			box-shadow: 0 0 3px 1px rgba(130, 164, 197, 0.3) inset;
			&:before{
				content: "";
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.2);
			}
			.tabs{
				position: absolute;
				left: 25px;
				top: 55px;
				height: 20px;
				right: 15px;
				z-index: 30;
				.read-write{
					color: #fff !important;
				}
				.tab{
					width: 52px;
					display: inline-block;
					font-size: 12px;
					color: rgba(255, 255, 255, 0.8);
					line-height: 12px;
					vertical-align: top;
					margin-right: 5px;
					height: 18px;
					cursor: pointer;
					&.segmentation{
						width: 0;
						height: 12px;
						border-left: 1px solid rgba(0, 0, 0, 0.5);
						border-right: 1px solid rgba(171, 224, 255, 0.2);
					}
					&.active{
						color: rgba(255, 255, 255, 1);
						border-bottom: 2px solid #00b5ff;
					}
				}
			}
		}
		.pie-text{
			position: absolute;
			width: 140px;
			height: 140px;
			top: 20px;
			left: 20px;
			border-radius: 50%;
			text-align: center;
		}
		.rofs-pie{
			position: absolute;
			width: 100%;
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.rofs-chart{
			margin-top: 30px;
		}
		.rofs-text{
			position: absolute;
			height: 30px;
			left: 15%;
			right: 15%;
			bottom: 15px;
			display: flex;
			justify-content: space-around;
			align-items: center;
			.gallery{
				width: 160px;
				height: 30px;
				line-height: 30px;
				&>*{
					display: inline-block;
					vertical-align: middle;
				}
				.num{
					font-size: 20px;
					color: #fff;
					cursor: pointer;
				}
			}
			.err .point{
				background: #ffa800;
			}
			.point{
				width: 7px;
				height: 7px;
				margin-right: 5px;
				border-radius: 50%;
				background: #03d979;
			}
		}
		.pie-chart, .rofs-chart{
			width: 180px;
			height: 180px;
			border-radius: 50%;
			position: relative;
			.text{
				margin: 50px 0 5px 0;
				width: 100%;
				height: 30px;
				font-size: 30px;
				color: #fff;
				text-align: center;
			}
		}
		.desc{
			color: #89ccff;
			font-size: 12px;
		}
		.cube-title{
			position: absolute;
			top: 15px;
			left: 20px;
			right: 20px;
			height: 40px;
			display: flex;
			justify-content: space-around;
			align-items: center;
			.cube-rofs{
				color: #39d2a1;
			}
			.cube-pfs{
				color: #0ac1e1;
			}
		}
		.sys-title{
			height: 40px;
			top: 0;
			left: 1px;
			right: 1px;
			position: absolute;
			line-height: 40px;
			padding-left: 20px;
			color: #fff;
			font-family: '宋体';
			font-size: 14px;
			font-weight: bold;
			border-bottom: 1px solid #030b11;
			&:after{
				content: "";
				position: absolute;
				bottom: -2px;
				right: 1px;
				left: 1px;
				border-bottom: 1px solid #255778;
			}
		}
		.rofs{
			position: absolute;
			left: 1px;
			right: 1px;
			height: 30%;
			border-bottom: 1px solid #030b11;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			&:after{
				content: "";
				position: absolute;
				bottom: -2px;
				right: 1px;
				left: 1px;
				border-bottom: 1px solid #255778;
			}
			.rofs-box{
				position: absolute;
				top: 0;
				left: 90px;
				right: 30px;
				bottom: 0;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
		.rofs, .pfs{
			.icon{
				margin-left: 25px;
			}
			.icon-folder{
				margin: 0 0 5px 6px;
			}
			.text{
				color: #7bc9ff;
				font-size: 12px;
			}
		}
		.pfs{
			position: absolute;
			left: 1px;
			right: 1px;
			top: 32%;
			bottom: 0;
			.pfs-content{
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 20px;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				.icon{
					margin-top: -5px;
				}
			}
			.pfs-box{
				position: absolute;
				top: 0;
				left: 90px;
				right: 30px;
				bottom: 0;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				&>.progress{
					margin-bottom: 10%;
				}
			}
		}
	}
</style>