import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex);
Vue.use(createPersistedState);

export default new Vuex.Store({
	plugins: [
		createPersistedState({
			storage: window.sessionStorage
		})
	],
	state: {
		token: '',
		activeName: '/home',
		adminData: {},
		roleData: {},
		moduleData: [],
		editableTabs: []
	},
	getters: { //vue中的计算属性
		editableTabsLast(state) {
			return state.editableTabs[state.editableTabs.length - 1];
		}
	},
	mutations: {
		logout(state) {
			state.adminData = {};
			state.roleData = {};
			state.moduleData = [];
			state.editableTabs = [

			];
			state.token = '';
			state.activeName = '/home';
		},
		setToken(state, token) {
			state.token = token;
		},
		appInit(state, LoginData) {
			//初始化用户信息
			state.adminData = LoginData.adminData;
			state.roleData = LoginData.roleData;
			state.moduleData = LoginData.moduleData;
		},
		addTab: function (state, param) {
			let flag = false;
			for (let i in state.editableTabs) {
				if (state.editableTabs[i].name == param.name) {
					flag = true;
					break;
				}
			}
			if (!flag) {
				state.editableTabs.push(param);
				state.activeName = param.name;
			}
		},
		switchTab: function (state, tabname) {
			state.activeName = tabname;
		},
		deleteTab: function (state, tabname) {
			if (state.editableTabs.length > 1) {
				for (let i in state.editableTabs) {
					if (state.editableTabs[i].name == tabname) {
						state.editableTabs.splice(i, 1);
						break;
					}
				}
			}
		}
	}
})
