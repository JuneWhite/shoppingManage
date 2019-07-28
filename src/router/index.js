import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

Vue.use(Router)

const router = new Router({
	mode: 'history'
});

// 路由卫士
router.beforeEach((to, from, next) => {
	if (to.path.toLowerCase() != '/login') {
		if (!(store.state.adminData && store.state.adminData.id)) {
			next('/login')
		} else {
			next()
		}
	} else {
		next()
	}
})

export default router;
