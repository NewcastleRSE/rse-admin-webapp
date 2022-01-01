import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Highcharts from "highcharts";
import Draggable from "highcharts/modules/draggable-points";
import HC_timeLine from "highcharts/modules/timeline";
import Gantt from "highcharts/modules/gantt";
import HighchartsCustomEvents from "highcharts-custom-events";
import HighchartsVue from "highcharts-vue";
import Highcharts3D from "highcharts/highcharts-3d";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@/assets/styles/index.css";


Gantt(Highcharts);
Draggable(Highcharts);
HC_timeLine(Highcharts);
HighchartsCustomEvents(Highcharts);
Highcharts3D(Highcharts);

createApp(App)
  .use(store)
  .use(router)
  .use(HighchartsVue)
  .mount("#app");
