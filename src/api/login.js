import axiosJson from '@/utils/axiosJson'

export const login_user = json => axiosJson.post('/user/login_user', json)


export const get_user_by_token = () => axiosJson.post('/user/get_user_by_token')

