<template>
	<div :class="`v-grid ${clz}`">
		<div class="v-tools">
			<span class="date-picker-title" v-if="tools.datePicker">{{tools.datePicker.title}}</span>
			<DatePicker 
			      :type="tools.datePicker.type"
			      :placeholder="tools.datePicker.placeholder"
				v-model="dateValue"
				v-if="tools.datePicker"
			></DatePicker>
			<div :class="`btn ${b.disable ? ('icon-btn-'+b.Key+'-disable') : ('icon-btn-'+ (hover == b.Key ? (b.Key+'-hover'): b.Key))}`" v-for="b of tools.btns" :title="b.title" @click="toolFn(b)" @mouseover="hover = b.Key" @mouseleave="hover = null">{{b.Key == 'refresh' ? '' : b.title}}</div>
			<div class="tools-dropdown rt">
				<dropdown v-for="d of tools.dropdowns"
					:title="d.title"
					:Key="d.Key"
					:value="d.value"
					:list="d.list"
					@checkFn="checkDropdown"
				></dropdown>
			</div>
		</div>
		<div class="v-body">
			<baseGrid 
				:clz="clz" 
				:has-checkbox="hasCheckbox"
				:sequence="sequence"
				:headers="headers" 
				:page-no="params.pageNo"
				:page-size="params.pageSize"
				:items="items" 
				:html="html"
				:actions="actions"
				@checkFn="getSelectArr"
				@rowFn="clickRow"
				@actionFn="actionFn"
			></baseGrid>
		</div>
		<div class="v-foot">
			<pagenation
				:total="total"
				:pageNo="params.pageNo"
				:pageSize="params.pageSize"
				@change-page="changePageFn"
			></pagenation> 
		</div>
	</div>
</template>
<script>

	import baseGrid from './baseGrid.vue';
	import pagenation from '../../components/pagenation.vue';
	import dropdown from '../../components/dropdown.vue';
	import {DatePicker} from 'element-ui';

	export default {
		props: {
			tools: {
				type: Object,
				default () {
					return {
						btns: [],
						datePicker: {},
						dropdowns: []
					}
				}
			},
			clz: {
				type: String,
				default: ''
			},
			hasCheckbox: {
				type: Boolean,
				default: true
			},
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
			html: {
				type: Array,
				default () {
					return [];
				}
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
			params: {
				type: Object,
				default () {
					return {
						pageNo: 0,
						pageSize: 20
					};
				}
			},
			total: {
				type: Number,
				default: 0
			},
			date: {
				type: null,
				default: null
			}
		},
		data () {
			return {
				selectArr: [],
				dateValue: null,
				hover: null
			};
		},
		computed: {
			selectData () {
				return _.map(this.selectArr, id => {
					let obj = null;
					_.forEach(this.items, item => {
						if (item.id == id)
							return obj = item;
					});
					return obj;
				});
			}
		},
		methods: {
			getSelectArr (arr) {
				this.selectArr = arr;
				this.$emit('checkFn', arr);
			},
			changePageFn (no) {
				this.$emit('pageFn', no);
			},
			clickRow (item) {
				this.$emit('rowFn', item);
			},
			toolFn (btn) {
				if (btn.disable) return;
				this.$emit('toolFn', btn, this.selectData);
			},
			checkDropdown (key, value) {
				this.$emit('dropdownFn', key, value);
			},
			actionFn (key, item) {
				this.$emit('actionFn', key, item);
			}
		},
		components: {
			baseGrid,
			pagenation,
			dropdown,
			DatePicker
		},
		watch: {
			date (newValue) {
				this.dateValue = newValue;
			},
			dateValue (newValue, oldVaule) {
				this.$emit('toolFn', 'date', newValue);
			},
			clz () {
				this.dateValue = [null, null];
			}
		}
	}
</script>
<style lang="less">
	.v-grid{
		position: relative;
		width: 100%;
		height: 100%;
		.v-tools{
			height: 30px;
			line-height: 30px;
			margin-bottom: 20px;
			.tools-dropdown{
				height: 30px;
			}
			&>.btn{
				margin-right: 10px;
				vertical-align: middle;
			}
			.date-picker-title{
				color: #fff;
				font-size: 12px;
				margin-right: 5px;
			}
		}
		.v-foot{
			height: 30px;
			margin: 15px 0;
		}
		.el-date-editor{
			width: 330px !important;
			border-bottom: 1px solid rgba(0, 0, 0, 0.1);
			margin-right: 10px;
			&:before{
				position: absolute;
				content: "";
				top: 32px;
				height: 0px;
				right: 2px;
				left: 2px;
				border-bottom: 1px solid rgba(255, 255, 255, 0.2); 
			}
			.el-input__inner{
				width: 330px;
				height: 30px;
				background: rgba(0, 0, 0, 0.3);
				border: none;
				padding-left: 12px;
				border-radius: 4px;
				color: #fff;
			}
			.el-input__icon{
				position: absolute;
				right: 10px;
				width: 19px;
				height: 17px;
				top: 8px;
				z-index: 100;
			}
			.el-icon-time{
				background: url('../../assets/bg/date.png');
				&:before{
					content: ""
				}
			}
		}
	}
</style>