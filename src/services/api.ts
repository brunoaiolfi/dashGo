import axios from 'axios';
import { parseCookies } from 'nookies';




export const api = axios.create({
    baseURL: 'http://localhost:3000/api',
   
})