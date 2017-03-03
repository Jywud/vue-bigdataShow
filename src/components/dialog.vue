<template>
<transition name="dialog-scale">
	<div :class="['dialog', clz]" v-show="show">
		<div class="dialog-box">
			<div class="dialog-title">{{title}}</div>
			<slot></slot>
			<div class="dialog-foot">
				<div :class="['btn', btn.Key]" v-for="btn of btns" @click="checkFn(btn.Key)">{{btn.text}}</div>
			</div>
		</div>
	</div>
</transition>
</template>
<script>
	export default {
		props: {
			clz: String,
			title: String,
			show: {
				type: Boolean,
				default: false
			},
			btns: {
				type: Array,
				default () {
					return [
						{Key: 'ok', text: '确定'},
						{Key: 'channel', text: '取消'}
					];
				}
			}
		},
		data () {
			return {};
		},
		methods: {
			checkFn (key) {
				this.$emit('check', key);
			}
		}
	}
</script>
<style lang="less">
	.dialog{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 1000;
		background: rgba(0, 0, 2, 0.6);
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.dialog-box{
		// margin-top: -50px;
		position: relative;
		width: 400px;
		height: 200px;
		background: rgba(47, 95, 129, 0.9);
		border-radius: 5px;
		box-shadow: 0 0 7px 2px rgba(125, 226, 255, 0.2) inset;
		// &:before{
		// 	content: "";
		// 	position: absolute;
		// 	top: 0;
		// 	left: 0;
		// 	right: 0;
		// 	bottom: 0;
		// 	box-shadow: 0 0 7px 1px rgba(0, 0, 0, 0.35);
		// }
	}
	.dialog-title{
		position: relative;
		height: 40px;
		line-height: 40px;
		margin: 0 1px;
		border-bottom: 1px solid rgba(0, 31, 53, 0.8);
		padding-left: 20px;
		color: #fff;
		font-size: 14px;
		font-weight: bold;
		&:after{
			content: "";
			position: absolute;
			bottom: -2px;
			left: 0;
			right: 0;
			border-bottom: 1px solid rgba(171, 224, 255, 0.2);
		}
	}
	.dialog-foot{
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 40px;
		text-align: center;
		.btn{
			width: 80px;
			height: 25px;
			margin: 0 5px;
			line-height: 23px;
			color: #fff;
			font-size: 12px;
			border: 1px solid #00deff;
		}
		.ok{
			background: rgba(6, 226, 255, 0.3);
			&:hover{
				background: rgba(6, 226, 255, 0.5);
			}
		}
		.channel:hover{
			background: rgba(6, 226, 255, 0.3);
		}
	}
	.dialog-scale-enter-active, .dialog-scale-leave-active {
		transition: all 0.25s ease;
		.dialog-box{
			transition: all 0.25s ease;
		}
	}
	.dialog-scale-enter, .dialog-scale-leave-active {
		opacity: 0.2;
		.dialog-box{
			transform: scale(0.8);
			opacity: 0.05;
		}
	}
</style>