import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
// 主要用于将url后面的值转换为对象，或者将对象拼接未url后面的值
import qs from 'qs';
// import useOthersStore from "@/stores/others/index"
// 配置新建一个 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_PROXY_DOMAIN_REAL,
  // baseURL: import.meta.env.VITE_API_URL,
  // baseURL: 'http://10.151.128.172:8088/',
  // baseURL: 'http://10.179.180.85:7263/',
  // baseURL: 'http://10.157.189.237:8001/',
  timeout: 50000,
  headers: { 'Content-Type': 'application/json' },
  paramsSerializer: {
    serialize(params) {
      return qs.stringify(params, { allowDots: true });
    },
  },
});

// 添加请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么 token
    if (localStorage.getItem('token')) {
      config.headers.Token = `${localStorage.getItem('token')}`;
    }

    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  },
);

const readFileAsPromise = (response) => {
  return new Promise((resolve, reject) => {
    const result = response.data;
    const reader = new FileReader();
    reader.readAsText(result);
    reader.onload = (e) => {
      resolve(e.target.result);
    };
  });
};
// 添加响应拦截器
service.interceptors.response.use(
  async (response) => {
    if (response.request.responseType === 'blob') {
      const readFile = await readFileAsPromise(response);
      // console.log(readFile);
      try {
        const resData = JSON.parse(readFile); // 解析对象成功，说明是json数据
        if (resData.code != 200) {
          ElMessage.error(resData?.message);
          return resData;
        }
      } catch (err) {
        return response;
      }
    }

    // const res =response.request.responseType==='blob'?response: response.data;
    const res = response.data;
    if (res.code && res.code !== 0) {
      // `token` 过期或者账号已在别处登录
      if (res.code === 401 || res.code === 4001) {
        ElMessageBox.alert('登錄過期,您已被登出,請重新登錄', '提示', {})
          .then(() => {})
          .catch(() => {});
        // 清除浏览器全部临时缓存
        localStorage.clear();
        // 使用 reload 时，不需要调用 resetRoute() 重置路由
        window.location.reload();
      } else if (res.code === 500 || res.Code === 500) {
        ElMessage.error(res.message || res.Message);
      }
      return res;
    } else {
      return res;
    }
  },
  async (error) => {
    // 对响应错误做点什么
    console.log(error);
    if (error.message.indexOf('timeout') != -1) {
      ElMessage.error('網絡超時');
    } else if (error.message == 'Network Error') {
      ElMessage.error('網絡連接錯誤');
    } else if (error.response?.data.code === 401 || error.response?.status == 401) {
      await ElMessageBox.alert('登錄過期,您已被登出,請重新登錄', '提示', {})
        .then(() => {})
        .catch(() => {});
      localStorage.clear();
      // 使用 reload 时，不需要调用 resetRoute() 重置路由
      window.location.reload();
      // window.location.href = '/'; // 去登录页
    } else {
      if (error.response.data) ElMessage.error(error.response.statusText);
      else ElMessage.error('接口路徑找不到');
    }
    return Promise.reject(error);
  },
);
const checkResponse = (config) => {
  //刷新token
  if (!config.headers) {
    if (config.getResponseHeader('Tsms_exp') == '1') {
      replaceToken();
    }
  } else if (config.headers.tsms_exp == '1') {
    replaceToken();
  }
};
// 拿到新的token
const replaceToken = async () => {
  const data = await service({
    url: '/api/User/ReplaceToken',
    method: 'POST',
  });
  if (data.data) {
    Session.set('token', data.data);
  } else {
    await ElMessageBox.alert('登錄過期,您已被登出,請重新登錄', '提示', {})
      .then(() => {})
      .catch(() => {});
    Session.clear();
    Local.clear();
    // window.location.href = '/'; // 去登录页
    // 使用 reload 时，不需要调用 resetRoute() 重置路由
    window.location.reload();
  }
};
// 导出 axios 实例
export default service;
