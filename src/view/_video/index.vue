<template>
<div id="body" class="video">
	<div class="grid-box">
		<div class="title">录像管理</div>
		<div class="grid-content">
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
				:actions="grid.actions"
				@checkFn="checkFn"
				@pageFn="pageFn"
				@toolFn="toolFn"
				@dropdownFn="dropdownFn"
				@rowFn="rowFn"
			></Grid>
		</div>
	</div>
	<div class="shop">
		<Shop
			title="对比队列"
			:items="shopData"
		></Shop>
	</div>
	<diy-dialog
		clz="access"
		title="权限验证"
		:show="access"
		@check="checkAccess"
	>
		<div class="dialog-content">
			<div class="d-row">
				<span class="label">请输入密码：</span>
				<input type="password" name="access" v-model="accessValue">
			</div>
			<div :class="{'hint': true, 'failed': failed}">输入密码不正确，权限认证失败</div>
		</div>
	</diy-dialog>
	<diy-dialog
		:clz="dialogClz"
		title="编辑录像"
		:show="show"
		@check="checkDialogFn"
	>
		<div class="dialog-content">
			<div class="d-row">
				<span class="label">录像循环类型</span>
				<Dropdown
					Key="cycleType"
					:value="dialogData.cycleType"
					:list="cycleTypeList"
					@checkFn="dialogDropdown"
				></Dropdown>
			</div>
			<div class="hint cycle">录像循环类型不能为空</div>
			<div :class="{'d-row': true, 'disable': !rowDisable}">
				<span class="label">录像覆盖周期</span>
				<input type="number" min="0" v-model.number="dialogData.day">
				<span>&nbsp;天</span>
				<Dropdown
					Key="hour"
					:value="dialogData.hour"
					:list="hourList"
					@checkFn="dialogDropdown"
				></Dropdown>
				<span>&nbsp;小时</span>
			</div>
			<div class="hint re">录像覆盖周期不能为空</div>
		</div>
	</diy-dialog>
</div>
</template>
<script>

	import Grid from '../../components/grid/grid.vue';
	import Shop from '../../components/shoppingCart.vue';
	import DiyDialog from '../../components/dialog.vue';
	import Dropdown from '../../components/dropdown.vue';
	import Const from '../../lib/const.js';

	export default {
		data () {
			let _this = this;
			return {
				access: false,
				failed: false,
				accessValue: '',
				show: false,
				total: 0,
				params: {
					pageNo: 0,
					pageSize: 20,
					status: 2
				},
				grid: {
					tools: {
						btns: [
							{Key: 'refresh', title: '刷新'},
							{Key: 'edit', title: '编辑', disable: true},
							{Key: 'add', title: '加入录像对比', disable: true}
						],
						dropdowns: [
							{
								title: '状态',
								Key: 'status',
								value: 2,
								list: [
									{name: '所有', value: 2},
									{name: '正常', value: 1},
									{name: '故障', value: 0}
								]
							}
						]
					},
					clz: 'video-grid',
					hasCheckbox: true,
					headers: [
						// {title: '摄像机名称', column: 'cameraName'},
						{title: '通道名称', column: 'name'},
						{title: '实际录像时间', column: 'period'},
						{title: '覆盖周期', column: 'recycle'},
						{title: '覆盖类型', column: 'cycleType'},
						{title: '开始时间', column: 'beginTime'},
						{title: '结束时间', column: 'endTime'},
						{title: '状态', column: 'status'}
					],
					html: [
						{
							key: 'status',
							type: 'node-status'
						}
					],
					items: [],
					actions: [
						// {key: 'add', title: '加入对比'}
					]
				},
				selectArr: [],
				dialogClz: 'edit-video',
				dialogData: {
					cycleType: null,
					day: null,
					hour: null
				},
				hourList: _.times(24, idx => {return {name: idx, value: idx}})
			};
		},
		computed: {
			shopData () {
				return this.$store.state.shopData;
			},
			rowDisable () {
				return this.dialogData.cycleType;
			},
			disable () {
				return this.selectArr.length;
			},
			cycleTypeList () {
				let arr = [];
				for (let key in Const.NodeRecycle) {
					arr.push({
						name: Const.NodeRecycle[key],
						value: Number(key)
					});
				}
				return arr;
			}
		},
		methods: {
			init () {
				UCS.VideoManger('getVideoList', Object.assign({}, this.params), result => {
					this.total = result.total;
					this.grid.items = result.items;
				});
			},
			checkFn (arr) {
				this.selectArr = arr;
				if (arr.length) {
					this.grid.tools.btns[1].disable = false;
					this.grid.tools.btns[2].disable = false;
				} else {
					this.grid.tools.btns[1].disable = true;
					this.grid.tools.btns[2].disable = true;
				}
			},
			pageFn (no) {
				this.params.pageNo = no;
				this.init();
			},
			toolFn (btn, selectData) {
				if (btn.Key == 'add') 
					return this.$store.commit('add', selectData);
				if (btn.Key == 'edit') {
					if (!this.$store.state.access)
						return this.access = true;
					return this.show = true;
				}
				this.init();
			},
			dropdownFn (key, value) {
				this.params[key] = value;
				this.params.pageNo = 0;
				this.init();
			},
			rowFn (item) {
				this.$router.push({ name: 'single-video', params: {id: item.id}});
			},
			checkAccess (key) {
				if (key == 'ok') {
					UCS.Common('checkAccess', {access: this.accessValue}, result => {
						if (!result)
							return this.failed = true;
						this.access = false;
						this.show = true;
						this.$store.commit('hasAccess');
						setTimeout(() => {
							this.accessValue = '';
							this.$store.commit('cleanAccess');
						}, 600000);
					});
				} else 
					this.access = false;
					this.failed = false;
			},
			checkDialogFn (key) {
				if (key == 'channel') {
					this.dialogData = {
						cycleType: null,
						day: null,
						hour: null
					};
					this.dialogClz = 'edit-video';
					return this.show = false;
				} else {
					let cycleType = this.dialogData.cycleType;
					let day = this.dialogData.day;
					let hour = this.dialogData.hour;
					if (!_.isNumber(cycleType))
						return this.dialogClz = 'edit-video cycleType';
					if (cycleType == 1 && ((!day && !hour) || (!_.isNumber(day) || !_.isNumber(hour)))) 
						return this.dialogClz = 'edit-video recycle';
					UCS.VideoManger('editVideo', _.assign({
						ids: this.selectArr,
						cycleType: this.dialogData.cycleType
					}, cycleType == 1 ? {
						recycle: 24*60*60*1000*this.dialogData.day+60*60*1000*this.dialogData.hour
					}: {}), () => {
						this.show = false;
						this.dialogData = {
							cycleType: null,
							day: null,
							hour: null
						};
						this.dialogClz = 'edit-video';
						this.init();
					});
				}
			},
			dialogDropdown (key, value) {
				this.dialogData[key] = value;
				if (key == 'cycleType') {
					if (value == 1) 
						this.dialogClz = 'edit-video show';
					else
						this.dialogClz = 'edit-video';
				}
			}
		},
		components: {
			Grid,
			Shop,
			DiyDialog,
			Dropdown
		},
		mounted () {
			if (this.$route.params.hasOwnProperty('status')) {
				let status = this.$route.params.status;
				this.params.status = status;
				this.grid.tools.dropdowns[0].value = status;
			}
			this.init();
		}
	}
</script>
<style lang="less">
	.video{
		.icon-btn-edit, .icon-btn-edit-hover, .icon-btn-add, .icon-btn-add-hover{
			height: 25px;
			border: 1px solid #00f0ff;
			line-height: 25px;
			padding: 0 8px;
			color: #fff;
			font-size: 12px;
		}
		.icon-btn-edit, .icon-btn-add{
			background: rgba(0, 157, 220, 0.5);
		}
		.icon-btn-edit-hover, .icon-btn-add-hover{
			background: rgba(0, 157, 220, 1);
		}
		.icon-btn-edit-disable, .icon-btn-add-disable{
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
		.video-grid{
			position: relative;
			z-index: 10;
			.col-cameraName, .col-name{
				// width: 18%;
				width: 28%;
				min-width: 195px;
			}
			.col-period{
				width: 12%;
				min-width: 170px;
			}
			.col-recycle, .col-cycleType{
				width: 9%;
				min-width: 80px;
			}
			.col-beginTime, .col-endTime{
				width: 10%;
				min-width: 140px;
			}
			.col-actions{
				padding: 0;
			}
		}
		.shop{
			position: fixed;
			right: 90px;
			bottom: 100px;
			width: 58px;
			height: 58px;
			border-radius: 5px;
			z-index: 50;
			background: rgba(0, 213, 255, 0.6);
		}
		.edit-video{
			&.show{
				.dialog-box{
					height: 200px;
				}
			}
			&.cycleType{
				.dialog-box{
					height: 180px;
				}
			}
			&.recycle{
				.dialog-box{
					height: 210px;
				}
			}
			&.cycleType{
				.cycle{
					display: block;
				}
			}
			&.recycle{
				.re{
					display: block;
				}
			}
			.dialog-box{
				width: 450px;
				height: 160px;
			}
			input {
				width: 98px;
			}
			.dropdown{
				width: 260px;
				.dropdown-button{
					width: 260px;
					border-radius: 4px;
					background: rgba(0, 0, 0, 0.3);
				}
				// .dropdown-list{
				// 	color: #10c9e1;
				// 	&.active{
				// 		color: #fff;
				// 	}
				// }
				.selected{
					width: 225px;
					text-align: left;
					color: #fff;
				}
			}
		}
	}
</style>