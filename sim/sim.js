// (function (factory) {

var Test = {};

var session = {
	account: 'admin',
	userId: 1
};
Test.login = params => {
	return _.assign(params, {userId: 1});
};

Test.logout = params => {
	return session = {};
};

Test.checkSession = params => {
	return session;
};

Test.checkAccess = params => {
	return true;
}

/***********实时报警*************/
var logArr = ['节点故障', '磁盘故障', '取流失败', '读写失败', '性能不足', '存储空间不足'];
Test.getRtFault = params => {
	return _.times(_.random(1, 20), item => {
		const type = logArr[_.random(0, 5)];
		return {
			id: item+1,
			level: _.random(1, 2),
			ip: '192.168.2.'+_.random(1, 255),
			type: type,
			detail: `192.168.2.${_.random(1, 255)}节点出现${type}`,
			time: new Date().getTime() - _.random(0, 100000000000)
		}
	});
};

/*********首页************/
Test.getSysData = params => {
	return {
		"video": {
			"storageSpace": {
				"total": 9663676416,
				"used": 9663676416,
				"unused": 0
			},
			"channel": {
				"total": 5,
				"normal": 0,
				"fault": 5
			},
			"storageNode": {
				"total": 2,
				"normal": 1,
				"fault": 1
			},
			"flowHis": {
				"flowT": [{
					"time": 1481593715373,
					"value": 514
				}, {
					"time": 1481593716373,
					"value": 765
				}, {
					"time": 1481593717373,
					"value": 478
				}, {
					"time": 1481593718373,
					"value": 514
				}, {
					"time": 1481593719373,
					"value": 781
				}, {
					"time": 1481593720373,
					"value": 806
				}, {
					"time": 1481593721373,
					"value": 317
				}, {
					"time": 1481593722373,
					"value": 539
				}, {
					"time": 1481593723373,
					"value": 785
				}, {
					"time": 1481593724373,
					"value": 773
				}, {
					"time": 1481593725373,
					"value": 264
				}, {
					"time": 1481593726373,
					"value": 923
				}, {
					"time": 1481593727373,
					"value": 417
				}],
				"flowR": [{
					"time": 1481593715373,
					"value": 724
				}, {
					"time": 1481593716373,
					"value": 562
				}, {
					"time": 1481593717373,
					"value": 163
				}, {
					"time": 1481593718373,
					"value": 200
				}, {
					"time": 1481593719373,
					"value": 660
				}, {
					"time": 1481593720373,
					"value": 654
				}, {
					"time": 1481593721373,
					"value": 435
				}, {
					"time": 1481593722373,
					"value": 910
				}, {
					"time": 1481593723373,
					"value": 613
				}, {
					"time": 1481593724373,
					"value": 116
				}, {
					"time": 1481593725373,
					"value": 438
				}, {
					"time": 1481593726373,
					"value": 532
				}, {
					"time": 1481593727373,
					"value": 660
				}]
			}
		},
		"files": {
			"storageSpace": {
				"total": 1739396218880,
				"used": 1088864387072,
				"unused": 562175672320
			},
			"storageNode": {
				"total": 1,
				"normal": 1,
				"fault": 0
			},
			"flowHis": {
				"flowT": [{
					"time": 1481593715373,
					"value": 0
				}, {
					"time": 1481593716373,
					"value": 0
				}, {
					"time": 1481593717373,
					"value": 0
				}, {
					"time": 1481593718373,
					"value": 0
				}, {
					"time": 1481593719373,
					"value": 0
				}, {
					"time": 1481593720373,
					"value": 0
				}, {
					"time": 1481593721373,
					"value": 0
				}, {
					"time": 1481593722373,
					"value": 0
				}, {
					"time": 1481593723373,
					"value": 0
				}, {
					"time": 1481593724373,
					"value": 0
				}, {
					"time": 1481593725373,
					"value": 0
				}, {
					"time": 1481593726373,
					"value": 0
				}, {
					"time": 1481593727373,
					"value": 0
				}],
				"flowR": [{
					"time": 1481593715373,
					"value": 0
				}, {
					"time": 1481593716373,
					"value": 0
				}, {
					"time": 1481593717373,
					"value": 0
				}, {
					"time": 1481593718373,
					"value": 0
				}, {
					"time": 1481593719373,
					"value": 0
				}, {
					"time": 1481593720373,
					"value": 0
				}, {
					"time": 1481593721373,
					"value": 0
				}, {
					"time": 1481593722373,
					"value": 0
				}, {
					"time": 1481593723373,
					"value": 0
				}, {
					"time": 1481593724373,
					"value": 0
				}, {
					"time": 1481593725373,
					"value": 0
				}, {
					"time": 1481593726373,
					"value": 0
				}, {
					"time": 1481593727373,
					"value": 0
				}]
			},
			"bigFile": {
				"total": 869698109440,
				"used": 544432193536,
				"unused": 281087836160
			},
			"smFile": {
				"total": 869698109440,
				"used": 544432193536,
				"unused": 281087836160
			}
		}
	};
};

Test.getRofsBroken = params => {
	return _.times(2, idx => {
		if (idx)
			return _.times(13, _idx => {
				return {
					time: new Date().getTime() - (12-_idx)*5000,
					value: _.random(0, 1024*500)
				}
			});
		return _.times(13, _idx => {
			return {
				time: new Date().getTime() - (12-_idx)*5000,
				value: _.random(1024*500, 1024*1024*1100)
			}
		});
	});
};

Test.getPfsBroken = params => {
	return _.times(2, idx => {
		if (idx)
			return _.times(13, _idx => {
				return {
					time: new Date().getTime() - (12-_idx)*5000,
					value: _.random(0, 1024*500)
				}
			});
		return _.times(13, _idx => {
			return {
				time: new Date().getTime() - (12-_idx)*5000,
				value: _.random(1024*500, 1024*1024*1100)
			}
		});
	});
};


/******************节点监控******************/
//type: 1(ROFS)， 0(PFS) ， 2(全部)
//type: 1(正常)， 0(故障) ， 2(全部)
Test.getNodeList = params => {
	let total = _.random(20, 200);
	return {
		total: total,
		items: _.times(20, idx => {
			let space = _.random(0, 30);
			let cpu = _.random(0, 30);
			let mem = _.random(0, 30);
			return {
				id: idx,
				name: '节点'+idx,
				ip: '192.168.1.'+idx,
				type: _.random(0, 1),
				allocatedSpace: {
					used: space,
					all: _.random(0, 30)+space
				},
				allocatedCpu: {
					used: cpu,
					all: _.random(0, 30)+cpu
				},
				allocatedMem: {
					used: mem,
					all: _.random(0, 30)+mem
				},
				flow: {
					up: _.random(0, 300000),
					down: _.random(0, 300000)
				},
				time: new Date().getTime(),
				status: _.random(0, 1)
			};
		})
	}
};
//params: {id}
Test.getSingleNodeMessage = params => {
	return {
		name: '节点',
		cpu: _.random(1, 6),
		system: 'Linux',
		status: _.random(0, 1),
		ip: '192.168.111.111',
		allocatedSpace: _.random(100, 500),
		allocatedMem: _.random(100, 500)
	};
}; 

Test.getSingleNodeList = params => {
	let total = _.random(20, 200);
	return {
		total: total,
		items: _.times(20, idx => {
			return {
				id: idx,
				name: 'name'+idx,
				recycle: _.random(1000000000, 32000000000),
				cycleType: _.random(0, 1),
				status: _.random(0, 1)
			};
		})
	}
};
Test.syncVideo = params => {
	return;
};

/**********录像管理****************/
Test.getVideoList = params => {
	let total = _.random(20, 200);
	return {
		total: total,
		items: _.times(20, idx => {
			return {
				id: idx,
				cameraName: '摄像机摄像机摄像机摄像机摄像机摄像机摄像机摄像机'+idx,
				name: '通道'+_.random(1, 100),
				recycle: _.random(1000000000, 32000000000),
				cycleType: _.random(0, 1),
				beginTime: new Date().getTime(),
				endTime: new Date().getTime(),
				period: _.random(1000000, 32000000),
				status: _.random(0, 1)
			};
		})
	}
};
//params: {id}
Test.getSingleVideoMessage = params => {
	return {
		cameraName: '摄像机摄像机摄像机摄像机摄像机',
		name: "通道名通道名通道名通道名通道名",
		period: _.random(100000000, 3200000000),
		storageNodeList: '节点1',
		segNum: _.random(1, 100),
		frameCount: _.random(200, 200000),
		size: _.random(2000000, 4000000000)
	};
};

Test.getSingleVideoList = params => {
	let total = _.random(20, 200);
	return {
		total: total,
		items: _.times(20, idx => {
			return {
				id: idx,
				size: _.random(2000000, 4000000000),
				frameCount: _.random(200, 200000),
				beginTime: new Date().getTime(),
				endTime: new Date().getTime(),
				period: _.random(100, 3200)
			};
		})
	};
};

Test.getVideoMessage = params => {
	let nowDate = new Date().getTime();
	let startDate = nowDate - 1000*60*60*24*30;
	return {
		id: 1,
		name: "通道名通道名通道名通道名通道名",
		detail: _.times(12, item => {
			return {
				beginTime: startDate + item*2 * 1000*60*60*30,
				endTime: startDate + (item*2 +1)* 1000*60*60*30
			};
		})
	};
};

Test.getComparisonVideo = params => {
	let nowDate = new Date().getTime();
	let startDate = nowDate - 1000*60*60*24*30;
	return _.map(params.ids, id => {
		return {
			id: id,
			name: '通道'+id,
			detail: _.times(12, item => {
				return {
					beginTime: startDate + item*2 * 1000*60*60*30,
					endTime: startDate + (item*2 +1)* 1000*60*60*30
				};
			})
		}
	});
};

Test.editVideo = params => {
	return;
};

Test.addLock = params => {
	return;
};
Test.deleteLock = params => {
	return;
};

/**************系统日志**********/
Test.getAlarmList = params => {
	let total = _.random(20, 200);
	return {
		total: total,
		items: _.times(20, idx => {
			return {
				id: idx,
				type: '磁盘故障',
				ip: '192.168.201.'+idx,
				detail: '详情详情详情详情详情详情详情详情详情',
				date: new Date().getTime()
			};
		})
	};
};

Test.getMessageList = params => {
	let total = _.random(20, 200);
	return {
		total: total,
		items: _.times(20, idx => {
			return {
				id: idx,
				detail: '详情详情详情详情详情详情详情详情详情',
				date: new Date().getTime()
			};
		})
	};
};

/************文件管理*******************/
/*
params: {path, type}
 */
Test.getFileData = params => {
	return {
		dirs: _.times(5, idx => {
			return {
				path: '/s'+idx,
				name: '文件名'+idx,
				type: params.type
			}
		}),
		files: _.times(2000, idx => {
			return {
				id: idx,
				name: 'name'+idx,
				size: _.random(10000, 200000),
				count: _.random(5, 10000),
				cTime: new Date().getTime(),
				aTime: new Date().getTime(),
				mTime: new Date().getTime()
			};
		})
	}
};

var rackExtra = 5;
/************机柜管理*******************/
Test.getRackList = params => {
	return  _.times(rackExtra, idx => {
		return {
			id: idx+1,
			name: '新建机柜'+idx,
			devices: _.times(4, idx1 => {
				return {
					ip: '192.168.111.'+idx1,
					id: idx1+1,
					name: idx1 + '号设备',
					type: (idx1%2 == 0) ? 24: 36,
					location: _.random(0, 7),
					size: 20003,
					rackId: idx+1
				};
			})
		};
	});
};

Test.getFaultList = params => {
	return _.times(rackExtra, idx => {
		return {
			id: idx+1,
			devices: _.times(4, idx1=>{
				return {
					ip: '192.168.111.'+(idx1+19),
					id: idx1+1,
					type: (idx1%2 == 0) ? 24: 36,
					faultList: _.times((idx1%2 == 0) ? 4: 6, idx2 => {
						return {
							id: (idx2>=24) ? '9:'+idx2%24 : '8:'+idx2,
							level: 1
						};
					})
				};
			})
		};
	});
}

Test.addRack = params => {
	let count = rackExtra++;
	return {
		id: rackExtra,
		name: "新建机柜" + count,
		devices: {}
	};
}

Test.editRack = params => {
	return {
		id: params.id,
		name: params.name
	};
}

Test.deleteRack = params => {
	return {
		retCode: 1
	}
}

Test.editDevice = params => {
	return {
		name: params.name,
		ip:params.ip,
		id: params.id,
		location: params.location,
		type: params.type,
		size: params.size,
		rackId: params.rackId,
		faultList: _.times(36, idx => {
			return {
				id: (idx>=24) ? '9:'+idx%24 : '8:'+idx,
				level: _.random(0, 1)
			};
		})
	};
}	

Test.addDevice = params => {
	return {
		name: params.name,
		ip:params.ip,
		id: params.id,
		location: params.location,
		type: params.type,
		size: params.size,
		rackId: params.rackId,
		faultList: _.times(36, idx => {
			return {
				id: (idx>=24) ? '9:'+idx%24 : '8:'+idx,
				level: _.random(0, 1)
			};
		})
	};
}

Test.deleteDevice = params => {
	return {
		rackId: params.rackId,
		id: params.id,
	};
}


// return factory.Test = Test;

// })(window);

module.exports = Test;