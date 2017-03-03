<template>
	<a class="checkbox-a" :data-key="Key" @click="checkFn()">
		<span :class="{
			checkbox: true,
			selected: selected
		}">{{text}}</span>
	</a>
</template>
<script>

	export default {
		props: {
			Key: {
				type: null,
				default: ''
			},
			isSelected: {
				type: Boolean,
				default: false
			},
			text: String
		},
		data () {
			return {
				selected: this.isSelected
			};
		},
		methods: {
			checkFn () {
				event.stopPropagation();
				this.selected = !this.selected;
				this.$emit('check', this.Key, this.selected);
			}
		},
		watch: {
			isSelected (newValue, oldValue) {
				this.selected = newValue;
			}
		}
	}
</script>
<style lang="less">
	.checkbox-a{
		&, &>*{
			display: inline-block;
		}
		.checkbox{
			position: relative;
			padding-left: 25px;
			cursor: pointer;
			display: inline-block;
			color: #fff;
			height: 20px;
			line-height: 20px;
			font-size: 1rem;
			&:before{
				left: 0;
				width: 0;
				height: 0;
				border-radius: 1px;
				margin-top: 2px;
				border: 3px solid transparent;
				left: 6px;
				top: 10px;
				transform: rotateZ(37deg);
				transform-origin: 100% 100%;
			}
			&:after{
				height: 16px;
				width: 16px;
				background-color: rgba(0, 0, 0, 0.3);
				top: 0px;
				left: 0;
				border-radius: 2px;
			}
			&:before, &:after{
				z-index: 1;
				content: '';
				position: absolute;
				transition: border .25s, background-color .25s, width .2s .1s, height .2s .1s, top .2s .1s, left .2s .1s;
				box-sizing: inherit;
			}
			&.selected:before{
				top: -2px;
				left: 0;
				width: 8px;
				height: 13px;
				border-top: 2px solid transparent;
				border-left: 2px solid transparent;
				border-right: 2px solid #fff;
				border-bottom: 2px solid #fff;
				transform: rotateZ(37deg);
				transform-origin: 100% 100%;
			}
			&.selected:after{
				top: 0px;
				width: 16px;
				height: 16px;
				// background-color: #0be5a5;
				background-color: #12f2fa;
				z-index: 0;
			}
		}
	}
</style>