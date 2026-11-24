<template>
  <div class="page-container">
    <van-nav-bar title="智能旅游助手" />
    <div class="page-content">
      <van-notice-bar left-icon="volume-o" text="基于AI的智能景点推荐与行程规划系统" style="margin-bottom: 16px;" />
      <div class="card">
        <div class="section-title">
          规划你的旅程
        </div>
        <van-cell-group inset>
          <van-field style="background-color: #f7f7f7;border-radius: 8px;margin-bottom: 8px;" v-model="fromData.city"
            label="目的地" is-link readonly @click="showBottom = true" placeholder="请选择目的地" />
          <van-field style="background-color: #f7f7f7;border-radius: 8px;margin-bottom: 8px;" v-model="fromData.budget"
            label="预算(元)" placeholder="请输入预算" />
          <van-field style="background-color: #f7f7f7;border-radius: 8px;margin-bottom: 8px;" v-model="fromData.days"
            label="天数" placeholder="请输入天数" />
        </van-cell-group>
        <van-button type="primary" size="large" round @click="submit">提交规划</van-button>
      </div>
      <div class="card">
        <div class="section-title">
          快捷入口
        </div>
        <div class="quick-entry">
          <div class="quick-item" @click="pathTo('/chat')">
            <div class="quick-icon">
              <van-icon name="chat-o" />
            </div>
            <div class="quick-label">AI对话</div>
          </div>
          <div class="quick-item" @click="pathTo('/profile')">
            <div class="quick-icon">
              <van-icon name="user-o" />
            </div>
            <div class="quick-label">我的</div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="section-title">
          热门目的地
        </div>
        <div class="city-grid">
          <div v-for="city in hotCities" :key="city" class="city-tag" :class="{ active: city === selectedCity }"
            @click="getSelectedCity(city)">
            {{ city }}
          </div>
        </div>
      </div>
    </div>

  </div>

  <!-- 弹出层 -->
  <van-popup v-model:show="showBottom" position="bottom" :style="{ height: '33%' }">
    <van-picker title="标题" :columns="columns" @confirm="onConfirm" @cancel="onCancel" @change="onChange" />
  </van-popup>

</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant';

const router = useRouter()
const active = ref(0)
const fromData = reactive({
  city: '',
  budget: '',
  days: '',
})
const hotCities = ['北京', '上海', '广州', '深圳', '成都', '杭州', '西安', '重庆']
const selectedCity = ref('北京')
const showBottom = ref(false)

const allColumns = ["北京", "上海", "广州", "深圳", "成都", "抗州", "西安", "重庆",
  "南京", "武汉", "苏州", "长沙", "天津", "郑州", "济南", "青岛", "大连", "沈阳",
  "哈尔滨", "长春", "福州", "厦门", "南昌", "合肥", "昆明", "贵阳", "南宁", "挂林",
  "海口", "三亚", "丽江", "大理", "西安", "兰州", "乌鲁木齐", "拉萨", "呼和浩特", "太原", "石家庄"]


const columns = allColumns.map((item) => {
  return { text: item, value: item }
})

const onConfirm = (value) => {
  fromData.city = value.selectedOptions[0].value
  showBottom.value = false
}
const onCancel = () => {
  showBottom.value = false
}
const onChange = (value) => {
  console.log(value)
}

const submit = () => {
  if (!fromData.city) {
    showToast('请选择目的地')
    return
  }
  if (!fromData.budget || fromData.budget <= 100) {
    showToast('请输入预算大于100元的预算，单位为元')
    return
  }
  if (!fromData.days || fromData.days < 1) {
    showToast('请输入1天以上的天数')
    return
  }

  router.push({ path: '/detail', query: fromData })

}

const getSelectedCity = (city) => {
  selectedCity.value = city
  fromData.city = city
}

const pathTo = (path) => {
  router.push(path)
}
</script>



<style scoped>
.page-container {
  max-height: 100vh;
  padding-bottom: 70px;
  background-color: #f5f5f5;
}

.page-content {
  padding: 16px;
}

.card {
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px 0px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #323233;
  margin-bottom: 12px;
}

/* 快捷入口 */
.quick-entry {
  display: flex;
  gap: 12px;
}

.quick-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px 0;
  background-color: #fff;
  border: 1px solid #f2f3f5;
  border-radius: 8px;
  box-shadow: 0 2px 8px 0px rgba(0, 0, 0, 0.05);
}

.quick-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: #f7f8fa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: #323233;
}

.quick-label {
  font-size: 13px;
  color: #646566;
}

/* 热门目的地 */
.city-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.city-tag {
  height: 34px;
  line-height: 34px;
  text-align: center;
  font-size: 14px;
  color: #323233;
  background-color: #fff;
  border: 1px solid #f2f3f5;
  border-radius: 8px;
  box-shadow: 0 2px 8px 0px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.2s;
}

.city-tag:hover {
  color: #fff;
  background-color: #1989fa;
  border-color: #1989fa;
}

.city-tag.active {
  color: #fff;
  background-color: #1989fa;
  border-color: #1989fa;
}
</style>
