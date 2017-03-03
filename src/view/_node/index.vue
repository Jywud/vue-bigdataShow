<template>
<div id="body" class="node">
	<div class="grid-box">
		<div class="title">节点监控</div>
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
	</div>
</div>
</template>
<script>
	
	import Grid from '../../components/grid/grid.vue';
	import DiyDialog from '../../components/dialog.vue';

	export default {
		data () {
			return {
				access: false,
				failed: false,
				accessValue: '',
				total: 0,
				timer: null,
				params: {
					pageNo: 0,
					pageSize: 20,
					type: 2,
					status: 2
				},
				grid: {
					tools: {
						btns: [
							{Key: 'refresh', title: '刷新'},
							{Key: 'sync', title: '同步录像周期'}
						],
						dropdowns: [
							{
								title: '类型',
								Key: 'type',
								value: 2,
								list: [
									{name: '所有', value: 2},
									{name: '视频云', value: 1},
									{name: '文件云', value: 0}
								]
							},
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
					clz: 'node-grid',
					hasCheckbox: true,
					headers: [
						{title: '名称', column: 'name'},
						{title: 'IP地址', column: 'ip'},
						{title: '节点类型', column: 'type'},
						{title: '存储空间使用(TB)', column: 'allocatedSpace'},
						{title: 'CPU使用率', column: 'allocatedCpu'},
						{title: '内存使用情况(GB)', column: 'allocatedMem'},
						{title: '网络流量', column: 'flow'},
						{title: '节点加入时间', column: 'time'},
						{title: '状态', column: 'status'}
					],
					html: [
						{
							key: 'allocatedSpace',
							type: 'dropdown'
						}, 
						{
							key: 'allocatedCpu',
							type: 'dropdown'
						}, {
							key: 'allocatedMem',
							type: 'dropdown'
						}, {
							key: 'flow',
							type: 'up-down'
						}, {
							key: 'status',
							type: 'node-status'
						}
					],
					items: [],
					actions: [
						// {key: 'add', title: '添加'}
					]
				},
				selectArr: []
			};
		},
		methods: {
			_init () {
				UCS.NodeManger('getNodeList', Object.assign({}, this.params), result => {
					this.total = result.total;
					this.grid.items = result.items;
				});
			},
			init () {
				this._init();
				if (this.timer)
					clearInterval(this.timer);
				this.timer = setInterval(() => {
					this._init();
				}, 5000);
			},
			checkFn (arr) {
				this.selectArr = arr;
			},
			pageFn (no) {
				this.params.pageNo = no;
				this.init();
			},
			toolFn (btn) {
				if (btn.Key == 'sync') {
					if (!this.$store.state.access)
						return this.access = true;
					return UCS.NodeManger('syncVideo', {}, () => this.init());
				}
				this.init();
			},
			dropdownFn (key, value) {
				this.params[key] = value;
				this.params.pageNo = 0;
				this.init();
			},
			rowFn (item) {
				if (item.type == 0) return;
				this.$router.push({ name: 'single-node', params: {id: item.id}});
			},
			checkAccess (key) {
				if (key == 'ok') {
					UCS.Common('checkAccess', {access: this.accessValue}, result => {
						if (!result)
							return this.failed = true;
						this.access = false;
						UCS.NodeManger('syncVideo', {}, () => {
							this.init();
						});
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
		},
		components: {
			Grid,
			DiyDialog
		},
		mounted () {
			if (this.$route.params.hasOwnProperty('status')) {
				let type = this.$route.params.type;
				let status = this.$route.params.status;
				this.params.type = type;
				this.params.status = status;
				this.grid.tools.dropdowns[0].value = type;
				this.grid.tools.dropdowns[1].value = status;
			}

			this.init();
		},
		beforeDestroy () {
			if (this.timer)
				clearInterval(this.timer);
		}
	}

</script>
<style lang="less">
	.node{
		.icon-btn-sync, .icon-btn-sync-hover{
			height: 25px;
			border: 1px solid #00f0ff;
			line-height: 25px;
			padding: 0 8px;
			color: #fff;
			font-size: 12px;
		}
		.icon-btn-sync{
			background: rgba(0, 157, 220, 0.5);
		}
		.icon-btn-sync-hover{
			background: rgba(0, 157, 220, 1);
		}
		.node-grid{
			.col-name{
				width: 7%;
				min-width: 85px;
			}
			.col-ip{
				width: 9%;
				min-width: 100px;
			}
			.col-type{
				width: 6%;
				min-width: 70px;
			}
			.col-allocatedSpace, .col-allocatedCpu, .col-allocatedMem{
				width: 12%;
				min-width: 150px;
			}
			.col-flow{
				width: 13%;
				min-width: 190px;
			}
			.col-time{
				width: 10%;
				min-width: 132px;
			}
		}
	}
</style>