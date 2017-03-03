<template>
	<div class="dropdown">
		<a class="btn dropdown-button" @click="open">
			{{title ? title+' :' : ''}}
			<span class="selected">{{name}}</span>
			<span :class="{
				'pic': true,
				'open': showMenu 
			}"></span>
		</a>
		<transition name="dropdown">
			<ul class="dropdown-content" v-show="showMenu" :style="{'height':  `${height}px`, maxHeight: '150px'}">
				<li v-for="item of list" :class="{
					'dropdown-list': true,
					'active': v == item.value
				}" @click="checkFn(item)">{{item.name}}</li>
			</ul>
		</transition>
	</div>
</template>
<script>
	
	import EventListener from '../lib/eventListener.js';

	export default {
		props: {
			title: {
				type: String,
				defalut: ''
			},
			Key: {
				type: null
			},
			value: {
				type: null
			},
			list: {
				type: Array,
				default () {
					return [];
				}
			}
		},
		data () {
			return {
				v: this.value,
				showMenu: false
			};
		},
		computed: {
			height () {
				if (!this.showMenu)
					return 0;
				return 30*this.list.length;
			},
			name () {
				let name = '';
				_.map(this.list, (item, idx) => {
					if (item.value == this.v)
						name = item.name;
				});
				return name;
			}
		},
		methods: {
			open () {
				this.showMenu = !this.showMenu;
			},
			checkFn (item) {
				this.showMenu = false;
				// if (this.v == item.value) return;
				this.v = item.value;
				this.$emit('checkFn', this.Key, this.v);
			}
		},
		watch: {
			value (newValue) {
				this.v = newValue;
			}
		},
		mounted () {
			this._closeEvent = EventListener.listen(window, 'click', (e)=> {
				if (!this.$el.contains(e.target)) 
					this.showMenu = false;
			});
		},
		beforeDestroy() {
			if (this._closeEvent) this._closeEvent.remove();
		}
	}

</script>
<style lang="less">
	.dropdown{
		display: inline-block;
		position: relative;
		width: 130px;
		height: 30px;
		top: 0;
		margin-left: 10px;
		.dropdown-button{
			display: inline-block;
			position: absolute;
			top: 0;
			width: 130px;
			height: 30px;
			line-height: 30px;
			padding: 0 8px;
			color: #fff;
			font-size: 12px;
			background: rgba(255, 255, 255, 0.15);
			.selected{
				position: absolute;
				top: 0;
				right: 25px;
				width: 70px;
				height: 30px;
				text-align: right;
				color: #10c9e1;
			}
			.pic{
				position: absolute;
				top: 14px;
				right: 8px;
				border-top: 4px solid #10c9e1;
				border-right: 4px solid transparent;
				border-bottom: 4px solid transparent;
				border-left: 4px solid transparent;
				transition: all 0.4s;
				transform-origin: 50% 15%;
			}
			.open{
				transform: rotate(-180deg);
			}
		}
		.dropdown-content{
			position: absolute;
			top: 31px;
			right: 0px;
			left: 0;
			background: rgba(7, 48, 78, 0.95);
			overflow-y: auto;
			z-index: 200;
			box-shadow:  0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
		}
		.dropdown-list{
			height: 30px;
			line-height: 30px;
			cursor: pointer;
			padding-left: 8px;
			font-size: 12px;
			color: #fff;
			&.active, &:hover{
				background: #295671;
			}
			&.active{
				color: #10c9e1;
			}
		}
		.dropdown-enter-active, .dropdown-leave-active {
			transition: all .4s;
		}
		.dropdown-enter, .dropdown-leave-active {
			opacity: 0;
		}
	}
</style>