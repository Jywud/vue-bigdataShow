<template>
	<nav>
		<a href="#" class="icon-logo"></a>
		<router-link :to="{name: item.name}" v-for="item in navList" class="nav-item">{{item.title}}</router-link>
		<div class="power rt">
			<div :class="{
				'btn': true,
				'icon-bell': !alarm,
				'icon-bell-gif': alarm
			}">
				<div class="alarm-num" @click="show = !show">{{num}}</div>
				<transition name="detail">
					<div class="alarm-detail" v-show="show">
						<div class="title">实时告警
							<span class="go-log" @click="goFn">查看全部</span>
						</div>
						<div class="rt-content">
							<ul class="fault-list" v-for="(value, key) of sortHT">
								<li class="fault-list-title">{{key}}</li>
								<li class="fault" v-for="fault of value || []" @click="goFn(fault)">
									<div :class="['fault-message', `level${fault.level}`]">{{fault.type}}  {{fault.showTime}} <span class="rt">{{fault.beforePresent}}</span></div>
									<div class="fault-detail">{{fault.ip}}节点发生{{fault.type}}</div>
								</li>
							</ul>
						</div>
					</div>
				</transition>
			</div>
			<div class="alarm-bg" @click="show = !show">
			</div>
			<div :class="{
					'nav-user': true,
					'rt': true,
					'active': showOut
				}" @click="showOut = !showOut">{{session.account}}
			</div>
			<transition name="logout">
				<div class="out" v-show="showOut" @click="logout">
					<div class="icon-logout"></div>
					退出
				</div>
			</transition>
		</div>
	</nav>
</template>
<script>

	import {formatFault} from '../filters.js';
	import EventListener from '../lib/eventListener.js';

	// console.log(formatFault);
	// let formatFault = filter.formatFault;

	/**
	 * params: {
	 * 	navList: [
	 * 		{name, title}
	 * 	]
	 * }
	 */
	export default {
		props: {
			navList: Array
		},
		data () {
			return {
				alarm: false,
				num: 0,
				show: false,
				lastId: null,
				dayHT: {},
				sortHT: {},
				faultList: [],
				timer: null,
				showOut: false,
				max: 0
			};
		},
		computed: {
			session () {
				return this.$store.state.session;
			}
		},
		methods: {
			logout () {
				this.showOut = false;
				UCS.Common('logout', {}, () => {
					this.$store.commit('cleanSession');
					this.$store.commit('cleanAccess');
					this.$store.commit('cleanShopData');
					this.num = 0;
					this.faultList = [];
					this.alarm = false;
					this.$router.push({name: 'entry'});
				});
			},
			init () {
				if (!this.session.userId)
					return;
				UCS.Common('getRtFault', {lastId: this.lastId}, result => {
					this.faultList = result;
					this.max = Number(this.num.toString().split('+')[0]) + result.length;
					if (this.max > 99)
						this.num = '99+';
					else
						this.num = this.max;
					if (result.length) {
						this.alarm = true;
						this.getItems();
						// setTimeout(() => {
						// 	this.alarm = false;
						// }, 3000);
					}
				});
			},
			loopHT (id, HT) {
				Object.keys(HT).forEach(k => {
					let _index = null;
					_.map(HT[k], (fault, idx) => {
						if (id == fault.id)
							_index = idx;
					});
					if (!_.isNull(_index))
						HT[k].splice(_index, 1);
					if (!HT[k].length)
						delete HT[k];
				});
				HT = _.assign([], HT);
			},
			goFn (fault) {
				if (fault.id) {
					if (this.$route.name == 'log') {
						window.bus.$emit('showLog', fault.id);
					} else {
						this.$router.replace({name: 'log', params: {id: fault.id}});
					}
					this.loopHT(fault.id, this.dayHT);
					this.loopHT(fault.id, this.sortHT);
					if (this.max < 100) {
						this.max -= 1;
						this.num = this.max;
					}
				} else {
					if (this.$route.name == 'log') {
						window.bus.$emit('showLog');
					} else {
						this.$router.push({name: 'log'});
					}
					this.dayHT = {};
					this.sortHT = {};
					this.num = 0;
					this.alarm = false;
				}
				this.show = false;


				// if (this.$route.name == 'log') {
				// 	if (fault.id)
				// 		window.bus.$emit('showLog', fault.id);
				// 	else
				// 		window.bus.$emit('showLog');
				// } else {
				// 	if (fault.id)
				// 		this.$router.replace({name: 'log', params: {id: fault.id}});
				// 	else
				// 		this.$router.push({name: 'log'});
				// }
				
			},
			getItems () {
				let sortArr = _.sortBy(this.faultList, [fault => {
					return fault.time;
				}]).reverse();
				this.lastId = sortArr[0].id;
				_.forEach(sortArr, fault => {
					let date = formatFault(new Date(fault.time));
					let title = `${date.format('yyyy年MM月dd日')}  ${date.toWeek('星期')}`;
					if (!this.dayHT[title]) 
						this.dayHT[title] = [];
					this.dayHT[title].push(_.assign(fault, {
						beforePresent: date.beforePresent(),
						showTime: date.getTime()
					}));
				});
				let obj = {};
				_.map(_.sortBy(Object.keys(this.dayHT), [day => {
					return new Date(day.split('日')[0].replace(/[年月]/g, '-')).getTime();
				}]).reverse(), time => {
					obj[time] = this.dayHT[time];
				});
				this.sortHT = obj;
			}
		},
		mounted () {
			this.timer = setInterval(() => {
				this.init();
			}, 10000);
			this._closeEvent = EventListener.listen(window, 'click', (e)=> {
				if (!this.$el.contains(e.target)) {
					this.show = false;
					this.showOut = false;
				}
			});
		},
		beforeDestroy() {
			clearInterval(this.timer);
			if (this._closeEvent) this._closeEvent.remove();
		}
	}
</script>
<style lang="less">
	nav{
		height: 50px;
		line-height: 50px;
		position: fixed;
	      top: 0;
	      left: 0;
	      right: 0;
	      height: 50px;
	      font-size: 14px;
	      font-weight: bold;
	      z-index: 100;
	      min-width: 1360px;
	      border-bottom: 1px solid #030b11;
		.icon-logo{
			margin: 0 8% 0 1.5%;
		}
		a{
			display: inline-block;
			width: 100px;
			text-align: center;
			line-height: 50px;
			vertical-align: top;
			color: #6c94ad;
		}
		.router-link-active{
			color: #00c6ff;
		}
		.power{
			width: 220px;
			height: 40px;
			line-height: 50px;
			position: relative;
			.btn{
				position: relative;
				vertical-align: top;
				height: 49px;
				.alarm-num{
					position: absolute;
					right: 2px;
					top: 19px;
					height: 14px;
					width: 30px;
					line-height: 14px;
					text-align: center;
					background: rgba(172, 227, 255, 0.2);
					border-radius: 7px;
					cursor: pointer;
					font-size: 12px;
					color: #48a3ed;
				}
			}
			&>div{
				vertical-align: middle;
				position: relative;
			}
			.alarm-bg{
				display: inline-block;
				position: absolute;
				height: 50px;
				left: 0;
				width: 80px;
				cursor: pointer;
				&:hover{
					background: rgba(68, 133, 174, 0.2);
				}
			}
			.icon-bell-gif{
				width: 80px;
				height: 49px;
				background: url(../assets/bg/bell.gif);
			}
			.alarm-detail{
				position: absolute;
				top: 49px;
				left: -117px;
				width: 285px;
				height: 500px;
				background: rgba(7, 48, 78, 0.95);
				border-radius: 4px;
				border: 1px solid #305671;
				z-index: 100;
				box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.35), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
				cursor: default;
				&:before{
					content: "";
					position: absolute;
					width: 15px;
					height: 15px;
					top: -9px;
					left: 135px;
					transform: rotate(45deg);
					background: rgba(7, 48, 78, 0.95);
					border-top: 1px solid #305671;
					border-left: 1px solid #305671;
				}
			}
			.title{
				color: #fff;
				padding-left: 10px;
				height: 40px;
				line-height: 40px;
				border-bottom: 1px solid #030b11;
				position: relative;
				&:after{
					position: absolute;
					content: "";
					bottom: -2px;
					left: 0;
					right: 0;
					height: 0;
					border-top: 1px solid #255778;
				}
				.go-log{
					position: absolute;
					right: 2px;
					top: 10px;
					color: #15a0c2;
					width: 60px;
					height: 20px;
					line-height: 20px;
					font-size: 12px;
					cursor: pointer;
				}
			}
			.rt-content{
				height: 450px;
				overflow-y: auto;
				font-size: 12px;
				// padding: 0 6px;
				& li {
					border-bottom: 1px solid rgba(255, 255, 255, 0.1);
					// &:last-of-type{
					// 	border-bottom: none;
					// }
				}
				// ul:last-child{
				// 	li:last-child{
				// 	}
				// }
				& *{
					color: #fff;
					font-weight: normal;
					font-size: 12px;
				}
			}
			.fault-list-title{
				text-align: center;
				height: 35px;
				line-height: 35px;
			}
			.fault{
				height: 70px;
				padding-left: 30px;
				padding-top: 15px;
				cursor: pointer;
				&:hover{
					background: #295671;
				}
			}
			.fault-message{
				height: 20px;
				line-height: 20px;
				position: relative;
				&:before{
					content: "";
					position: absolute;
					left: -13px;
					top: 8px;
					width: 6px;
					height: 6px;
					border-radius: 50%;
				}
				.rt{
					margin-right: 10px;
				}
			}
			.level1:before{
				background: #fd3b37;
			}
			.level2:before{
				background: #ffeb00;
			}
			.fault-detail{
				height: 25px;
				line-height: 25px;
				color: #15a0c2 !important;
			}
			.nav-user{
				width: 140px;
				cursor: pointer;
				padding: 0 20px;
				color: #fff;
				height: 50px;
				line-height: 50px;
				display: inline-block;
				position: relative;
				font-weight: normal;
				transition: all 0.3s;
				border: 1px solid transparent;
				border-bottom: none;
				&.active{
					border: 1px solid #305671;
					border-bottom: none;
					background: rgba(7, 48, 78, 0.95);	
				}
				&:after{
					content: "";
					position: absolute;
					top: 22px;
					right: 12px;
					border-top: 5px solid #fff;
					border-left: 5px solid transparent;
					border-right: 5px solid transparent;
					border-bottom: 5px solid transparent;
				}
			}
			.out{
				position: absolute;
				cursor: pointer;
				top: 50px;
				height: 42px;
				line-height: 42px;
				width: 140px;
				color: #fff;
				font-size: 12px;
				font-weight: normal;
				right: 0px;
				padding-left: 40px;
				background: rgba(7, 48, 78, 0.95);
				border-bottom: 1px solid #305671;
				border-left: 1px solid #305671;
				border-right: 1px solid #305671;
				box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.35), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
				z-index: 100;
				.icon-logout{
					position: absolute;
					left: 20px;
					top: 14px;
				}
			}
		}
		.detail-enter-active, .detail-leave-active {
			transition: all .4s;
			transform-origin: 51% -5%;
		}
		.detail-enter, .detail-leave-active {
			opacity: 0.5;
			transform: scale(0);
		}
		.logout-enter-active, .logout-leave-active {
			transition: all .3s;
		}
		.logout-enter, .logout-leave-active {
			height: 0px;
			opacity: 0;
		}
	}
</style>