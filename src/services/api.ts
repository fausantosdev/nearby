import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://nearby-api-rn60.onrender.com',
  timeout: 700
})
