<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { fetchStream } from '../utils/request'
import { showToast } from 'vant'
import ChatBubble from '../components/ChatBubble.vue'

const router = useRouter()
const active = ref(0)
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

const chatContainer = ref(null)
// 滚到底部
const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

const sendMessage = () => {
  const msg = inputMessage.value.trim()
  if (!msg || isStreaming.value) {
    return
  }
  addUserMessage(msg)
  fetchAIResponse()
}

const fetchAIResponse = () => {
  isStreaming.value = true
  messageList.value.push({ id: Date.now() + 2, role: 'ai', content: '', timestamp: new Date().toISOString() })
  let fullResponse = ''
  fetchStream('/chat', { message: inputMessage.value }, (chunk) => {
    fullResponse += chunk
    // AI正在回复的消息
    const lastMsg = messageList.value[messageList.value.length - 1]
    if (lastMsg && lastMsg.role === 'ai') {
      lastMsg.content = fullResponse
    }
    scrollToBottom()
  }, () => {
    inputMessage.value = ''
    // AI回复完成
    isStreaming.value = false
    scrollToBottom()
  }, (err) => {
    const lastMsg = messageList.value[messageList.value.length - 1]
    if (lastMsg && lastMsg.role === 'ai') {
      lastMsg.content = `AI发生了错误${err}`
    }
    isStreaming.value = false
    showToast('AI回复失败')
    scrollToBottom()
  })
}


const addUserMessage = (msg) => {
  messageList.value.push({
    id: Date.now() + 1,
    content: msg,
    role: 'user',
    timestamp: new Date().toISOString()
  })
}

const handleQuickClick = (tag) => {
  console.log(tag)
  inputMessage.value = tag
  sendMessage()
}
</script>

<template>
  <div class="page-container chat-page">
    <div class="page-header" style="height: 46px;">
      <van-nav-bar title="AI旅游助手" fixed left-arrow @click="goBack" />
    </div>
    <div class="chat-container" ref="chatContainer">
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
      <div class="message-list" v-else>
        <ChatBubble v-for="item in messageList" :key="item.id" :message="item" />
        <div v-if="isStreaming" class="streaming-indicator">
          <van-loading type="spinner" size="20px" />
          <span>AI正在思考中...</span>
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
  /* flex: 1; */
  height: 630px;
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
