<template>
<div class="base-grid">
	<ul class="hdr">
		<li class="col-_check" v-if="hasCheckbox">
			<checkbox @check="checkFn" :is-selected="rootSelected" Key="root"></checkbox>
		</li>
		<li class="col-_no" v-if="sequence">
			<a data-key="_no">
				<span>{{sequence}}</span>
				<span class="pic-hide"></span>
			</a>
		</li>
		<li :class="`col-${col.column}`" v-for="(col, index) of headers">
			<a :data-key="col.column">
				<span>{{col.title}}</span>
				<span class="pic-hide"></span>
			</a>
		</li>
	</ul>
	<transition name="list-grid">
		<div class="g-body" v-show="items.length"> 
			<ul class="row" v-for="(item, index) of items" :key="item.id" @click="clickRow(item, $event)">
				<li class="col-_check" v-if="hasCheckbox">
					<checkbox @check="checkFn" :is-selected="selected(item.id)" :Key="item.id"></checkbox>
				</li>
				<li class="col-_no" v-if="sequence">
					<span>{{pageNo * pageSize + (index + 1)}}</span>
				</li>
				<li :class="`col-${col.column}`" v-for="(col, index) of headers">
					<gridHtml
						:params="item[col.column]"
						:type="getType(col.column)"
						v-if="isHTML(col.column)"
					></gridHtml>
					<span v-else :title="getColTitle(col.column, item, clz, 'title')">{{col.column | getGridValue(item, clz)}}</span>
				</li>
				<li class="rt col-actions">
					<a :class="`btn action icon-${action.key}`" v-for="action of actions" :title="`${action.title}`" @click="actionFn(action.key, item)"></a>
				</li>
			</ul>
		</div>
	</transition>
</div>
</template>
<script>
	import checkbox from '../checkbox.vue';
	import gridHtml from '../grid/grid-html.vue';
	import {getGridValue} from '../../filters.js';
	/**
	 * params: {
	 * 		clz,				//表格class
	 * 		hasCheckbox,		//是否显示checkbox
	 * 		sequence,			//显示序号名
	 * 		headers: [			//显示表格头和列数
	 * 			{
	 * 				title: ‘’,		//对应columns的显示文字
	 *   				column: ‘’,	//表格显示列
	 *   			}
	 * 		],		
	 * 		items: [			//表格显示数据
	 * 			{id, name....}
	 * 		],
	 * 		html: [{key, type}],			//用于显示html的列
	 * 		actions: [			//对于每一列表格元素的所有操作集合
	 * 			{key, title}
	 * 		]			
	 * }
	 */
	export default {
		props: {
			clz: String,
			hasCheckbox: Boolean,
			sequence: {
				type: String,
				default: null
			},
			headers: {
				type: Array,
				default () {
					return [];
				}
			},
			pageNo: {
				type: Number,
				default: 0
			},
			pageSize: {
				type: Number,
				default: 0
			},
			items: {
				type: Array,
				default () {
					return [];
				}
			},
			actions: {
				type: Array,
				default () {
					return [];
				}
			},
			html: {
				type: Array,
				default () {
					return [];
				}
			}
		},
		data () {
			return {
				rootSelected: false,
				selectArr: []
			};
		},
		computed: {
			htmlKeys () {
				return _.map(this.html, item => item.key);
			}
		},
		methods: {
			selected (id) {
				if (_.indexOf(this.selectArr, id) > -1)
					return true;
				return false;
			},
			getType (key) {
				let type = null;
				_.map(this.html, item => {
					if (key == item.key)
						type = item.type;
				});
				return type;
			},
			isHTML (key) {
				if (!this.htmlKeys.length)
					return false;
				return _.indexOf(this.htmlKeys, key) > -1;
			},
			clickRow (item, event) {
				let elClass = event.target.className;
				if (elClass.indexOf('col-_check') === -1 && elClass.indexOf('col-actions') === -1)
					this.$emit('rowFn', item);
			},
			checkFn (key, value) {
				if (key == 'root') {
					this.rootSelected = value;
					if (value)
						this.selectArr = this.items.map((item, idx) => {return item.id;});
					else 
						this.selectArr = [];
				} else {
					if (value) 
						this.selectArr.push(key);
					else 
						this.selectArr.splice(_.indexOf(this.selectArr, key), 1);
				}
			},
			actionFn (key, item) {
				this.$emit('actionFn', key, item);
			},
			getColTitle (key, item, clz, title) {
				return getGridValue(key, item, clz, title);
			},
			beforeEnter: function (el) {
			      el.style.opacity = 0;
			      el.style.marginLeft = '800px';
			},
			enter: function (el, done) {
				var delay = el.dataset.index * 20
				setTimeout(function () {
					Velocity(
						el,
						{ opacity: 1, marginLeft: '0px'},
						{ complete: done }
					)
				}, delay)
			}
		},
		components: {
			checkbox,
			gridHtml
		},
		watch: {
			items (newValue, oldValue) {
				this.rootSelected = false;
				this.selectArr = [];
			},
			selectArr (newValue, oldValue) {
				this.rootSelected = false;
				if (newValue.length !== 0 && newValue.length === this.items.length) 
					this.rootSelected = true;
				this.$emit('checkFn', newValue);
			}
		}
	}
</script>
<style lang="less">
	.base-grid{
		position: relative;
		width: 100%;
		height: 100%;
		color: #fff;
		font-family: '宋体';
		font-size: 12px;
		ul.hdr{
			position: relative;
			background: rgba(220, 220, 220, 0.4);
			margin-right: 13px;
			&:after{
				content: "";
				position: absolute;
				right: -14px;
				top: 0;
				bottom: 0;
				width: 14px;
				background: rgba(220, 220, 220, 0.4);
			}
			a{
				color: #fff;
				font-weight: bold;
			}
			[class^="col-"] {
				
			}
		}
		[class^="col-"] {
			display: inline-block;
			text-align: left;
			vertical-align: middle;
			min-width: 56px;
			line-height: 34px;
			height: 34px;
			padding: 0px 8px;
			white-space:nowrap; 
			text-overflow: ellipsis;
			overflow: hidden;
		}
		.col-_check{
			line-height: 34px;
			padding-top: 7px;
			min-width: 20px;
		}
		.g-body{
			background: transparent;
			overflow-x: hidden;
			transition: opacity 0.5s;
			.row:nth-child(even) {
				background: rgba(255, 255, 255, 0.15);
			}
			.row{
				transition: opacity 0.7s, border 0.05s, background 0.05s;
				margin-right: 5px;
				&:after{
					content: "";
					clear: both;
				}
				border: 1px solid transparent;
				&:hover{
					background: rgba(0, 226, 255, 0.2);
					border: 1px solid #12c5df;
					cursor: pointer;
					.col-actions{
						display: block;
					}
				}
			}
		}
		.col-actions{
			line-height: 30px;
			text-align: center;
			display: none;
			padding: 0 10px;
			.btn{
				width: 24px;
				height: 24px;
				margin: 4px 10px 0 0;
				position: relative;
				background: #fff;
				&:hover{
					background-color: #3eb6e3;
					border-radius: 3px;
				}
			}
		}
		.list-grid-enter {
		  	opacity: 0;
		}
	}
</style>