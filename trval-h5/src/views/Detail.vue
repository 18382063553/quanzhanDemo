<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SpotItem from '../components/SpotItem.vue'
import BudgetTable from '../components/BudgetTable.vue'
import request from '../utils/request'


const route = useRoute()
const router = useRouter()
onMounted(() => {
    fromData.city = route.query.city
    fromData.budget = route.query.budget
    fromData.days = route.query.days
    fetchTripData()
})

const fromData = reactive({
    city: '',
    budget: '',
    days: ''
})

const tripData = ref(null)
const loading = ref(false)
const error = ref(false)
const activeDays = ref([])

const goBack = () => {
    router.back()
}

const reload = () => {
    loading.value = true
    error.value = false
    fetchTripData()
}

// 封装获取数据的函数
const fetchTripData = async () => {
    loading.value = true
    error.value = false
    try {
        // 使用封装的 request.get 方法发起请求
        const res = await request.post('/api/travel/recommend', {
            city: fromData.city,
            budget: fromData.budget,
            days: fromData.days
        })
        // 假设后端返回的数据结构中包含 success 和具体业务数据
        tripData.value = res.data
    } catch (err) {
        console.error('获取详情失败:', err)
        error.value = true
    } finally {
        loading.value = false
    }
}

const goToChat = () => {
    router.push({ name: 'Chat' })
}

</script>

<template>
    <div class="page">
        <van-nav-bar title="详情页" left-arrow @click="goBack" />
        <div class="page-content">
            <div class="loading-container" v-if="loading">
                <van-loading size="48px" type="spinner" />
            </div>
            <div v-if="error">
                <van-empty description="加载失败">
                    <van-button @click="reload" round type="primary" class="bottom-button">重新加载</van-button>
                </van-empty>
            </div>
            <template v-if="tripData && tripData.success">
                <div class="card overview-card" style="display: flex;justify-content: space-between;">
                    <h2 class="trip-header">{{ tripData.city }}~{{ tripData.days }}天行程</h2>
                    <span class="trip-budget">预算：{{ tripData.totalBudget }}</span>
                </div>
                <van-collapse v-model="activeDays">
                    <van-collapse-item v-for="item in tripData.dailyItinerary" :key="item.days"
                        :title="'第' + item.day + '天'" :name="item.days">
                        <div class="day-schedule">
                            <div class="schedule-section">
                                <div class="section-label morning">上午</div>
                                <SpotItem v-for="spot in item.morning" :key="spot.spot" :data="item.morning" />
                            </div>
                            <div class="schedule-section">
                                <div class="section-label afternoon">下午</div>
                                <SpotItem v-for="spot in item.afternoon" :key="spot.spot" :data="item.afternoon" />
                            </div>
                            <div class="schedule-section">
                                <div class="section-label evening">晚上</div>
                                <SpotItem v-for="spot in item.evening" :key="spot.spot" :data="item.evening" />
                            </div>
                        </div>
                    </van-collapse-item>
                </van-collapse>
                <div class="card budget-card" style="margin-top: 16px;">
                    <h2 class="section-title">预算明细</h2>
                    <BudgetTable :data="tripData.budgetBreakdown" :total="tripData.totalBudget" />
                </div>
                <div class="card tips-card">
                    <h2 class="section-title">温馨提示</h2>
                    <ul class="tips-list">
                        <li v-for="item in tripData.tips" :key="item">{{ item }}</li>
                    </ul>
                </div>
                <div class="card warnings-card">
                    <h2 class="section-title">注意事项</h2>
                    <ul class="warnings-list">
                        <li v-for="item in tripData.warnings" :key="item">{{ item }}</li>
                    </ul>
                </div>
            </template>
        </div>
        <div class="detail-footer" v-if="tripData && tripData.success">
            <van-button @click="goToChat" class="primary-button" type="primary" size="large" round>咨询AI助手</van-button>
        </div>
    </div>
</template>

<style scoped>
.page-container {
    min-height: 100vh;
    background-color: #f5f5f5;
    padding-bottom: 70px;
}

.card {
    background-color: #fff;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-title {
    font-size: 18px;
    font-weight: 600;
    color: #323233;
    margin-bottom: 12px;
}

.page-content {
    padding: 16px;
    margin-bottom: 45px;
}

.overview-card {
    margin-bottom: 16px;
}

.trip-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.trip-header h2 {
    font-size: 20px;
    color: #323233;
    margin: 0;
}

.trip-budget {
    font-size: 16px;
    color: #ee0a24;
    font-weight: 600;
}

.trip-collapse {
    margin-bottom: 16px;
}

.day-schedule {
    padding: 8px 0;
}

.schedule-section {
    margin-bottom: 16px;
}

.schedule-section:last-child {
    margin-bottom: 0;
}

.section-label {
    font-size: 14px;
    font-weight: 600;
    padding: 4px 8px;
    border-radius: 4px;
    display: inline-block;
    margin-bottom: 8px;
}

.section-label.morning {
    background: #fff7e6;
    color: #fa8c16;
}

.section-label.afternoon {
    background: #e6f7ff;
    color: #1890ff;
}

.section-label.evening {
    background: #f6ffed;
    color: #52c41a;
}

.budget-card,
.tips-card,
.warnings-card {
    margin-bottom: 16px;
}

.tips-list,
.warnings-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.tips-list li,
.warnings-list li {
    padding: 8px 0;
    color: #666;
    font-size: 14px;
    border-bottom: 1px solid #f5f5f5;
}

.tips-list li:last-child,
.warnings-list li:last-child {
    border-bottom: none;
}

.detail-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 12px 16px;
    background: #fff;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
    max-width: 750px;
    margin: 0 auto;
}

.error-card {
    text-align: center;
    padding: 40px 16px;
}
</style>
