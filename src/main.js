import 'amfe-flexible'
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// By default we import all the components.
// Only reserve the components on demand and remove the rest.
// Style is always required.
import {
  Style,
  // // basic
  // Button,
  // Loading,
  // Tip,
  // Toolbar,
  // TabBar,
  // TabPanels,
  // // popup
  // Popup,
  // Toast,
  // Picker,
  // CascadePicker,
  // DatePicker,
  // TimePicker,
  // SegmentPicker,
  // ActionSheet,
  // Drawer,
  // ImagePreview,
  // // scroll
  // Scroll,
  Slide,
  // IndexList,
  // Swipe,
  // Sticky,
} from 'cube-ui'
import App from './App'
import router from './router'

// Vue.use(Button)
// Vue.use(Loading)
// Vue.use(Tip)
// Vue.use(Popup)
// Vue.use(Toast)
// Vue.use(ActionSheet)
// Vue.use(Drawer)
// Vue.use(ImagePreview)
// Vue.use(Scroll)
Vue.use(Slide)
// Vue.use(IndexList)
// Vue.use(Swipe)
// Vue.use(Sticky)


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
