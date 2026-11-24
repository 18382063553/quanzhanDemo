import axios from "axios";
import { showToast } from 'vant';

// Vite 项目统一使用 import.meta.env + VITE_ 前缀
const baseURL = import.meta.env.VITE_BASE_API || "";
// 创建 axios 实例
const service = axios.create({
  baseURL: baseURL, // 基础请求路径
  timeout: 160000, // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  },
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code !== 200) {
      showToast(res.message || "Error"); // 调用自定义的提示函数
      return Promise.reject(new Error(res.message || "Error"));
    } else {
      return res;
    }
  },
  (error) => {
    // 对响应错误做点什么
    console.error("Response Error:", error);
    let message = "请求失败";
    if (error.response) {
      switch (error.response.status) {
        case 401:
          message = "未授权，请重新登录";
          // 可在此处触发登出逻辑或跳转登录页
          break;
        case 403:
          message = "拒绝访问";
          break;
        case 404:
          message = `请求地址出错: ${error.response.config.url}`;
          break;
        case 500:
          message = "服务器内部错误";
          break;
        default:
          message = `请求失败，状态码: ${error.response.status}`;
      }
    } else if (error.request) {
      message = "服务器未响应，请检查网络";
    }
    showToast(message); // 调用自定义的提示函数
    return Promise.reject(error);
  },
);

// 导出封装好的请求方法
export default {
  get(url, params = {}) {
    return service.get(url, { params });
  },
  post(url, data = {}) {
    return service.post(url, data);
  },
  put(url, data = {}) {
    return service.put(url, data);
  },
  delete(url, params = {}) {
    return service.delete(url, { params });
  },
};
