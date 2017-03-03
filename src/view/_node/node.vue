<template>
<div id="body" class="single-node">
	<div class="grid-box">
		<div class="title">节点监控</div>
		<div class="node-message">
			<div class="node-name"><div class="label">存储节点：</div>{{message.name}}</div>
			<div class="node-cpu"><div class="label">CPU：</div>{{message.cpu}} 核</div>
			<div class="node-system"><div class="label">操作系统：</div>{{message.system}}</div>
			<div class="node-status"><div class="label">状态：</div>{{message.status | getNodeStatus}}</div>
			<div class="node-ip"><div class="label">IP地址：</div>{{message.ip}}</div>
			<div class="node-allocatedSpace"><div class="label">存储空间：</div>{{message.allocatedSpace}} TB</div>
			<div class="node-allocatedMem"><div class="label">内存：</div>{{message.allocatedMem}} GB</div>
		</div>
		<div class="node-tab">
			<Tab
				:items="tabs"
			></Tab>
		</div>
		<div class="grid-content node-content">
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
				@pageFn="pageFn"
				@dropdownFn="dropdownFn"
			></Grid>
		</div>
	</div>
</div>
</template>
<script>

	import Grid from '../../components/grid/grid.vue';
	import Tab from '../../components/tab.vue';

	export default {
		data () {
			return {
				message: {},
				tabs: [{Key: 1, title: '录像通道'}],
				total: 0,
				timer: null,
				params: {
					pageNo: 0,
					pageSize: 20,
					id: null,
					status: 2
				},
				grid: {
					tools: {
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
					clz: 'single-node-grid',
					hasCheckbox: false,
					headers: [
						{title: '通道名称', column: 'name'},
						{title: '覆盖周期', column: 'recycle'},
						{title: '循环类型', column: 'cycleType'},
						{title: '状态', column: 'status'}
					],
					html: [
						{
							key: 'status',
							type: 'node-status'
						}
					],
					items: []
				}
			};
		},
		methods: {
			_init () {
				UCS.NodeManger('getSingleNodeMessage', {id: this.params.id}, result => {
					this.message = result;
				});
				UCS.NodeManger('getSingleNodeList', Object.assign({}, this.params), result => {
					this.total = result.total;
					this.grid.items = result.items;
				});
			},
			init () {
				this._init();
				if (!this.timer)
					this.timer = setInterval(() => {
						this._init();
					}, 5000);
			},
			pageFn (no) {
				this.params.pageNo = no;
				this.init();
			},
			dropdownFn (key, value) {
				this.params[key] = value;
				this.params.pageNo = 0;
				this.init();
			}
		},
		components: {
			Grid,
			Tab
		},
		mounted () {
			this.params.id = this.$route.params.id;
			this.init();
		},
		beforeDestroy () {
			if (this.timer)
				clearInterval(this.timer);
		}
	}
</script>
<style lang="less">
	.single-node{
		.node-message{
			position: absolute;
			top: 77px;
			left: 30px;
			right: 30px;
			height: 50px;
			background: rgba(0, 26, 45, 0.4);
			padding: 15px 38px;
			margin-bottom: 22px;
			box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.2) inset;
			&:before{
				content: '';
				position: absolute;
				top: 50px;
				left: 1px;
				right: 1px;
				box-shadow: 0 0 1px 1px rgba(255, 255, 255, 0.1);
			}
			[class^="node-"]{
				display: inline-block;
				height: 20px;
				line-height: 20px;
				width: 13%;
				min-width: 150px;
				font-size: 12px;
				color: #fff;
				margin-right: 10px;
			}
		}
		.node-tab{
			position: absolute;
			top: 155px;
			left: 40px;
			height: 24px;
		}
		.node-content{
			top: 150px;
		}
		.single-node-grid{
			padding: 0 15px;
			.col-_no{
				padding-left: 15px;
			}
			.col-name, .col-recycle, .col-cycleType{
				width: 25%;
			}
			.row:hover{
				cursor: default !important;
			}
		}
	}
</style>