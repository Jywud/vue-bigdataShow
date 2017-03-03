"use strict"

import utils from  './lib/utils.js';
import ucsConst from './lib/const.js';

/**
 * [格式化时间]
 * @param  {[new Date()]} date [description]
 * @param  {[string]} fmt  [description]
 * @return {[string]}      [description]
 */
export function format (date, fmt) {
    if (!date)
        return '';
    return utils.extendDate(date).format(fmt);
};

export function formatFault (date) {
    if (!date)
        return '';
    return utils.extendDate(date);
};

/**
 * 转化毫秒时间为xx天xx小时xx分xx秒xx毫秒
 * @param  {[number]} tick [毫秒]
 * @param  {[boolean]} S    [输出：xx天xx小时xx分xx秒]
 * @return {[string]}      [xx天xx小时xx分xx秒xx毫秒]
 */

export function getDay4Millisecond (tick, S) {
    let millSecInDay = 24 * 3600 *1000;
    let millSecInHour = 3600 * 1000;
    let millSecInMin = 60*1000;
    let millSecInSec = 1000;
    tick = tick*1;//convertTickToDate(tick);
    let day = parseInt(tick/millSecInDay);
    let hour = parseInt((tick-day *millSecInDay)/millSecInHour);
    let min = parseInt((tick-day*millSecInDay-hour*millSecInHour)/millSecInMin);
    let sec=parseInt((tick-day*millSecInDay-hour*millSecInHour-min*millSecInMin)/millSecInSec);
    let millSec = parseInt(tick%millSecInSec);
    let strDay = day >0 ? day + "天" : "";
    let strHour = hour >0 ? hour + "小时": day > 0 ? "0小时":"";
    let strMin = min >0 ? min+"分": (day >0 || hour >0) ?"0分": "";
    let strSec = sec > 0 ? sec+"秒" : (day >0 || hour >0 || min > 0) ?"0秒": "";
    let strMillSec = millSec + "毫秒";
    if (tick < millSecInSec)
        return '不足1秒';
    if (S)
        return strDay + strHour;
    return strDay + strHour + strMin + strSec + strMillSec;
};

let BIn = {
    "T" : 1024*1024*1024*1024,
    "G" : 1024*1024*1024,
    "M" : 1024*1024,
    "K" : 1024
};

export function formatUnit (value) {
    value = value*1;
    if (value/BIn.T>1) {
        return Math.round(100*value/BIn.T)/100 + "TB";
    } else if (value/BIn.G>1) {
        return  Math.round(100*value/BIn.G)/100 + "GB";
    } else if (value/BIn.M>1) {
        return  Math.round(100*value/BIn.M)/100 + "MB";
    } else if (value/BIn.K>1) {
        return  Math.round(100*value/BIn.K)/100 + "KB";
    } else {
        return value + "B";
    }
};

export function formatBrokenUnit (value) {
    value = value*1;
    if (value/BIn.M>1) {
        return  (Math.round(100*value/BIn.M)/100).toFixed(2) + "Mbps";
    } else if (value/BIn.K>1) {
        return  (Math.round(100*value/BIn.K)/100).toFixed(2) + "Kbps";
    } else {
        return value + "bps";
    }
};

export function getNodeStatus (key) {
    return ucsConst.NodeStatus[key] || '';
};

/**
 * clz: 'node-grid'
 */

function nodeGrid (key, item, title) {
    const value = item[key];
    switch (key) {
        case 'type':
            return ucsConst.NodeType[value] || '';
        case 'time': 
            return utils.extendDate(new Date(value)).format('yyyy-MM-dd hh:mm:ss');
        case 'status':
            return ucsConst.NodeStatus[value] || '';
    }
    return value;
}

function singleNodeGrid (key, item, title) {
    const value = item[key];
    switch (key) {
        case 'recycle':
            return item.cycleType == 0 ? '-': getDay4Millisecond(value, 1);
        case 'cycleType': 
            return ucsConst.NodeRecycle[value] || ucsConst.NodeRecycle[1];
        case 'status':
            return ucsConst.NodeStatus[value] || '';
    }
    return value;
}

function videoGrid (key, item, title) {
    const value = item[key];
    switch (key) {
        case 'recycle':
            return item.cycleType == 0 ? '-': getDay4Millisecond(value, 1);
        case 'period':
            return getDay4Millisecond(value);
        case 'beginTime':
        case 'endTime':
            return utils.extendDate(new Date(value)).format('yyyy-MM-dd hh:mm:ss');
        case 'cycleType': 
            return ucsConst.NodeRecycle[value] || ucsConst.NodeRecycle[1];
        case 'status':
            return ucsConst.NodeStatus[value] || '';
    }
    return value;
}

function singleVideoGrid (key, item, title) {
    const value = item[key];
    switch (key) {
        case 'size':
            return formatUnit(value);
        case 'beginTime': 
        case 'endTime': 
            return utils.extendDate(new Date(value)).format('yyyy-MM-dd hh:mm:ss');
        case 'period':
            return getDay4Millisecond(value);
    }
    return value;
}

function logGrid (key, item, clz, title) {
    const value = item[key];
    switch (key) {
        case 'date': 
            return utils.extendDate(new Date(value)).format('yyyy-MM-dd hh:mm:ss');
    }
    return value;
}

function fileGrid (key, item, clz, title) {
    const value = item[key];
    switch (key) {
        case 'size':
            return formatUnit(value);
        case 'cTime': 
        case 'aTime': 
        case 'mTime': 
            return utils.extendDate(new Date(value)).format('yyyy-MM-dd hh:mm:ss');
    }
    return value;
}

export function getGridValue (key, item, clz, title) {
    switch (clz) {
        case 'node-grid':
            return nodeGrid(key, item, title);
        case 'single-node-grid':
            return singleNodeGrid(key, item, title);
        case 'video-grid':
            return videoGrid(key, item, title);
        case 'single-video-grid':
            return singleVideoGrid(key, item, title);
        case 'alarm-log-grid':
        case 'handle-log-grid':
            return logGrid(key, item, title);
        case 'file-grid':
            return fileGrid(key, item, title);
    }
    return item[key];
};

export default {
    format,
    formatFault,
    getDay4Millisecond,
    formatUnit,
    formatBrokenUnit,
    getNodeStatus,
    getGridValue
};