import axios from "axios"

const api = axios.create({
    baseURL : "http://127.0.0.1:8000/api", //"Whenever you make a request, always start with this URL."
    headers : {
        "Content-Type":"application/json"  //,"Whenever you send a request, also send these headers."
    }
})

export default api;