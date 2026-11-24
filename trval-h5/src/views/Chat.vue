<script setup>
import { ref, reactive } from 'vue'
const active = ref(0)
import { useRouter } from 'vue-router'
const router = useRouter()
const goBack = () => {
  router.back()
}


const inputMessage = ref('')
const isStreaming = ref(false)
const messageList = ref([])
const quickQuestions = ref([
  '北京有哪些必去的景点？',
  '上海美食推荐！',
  '成都三日游攻略！',
  '如何选择旅行保险？'
])

const sendMessage = () => {

}

const handleQuickClick = (tag) => {
  inputMessage.value = tag
  inputMessage.value = ''
}
</script>

<template>
  <div class="page-container chat-page">
    <div class="page-header">
      <van-nav-bar title="AI旅游助手" fixed left-arrow @click="goBack" />
    </div>
    <div class="chat-container">
      <!-- 默认展示 -->
      <div class="chat-empty" v-if="messageList.length === 0">
        <van-empty description="开始和 AI助手对话 吧！" />
        <div class="quick-questions">
          <div class="quick-title">常见问题</div>
          <van-tag size="large" class="quick-tag" v-for="tag in quickQuestions" :key="tag" mark
            @click="handleQuickClick(tag)">
            {{ tag }}
          </van-tag>
        </div>
      </div>
      <!-- 对话内容 -->
      <div class="message-list">
        <div v-for="item in messageList" :key="item.id" class="message-item">
          {{ item.content }}
        </div>
      </div>
    </div>

    <div class="chat-input-area">
      <van-field v-model="inputMessage" :disabled="isStreaming" placeholder="请输入您的问题">
        <template #button>
          <van-button @click="sendMessage" :disabled="!inputMessage.trim()" size="small" type="primary">发送</van-button>
        </template>
      </van-field>
    </div>
  </div>
</template>

<style scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding-bottom: 50px;
}

.chat-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 60px;
}

.chat-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.quick-questions {
  margin-top: 32px;
  text-align: center;
}

.quick-title {
  font-size: 14px;
  color: #999;
  margin-bottom: 16px;
}

.quick-tag {
  margin: 8px;
  cursor: pointer;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.streaming-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  color: #999;
  font-size: 14px;
}

.chat-input-area {
  position: fixed;
  bottom: 50px;
  left: 0;
  right: 0;
  background: #fff;
  padding: 8px 16px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  max-width: 750px;
  margin: 0 auto;
}

.chat-input-area :deep(.van-field) {
  background: #f7f8fa;
  border-radius: 20px;
  padding: 8px 16px;
}
</style>
