import { axiosInstance } from 'src/boot/axios'

export const doLogin = async ({ commit, dispatch }, payload) => {
  await axiosInstance.post('/api/v1/jwt/create/', payload).then(response => {
    const token = response.data
    commit('setToken', token)
    axiosInstance.defaults.headers.common.Authorization = 'JWT ' + token.access
    dispatch('getMe', token)
  })
}

export const signOut = ({ commit }) => {
  axiosInstance.defaults.headers.common.Authorization = ''
  commit('removeToken')
}

export const getMe = async ({ commit, dispatch }, token) => {
  await axiosInstance.get('/api/v1/users/me/', token.access).then(response => {
    commit('setMe', response.data)
  })
}

export const init = async ({ commit, dispatch }) => {
  const token = localStorage.getItem('token')
  if (token) {
    await commit('setToken', JSON.parse(token))
    axiosInstance.defaults.headers.common.Authorization = 'JWT ' + JSON.parse(token).access
    dispatch('getMe', JSON.parse(token))
  } else {
    commit('removeToken')
  }
}
