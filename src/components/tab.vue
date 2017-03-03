<template>
	<div class="tab">
		<div :class="{
			'tab-item': true,
			'active': item.Key == active,
			'cursor': items.length > 1
		}" v-for="item of items" @click="clickFn(item)">{{item.title}}</div>
	</div>
</template>
<script>
	/**
	 * items: [
	 * 	{Key, title}
	 * ]
	 */
	export default {
		props: {
			items: {
				type: Array,
				default () {
					return [];
				}
			}
		},
		data () {
			return {
				active: this.items[0] ? this.items[0].Key : null
			};
		},
		methods: {
			clickFn (item) {
				this.active = item.Key;
				this.$emit('clickFn', item);
			}
		},
		watch: {
			items (newValue) {
				this.active = newValue[0] ? newValue[0].Key : null;
			}
		}
	}
</script>
<style lang="less">
	.tab{
		color: #fff;
		font-size: 14px;
		font-weight: bold;
		.tab-item{
			position: relative;
			display: inline-block;
			width: 70px;
			height: 24px;	
			text-align: center;
			margin-right: 10px;
			&:after{
				content: "";
				position: absolute;
				right: -6px;
				width: 0;
				top: 1px;
				height: 12px;
				border-left: 1px solid rgba(0, 0, 0, 0.5);
				border-right: 1px solid rgba(171, 224, 255, 0.2);
			}
			&:last-of-type{
				&:after{
					display: none;
				}
			}
		}
		.cursor{
			cursor: pointer;
		}
		.active{
			border-bottom: 2px solid #00b5fd;
		}
	}
</style>