<template>
<div id="body" class="rack">
	<div class="tab-content">
		<tab
			:items="tabData"
			@clickFn="tabFn"
		></tab>
	</div>
	<div class="show-content">
		<div :class="{
			'icon-rack-left': !leftHover || start == 0,
			'icon-rack-left-hover': leftHover && start > 0}" @click="clickLeft()" @mouseover="leftHover=true" @mouseleave="leftHover=false"
		></div>
		<div :class="{
			'icon-rack-right': !rightHover || (start+1)*3 >= (tabKey == 'edit' ? total+1 : total),
			'icon-rack-right-hover': rightHover && (start+1)*3 < (tabKey == 'edit' ? total+1 : total)}" @click="clickRight()" @mouseover="rightHover=true" @mouseleave="rightHover=false"
		></div>
		<div class="rack-content">
			<div class="rack-window">
				<div class="rack-heap"  :style="{'left': heapLeft, 'width': heapWidth}">
					<rack-cab v-for="item of rackItems"
						:selected="selected(item)"
						:showEditPage="tabKey=='edit'"
						:cabInfo="item"
						@checkFn="checkFn"
						@onEditRackTitle="onEditRackTitle"
						@onEditRackElement="onEditRackElement"
						@onShowElementDetail="onShowElementDetail"
					></rack-cab>
					<div :class="{
						'icon-rack-add': !addHover,
						'icon-rack-add-hover': addHover}" v-show="tabKey=='edit'" @click="clickAddRack" @mouseover="addHover=true" @mouseleave="addHover=false"
					></div>
				</div>
			</div>
			<div class="rack-pan"></div>
		</div>
		<div :class="{'rack-btn-delete': true, 'delete-rack': !selectArr.length}" @click="deleteRack" v-show="tabKey=='edit'">删除</div>
		
	</div>
	<diy-dialog
		:clz="dialogClz"
		:title="dialogTitle"
		:show="showPop"
		@check="checkDialogFn"
	>
		<div class="dialog-content">
			<div class="d-row">
				<span class="label">设备名称</span>
				<input v-model="popObj.name">
			</div>
			<div class="d-row">
				<span class="label">ＩＰ地址</span>
				<input v-model="popObj.ip">
			</div>
			<div class="d-row">
				<span class="label">硬盘大小</span>
				<input type="number" min="0" v-model.number="popObj.size">
				<span>&nbsp;TB</span>
			</div>
			<div class="d-row">
				<span class="label">设备型号</span>
				<Dropdown
					Key="type"
					:value="popObj.type"
					:list="[{name:'24', value: 24}, {name: '36', value: 36}]"
					@checkFn="dialogDropdown"
				></Dropdown>
			</div>
			<div class="d-row">
				<span class="label">机柜位置</span>
				<Dropdown
					Key="location"
					:value="popObj.location"
					:list="dropdowns"
					@checkFn="dialogDropdown"
				></Dropdown>
			</div>
			<div class="hint" v-show="showHint">{{invalidText}}</div>
		</div>
	</diy-dialog>
	<diy-dialog
		:clz="confirmClz"
		:title="dialogTitle"
		:show="showConfirm"
		@check="checkDialogFn"
	>
		<div class="dialog-content">
			<div class="d-row">
				<span class="label">{{confirmTitle}}</span>
			</div>
		</div>
	</diy-dialog>
	<modal class="rack-element-detail" v-show="showDetail" :style="{left: detailLeft, bottom: detailBottom, height: detailHeight}">
		<div class="modal-content">
			<div class="modal-body">
				<div class="modal-text">
					<ul class="modal-list">
						<li>
							<span class="modal-list-name">设备名称： </span>
							<span class="modal-list-value">{{devName}}</span>
						</li>
						<!-- <li>
							<span class="modal-list-name">节点种类： </span>
							<span class="modal-list-value">{{nodeType}}</span>
						</li> -->
						<li>
							<span class="modal-list-name">ＩＰ地址： </span>
							<span class="modal-list-value">{{ipAddr}}</span>
						</li>
						<li>
							<span class="modal-list-name">设备类型： </span>
							<span class="modal-list-value">{{devType}}</span>
						</li>
						<li>
							<span class="modal-list-name">硬盘大小： </span>
							<span class="modal-list-value">{{harddisk}}</span>
						</li>
					</ul>
				</div>
				<div class="modal-list-front">
					<div class="list-front-title">
						<span class="title">正面</span>
						<span class="status">{{faultCount(true)}}</span>
					</div>
					<div class="list-front-content">
						<div class="column0" >
							<div :class="{
								'element-available': (item.level == 0),
								'element-inavailable': (item.level != 0)
							}" v-for="item of columnFaultList(0, true)">
								<div class="icon-rack-element"></div>
								<div class="icon-rack-element-mark">{{faultIndex(item.id)}}</div>
							</div>
						</div>
						<div class="column1" >
							<div :class="{
								'element-available': (item.level == 0),
								'element-inavailable': (item.level != 0)
							}" v-for="item of columnFaultList(1, true)">
								<div class="icon-rack-element"></div>
								<div class="icon-rack-element-mark">{{faultIndex(item.id)}}</div>
							</div>
						</div>
						<div class="column2" >
							<div :class="{
								'element-available': (item.level == 0),
								'element-inavailable': (item.level != 0)
							}" v-for="item of columnFaultList(2, true)">
								<div class="icon-rack-element"></div>
								<div class="icon-rack-element-mark">{{faultIndex(item.id)}}</div>
							</div>
						</div>
						<div class="column3" >
							<div :class="{
								'element-available': (item.level == 0),
								'element-inavailable': (item.level != 0)
							}" v-for="(item, index) of columnFaultList(3, true)">
								<div class="icon-rack-element"></div>
								<div class="icon-rack-element-mark">{{faultIndex(item.id)}}</div>
							</div>
						</div>
					</div>
				</div>
				<div class="modal-list-back" v-show="detail36Type">
					<div class="list-back-title">
						<span class="title">背面</span>
						<span class="status">{{faultCount(false)}}</span>
					</div>
					<div class="list-back-content">
						<div class="column0" >
							<div :class="{
								'element-available': (item.level == 0),
								'element-inavailable': (item.level != 0)
							}" v-for="item of columnFaultList(0, false)">
								<div class="icon-rack-element"></div>
								<div class="icon-rack-element-mark">{{faultIndex(item.id)}}</div>
							</div>
						</div>
						<div class="column1" >
							<div :class="{
								'element-available': (item.level == 0),
								'element-inavailable': (item.level != 0)
							}" v-for="item of columnFaultList(1, false)">
								<div class="icon-rack-element"></div>
								<div class="icon-rack-element-mark">{{faultIndex(item.id)}}</div>
							</div>
						</div>
						<div class="column2" >
							<div :class="{
								'element-available': (item.level == 0),
								'element-inavailable': (item.level != 0)
							}" v-for="item of columnFaultList(2, false)">
								<div class="icon-rack-element"></div>
								<div class="icon-rack-element-mark">{{faultIndex(item.id)}}</div>
							</div>
						</div>
						<div class="column3" >
							<div :class="{
								'element-available': (item.level == 0),
								'element-inavailable': (item.level != 0)
							}" v-for="(item, index) of columnFaultList(3, false)">
								<div class="icon-rack-element"></div>
								<div class="icon-rack-element-mark">{{faultIndex(item.id)}}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
        </div>  
	</modal>
</div>

</template>
<script>

	import Modal from '../../components/modal-confirm.vue';
	import RackCab from '../../components/rack/rack.vue';
	import Tab from '../../components/tab.vue';
	import DiyDialog from '../../components/dialog.vue';
	import Dropdown from '../../components/dropdown.vue';


	export default {
		props: {
		},
		data () {
			return {
				start: 0,
				tabKey: 'normal',
				showPop: false,
				showConfirm: false,
				showDetail: false,
				popObj: {},
				detailObj: {},
				tabData: [
					{Key: 'normal', title: '查看机柜'},
					{Key: 'edit', title: '编辑机柜'}
				],
				selectArr: [],
				rackItems: {},
				leftHover: false,
				rightHover: false,
				addHover: false,
				dialogClz: 'edit-rack',
				confirmClz: 'confirm-rack',
				dialogTitle: '',
				confirmTitle:'',
				dropdowns:[],
				invalidText: '',
				showHint: false
			};
		},
		computed: {
			total () {
				let objLen = 0;
				_.forEach(this.rackItems, (item)=>{
					objLen++;
				});
				return objLen;
			},
			heapLeft () {
				return -this.start*1017 + 'px';
			},
			heapWidth () {
				return (_.floor(this.total/3) + 1) * 987 + 'px';
			},
			detail36Type () {
				if (!_.isUndefined(this.detailElement))
					return this.detailElement.type == 36;
			},
			detailLeft () {
				if (this.detailObj.offsetLeft + 210 >document.body.clientWidth - 268)
					return this.detailObj.offsetLeft - 298 + 'px';
				return this.detailObj.offsetLeft + 210 + 'px';
			},
			detailBottom () {
				let clientHeight = 768;
				if (!_.isUndefined(document.body)) {
					clientHeight = document.body.clientHeight;
				}

				let bottom = clientHeight - this.detailObj.offsetTop - ((this.detail36Type) ? 642: 448);
				return ((bottom <= 20) ? 20 : bottom) + 'px';
			},
			detailHeight () {
				return ((this.detail36Type) ? 615: 430) + 'px';
			},
			detailElement () {
				if (!_.isUndefined(this.detailObj.rackId) 
					&& !_.isUndefined(this.detailObj.id) 
					&& !_.isUndefined(this.rackItems[this.detailObj.rackId])
					&& !_.isUndefined(this.rackItems[this.detailObj.rackId].devices[this.detailObj.id])) {
					return this.rackItems[this.detailObj.rackId].devices[this.detailObj.id];
				}
			},
			devName () {
				if (!_.isUndefined(this.detailElement))
					return this.detailElement.name;
			},
			nodeType () {
				return "视频集群";
			},
			ipAddr () {
				if (!_.isUndefined(this.detailElement))
					return this.detailElement.ip;
			},
			devType () {
				if (!_.isUndefined(this.detailElement))
					return this.detailElement.type;
			},
			harddisk () {
				if (!_.isUndefined(this.detailElement))
					return this.detailElement.size + " TB";
			}
		},
		methods: {
			selected (item) {
				return (_.indexOf(this.selectArr, item.id) >= 0);
			},
			tabFn (item) {
				this.tabKey = item.Key;
				if (this.tabKey != 'edit' && this.start >= (this.total)/3 && this.start > 0) {
					this.start = this.start - 1;
				}
			},
			checkFn (rackId, value) {
				if (value && _.indexOf(this.selectArr, rackId) < 0) {
					this.selectArr.push(rackId);
				} else if (!value) {
					this.selectArr.splice(_.indexOf(this.selectArr, rackId), 1);
				}
			},
			clickLeft () {
				if (this.start > 0)
					this.start = this.start - 1;				
			},
			clickRight () {
				if (this.tabKey != 'edit') {
					if (this.start < (this.total)/3 && this.start+1 < (this.total)/3)
						this.start = this.start + 1;
				} else if (this.start < (this.total)/3 && this.start+1 < (this.total+1)/3){
					this.start = this.start + 1;
				}
			},
			deleteRack () {
				if (!this.selectArr.length)
					return;
				this.popObj.editType = "deleteRack";
				this.showConfirm = true;
				this.dialogTitle = "确认删除";
				this.confirmTitle = "是否要删除选中的机柜？";
			},
			clickAddRack () {
				//添加机柜
				UCS.RackManger("addRack", "", (params) => {
					if (!_.isUndefined(params)) {
						let item = {
							name: params.name,
							id: params.id,
							devices: {}
						};
						this.$set(this.rackItems, params.id, item);
					}
				});
			},
			onEditRackTitle (id, name) {
				let me = this;
				let param = {"id": id, "name": name};
				UCS.RackManger("editRack", param, (params) => {
					if (!_.isUndefined(params) && !_.isUndefined(me.rackItems[params.id])) {
						//赋值
						let temp = this.rackItems;
						temp[params.id].name = params.name;
						this.rackItems = _.assign({}, temp);
					}
				});
			},
			onEditRackElement (type, element) {
				this.popObj.editType = type;
				this.popObj.rackId = element.rackId;
				this.popObj.id = element.id;
				this.showHint = false;

				this.dropdowns = [
					{name:"3U-7U",   value: 8},
					{name:"8U-12U",  value: 7},
					{name:"13U-17U", value: 6},
					{name:"18U-22U", value: 5},
					{name:"23U-27U", value: 4},
					{name:"28U-32U", value: 3},
					{name:"33U-37U", value: 2},
					{name:"38U-42U", value: 1}
				];
				switch (type) {
					case 'add':
						this.showPop = true;
						this.dialogTitle = "新建设备"
						_.forEach(this.rackItems[element.rackId].devices, (item) => {
							_.remove(this.dropdowns, (dd) => {
								return (dd.value == item.location && dd.value != this.popObj.location);
							});
						});
						break;
					case 'edit':
						this.showPop = true;
						this.dialogTitle = "修改设备";
						if (!_.isUndefined(this.rackItems[element.rackId].devices[element.id])) {
							this.popObj.name = this.rackItems[element.rackId].devices[element.id].name;
							this.popObj.ip = this.rackItems[element.rackId].devices[element.id].ip;
							this.popObj.size = this.rackItems[element.rackId].devices[element.id].size;
							this.popObj.type = this.rackItems[element.rackId].devices[element.id].type;
							this.popObj.location = this.rackItems[element.rackId].devices[element.id].location;

							_.forEach(this.rackItems[element.rackId].devices, (item) => {
								_.remove(this.dropdowns, (dd) => {
									return (dd.value == item.location && dd.value != this.popObj.location);
								});
							});
						}

						// console.log(this.popObj);
						break;
					case 'deleteDevice':
						this.showConfirm = true;
						this.dialogTitle = "确认删除"
						this.confirmTitle = "是否要删除当前设备？"
						break;
				}
			},
			onShowElementDetail (bShow, detailObj) {
				if (this.showDetail != bShow) {
					this.showDetail = bShow;
					this.detailObj = detailObj;
				}
			},
			findFault (id) {
				let ret = false;
				if (!_.isUndefined(this.detailElement) && !_.isUndefined(this.detailElement.faultList)) {
					for (let i = 0; i < this.detailElement.faultList.length; i++) {
						if (this.detailElement.faultList[i].id == id) {
							return true;
						}
					}
				}
				
				return false;
			},
			columnFaultList (col, front) {
				let colItems = [];
				if (!_.isUndefined(this.detailElement) && !_.isNull(this.detailElement)) {
					if (front) {
						for (let i = 5; i >= 0; i--) {
							let id = "8:"+(6*col+i);
							colItems.push({id: id, level: this.findFault(id) ? 1 : 0});
						}
					} else {
						for (let i = 2; i >= 0; i--) {
							let id = "9:"+(3*col+i);
							colItems.push({id: id, level: this.findFault(id) ? 1 : 0});
						}
					}
				}

				return colItems;
			},
			faultCount (bFront) {
				let count = 0;
				if (!_.isUndefined(this.detailElement)) {
					_.forEach(this.detailElement.faultList, (item)=>{
						if (_.startsWith(item.id, (bFront ? "8" : "9")) && item.level == 1) {
							count++;
						}
					});
				}
				
				return "故障："+ count;
			},
			faultIndex (strIndex) {
				let index = _.indexOf(strIndex, ':');
				if (index >= 0) {
					let str = strIndex.substr(index+1);
					if (str.length == 1)
						str = '0' + str;
					return str;
				}
			},
			isValidIP (ip) {
				var reg =  /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
				return reg.test(ip);
			},
			checkInvalid () {

				if (_.isUndefined(this.popObj.name) || this.popObj.name.length == 0) {
					this.invalidText = "请输入有效的设备名称！";
					this.showHint = true;
				} else if (_.isUndefined(this.popObj.ip) || this.popObj.ip.length == 0 || !this.isValidIP(this.popObj.ip)) {
					this.invalidText = "请输入有效的ＩＰ地址！";
					this.showHint = true;
				} else if (_.isUndefined(this.popObj.size) || !Number(this.popObj.size) || !(this.popObj.size > 0)) {
					this.invalidText = "请输入有效的硬盘大小！";
					this.showHint = true;
				} else if (_.isUndefined(this.popObj.type) || (this.popObj.type != 24 && this.popObj.type != 36)) {
					this.invalidText = "请输入有效的设备型号！";
					this.showHint = true;
				} else if (_.isUndefined(this.popObj.location) || (this.popObj.location < 1 || this.popObj.location > 8)) {
					this.invalidText = "请输入有效的机柜位置！";
					this.showHint = true;
				} else {
					this.showHint = false;
				}
			},
			checkDialogFn (key) {
				switch (this.popObj.editType) {
					case 'edit':
						if (key == 'ok') {
							this.checkInvalid();
							if (this.showHint) {
								return;
							}
							let me = this;
							UCS.RackManger("editDevice", me.popObj, (params) => {
								if (!_.isUndefined(params) 
									&& !_.isUndefined(me.rackItems[params.rackId])
									&& !_.isUndefined(me.rackItems[params.rackId].devices[params.id])) {

									//赋值
									let item = me.rackItems[params.rackId].devices[params.id];
									item.name = params.name;
									item.ip = params.ip;
									item.type = params.type;
									item.location = params.location;
									item.size = params.size;
									me.$set(me.rackItems[params.rackId].devices, params.id, item);

								}
							});
						}

						break;
					case 'add':
						if (key == 'ok') {
							this.checkInvalid();
							if (this.showHint) {
								return;
							}
							let me = this;
							let temp = me.popObj;
							UCS.RackManger("addDevice", me.popObj, (params) => {
								if (!_.isUndefined(params) && !_.isUndefined(me.rackItems[params.rackId])) {
									//赋值
									let item = {
										id: params.id,
										name: params.name,
										ip: params.ip,
										type: params.type,
										location: params.location,
										size: params.size,
										rackId: params.rackId,
										faultList: []
									};

									me.$set(me.rackItems[params.rackId].devices, params.id, item);
								}
							});
						}
						break;
					case 'deleteDevice':
						if (key == 'ok') {
							let me = this;
							let temp = me.popObj;
							UCS.RackManger("deleteDevice", temp, (params) => {
								let item = me.rackItems[temp.rackId].devices;
								delete item[temp.id];
								me.$set(me.rackItems[temp.rackId].devices, temp.id, item);
							});
						}
						break;
					case 'deleteRack':
						if (key == 'ok') {
							let me = this;
							let ids = {id: me.selectArr};
							UCS.RackManger("deleteRack", ids, (params) => {
								//赋值
								// let temp = _.cloneDeep(this.rackItems);
								let temp = me.rackItems;
								_.forEach(temp, (item) => {
									if (_.indexOf(me.selectArr, item.id) > -1) {
										delete temp[item.id];
									}
								});
								me.rackItems = _.assign({}, temp);
								me.selectArr = [];
							});
						}
						break;
				}

				this.popObj = {};
				this.showConfirm = false;
				this.showPop = false;
			},
			dialogDropdown (key, value) {
				if (key == 'location') {
					this.popObj.location = value;
				} else if (key == 'type') {
					this.popObj.type = value;
				}
			}
		},
		components: {
			Modal,
			RackCab,
			Tab,
			DiyDialog,
			Dropdown
		},
		mounted () {
			UCS.RackManger("getRackList", "", (params)=>{
				let items = {};
				_.forEach(params, (item)=>{
					items[item.id] = {
						name: item.name,
						id: item.id,
						devices: {}
					};

					for (let i in item.devices) {

						let device = item.devices[i];
						if (_.isUndefined(items[item.id].devices[device.id])) {
							items[item.id].devices[device.id] = {
								ip: device.ip,
								id: device.id,
								name: device.name,
								type: device.type,
								location: device.location,
								size: device.size,
								rackId: device.rackId
							}
						}
					}
				});
				
				UCS.RackManger("getFaultList", "", (lists) => {

					_.forEach(lists, (item) => {
						for (let i in item.devices) {
							let device = item.devices[i];
							if (!_.isUndefined(items[item.id]) && !_.isUndefined(items[item.id].devices[device.id])) {
								items[item.id].devices[device.id].faultList = device.faultList;
							}
						}
					});

					this.rackItems = _.assign({}, items);

					//获取信息后定时器取faultlist更新
					this.timer4FaultList = setInterval(() => {
						UCS.RackManger("getFaultList", "", (lists) => {
							let items = this.rackItems;
							_.forEach(lists, (item) => {
								for (let i in item.devices) {
									let device = item.devices[i];
									if (!_.isUndefined(items[item.id]) && !_.isUndefined(items[item.id].devices[device.id])) {
										items[item.id].devices[device.id].faultList = [];
									}
								}
							});

							this.rackItems = _.assign({}, items);

							this.$nextTick(() => {
								_.forEach(lists, (item) => {
									for (let i in item.devices) {
										let device = item.devices[i];
										if (!_.isUndefined(items[item.id]) && !_.isUndefined(items[item.id].devices[device.id])) {
											items[item.id].devices[device.id].faultList = device.faultList;
										}
									}
								});

								this.rackItems = _.assign({}, items);
							});

						}, null);

					}, 10000);

				}, null);

			}, null);
		},
		beforeDestroy () {
			if (!_.isUndefined(this.timer4FaultList)) {
				// console.log("clearInterval");
				clearInterval(this.timer4FaultList);
			}
		}

	}

</script>
<style lang="less">
	.rack {
		position: fixed;
		background: url(../../assets/bg/rack-body.png) no-repeat;
		background-size: cover;
		padding: 0 250px;
		.rack-content{
			width: 1265px;
			margin: 0 auto;
		}

		.tab-content, .icon-rack-left, .icon-rack-left-hover, .icon-rack-right, .icon-rack-right-hover, .icon-rack-add, .icon-rack-add-hover {
			cursor: pointer;
			position: absolute;
		}

		.tab-content {
			left: 50px;
			right: 50px;
			top: 80px;
			height: 28px;
		}

		.show-content {
			display: inline-block;
			position: fixed;	
			min-width: 1360px;
			left: 10px;
			right: 10px;
			top: 120px;
			bottom: 0px;
			overflow-y: auto;
			.rack-window {
				margin-left: 143px;
				width: 1000px;
				min-height: 885px;
				top: 0;
				bottom: 0;
				overflow-x: hidden;
				overflow-y: scroll;
				.rack-heap {
					padding-left: 40px;
					height: 890px;
					overflow-y: hidden;
					position: relative;
					transition: all 1.5s ease-in-out;
					-moz-transition: all 1.5s ease-in-out;
					-webkit-transition: all 1.5s ease-in-out;
					-o-transition:all 1.5s ease-in-out;
				}
			}
			.rack-pan {
				margin-top: -120px;
				width: 1261px;
				height: 143px;
				right: 0;
				bottom: 0;
				z-index: -3000;
				background: url(../../assets/bg/rack-pan.png) no-repeat;
				background-size: cover;
			}
			[class^='icon-rack-add'] {
				top: 40%;
				vertical-align: middle;
				width: 90px;
			}
			[class^='icon-rack-left'] {
				left: 90px;
				top: 40%;
			}
			[class^='icon-rack-right'] {
				right: 90px;
				top: 40%;
			}
			.rack-btn-delete{
				position: fixed;
				top: 120px;
				right: 82px;
				width: 80px;
				height: 25px;
				text-align: center;
				line-height: 23px;
				color: #fff;
				font-size: 12px;
				z-index: 100;
				border: 1px solid #00deff;
				background: rgba(6, 226, 255, 0.3);
				cursor: pointer;
				&.delete-rack{
					cursor: default;
					background: rgba(0, 157, 220, 0.3) !important;
					opacity: 0.5;
				}
				&:hover{
					background: rgba(6, 226, 255, 0.5);
				}
			}
		}

		.edit-rack{
			.dialog-box{
				width: 450px;
				height: 326px;
			}
			.dialog-content{
				margin-top: 20px;
				padding: 0 40px;
			}
			.hint{
				height: 12px;
				color: #f46c76;
				font-size: 12px;
				margin-left: 63px;
				display: block;
			}
			.d-row{
				height: 30px;
				margin: 10px 0;
				line-height: 30px;
				font-size: 12px;
				color: #fff;
				&.disable{
					display: none;
				}
				span{
					display: inline-block;
					vertical-align: top;
				}
				input{
					display: inline-block;
					width: 260px;
					height: 30px;
					margin-left: 10px;
					vertical-align: top;
					padding-left: 10px;
					color: #fff;
					border-radius: 4px;
					background: rgba(0, 0, 0, 0.3);
					border: 1px solid transparent;
					&:focus{
						border: 1px solid #0993b0;
					}
					&+span+.dropdown{
						width: 98px;
						.dropdown-button{
							width: 98px;
						}
						.selected{
							width: 65px;
							text-align: left;
						}
					}
				}
			}
			.label{
				vertical-align: top;
				display: inline-block;
				height: 30px;
			}
			.dropdown{
				width: 260px;
				.dropdown-button{
					width: 260px;
					border-radius: 4px;
					background: rgba(0, 0, 0, 0.3);
				}
				.selected{
					width: 225px;
					text-align: left;
					color: #fff;
				}
			}
		}

		.confirm-rack{
			.dialog-box{
				width: 450px;
				height: 160px;
			}
			.dialog-content{
				margin-top: 20px;
				padding: 0 40px;
			}

			.d-row{
				height: 30px;
				margin: 10px 0;
				line-height: 30px;
				font-size: 12px;
				color: #fff;
				&.disable{
					display: none;
				}
				span{
					display: inline-block;
					vertical-align: top;
				}
			}
			.label{
				vertical-align: top;
				display: inline-block;
				height: 30px;
			}
		}

		.rack-element-detail {
			
			font-family: "微软雅黑";
			margin: auto auto;
			position: fixed;
			bottom: 0px;
			width: 268px;
			border: 1px solid #15476e;
			border-radius: 5px;
			background-color: rgba(7, 48, 78, 0.9);

			.modal-text {
				height: 135px;
				border-bottom: 1px solid rgba(0, 31, 53, 0.8);
				&:after{
					content: "";
					position: absolute;
					top: 135px;
					left: 0;
					right: 0;
					border-bottom: 1px solid rgba(171, 224, 255, 0.2);
				}
				.modal-list {
					position: relative;
					left: 20px;
					top: 18px;
					line-height: 25px;
					color: #fff;
					font-size: 14px;
					max-width: 230px;
					.modal-list-name {
						font-size: 14px;
						color: #fff;
						opacity: 0.7;
					}
					.modal-list-value {
						display: block;
						float: right;
						width: 150px;
						overflow:hidden;
						text-overflow:ellipsis;
						white-space:nowrap;
					}
				}
			}
			.modal-list-front {
				position: relative;
				vertical-align: top;
				height: 278px;
				top: 16px;
				.list-front-content {
					position: absolute;
					width: 228px;
					height: 226px;
					left: 20px;
					border-radius: 4px;
					background-color: rgba(11, 23, 39, 0.5);
				}
				.list-front-title {
					position: relative;
					display: inline-block;
					width: 230px;
					height: 20px;
					font-size: 12px;
					left: 20px;
					.title {
						color: #00a5e2;
					}
					.status {
						display: block;
						float: right;
						color: #e44c4c;
					}
				}
			}
			.modal-list-back {
				position: relative;
				top: 18px;
				.list-back-content {
					position: absolute;
					width: 228px;
					height: 130px;
					border-radius: 4px;
					left: 20px;
					background-color: rgba(11, 23, 39, 0.5);
				}
				.list-back-title {
					position: relative;
					display: inline-block;
					width: 230px;
					height: 20px;
					font-size: 12px;
					left: 20px;
					.title {
						color: #00c4a2;
					}
					.status {
						display: block;
						float: right;
						color: #e44c4c;
					}
				}
			}
			[class^='column'] {
				position: relative;
				display: inline-block;
				margin-left: 8px;
				top: 17px;
				[class^='element-'] {
					width: 40px;
					height: 10px;
					margin-bottom: 25px;
					.icon-rack-element-mark {
						width: 40px;
						vertical-align: top;
						font-size: 10px;
						color: #396c92;
						top: -4px;
						text-align: center;
					}
				}
				.element-available {
					background-color: #00FFFF;
				}
				.element-inavailable {
					-webkit-animation: twinkling 1s infinite 0.6s ease-in-out alternate;
					animation: twinkling 1s infinite 0.6s ease-in-out alternate;
				}
			}
			.column0 {
				margin-left: 16px;
			}
		}
	}
</style>