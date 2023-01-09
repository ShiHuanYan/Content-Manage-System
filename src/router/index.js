import { createRouter, createWebHistory } from "vue-router";
const routerHistory = createWebHistory();
// 用一个变量定义路由.
const jsonArrayRoute = [
  {
    name: 'CatSir',
    path: '/',
    component: () => import('@/views/CatSir.vue'),
    meta: {}
  },
  {
    // IAM 登录跳转, 不判断用户在线状态.
    path: "/LayoutViewUserAccount",
    component: () => import("@/LayoutView/UserAccount.vue"),
    meta: {
      StrRouteTitle: "",
      StrRouteTip: "",
    },
    children: [
      {
        name: 'Login',
        path: "VerfyUserWebCmd",
        component: () => import("@/views/ShareAccountClient/VerfyUser/MainViewWebCmd.vue")
      }
    ],
  },
  {
    // 后台管理系统 (CMS), 必须判断用户在线.
    path: "/LayoutViewSystemMgt",
    component: () => import("@/LayoutView/SystemMgt.vue"),
    // 在路由配置的 meta 中, 可以自定义的字段.
    meta: {
      AuthPolicy: "NeedLogin"
    },
    children: [
      { 
        name: 'MainViewHome',
        path: "MainViewHome", 
        component: () => import("@/views/SystemMgt/DataAggreg/MainViewHome.vue"),
      },
      {
        name: 'PagingListUniv',
        path: "PagingListUniv",
        component: () => import("@/views/SystemMgt/PagingList/MainViewUniv.vue"),
        meta: {
          keepAlive: true,
        },
      },
      {
        name: 'DataListTree',
        path: "DataListTree",
        component: () => import("@/views/SystemMgt/DataList/MainViewTree.vue"),
        meta: {
          keepAlive: true,
        },
      },
      {
        name: 'DetailedDataTextarea',
        path: "DetailedDataTextarea",
        component: () => import("@/views/SystemMgt/DetailedData/MainViewTextarea.vue"),
        meta: {
          keepAlive: false,
        },
      }
    ],
  },
];
// 创建路由实例.
const router = createRouter({
  history: routerHistory,
  routes: jsonArrayRoute,
  strict: true
});
// 输出路由实例和菜单数组 (全局变量).
export { router };
