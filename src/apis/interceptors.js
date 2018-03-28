import axios from 'axios';
import {baseURL} from '@/baseurl'
import {Message} from 'iview';

// 创建axios实例
const service = axios.create({
  baseURL: baseURL,
  timeout: 5000,
});

// 下载文件
const downloadUrl = url => {
  let iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = url;
  iframe.onload = function () {
    document.body.removeChild(iframe)
  };
  document.body.appendChild(iframe)
}

// request拦截器
service.interceptors.request.use(config => {
  // Do something before request is sent
  return config;
}, error => {
  // Do something with request error
  console.log(error); // for debug
  return Promise.reject(error);
})

// respone拦截器
service.interceptors.response.use(
  response => {
    if (response.headers && (response.headers['content-type'] === 'text/csv; charset=utf-8' ||
        response.headers['content-type'] === 'application/octet-stream')) {
      downloadUrl(response.request.responseURL);
      return
    }
    const res = response.data;
    // console.log(res);
    if (res.stateCode === 404) {
      Message.error(res.msg);
    }
    return res;
  },
  error => {
    console.log('err' + error);// for debug
    return Promise.reject(error);
  }
)

export default service;
