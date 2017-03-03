<template>
	<div class="alert" style="width: 0" @mouseover="over = true" @mouseleave="hideFn">
		<div class="icon-hint"></div>
		<div class="content">{{content}}</div>
		<div :class="{
			'rt': true,
			'icon-close': !isHover,
			'icon-close-hover': isHover
		}" @mouseover="isHover = true" @mouseleave="isHover = false" @click="closeFn"></div>
	</div>
</template>
<script>
	export default {
		data () {
			return {
				over: false,
				isHover: false,
				timer: null
			};
		},
		computed: {
			content () { 
				return this.$store.state.alertConent;
			}
		},
		methods: {
			closeFn () {
				this.$store.commit('alertHide');
				clearTimeout(this.timer);
			},
			hideFn () {
				this.over = false;
				this.timer = setTimeout(() => {
					if (!this.over)
						this.closeFn();
				}, 3000);
			}
		}
	}
</script>
<style lang="less">
	.alert{
		position: fixed;
		z-index: 2000;
		top: 130px;
		left: 0;
		right: 0;
		margin: auto;
		min-width: 670px;
		height: 56px;
		color: #fff;
		border: 1px solid #fe90b2;
		background: rgba(222, 124, 147, 0.9);
		border-radius: 5px;
		padding: 17px 16px 17px 21px;
		word-break:keep-all;
		white-space:nowrap;
		&>*{
			vertical-align: middle;
		}
		.content{
			display: inline-block;
			padding-left: 7px;
			height: 22px;
			line-height: 22px;
		}
		.rt{
			margin-top: 3px;
			cursor: pointer;
		}
	}
</style>