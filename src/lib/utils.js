'use strict'

// let _ = require('lodash');
import _ from 'lodash';

let output = {};

/**
 * 获取时间方法
 * @param  {[Object]} date [new Date()对象]
 *   月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
 *   年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 *   例子：
 *   (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 *   key: 周 || 星期
 * @return {
 *         format: (fmt) => {return str},
 *         toWeek: (key) => {return str}
 * }      [对应方法获取时间显示字符串]
 */
export default {
	extendDate: date => {
		let o = {
		    "M+": date.getMonth() + 1, //月份 
		    "d+": date.getDate(), //日 
		    "h+": date.getHours(), //小时 
		    "m+": date.getMinutes(), //分 
		    "s+": date.getSeconds(), //秒 
		    "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
		    "S": date.getMilliseconds() //毫秒 
		};
		let week = date.getDay();
		return {
			format: (fmt) => {
				if (!date.getTime())
					return '-';
				if (/(y+)/.test(fmt))
				    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
				for (var k in o) {
				    if (new RegExp("(" + k + ")").test(fmt))
				        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
				}
				return fmt;
			},
			toWeek: (key) => {
				return key+'一,二,三,四,五,六,日'.split(',')[week];
			},
			getTime: () => {
				return `${('0'+o['h+']).slice(-2)}: ${('0'+o['m+']).slice(-2)}`;
			},
			beforePresent: () => {
				var minute = 1000 * 60;
				var hour = minute * 60;
				var day = hour * 24;
				var halfamonth = day * 15;
				var month = day * 30;
				var now = new Date().getTime();
				var diffValue = now - date;
				var monthC =diffValue/month;
				var weekC =diffValue/(7*day);
				var dayC =diffValue/day;
				var hourC =diffValue/hour;
				var minC =diffValue/minute;
				if (monthC>=1) {
			 		return parseInt(monthC) + "月前";
			 	} else if (weekC>=1) {
					return parseInt(weekC) + "周前";
			 	} else if (dayC>=1) {
				 	return parseInt(dayC) +"天前";
				} else if (hourC>=1) {
				 	return parseInt(hourC) +"小时前";
				} else if (minC>=1) {
				 	return parseInt(minC) +"分钟前";
				} else
				 	return "刚刚";
			}
		};
	}
};