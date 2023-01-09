import { createApp } from "vue";
import LayoutApp from "./App.vue";
import { router } from "./router/index.js";
import HelperAxios from "axios";
import { HelperCore, HelperWebComm, HelperUserAccount, DataModelDataGroup } from "../util/HelperCore.js";
import { ConfigBiz } from "/util/ConfigBiz.js";
import * as ElementPlusIcons from '@element-plus/icons-vue';
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import './assets/common.css';
// 导航守卫 (Navigation Guards)
// 前置守卫, 路由开始之前的逻辑.
router.beforeEach((to, from, next) => {
  // if (["/LayoutViewSystemMgt/PagingListUniv"].includes(from.path) && ["/LayoutViewSystemMgt/PagingListUniv"].includes(to.path)) {
  //   // Need Keep-Alive
  //   from.meta.keepAlive = false;
  //   to.meta.keepAlive = false;
  // } else {
  //   // Relieve Keep-Alive
  //   from.meta.keepAlive = true;
  //   to.meta.keepAlive = true;
  // }
  // alert(`路由开始, 由 ${from.path} 路由到 ${to.path}`);
  if (to.meta.AuthPolicy !== undefined && to.meta.AuthPolicy === "NeedLogin") {
    // 目标路由需要验证用户已登录.
    const accessToken = window.localStorage.getItem("AccessToken");
    if (accessToken === null) {
      // 跳转到 IAM 登录界面, 此函数由 SDK 提供, 黑箱操作.
      HelperUserAccount.handlerLogin();
    } else {
      next();
    }
  } else {
    // 目标路由不需要验证用户已登录, 直接放行.
    next();
  }
});
// 后置守卫, 路由结束以后的逻辑.
router.afterEach((to, from, failure) => {
  // alert(`路由完毕, 由 ${from.path} 路由到 ${to.path}`);
});
// interceptors: 拦截器
HelperAxios.interceptors.request.use(
  function (config) {
    // config: 每一次 Axios 请求的实例.
    // Do something before request is sent
    const accessToken = window.localStorage.getItem("AccessToken");
    if (accessToken !== null) {
      // 只需要无差别将 AccessToken 请求到接口, 至于需不需要用 AccessToken, 由接口最终定夺.
      config.headers["authorization"] = accessToken;
    }
    config.baseURL = '/proxy';
    const jsonArrayUserGrop = sessionStorage.getItem('jsonArrayUserGroup');
    let CurrentUserGroup = null;
    if (jsonArrayUserGrop !== null) {
      CurrentUserGroup = JSON.parse(jsonArrayUserGrop)[0].NumUserGroup;
    }
    if (CurrentUserGroup !== null) {
      switch(config.method) {
        case 'get':
        case 'delete':
          config.params.CurrentUserGroup = CurrentUserGroup;
          break;
        case 'post':
        case 'put':
          config.data.CurrentUserGroup = CurrentUserGroup;
          break;
      }
    }
    // alert("请求拦截");
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);
// Add a response interceptor
HelperAxios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if (response.status === 200 && response.data.StatusCode === 'SuccessGoal')
      response.data['strInterceptor'] = '已经过响应拦截器处理';
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);
// 创建一个 Vue 实例.
const AppNew = createApp(LayoutApp);
AppNew.use(router);
AppNew.use(ElementPlus);
AppNew.config.globalProperties.$HelperCore = HelperCore;
AppNew.config.globalProperties.$HelperWebComm = HelperWebComm;
AppNew.config.globalProperties.$HelperUserAccount = HelperUserAccount;
AppNew.config.globalProperties.$DataModelDataGroup = DataModelDataGroup;
AppNew.config.globalProperties.$ConfigBiz = ConfigBiz;
AppNew.config.globalProperties.$HelperAxios = HelperAxios;
for (const [key, component] of Object.entries(ElementPlusIcons))
  AppNew.component(key, component);
AppNew.mount("#app");
