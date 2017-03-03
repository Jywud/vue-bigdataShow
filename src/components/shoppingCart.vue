<template>
	<div class="shop-cart" @click="showFn">
		<div class="button">{{title}}</div>
		<div class="sup">{{total}}</div>
		<transition name="shop">
			<div class="shopping-list" v-show="show">
				<transition-group name="list-complete" tag="ul" class="content">
					<li class="shopping-item" v-for="(item, index) of items" v-bind:key="item" @mouseover="showId = item.id" @mouseleave="showId = null">
						<div class="shopping-_no">{{(index+1).toString().length == 1 ? '0'+(index+1) : (index+1)}}</div>
						<div class="shopping-name">{{item.name}}</div>
						<div :class="{
							'icon-shopping-close': (hoverId === null && item.id == showId),
							'icon-shopping-close-hover': item.id == hoverId
						}" @click="deleteFn(item)" @mouseover="hoverId = item.id" @mouseleave="hoverId = null"></div>
					</li>
				</transition-group>
				<div class="shopping-contrast" @click="contrastFn">开始对比</div>
				<div class="shopping-clean" @click="cleanFn">全部清除</div>
			</div>
		</transition>
	</div>
</template>
<script>
	
	import eventListener from '../lib/eventListener.js';

	export default {
		props: {
			title: String,
			items: {
				type: Array,
				default () {
					return [];
				}
			}
		},
		data () {
			return {
				show: false,
				showId: null,
				hoverId: null
			};
		},
		computed: {
			total () {
				return this.items.length;
			}
		},
		methods: {
			showFn () {
				if (event.target.className.indexOf('shopping') === -1)
					this.show = !this.show;
			},
			deleteFn (item) {
				this.$store.commit('deleted', item);
			},
			contrastFn () {
				if (!this.items.length)
					return this.$store.commit('alertShow', '请先加入录像，再进行比对');;
				this.$router.push({name: 'comparison'});
			},
			cleanFn () {
				_.forEach(this.items, item => {
					this.$store.commit('deleted', item);
				});
			}
		},
		mounted () {
			this._closeEvent = eventListener.listen(window, 'click', (e)=> {
				if (e.target.className.indexOf('icon-btn-add-hover') === -1 && !this.$el.contains(e.target)) 
					this.show = false;
			});
		},
		beforeDestroy() {
			if (this._closeEvent) this._closeEvent.remove();
		},
		watch: {
			items () {
				setTimeout(() => {
					this.show = true;
				}, 0);
			}
		}
	}

</script>
<style lang="less">
	.shop-cart{
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		z-index: 100;
		.button{
			width: 30px;
			color: #fff;
			font-size: 14px;
			line-height: 20px;
		}
		.sup{
			position: absolute;
			right: -6px;
			top: -6px;
			width: 20px;
			height: 20px;
			line-height: 20px;
			border-radius: 50%;
			background: #ff1f1f;
			color: #fff;
			font-size: 12px;
			text-align: center;
			line-height: 18px;
		}
		.shopping-list{
			position: absolute;
			overflow: hidden;
			left: -337px;
			bottom: 0;
			width: 335px;
			border-radius: 5px;
			background: rgba(7, 48, 78, 0.95);
			height: 400px;
			padding: 0 5px 58px 0px;
			.content{
				height: 342px;
				overflow-y: auto;
			}
			box-shadow: 0 0 3px 2px rgba(0, 0, 0, 0.35);
		}
		.shopping-item{
			color: #fff;
			height: 50px;
			line-height: 50px;
			font-size: 12px;
			position: relative;
			margin-right: 5px;
			padding-left: 20px;
			transition: all 0.5s ease-out;
			z-index: 100;
			&:hover{
				background: #295671;
			}
			&:before, &:after{
				content: "";
				position: absolute;
				left: 20px;
				right: 0;
				bottom: -2px;
			}
			&:before{
				bottom: 0px;
				border-bottom: 1px solid rgba(0, 0, 0, 0.5);
			}
			&:after{
				bottom: -1px;
				border-bottom: 1px solid rgba(171, 224, 255, 0.2);
			}
			&>[class^="shopping"]{
				display: inline-block;
				height: 50px;
				line-height: 50px;
				vertical-align: middle;
			}
			.shopping-_no{
				margin-left: 6px;
				margin-right: 12px;
			}
			.shopping-name{
				max-width: 240px;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
			}
			[class^="icon-shopping-close"]{
				position: absolute;
				right: 5px;
				top: 19px;
				z-index: 110;
			}
		}
		.shopping-contrast, .shopping-clean{
			position: absolute;
			line-height: 26px;
			color: #fff;
			text-align: center;
			font-size: 12px;
		}
		.shopping-contrast{
			width: 84px;
			height: 26px;
			background: #009ddc;
			left: 128px;
			bottom: 15px;
		}
		.shopping-clean{
			width: 70px;
			height: 28px;
			right: 20px;
			bottom: 15px;
			border: 1px solid #1f5882;
			border-radius: 5px;
		}
		.list-complete-enter, .list-complete-leave-active {
		  	opacity: 0;
		  	transform: translateX(-400px);
		}
		.list-complete-leave-active {
			position: absolute;
		}
		.shop-enter-active, .shop-leave-active {
			transition: all .4s;
			transform-origin: 110% 95%;
		}
		.shop-enter, .shop-leave-active {
			opacity: 0.5;
			transform: scale(0);
		}
	}
</style>