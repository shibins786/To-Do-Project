        import { BrowserRouter, Route, Routes } from "react-router-dom";
        import Login from "./pages/Login.jsx";
        import Register from "./pages/Register.jsx";
        import Tasks from "./pages/Tasks.jsx";

        export default function App(){
            return(
                <>
                <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Register/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/task" element={<Tasks/>}/>
                </Routes>
                </BrowserRouter>
                </>
            );
        }
