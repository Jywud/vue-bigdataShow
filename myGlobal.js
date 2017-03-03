// import $ from './lib/jquery-1.8.1.js';
// require('lodash');
window.$ = $;

/**
* ajax封装
* url 发送请求的地址
* data 发送到服务端数据
* fnSuccess 成功回调函数
* fnFailed 失败回调函数
*/
var jsonAjax = function(url, data, method, fnSuccess, fnFailed, nameSpace, name) {
	
	data = (data == "" || typeof data == "undefined") ? null : data;
    // data.sys_server_ip = 
	$.ajax({
		type: method,
		data: data,
		url: url,
		dataType: "json",
		success: function(s) {
			if (fnSuccess) {
				if (s.retCode == 401) {
					store.commit('cleanSession');
					store.commit('cleanAccess');
					store.commit('cleanShopData');
					router.push({name: 'entry'});
					store.commit('alertShow', s.err);
					return; 
				}
				if (s.retCode == 1) {
					return fnSuccess(s.data);
				} 
				if (s.retCode <= 0) {
					if (fnFailed) 
						return fnFailed();
					else 
						return store.commit('alertShow', s.err);
				}
			}
		},
		error: function(e) {
			if (fnFailed)
				return fnFailed(e);
			store.commit('alertShow', '无法连接服务器，请确定服务器或网络是否正常。');
		},
		complete: function() {
			mutex_unlock(nameSpace, name);
			//console.log( nameSpace + "  " + name);
		}
	});
};

function HashTable() {
	var size = 0;
	var entry = new Object();

	this.add = function (key, value) {
		if (!this.containsKey(key)) {
			size++;
		}
		entry[key] = value;
	}

	this.increase = function(key) {
		if (!this.containsKey(key)) {
			size++;
		}
		entry[key]++;
	}

	this.decrease = function (key) {
		if (!this.containsKey(key)){
			return;
		}

		entry[key]--;
	}

	this.getValue = function (key) {
		return this.containsKey(key) ? entry[key] : null;
	}

	this.remove = function (key) {
		if (this.containsKey(key) && (delete entry[key])) {
			size--;
		}
	}

	this.containsKey = function (key) {
		return (key in entry);
	}

	this.getSize = function () {
		return size;
	}
}

var g_mutex_lock = new HashTable();

var mutex_check_init = function() {
	if (g_mutex_lock.getSize() > 0)
		return -1;

	return 0;
};

var mutex_add = function(nameSpace, name) {
	g_mutex_lock.add(getMixKey(nameSpace, name), 0);
};

var mutex_lock = function(nameSpace, name) {

	if (!g_mutex_lock.containsKey(nameSpace+"#"+name))
		g_mutex_lock.add(getMixKey(nameSpace, name), 0);

	g_mutex_lock.increase(getMixKey(nameSpace, name));

	if (g_mutex_lock.getValue(getMixKey(nameSpace, name)) > 1) {
		g_mutex_lock.decrease(getMixKey(nameSpace, name));
		return -1;
	}

    return 0;
};

var getMixKey = function (nameSpace, name) {
	return (nameSpace + "#" + name);
}

var mutex_unlock = function(nameSpace, name) {

    if (!g_mutex_lock.containsKey(getMixKey(nameSpace, name)))
        return -1;

    g_mutex_lock.remove(getMixKey(nameSpace, name));
    return 0;
};

function mutex_isLock (nameSpace, name) {
	return (g_mutex_lock.containsKey(getMixKey(nameSpace, name))
	 		&& g_mutex_lock.getValue(getMixKey(nameSpace, name)) > 0);
}


 (function (factory) {
	
	factory.UCS = {version:'0.1'};

	function globalMap (nameSpace, arr) {
/*		
		UCS[nameSpace] = function (name, params, cbFn, failFn) {
			_.forEach(arr, item) {
				if (name == item.key) {
					jsonAjax(item.url, params, "POST", cbFn, failFn);
					break;
				}
			}
		}
*/

		factory.UCS[nameSpace] = function(name, params, cbFn, failFn) {

			if (!mutex_isLock(nameSpace, name)) {

				_.forEach(arr, item => {

					if (name == item.key) {

						mutex_lock(nameSpace, name);

						jsonAjax(item.url, params, "POST", cbFn, failFn, nameSpace, name);

						//console.log(item.url + "  " + name);

						/*
						//超过timeout删除锁
						setTimeout(() => {
							mutex_unlock(nameSpace, name);
						}, 10000);
						*/
					}
				})
			}
		};
	}

	//注册SysManager下的请求
	globalMap("SysManger", [
		{
			key: 'getSysData',
			url: '/host/all/status'
		},
		{
			key: 'getRofsBroken',
			url: '/host/all/rofsnetflow'
		},
		{
			key: 'getPfsBroken',
			url: '/host/all/pfsnetflow'
		},	 
	]);

	//注册NodeManager下的请求
	globalMap("NodeManger", [
		{
			key: 'getNodeList',
			url: '/storageNode/list'
		},
		{
			key: 'getSingleNodeMessage',
			url: '/storageNode/nodedetail'
		},
		{
			key: 'getSingleNodeList',
			url: '/storageNode/channel/list'
		},
		{
			key:'syncVideo',
			url:'storageNode/channel/sync'
		}
	]);

	//注册VideoManager下的请求
	globalMap("VideoManger", [
		{
			key: 'getVideoList', // 录像
			url: '/channel/list.json'
		},
		{
			key: 'getSingleVideoMessage',
			url: '/channel/channelmessage'
		},
		{
			key: 'getSingleVideoList', // 通道锁定录像
			url: '/segment/list'
		},
		{
			key:'getComparisonVideo', // 比对
			url:'/channel/details/list.json',
		},
		{
            key:'getVideoMessage',
			url:'/channel/details/item.json',
		},
		{
			key:'editVideo',
			url:'/channel/update.json',
		},
		{
			key:'addLock',
			url:'/segment/lock.json',
		},
		{
			key:'deleteLock',
			url:'/segment/unlock.json',
		}, 
	]);

	globalMap("FileManger",[
		{
			key:'getFileData',
			url:'/pfs/list'
		},

	]);

	globalMap("LogManger",[
		{
			key:'getAlarmList',
			url:'/user/log/alarm'
		},
		{
			key:'getMessageList',
			url:'/user/log/message'
		},
	]);

	globalMap('Common',[
        {
			key:'login',
			url:'/user/login.json'
		},{
			key:'logout',
			url:'/user/logout.json',
		},{
			key:'getRtFault',
			url:'/rtFaults.json',
		},{
			key:'checkSession',
			url:'/user/session.json'
		},{
			key:"checkAccess",
			url:"/user/access"
		}
	]); 

	globalMap('RackManger',[
		{
			key:'getRackList',
			url:'/rack/rack_list.json',
		},{
			key:'getFaultList',
			url:'/rack/device_faults_status.json',
		},{
			key:'addRack',
			url:'/rack/add_rack.json',
		},{
			key:'deleteRack',
			url:'/rack/remove_racks.json',
		},{
            key:'editRack',
            url:'/rack/edit_rack.json',
		},
		{
			key:'editDevice',
			url:'/rack/edit_device.json',
		}
		,{
			key:'addDevice',
			url:'/rack/add_device.json',
		}
		,{
			key:'deleteDevice',
			url:'/rack/remove_device.json',
		}
	]); 
 

})(window);

