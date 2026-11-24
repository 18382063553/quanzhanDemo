<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  <router-view />
  <van-tabbar route v-if="['Home', 'Chat', 'Profile'].includes(route.name)">
    <van-tabbar-item icon="home-o" replace to="/">首页</van-tabbar-item>
    <van-tabbar-item icon="chat-o" replace to="/chat">对话</van-tabbar-item>
    <van-tabbar-item icon="user-o" replace to="/profile">我的</van-tabbar-item>
  </van-tabbar>
</template>
