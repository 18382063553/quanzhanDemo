import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import Vant from 'vant'; // 引入vant
import 'vant/lib/index.css'; // 引入vant的样式


const app = createApp(App);
app.use(Vant); // 使用vant
app.use(Vant.Lazyload);
app.use(router);
app.mount('#app')
