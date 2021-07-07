import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Highcharts from "highcharts";
import draggable from "highcharts/modules/draggable-points";
import HighchartsVue from "highcharts-vue";
import Gantt from "highcharts/modules/gantt";

Gantt(Highcharts);
draggable(Highcharts);

createApp(App)
  .use(store)
  .use(router)
  .use(HighchartsVue)
  .mount("#app");
