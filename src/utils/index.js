import { message } from 'antd';

export function getMangerToken() {

  const tokenStr = localStorage.getItem('eframe-manager-token');
  if (typeof tokenStr === 'undefined') {
    return "";
  }
  return tokenStr;
}

export function setMangerToken(token) {
  return localStorage.setItem('eframe-manager-token', token);
}

export function removeMangerToken() {
  localStorage.removeItem('eframe-manager-token');
}


export function getVersion() {
  return "v1";
}

export function getVersionHeardParam() {
  return "EVersion";
}


export function getDefaultPaging() {
  return 1;
}

export function getDefaultPagingSize() {
  return 10;
}

export function getFormNamePattern() {
  return {
    pattern: /^[\u4E00-\u9FA5a-zA-Z0-9_]{1,}$/,
    message: '只允许大小写，数字，汉字，下划线'
  }
}

export function getFormNameByPattern(seg) {
  return {
    pattern: seg,
    message: '格式不正确'
  }
}

export function getJSONData(data) {
  if (!!data && typeof data === "string") {
    return JSON.parse(data);
  }
  return data;
}

export function converString2Array(stringData, splitChar) {
  let newArray = stringData.split(splitChar);
  return newArray;
}


export function getFormNameLength(length) {
  return {
    message: '此字段长度最长' + length + '位', max: length
  }
}

export function getUploadInfo(type) {

  let uploadAvatar = {
    action: "/eframe/multipart-manager/upload/" + type,
    authorization: "Bearer " + getMangerToken(),
    "version": getVersion(),
  };
  return uploadAvatar;
}

export function checkDataResultWithNotification(data) {


  return new Promise(function (resolve, reject) {
    if (!!data.code && data.code === '0' && !!data.msg) {
      message.success(data.msg);
      resolve(data);
    }
    else {
      reject(data);
    }
  });

}

export function checkDataResult(data) {


  return new Promise(function (resolve, reject) {
    if (!!data.code && data.code === '0' && !!data.msg) {
      resolve(data);
    }
    else {
      reject(data);
    }
  });

}

export function cutString(str,length) {
  if (!!str) {
    let n = str.length;
    return str.substr(0, length);
  }
  else {
    return "";
  }
}