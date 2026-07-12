import axios from "axios"

const api = axios.create({
    baseURL : "https://to-do-project-1-i9lh.onrender.com/api", //"Whenever you make a request, always start with this URL."
    headers : {
        "Content-Type":"application/json"  //,"Whenever you send a request, also send these headers."
    }
})

export default api;