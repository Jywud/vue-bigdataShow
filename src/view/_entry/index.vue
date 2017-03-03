<template>
	<div class="entry-page">
		<canvas id="c"></canvas>
		<div class="entry-bg"></div>
		<div class="login-content">
			<transition name="entry">
				<div class="wapper" v-show="show">
					<div class="login-logo"></div>
					<div class="icon-login-text"></div>
					<div class="login-box" >
						<div class="account">
							<div class="btn icon-login-account"></div>
							<input id="account" type="text" v-model="account">
						</div>
						<div class="password">
							<div class="btn icon-login-password"></div>
							<input type="password" v-model="password">
						</div>
						<div :class="{
							'login': true,
							'icon-login': !hover,
							'icon-login-hover': hover
							}" @click="login" @mouseover="hover = true" @mouseleave="hover = false">登录</div>
					</div>
				</div>
			</transition>
		</div>
	</div>
</template>
<script>

	var w, h, ctx,
	opts = {
		lineCount: 100,
		starCount: 30,

		radVel: .01,
		lineBaseVel: .1,
		lineAddedVel: .1,
		lineBaseLife: .4,
		lineAddedLife: .01,

		starBaseLife: 10,
		starAddedLife: 10,

		ellipseTilt: -0.2,
		ellipseBaseRadius: .15,
		ellipseAddedRadius: .09,
		ellipseAxisMultiplierX: 2.3,
		ellipseAxisMultiplierY: 0.6,
		ellipseCX: w / 2,
		ellipseCY: h / 2,

		repaintAlpha: .02
	},
	gui = new dat.GUI,

	lines = [],
	stars = [],
	tick = 0,
	first = true;

	function init() {
	  
	  lines.length = stars.length = 0;
	  ctx.globalCompositeOperation = 'source-over';
	  ctx.fillStyle = '#333';
	  ctx.fillRect( 0, 0, w, h );

	  
	  if( first ) {
	    
	    var f = gui.addFolder( 'logics' );
	    f.add( opts, 'lineCount', 1, 300 );
	    f.add( opts, 'starCount', 1, 300 );
	    f.add( opts, 'radVel', 0, 1 );
	    f.add( opts, 'lineBaseVel', .01, 1 );
	    f.add( opts, 'lineAddedVel', 0, 1 );
	    f.add( opts, 'lineBaseLife', 0, 1 );
	    f.add( opts, 'lineAddedLife', 0, 1 );
	    f.add( opts, 'starBaseLife', 0, 100 );
	    f.add( opts, 'starAddedLife', 0, 100 );
	       f = gui.addFolder( 'graphics' );
	    f.add( opts, 'ellipseTilt', -Math.PI, Math.PI ).step( .1 );
	    f.add( opts, 'ellipseBaseRadius', 0, .5 );
	    f.add( opts, 'ellipseAddedRadius', 0, .5 );
	    f.add( opts, 'ellipseAxisMultiplierX', 0, 3 );
	    f.add( opts, 'ellipseAxisMultiplierY', 0, 3 );
	    f.add( opts, 'ellipseCX', 0, w );
	    f.add( opts, 'ellipseCY', 0, h );
	    f.add( opts, 'repaintAlpha', 0, 1 );
	    
	    loop();
	    first = false;
	  }
	}

	function loop() {
	  
	  window.requestAnimationFrame( loop );
	  step();
	  draw();
	}

	function step() {
	  
	  tick += .5;
	  
	  if( lines.length < opts.lineCount && Math.random() < .5 )
	    lines.push( new Line );
	  
	  if( stars.length < opts.starCount )
	    stars.push( new Star );
	  
	  lines.map( function( line ) { line.step(); } );
	  stars.map( function( star ) { star.step(); } );
	}

	function draw() {
	  
	  ctx.shadowBlur = 0;
	  ctx.globalCompositeOperation = 'source-over';
	  ctx.fillStyle = 'rgba(0,0,0,alp)'.replace( 'alp', opts.repaintAlpha );
	  // ctx.fillStyle = 'rgba(255,255,255,1)';
	  ctx.fillRect( 0, 0, w, h );
	  
	  ctx.globalCompositeOperation = 'lighter';
	  
	  ctx.translate( opts.ellipseCX, opts.ellipseCY );
	  ctx.rotate( opts.ellipseTilt );
	  ctx.scale( opts.ellipseAxisMultiplierX, opts.ellipseAxisMultiplierY );
	  
	  // ctx.shadowBlur here almost does nothing
	  lines.map( function( line ) { line.draw(); } );
	  
	  ctx.scale( 1/opts.ellipseAxisMultiplierX, 1/opts.ellipseAxisMultiplierY );
	  ctx.rotate( -opts.ellipseTilt );
	  ctx.translate( -opts.ellipseCX, -opts.ellipseCY );
	  
	  stars.map( function( star ) { star.draw(); } );
	}

	function Line() {
	  
	  this.reset();
	}
	Line.prototype.reset = function() { 

	  this.rad = Math.random() * Math.PI * 2,
	  this.len = w * ( opts.ellipseBaseRadius + Math.random() * opts.ellipseAddedRadius );
	  this.lenVel = opts.lineBaseVel + Math.random() * opts.lineAddedVel;
	  
	  this.x = this.px = Math.cos( this.rad ) * this.len;
	  this.y = this.py = Math.sin( this.rad ) * this.len;
	  
	  this.life = this.originalLife = w * ( opts.lineBaseLife + Math.random() * opts.lineAddedLife );
	  
	  this.alpha = .2 + Math.random() * .8;
	}
	Line.prototype.step = function() {
	  
	  --this.life;
	  
	  var ratio = 1 - .1 *  this.life / this.originalLife;
	  
	  this.px = this.x;
	  this.py = this.y;
	  
	  this.rad += opts.radVel;
	  this.len -= this.lenVel;
	  
	  this.x = Math.cos( this.rad ) * this.len;
	  this.y = Math.sin( this.rad ) * this.len;
	  
	  if( this.life <= 0 )
	    this.reset();
	}
	Line.prototype.draw = function() {
	  
	  var ratio = Math.abs( this.life / this.originalLife - 1/2 );
	  
	  ctx.lineWidth = ratio * 5;
	  ctx.strokeStyle = ctx.shadowColor = 'hsla(hue, 80%, light%, alp)'
	    .replace( 'hue', tick + this.x / ( w * ( opts.ellipseBaseRadius + opts.ellipseAddedRadius ) ) * 100 )
	    .replace( 'light', 75 - ratio * 150 )
	    .replace( 'alp', this.alpha );
	  ctx.beginPath();
	  ctx.moveTo( this.px, this.py );
	  ctx.lineTo( this.x, this.y );
	  
	  ctx.stroke();
	}

	function Star() {
	  
	  this.reset();
	};
	Star.prototype.reset = function() {
	  
	  this.x = Math.random() * w;
	  this.y = Math.random() * h;
	  this.life = opts.starBaseLife + Math.random() * opts.starAddedLife;
	}
	Star.prototype.step = function() {
	  
	  --this.life;
	  
	  if( this.life <= 0 )
	    this.reset();
	}
	Star.prototype.draw = function(){
	  
	  ctx.fillStyle = ctx.shadowColor = 'hsla(hue, 80%, 50%, .2)'
	    .replace( 'hue', tick + this.x / w * 100 );
	  ctx.shadowBlur = this.life;
	  ctx.fillRect( this.x, this.y, 1, 1 );
	};

	function LuukLamers() {
	  
	  var i = 0,
	      array = [ 300, 74, 0.04, 0.1, 0.1, .55, 10, 100, 10, -.15, .18, .01, 3, 1, w / 2, h / 2, 0.02 ];
	  
	  for( var key in opts ) {
	    
	    opts[ key ] = array[ i ];
	    ++i;
	  }
	  
	  init();
	}

	import EventListener from '../../lib/eventListener.js';

	export default {
		data () {
			return {
				show: false,
				hover: false,
				c: null,
				account: '',
				password: ''
			}
		},
		methods: {
			login () {
				if (!_.trim(this.account) || !_.trim(this.password))
					return this.$store.commit('alertShow', '账号或密码不能为空');
				UCS.Common('login', {account: this.account, password: this.password}, result => {
					this.$store.commit('setSession', result);
					this.$router.push({name: 'sys'});
				});
			},
			init () {
				w = this.c.width = window.innerWidth;
				h = this.c.height = window.innerHeight;
				opts.ellipseCX = w / 2;
				opts.ellipseCY = h / 2;
				this.show = true;
			}
		},
		mounted () {
			window.addEventListener( 'resize', () => {
				this.init();
				init();
			});
			this.c = document.getElementById('c');
			if (!this.c)
				return;
			this.init();
			ctx = this.c.getContext( '2d' );
			init();
			this._closeEvent = EventListener.listen(document, 'keyup', (e)=> {
				if (e.which == 13)
					this.login();
			});
			setTimeout(() => {
				let el = document.getElementById('account');
				if (el)
					el.focus();
			}, 2000);
		},
		beforeDestroy() {
			if (this._closeEvent) this._closeEvent.remove();
		}
	}
</script>
<style lang="less">
	.entry-page{
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		.login-content{
			width: 300px;
			height: 290px;
			position: relative;
		}
		.wapper{
			position: absolute;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
		.login-logo{
			width: 110px;
			height: 54px;
			background: url('../../assets/bg/login-logo.gif');
			margin-bottom: 10px;
		}
		.icon-login-text{
			margin-bottom: 20px;
		}
		.login-box{
			width: 300px;
			height: 145px;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			.account, .password{
				position: relative;
				.btn{
					position: absolute;
					left: 12px;
					top: 8px;
					// z-index: -1;
				}
			}
			input{
				border: 1px solid #204569;
				background: rgba(0, 0, 0, 0.3);
				color: #fff;
				padding-left: 40px;
				width: 300px;
				height: 35px;
				&:focus{
					background: rgba(0, 0, 0, 0.5);
					border: 1px solid #0f6b94;
				}
			}
			.login{
				margin-top: 15px;
				line-height: 36px;
				font-size: 14px;
				color: #fff;
				cursor: pointer;
				text-align: center;
			}
		}
		canvas{
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: transparent;
			z-index: -1;
		}
		.entry-bg{
			position: fixed;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			background: url('../../assets/bg/entry-bg.png');
			z-index: 0;
			background-size: cover;
		}
		.entry-enter-active, .entry-leave-active {
			transition: all 1s ease-in-out 1s;
			top: 0;
		}
		.entry-enter, .entry-leave-active {
			opacity: 0;
			top: 120px;
		}
	}
</style>