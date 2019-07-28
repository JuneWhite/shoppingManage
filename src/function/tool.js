import store from '@/store'
import router from '@/router'

/*加载基本页面*/
import Index from '@/view/index/Index.vue'
import Login from '@/view/login/Login'
import Logout from '@/view/login/Logout'
import Error from '@/view/public/Error'
import AdminInfo from '@/view/admin/Admininfo'
import Home from '@/view/index/Home'

export function addRoute() {
  // 路由配置封装
  const getRouter = (data) => {
    let arr = []
    for (let i in data) {
      let path = data[i]['modulepath']
      let name = path.replace(/\//img, '')
      let viewname = ''
      if (data[i].display == 1) {
        viewname = 'main'
      } else {
        viewname = data[i]['modulepath'].split('/')[1]
      }
      let comName = path.split('/')[2].charAt(0).toUpperCase() + path.split('/')[2].slice(1)
      let viewpath = path.split('/')[1] + '/' + comName + '.vue'
      let obj = {
        path: path,
        name: name,
        components: { [viewname]: () => import('@/view/' + viewpath) },
        meta: {
          id: data[i]['id'],
          title: data[i]['modulename'],
          display: data[i]['display']
        }
      }
      arr.push(obj)
    }
    return arr
  }

  // 基本路由数据
  let routeData = [
    {
      path: '/',
      component: Index,
      children: [
        {
          path: '/home',
          name: 'home',
          components: { main: Home },
          meta: {
            display: 1,
            title: 'home'
          }
        },
        {
          path: '/admin/info',
          name: 'admininfo',
          components: { main: AdminInfo },
          meta: {
            id: -1,
            title: '会员中心',
            display: 1
          }
        }
      ]
    },
    {
      path: '/login',
      components: { default: Login }
    },
    {
      path: '/logout',
      components: { default: Logout }
    },
    {
      path: '*',
      components: { default: Error }
    }
  ];

  let module = store.state.moduleData
  // 第一层路由
  let levelData = getRouter(module)
  // 递归生成二层路由
  for (let i in module) {
    if (typeof (module[i]['children']) != undefined) {
      levelData[i]['children'] = getRouter(module[i]['children'])
      routeData[0]['children'].push(levelData[i])
    }
  }
  // 挂载路由
  router.addRoutes(routeData)
}