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
import "./assets/main.scss";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faTasks,
  faProjectDiagram,
  faTachometerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faTasks, faProjectDiagram, faTachometerAlt);
Gantt(Highcharts);
Draggable(Highcharts);
HC_timeLine(Highcharts);
HighchartsCustomEvents(Highcharts);

createApp(App)
  .use(store)
  .use(router)
  .component("font-awesome-icon", FontAwesomeIcon)
  .use(HighchartsVue)
  .mount("#app");
