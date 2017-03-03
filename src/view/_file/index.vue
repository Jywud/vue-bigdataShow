<template>
<div id="body" class="file">
	<div class="grid-box">
		<div class="title">文件管理</div>
		<div class="content">
			<div class="tree-box">
				<div class="tree-content">
					<Tree
						:data="filepaths"
						:props="treeProps"
						:load="loadNode"
						@node-click="handleNodeClick"
						lazy="" 
					></Tree>
				</div>
			</div>
			<div class="file-grid-box">
				<Grid
					:clz="grid.clz"
					:tools="grid.tools"
					:hasCheckbox="grid.hasCheckbox"
					sequence="序号"
					:headers="grid.headers"
					:items="items"
					:total="total"
					:params="params"
					@pageFn="pageFn"
				></Grid>
			</div>
		</div>
	</div>
</div>
</template>
<script>

	import {Tree} from 'element-ui';
	// import Tree from '../../components/tree/tree.vue'
	import Grid from '../../components/grid/grid.vue';

	export default {
		data () {
			return {
				params: {
					pageNo: 0,
					pageSize: 20
				},
				bHeader: [
					{title: '名称', column: 'name'},
					{title: '文件大小', column: 'size'},
					// {title: '创建时间', column: 'cTime'},
					{title: '最后访问时间', column: 'aTime'},
					{title: '最后更新时间', column: 'mTime'}
				],
				sHeader: [
					{title: '名称', column: 'name'},
					{title: '文件大小', column: 'size'},
					{title: '文件数量', column: 'fileCount'},
					// {title: '创建时间', column: 'cTime'},
					{title: '最后访问时间', column: 'aTime'},
					{title: '最后更新时间', column: 'mTime'}
				],
				grid: {
					clz: 'file-grid',
					tools: {},
					hasCheckbox: false,
					headers: []
				},
				fileList: [],
				filepaths: [
					{
						path: '/',
						name: '大文件卷',
						type: 1
					},
					{
						path: '/',
						name: '小文件卷',
						type: 2
					}
				],
				treeProps: {
					label: 'name', 
					children: ''
				}
			};
		},
		computed: {
			total () {
				return this.fileList.length;
			},
			items () {
				return this.fileList.slice(this.params.pageNo * this.params.pageSize, (this.params.pageNo+1) * this.params.pageSize);
			}
		},
		methods: {
			pageFn (no) {
				this.params.pageNo = no;
			},
			updateGridHeader (type) {
				if (type == 1)
					this.grid.headers = this.bHeader;
				else
					this.grid.headers = this.sHeader;
			},
			init () {
				this.$nextTick(() => {
					document.querySelector('.el-tree-node').click();
					this.updateGridHeader(1);
					UCS.FileManger('getFileData', {path: '/', type: 1}, result => {
						this.fileList = result.files;
					});
				});
			},
			handleNodeClick (data, node) {      
				// if (event.target.className.indexOf('el-tree-node__expand-icon') !== -1)
				// 	return;   
				this.updateGridHeader(data.type);
				if (data.files) {
					this.fileList = data.files;
				} else {
					UCS.FileManger('getFileData', {path: data.path, type: data.type}, result => {
						node.data.files = result.files;
						this.fileList = result.files;
					});
				}
			},
			loadNode(node, resolve) {
				if (node.level === 0) {
					resolve(this.filepaths);
					return this.init();
				} else { 
					this.updateGridHeader(node.data.type);
					UCS.FileManger('getFileData', {path: node.data.path, type: node.data.type}, result => {
						node.data.files = result.files;
						this.fileList = result.files;
						resolve(result.dirs);
					});
				}
			}
		},
		components: {
			Tree,
			Grid
		}
	}
</script>
<style lang="less">
	.file{
		.grid-box{
			.content, .tree-box, .file-grid-box{
				position: absolute;
				bottom: 0;
			}
			.content{
				top: 84px;
				left: 0;
				right: 0;
				background: transparent;
			}
			.tree-box{
				top: 0;
				left: 0;
				width: 262px;
				padding-right: 5px;
				background: transparent;
				overflow: auto;
				border-right: 1px solid rgba(0, 0, 0, 0.5);
				.tree-content{
					width: 100%;
					height: 99%;
					overflow: auto;
				}
				.el-tree{
					background: transparent;
					border: none;
					margin-right: 8px;
					&>.el-tree-node>.el-tree-node__content>.el-tree-node__label{
						&:before{
							background: url('../../assets/bg/tree-root.png');
						}
					}
				}
				.is-current{
					&>.el-tree-node__content{
						background: rgba(6, 226, 255, 0.2);
						&:hover{
							background: rgba(6, 226, 255, 0.2);
						}
					}
				}
				.el-tree-node__content{
					color: #fff;
					// height: 30px;
					// line-height: 30px;
					&:hover{
						background: rgba(6, 226, 255, 0.1);
					}
				}
				.el-tree-node__children{
					overflow: inherit;
				}
				.el-tree-node__label{
					margin-left: 30px;
					min-width: 100px;
					position: relative;
					&:before{
						content: "";
						position: absolute;
						width: 30px;
						height: 23px;
						background: url('../../assets/bg/tree-node.png');
						left: -35px;
						top: 6px;
					}
				}
			}
			.file-grid-box{
				left: 270px;
				right: 20px;
				top: 0;
				&:before{
					content: '';
					position: absolute;
					border-right: 1px solid rgba(171, 224, 255, 0.2);
					left: -8px;
					top: 0;
					bottom: 0;
				}
				.v-tools{
					height: 0;
					margin: 0;
				}
				.v-body{
					top: 0;
				}
				.col-name{
					width: 25%;
				}
				.col-size{
					width: 12%;
				}
				.col-fileCount{
					width: 12%;
				}
				.col-cTime, .col-aTime, .col-mTime{
					width: 15%;
				}
				.row{
					&:hover{
						cursor: default !important;
					}
				}
			}
		}
	}
</style>