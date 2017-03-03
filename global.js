
import Test from './sim/sim.js';

// (function (factory) {
var UCS = {};

UCS.Common = function (name, params, cbFn, failFn) {
	switch (name) {
		case 'checkSession':
			return setTimeout(() => cbFn(Test.checkSession(params)), 20);
		case 'login':
			return setTimeout(() => cbFn(Test.login(params)), 200);
		case 'logout':
			return setTimeout(() => cbFn(Test.logout(params)), 200);
		case 'getRtFault':
			return setTimeout(() => cbFn(Test.getRtFault(params)), 200);
		case 'checkAccess':
			return setTimeout(() => cbFn(Test.checkAccess(params)), 200);
	}
};

UCS.SysManger = function (name, params, cbFn, failFn) {
	switch (name) {

		case 'getSysData':
			return setTimeout(() => cbFn(Test.getSysData(params)), 200);
		/**
		 * 获取视频集群信息
		 * params: {time: 'now'/'day'}
		 * return [
		 * 	[{time: new Date().getTime(), value: 122}...],
		 * 	[{time: new Date().getTime(), value: 122}...]
		 * ]
		 * length: 13
		 */
		case 'getRofsBroken':
			return setTimeout(() => cbFn(Test.getRofsBroken(params)), 200);
		/**
		 * 获取文件集群信息
		 * params: {time: 'now'/'day'}
		 * return [
		 * 	[{time: new Date().getTime(), value: 122}....],
		 * 	[{time: new Date().getTime(), value: 122}....]
		 * ]
		 *  length: 13
		 */
		case 'getPfsBroken':
			return setTimeout(() => cbFn(Test.getPfsBroken(params)), 200);
		/**
		 * 获取存储空间统计，波浪图
		 * params: {}
		 * return {
		 * 	used, all
		 * }
		 */
		// case 'getStorage4Wave':
		// 	return setTimeout(() => cbFn(Test.getStorage4Wave(params)), 200);
		/**
		 * 获取存储空间百分比
		 * params: {}
		 * return {
		 * 	rofs: {
		 * 		used, all
		 * 	},
		 * 	pfs: {
		 * 		big: {
		 * 			used, all
		 * 		},
		 * 		small: {
		 * 			used, all
		 * 		}
		 * 	}
		 * }
		 */
		// case 'getStoragePercent':
		// 	return setTimeout(() => cbFn(Test.getStoragePercent(params)), 200);
		/**
		 * 获取系统设备统计
		 * params: {}
		 * return: {
		 * 	rofs, pfs, err
		 * }
		 */
		// case 'getDevices':
		// 	return setTimeout(() => cbFn(Test.getDevices(params)), 200);
		/**
		 * 获取节点信息柱状图
		 * params: {}
		 * return: {
		 * 	rofs: {normal, err},
		 * 	pfs: {normal, err}
		 * }
		 */
		// case 'getDevices4Cube':
		// 	return setTimeout(() => cbFn(Test.getDevices4Cube(params)), 200);
		/**
		 * 获取视频录像统计
		 * params: {}
		 * return: {
		 * 	normal, err
		 * }
		 */
		// case 'getRofsMessage':
		// 	return setTimeout(() => cbFn(Test.getRofsMessage(params)), 200);
	}
};

UCS.NodeManger = function (name, params, cbFn, failFn) {
	switch (name) {
		/**
		 * 进入节点监控界面
		 * params: {type: 0(pfs)|| 1(rofs)|| 2(全部), status: 0(故障)|| 1(正常)|| 2(全部)}
		 * return: {
		 * 	total: ,
		 * 	items: [
		 * 		{
		 * 			id, name, ip, type, allocatedSpace, allocatedCpu, allocatedMem, flow, time, status
		 * 	  	}
		 *    ]
		 * }
		 */
		case 'getNodeList':
			return setTimeout(() => cbFn(Test.getNodeList(params)), 200);
		/**
		 * 进入单个节点信息
		 * params: {id}
		 * return {
		 * 	name, cpu, system, status, ip
		 * }
		 */
		case 'getSingleNodeMessage':
			return setTimeout(() => cbFn(Test.getSingleNodeMessage(params)), 200);
		/**
		 * 获取单个节点通道信息
		 * params: {id, pageNo, pageSize, status}
		 * return {
		 * 	total,
		 * 	items: [{id, name, recycle, cycleType, status}]
		 * }
		 */
		case 'getSingleNodeList':
			return setTimeout(() => cbFn(Test.getSingleNodeList(params)), 200);
		case 'syncVideo':
			return setTimeout(() => cbFn(Test.syncVideo(params)), 200);
	}
};

UCS.VideoManger = function (name, params, cbFn, failFn) {
	switch (name) {
		/**
		 * 进入录像管理页面
		 * params: {}
		 * return: {
		 * 	total,
		 * 	items: [{id, cameraName, channelName, recycle, cycleType, beginTime, endTime, period, status}]
		 * }
		 */
		case 'getVideoList':
			return setTimeout(() => cbFn(Test.getVideoList(params)), 200);
		/**
		 * 进入单个录像管理界面
		 * params: {id}
		 * return {
		 * 	cameraName, channelName, time, node, num, frame, size
		 * }
		 */
		case 'getSingleVideoMessage':
			return setTimeout(() => cbFn(Test.getSingleVideoMessage(params)), 200);
		/**
		 * 进入单个录像时间轴界面
		 * params: {id}
		 * return: {
		 * 	id, 
		 * 	name,
		 * 	detail: [{beginTime, endTime}]
		 * }
		 */
		case 'getVideoMessage':
			return setTimeout(() => cbFn(Test.getVideoMessage(params)), 200);
		/**
		 * 进入录像锁定界面
		 * params: {id}
		 * return: {
		 * 	total,
		 * 	items: [{id, size, frame, beginTime, endTime, time}]
		 * }
		 */
		case 'getSingleVideoList':
			return setTimeout(() => cbFn(Test.getSingleVideoList(params)), 200);
		/**
		 * 进入录像比对界面
		 * params: {ids: []}
		 * return: [
		 * 	{id, name, detail: [{beginTime, endTime}]}
		 * ]
		 */
		case 'getComparisonVideo':
			return setTimeout(() => cbFn(Test.getComparisonVideo(params)), 200);
		/**
		 * 编辑录像
		 * params: {
		 * 	ids: [],
		 * 	cycleType: 0/1,
		 * 	recycle: 0
		 * }
		 */
		case 'editVideo':
			return setTimeout(() => cbFn(Test.editVideo(params)), 200);
		/**
		 * 编辑录像
		 * params: {
		 * 	id,
		 * 	from: 0,
		 * 	to: 0
		 * }
		 */
		case 'addLock':
			return setTimeout(() => cbFn(Test.addLock(params)), 200);
		/**
		 * 删除锁定任务
		 * params: {
		 * 	id,
		 * 	ids: []
		 * }
		 */
		case 'deleteLock':
			return setTimeout(() => cbFn(Test.deleteLock(params)), 200);
	}
};


UCS.FileManger = function (name, params, cbFn, failFn) {
	switch (name) {
		/**
		 * 进入录像锁定界面
		 * params: {path, type}
		 * return: {
		 * 	dirs: [{path, name, type}],
		 * 	files: [{id, size, name, count, cTime, aTime, mTime}]
		 * }
		 */
		case 'getFileData':
			return setTimeout(() => cbFn(Test.getFileData(params)), 200);
	}
};


UCS.LogManger = function (name, params, cbFn, failFn) {
	switch (name) {
		/**
		 * 系统日志，报警日志
		 * params: {type, pageNo, pageSize [beginTime, endTime]}
		 * return: {
		 * 	total,
		 * 	items: [{id, type, detail, date}]
		 * }
		 */
		case 'getAlarmList':
			return setTimeout(() => cbFn(Test.getAlarmList(params)), 200);
		case 'getMessageList':
			return setTimeout(() => cbFn(Test.getMessageList(params)), 200);
	}
};

UCS.RackManger = function (name, params, cbFn, failFn) {
	switch (name) {

		/**
		 * 机柜列表
		 * params: null
		 * return: {
		 * 	[{"id", "name", "devices":[{"ip", "id", "name", "type", "location", "size", "rackName", "rackId"}]]
		 * }
		 */
		case 'getRackList':
			return setTimeout(() => cbFn(Test.getRackList(params)), 200);

		/**
		 * 错误灯提示
		 * params: null
		 * return: {
		 * 	[{"id", "devices":[{"ip", "id", "type", "faultList":["id", "level"]}]]
		 * }
		 */	
		case 'getFaultList':
			return setTimeout(() => cbFn(Test.getFaultList(params)), 200);

		/**
		 * 添加机柜
		 * params: null
		 * return: {
		 * 	"id", "name", "devices"
		 * }
		 */	
		case 'addRack':
			return setTimeout(() => cbFn(Test.addRack(params)), 200);

		/**
		 * 编辑机柜
		 * params: null
		 * return: {
		 * 	"id", "name"
		 * }
		 */	
		case 'editRack':
			return setTimeout(() => cbFn(Test.editRack(params)), 200);

		/**
		 * 删除机柜
		 * params: {"rackId", "id"}
		 * return: {
		 * 	"rackId", "id"
		 * }
		 */	
		case 'deleteRack':
			return setTimeout(() => cbFn(Test.deleteRack(params)), 200);

		/**
		 * 编辑机柜设备
		 * params: {"rackId", "id", "device":{"ip", "name", "type", "location", "size", "faultList":["id", "level"]}}
		 * return: {
		 * 	"rackId", "id", "device":{"ip", "name", "type", "location", "size", "faultList":["id", "level"]}
		 * }
		 */		
		case 'editDevice':
			return setTimeout(() => cbFn(Test.editDevice(params)), 200);

		/**
		 * 添加机柜设备
		 * params: {"rackId", "id", "device":{}}
		 * return: {
		 * 	"rackId", "id", "device":{"ip", "name", "type", "location", "size", "faultList":["id", "level"]}
		 * }
		 */	
		case 'addDevice':
			return setTimeout(() => cbFn(Test.addDevice(params)), 200);

		/**
		 * 删除机柜设备
		 * params: {"rackId", "id"}
		 * return: {
		 * 	"retCode"
		 * }
		 */	
		case 'deleteDevice':
			return setTimeout(() => cbFn(Test.deleteDevice(params)), 200);
	}

};

// return factory.UCS = UCS;

// })(window);

export default UCS;