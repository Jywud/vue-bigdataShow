<template>
	<div class="rack-cab">
		<div class="rack-title" @mouseover="titleHover=true" @mouseleave="titleHover=false">	
			<checkbox :id="`rack-checkbox-id${rackId}`" class="rack-checkbox" 
				Key="rack-check"
				:isSelected="selected" @check="checkFn" v-show="showEditPage && !editingTitle"></checkbox>
			<input :id="`rack-edit-title-id${rackId}`" class="rack-edit-title" type="text" v-model="inputTitle" v-show="showEditPage && editingTitle" @keyup.enter="titleEdit(true)" @blur="titleEdit(false)">
			<a class="rack-titleName" v-show="!showEditPage || !editingTitle">{{cabInfo.name}}</a>
			<div class="edit-content" v-show="showEditPage && !editingTitle && titleHover" @click="clickEdit" @mouseover="editHover=true" @mouseleave="editHover=false">
				<span :class="{
					'icon-rack-edit': !editHover,
					'icon-rack-edit-hover': editHover
				}"></span>
				<span :class="{
					'edit-title': !editHover,
					'edit-title-hover': editHover
				}">编辑</span>
			</div>
		</div>
		<div class="rack-slide" @click="clickSlide">
			<div class="icon-rack-slide" :style="{'left': `${(slideFront? 38: 3)}px`, 'background-color':`${(slideFront? '#11b7f5': '#05d2ac')}`}"></div>
			<div class="rack-slide-title" :style="{'left': `${(slideFront? 5: 32)}px`, 'color':`${(!slideFront? '#05d2ac': '#00c7fe')}`}">{{slideTitle}}</div>
		</div>
		<div class="rack-body">
			<div class="rack-side rack-side-front">
				<rack-element :class="`rack-element${index}`" v-for="(item, index) of cabElements" @click="clickAddNew(item)"
					:editPage="showEditPage"
					:front="true"
					:itemObj="item"
					@onEditOneElement="onEditOneElement"
					@onShowElementDetail="onShowElementDetail"
				></rack-element>
			</div>
			<div class="rack-side rack-side-back">
				<rack-element :class="`rack-element${index}`" v-for="(item, index) of cabElements" @click="clickAddNew(item)"
					:editPage="showEditPage"
					:front="false"
					:itemObj="item"
					@onEditOneElement="onEditOneElement"
					@onShowElementDetail="onShowElementDetail"
				></rack-element>	
			</div>
			<div class="rack-side rack-side-left"></div>
			<!--div id="rack-side-right" class="rack-side"></div-->
		</div>
	</div>
</template>
<script>
	import Checkbox from '../checkbox.vue';
	import RackElement from './rack-element.vue';

	/**
	 * items: [
	 * 	{Key, title}
	 * ]
	 */
	export default {
		props: {
			selected: Boolean,
			showEditPage: Boolean,
			cabInfo: {
				type: Object,
				default () {
					return {};
				}
			}
		},
		data () {
			return {
				inputEl: null,
				inputTitle: this.cabInfo.name,
				editingTitle: false,
				slideFront: true,
				editHover: false,
				titleHover: false,
				text: '机柜名',
				aryElements:[]
			};
		},
		computed: {
			rackId () {
				return this.cabInfo.id;
			},
			slideTitle () {
				if (this.slideFront)
					return "正面";
				else
					return "背面";
			},
			cabElements () {
				this.aryElements = [];
				if (!_.isUndefined(this.cabInfo.devices)) {
					//添加初始值
					const Max_Elements = 8;
					for (let i = 0; i < Max_Elements; i++) {
						this.aryElements.push({hasData: false, rackId: this.cabInfo.id, ip: "", id: i+1, type: -1, size: -1, faultList: null});
					}

					//已有的element位置值重置
					for (let j in this.cabInfo.devices) {
						let cab = this.cabInfo.devices[j];
						this.aryElements[cab.location-1] = {hasData: true, rackId: cab.rackId, ip: cab.ip, id: cab.id, type: cab.type, size: cab.size, faultList: cab.faultList};
					}
				}

				return this.aryElements;
			}
		},
		methods: {
			tabChange () {
				this.editingTitle = false;
			},
			checkFn (key, value) {
				if (key == 'rack-check')
					this.$emit("checkFn", this.rackId, value);
			},
			clickEdit () {
				if (this.showEditPage) {
					this.editingTitle = true;
					this.$nextTick(() => {
						document.getElementById('rack-edit-title-id'+this.rackId).focus();
					});
				}
			},
			clickSlide () {
				this.slideFront = !this.slideFront;
				this.$el.getElementsByClassName("rack-body")[0].classList.toggle('rack-rotate');
				//this.$el.getElementsByClassName("rack-slide-title")[0].classList.toggle('fadeIn');
			},
			titleEdit (bEdited) {
				this.editingTitle = false;
				if (bEdited && this.cabInfo.name != this.inputTitle) {
					//修改title
					//this.cabInfo.name = this.inputTitle
					this.$emit("onEditRackTitle", this.cabInfo.id, this.inputTitle);
				}	
			},
			onEditOneElement (type, element) {
				this.$emit('onEditRackElement', type, element);
			},
			onShowElementDetail (bShow, detailObj) {
				this.$emit('onShowElementDetail', bShow, detailObj);
			}
		},
		components: {
			RackElement,
			Checkbox
		},
		watch: {
			showEditPage (newValue, oldValue) {
				this.editingTitle = false;
			}
		}
	}
</script>
<style lang="less">
	.rack-cab {
		position: relative;
		display: inline-block;
		width: 219px;
		height: 890px;
		margin-right: 120px;

		.edit-title {
			line-height: 20px;
			color: white;
			font-size: 14px;
			font-weight: bold;
		}
		.edit-title-hover {
			line-height: 20px;
			color: #00c7fe;
			font-size: 14px;
			font-weight: bold;
		}

		.rack-title {
			//background: #ff0;
			height: 20px;
			width: 100%;
			text-align: center;
			line-height: 20px;
			margin-bottom: 15px;
			position: relative;
			cursor: pointer;
			input{
				display: inline-block;
				width: 180px;
				border: none;
				height: 30px;
				margin-left: 10px;
				vertical-align: top;
				padding-left: 10px;
				color: #fff;
				border-radius: 4px;
				background: rgba(0, 0, 0, 0.3);
				&:focus{
					border: 1px solid #0993b0;
				}
			}

			&>*{
				vertical-align: top;
				display: inline-block;
				height: 20px;
			}
			.rack-checkbox {
				margin-top: 2px;
				width: 20px;
			}
			.rack-titleName {
				max-width: 100px;
				color: #fff;
				line-height: 20px;
				font-size: 14px;
				font-weight: bold;
				text-overflow: ellipsis;
				overflow: hidden;
				white-space: nowrap;
			}
			.edit-content{
				position: absolute;
				right: 0;
				top: 0;
				cursor: pointer;
			}
		}
		.rack-slide	 {
			margin-left: 75px;
			width: 65px;
			font-size: 14px;
			border-radius: 3px;
			position: relative;
			height: 22px;
			background-color: rgba(0, 0, 0, 0.6);
			cursor: pointer;

			.icon-rack-slide {
				top: 3px;
				transition: all 0.5s ease-out;
				position: absolute;
				border-radius: 3px;
			}

			.rack-slide-title {
				transition: all 0.5s ease-out;
				position: relative;
				top: 4px;
				width: 30px;
			}
		}
		.rack-body {
		
		    position: relative;
		    height: 825px;

			.rack-side {
				position: absolute;
				left: 0;
				top: 20px;
				right: 0;
				bottom: 0;
				background: url("../../assets/bg/rack-cab.png") no-repeat;
			}
/*
			#rack-side-right {
				background: url("../../assets/bg/rack-cab-side.png") no-repeat;	
		        -webkit-transform: rotateY(90deg) translateX(100px);
		           -moz-transform: rotateY(90deg) translateX(100px);
		            -ms-transform: rotateY(90deg) translateX(100px);
		             -o-transform: rotateY(90deg) translateX(100px);
		                transform: rotateY(90deg) translateX(100px);
		        -webkit-transform-origin: right;
		           -moz-transform-origin: right;
		            -ms-transform-origin: right;
		             -o-transform-origin: right;
		                transform-origin: right;
		    }
*/
		    .rack-side-left {
		    	background: url("../../assets/bg/rack-cab-side.png") no-repeat;
		        -webkit-transform: rotateY(-90deg) translateX(-100px);
		           -moz-transform: rotateY(-90deg) translateX(-100px);
		            -ms-transform: rotateY(-90deg) translateX(-100px);
		             -o-transform: rotateY(-90deg) translateX(-100px);
		                transform: rotateY(-90deg) translateX(-100px);
		        -webkit-transform-origin: left;
		           -moz-transform-origin: left;
		            -ms-transform-origin: left;
		             -o-transform-origin: left;
		    }

		    .rack-side-front {
		        -webkit-transform: translateZ(120px);
		           -moz-transform: translateZ(120px);
		            -ms-transform: translateZ(120px);
		             -o-transform: translateZ(120px);
		                transform: translateZ(120px);
		        -webkit-transform-origin: right;
		           -moz-transform-origin: right;
		            -ms-transform-origin: right;
		             -o-transform-origin: right;
		    }

		    .rack-side-back {
		        -webkit-transform: rotateY(180deg) translateX(219px) translateZ(100px);
		           -moz-transform: rotateY(180deg) translateX(219px) translateZ(100px);
		            -ms-transform: rotateY(180deg) translateX(219px) translateZ(100px);
		             -o-transform: rotateY(180deg) translateX(219px) translateZ(100px);
		                transform: rotateY(180deg) translateX(219px) translateZ(100px);
		        -webkit-transform-origin: right;
		           -moz-transform-origin: right;
		            -ms-transform-origin: right;
		             -o-transform-origin: right;
		    }

			[class^='rack-element0'] {
					margin-top: 18px !important;
				}

				[class^='rack-element'] {
					width: 179px;
					height: 69px;
					margin-left: 20px;
					margin-bottom: 16px;
				}
		}

		//background-color: #0ff;
		// width: 100%;
		// height: 100%;
		// color: #fff;


	}

@keyframes fadeIn {
	0% {
		opacity: 0; /*初始状态 透明度为0*/
	}
	50% {
		opacity: 0; /*中间状态 透明度为0*/
	}
	100% {
		opacity: 1; /*结尾状态 透明度为1*/
	}
}

.rack-body {
	transition: all 1s ease-in-out;
	transform-style: preserve-3d;
	 -webkit-transform:rotateX(0deg) rotateY(0deg);
        -moz-transform:rotateX(0deg) rotateY(0deg);
          -o-transform:rotateX(0deg) rotateY(0deg);
             transform:rotateX(0deg) rotateY(0deg);
    
}

.rack-rotate {
	-webkit-transform:rotateX(0deg) rotateY(180deg);
       -moz-transform:rotateX(0deg) rotateY(180deg);
         -o-transform:rotateX(0deg) rotateY(180deg);
            transform:rotateX(0deg) rotateY(180deg);
}

</style>