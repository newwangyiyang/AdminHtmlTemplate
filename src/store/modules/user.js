import { login_user, get_user_by_token, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: 'http://tx.haiqq.com/uploads/allimg/150411/1640504941-14.jpg',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {  
      return new Promise((resolve, reject) => {
        login_user(userInfo).then(response => {
          const data = response.data
          setToken(data)
          commit('SET_TOKEN', data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    async GetUserInfo({ commit, state }) {
      const res = await get_user_by_token()
      if (res.status_code === 0) {
        const data = res.data
        let roleList
        // 验证返回的roles是一个数字  [10, 100, 1000]  [普通用户, '管理员', '超级管理员']
        switch (data.user_role) {
          case 10:
            roleList = ['user']
            break;
          case 100:
            roleList = ['user', 'admin']
            break;
          case 1000:
            roleList = ['user', 'admin', 'superAdmin']
            break
          default:
            roleList = []
            break
        }
        commit('SET_ROLES', roleList)
        commit('SET_NAME', data.user_name)
      } 
      return res
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resolve()
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
