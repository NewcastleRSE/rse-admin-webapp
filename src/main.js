import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Highcharts from "highcharts";
import Draggable from "highcharts/modules/draggable-points";
import Gantt from "highcharts/modules/gantt";
//import Stock from "highcharts/modules/stock";
import HighchartsVue from "highcharts-vue";
import "./assets/main.scss";
//require("./assets/main.scss");

Gantt(Highcharts);
Draggable(Highcharts);
//Stock(Highcharts);

createApp(App)
  .use(store)
  .use(router)
  .use(HighchartsVue)
  .mount("#app");
