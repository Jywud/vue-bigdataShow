<template>
<div class="wave-pic">
	<div class="wave-box">
		<div class="shadow1"></div>
	</div>
	<div class="wave-box">
		<div class="shadow2"></div>
	</div>
	<div class="wave-box">
		<div class="shadow3"></div>
	</div>
	<div class="wave-box">
		<svg class="circle">
			<circle cx="50%" cy="50%" r="68" fill-opacity="0" stroke="#01f1b6" stroke-width="4"></circle>
		</svg>
	</div>
	<div class="wave-box">
		<svg class="wave">
			<path :d="w1" fill="#01f1b6" stroke="none"></path>
			<path :d="w2" fill="#01f1b6" stroke="none"></path>
			<text x="50%" y="50%" dy="0.3em" fill="#fff" text-anchor="middle" font-size="24">{{percent}}%</text>
			<text x="52%" y="50%" dy="2.4em" fill="#fff" text-anchor="middle" font-size="12">{{used}}/{{all}} TB</text>
		</svg>
	</div>
	<div class="wave-box">
		<div class="icon-glass"></div>
	</div>
</div>
</template>
<script>
	export default {
		props: {
			used: {
				type: Number,
				default: 0
			},
			all: {
				type: Number,
				default: 1
			}
		},
		data () {
			return {
				percent: 0,
				high: 110,
				x1: 0,
				x2: -120,
				r: 0,
				timer: null,
				timer4wave: null
			};
		},
		computed: {
			w1 () {
				return `M${this.x1}, ${this.high} q30, ${this.r} 60, 0 t60,0 t60,0 l0, 150 l-180, 0`;
			},
			w2 () {
				return `M${this.x2}, ${this.high} q30, ${this.r} 60, 0 t60,0 t60,0 l0, 150 l-180, 0`;
			}
		},
		methods: {
			autoRefresh () {
				let vm = this;
			      function animate (time) {
					requestAnimationFrame(animate)
					TWEEN.update(time)
			      }
			      new TWEEN.Tween({ tweenR: 12 })
					.easing(TWEEN.Easing.Quadratic.Out)
					.onUpdate(function () { 
						vm.r = this.tweenR;
					})
					.to({ tweenR: 0.5 }, 8000)
					.start();
			      animate();
			},
			update (newUsed, newAll) {
				let vm = this;
			      let newPercent = Math.max(0, Math.min(100, (newUsed / newAll * 100)));
			      new TWEEN.Tween({ tweenPercent: vm.percent, tweenHeight: vm.high })
					.easing(TWEEN.Easing.Quadratic.Out)
					.onUpdate(function () { 
						vm.percent = this.tweenPercent.toFixed(0);
						vm.high = 120 - (this.tweenHeight*1.2).toFixed(0);
					})
					.to({ tweenPercent: newPercent, tweenHeight: newPercent }, 1500)
					.start();
				this.autoRefresh();
			},
			init () {
				let self = this;
				function doAnimation(timestamp) {
					self.x1 += 1.8;
					self.x2 += 1.8;
					if (self.x1 > 120 || self.x1 == 120)
						self.x1 = -120;
					if (self.x2 > 120 || self.x2 == 120)
						self.x2 = -120;
					window.requestAnimationFrame(doAnimation);
				}

				// Start animation
				window.requestAnimationFrame(doAnimation);

				// this.timer4wave = setInterval(() => {
		  //     		      this.autoRefresh();
				// }, 10000);
			}
		},
		watch: {
			used (newValue, oldValue) {
				this.update(newValue, this.all || 1);
			},
			all (newValue, oldValue) {
				this.update(this.used, newValue || 1);
			}
		},
		mounted () {
			this.init();
		},
		beforeDestroy () {
			clearInterval(this.timer);
			clearInterval(this.timer4wave);
		}
	}
</script>
<style lang="less">
	.wave-pic{
		position: relative;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		.wave-box, .circle{
			width: 100%;
			height: 100%;
		}
		.wave-box{
			position: absolute;
			left: 0;
			top: 5%;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.wave{
			width: 120px;
			height: 120px;
			border-radius: 50%;
		}
		.shadow1, .shadow2, .shadow3{
			border-radius: 50%;
		}
		@keyframes diffuse {
			0%{
				border: 1px solid #11b094;
				width: 136px;
				height: 136px;
				opacity: 0.75;
				box-shadow: 0 0 3px 3px rgba(31, 151, 124, 0.3);
			}
			66%{
				border: 1px solid #11b094;
				width: 285px;
				height: 285px;
				opacity: 0;
				box-shadow: 0 0 10px 10px rgba(31, 151, 124, 0.3);
			}
			100% {
				width: 136px;
				height: 136px;
				opacity: 0;
			}
		}
		.shadow1{
			animation: diffuse 5s ease-in-out infinite;
		}
		.shadow2{
			animation: diffuse 5s ease-in-out 0.9s infinite;
		}
		.shadow3{
			animation: diffuse 5s ease-in-out 1.7s infinite;
		}
	}
</style>