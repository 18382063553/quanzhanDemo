import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Chat from "../views/Chat.vue"; // 异步加载
import Profile from "../views/Profile.vue"; // 异步加载
import Detail from "../views/Detail.vue"; // 异步加载

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { title: "首页" },
  },
  {
    path: "/chat",
    name: "Chat",
    component: Chat,
    meta: { title: "对话" },
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile, // 异步加载
    meta: { title: "我的" },
  },
  {
    path: "/detail",
    name: "Detail",
    component: Detail, // 异步加载
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

export default router;
