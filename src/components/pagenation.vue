<template>
	<div class="page-nation">
		<div class="page-total">
			<span>从 {{total ? (pno * pageSize + 1) : 0}} 到 {{Math.min(((pno + 1) * pageSize), total)}} </span>
			<span>/ 共 {{total}} 条数据</span>
		</div>
		<div class="page-items" v-if="total !== 0">
			<a :class="{'previous btn': true, 'disable': pno === 0}" @click="change(-1)"><span></span>上一页</a>
			<a :class="{'page-item btn': true, 'active': item == pno + 1}" v-for="item of items" @click="jump(item)">{{item}}</a>
			<a :class="{'next btn': true, 'disable': pno === pages - 1}" @click="change(1)">下一页<span></span></a>
			<input type="text" v-model="jumpNo" class="page-jump">
			<a class="go btn" @click="jump(jumpNo)">跳转</a>
		</div>
	</div>
</template>
<script>
	export default {
		props: {
			total: {
				type: Number,
				defatult: 0
			},
			pageNo: {
				type: Number,
				default: 0
			},
			pageSize: {
				type: Number,
				default: 20
			}
		},
		data () {
			return {
				jumpNo: '',
				pno: this.pageNo
			};
		},
		computed: {
			pages () {
				return Math.ceil(this.total / this.pageSize); 
			},
			items () {
				if (this.pages <= 6)
					return _.repeat('0', this.pages).split('').map((item, idx) => {return idx + 1;});
				else {
					if (this.pno < 4)
						return [1, 2, 3, 4, 5, '...', this.pages];
					else if (this.pno > this.pages - 5) 
						return [1, '...',this.pages - 4,  this.pages - 3, this.pages - 2, this.pages - 1, this.pages];
					else
						return [1, '...', this.pno, this.pno + 1, this.pno + 2, '...', this.pages];
				}
			}
		},
		methods: {
			jump (no) {
				if (_.isNaN(Number(no)) || Number(no) <= 0 || no > this.pages ||_.round(no) != no) {
					store.commit('alertShow', "请输入有效的页码！");
					return;	
				}

				this.pno = no - 1;
				this.$emit('change-page', this.pno);
			},
			change (no) {
				const number = this.pno + no;
				this.pno = Math.max(0, Math.min(this.pages - 1, number));
				if (event.target.className.indexOf('disable') === -1)
					this.$emit('change-page', this.pno);
			}
		},
		watch: {
			pageNo (newValue) {
				this.pno = newValue;
			}
		}	
	}
</script>
<style lang="less">
	.page-nation{
		width: 100%;
		height: 30px;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #fff;
		.page-total{
			position: absolute;
			left: 5px;
			line-height: 30px;
			font-size: 12px;
		}
		.page-items{
			font-size: 12px;
		}
		.page-item, .go{
			width: 30px;
		}
		.previous, .next, .page-item, .go{
			text-align: center;
			line-height: 30px;
			height: 30px;
			border: 1px solid #fff;
			margin-right: 10px;
		}
		.previous, .next{
			width: 70px;
			span{
				width: 8px;
				height: 8px;
				display: inline-block;
				border-top: 1px solid #fff;
				border-right: 1px solid #fff;
			}
		}
		.previous{
			span{
				transform: rotate(-135deg);
				margin-right: 2px;
			}
		}
		.next{
			span{
				transform: rotate(45deg);
				margin-left: 2px;
			}
		}
		.active{
			background: rgba(0, 157, 220, 0.5);
		}
		.btn.disable{
			cursor: default;
		}
		.page-jump{
			display: inline-block;
			width: 40px;
			height: 30px;
			margin-right: 5px;
			vertical-align: top;
			color: #fff;
			border-radius: 4px;
			background: rgba(0, 0, 0, 0.3);
			border: 1px solid transparent;
			text-align: center;
			&:focus{
				border: 1px solid #0993b0;
			}
		}
		.go{
			width: 40px;
		}
		// input{
		// 	border: 1px solid #fff;
		// 	background: #fff;
		// 	width: 40px;
		// 	height: 30px;
		// 	margin-right: 10px;
		// }
	}
</style>