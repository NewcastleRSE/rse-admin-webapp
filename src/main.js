import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Highcharts from "highcharts";
import Draggable from "highcharts/modules/draggable-points";
import HC_timeLine from "highcharts/modules/timeline";
import Gantt from "highcharts/modules/gantt";
import HighchartsVue from "highcharts-vue";
import "./assets/main.scss";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTasks, faProjectDiagram, faTachometerAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faTasks, faProjectDiagram, faTachometerAlt, faUser)
Gantt(Highcharts);
Draggable(Highcharts);
HC_timeLine(Highcharts)

createApp(App)
    .use(store)
    .use(router)
    .component('font-awesome-icon', FontAwesomeIcon)
    .use(HighchartsVue)
    .mount("#app");