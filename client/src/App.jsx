import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import SignIn from "./pages/Signin"
import SignUp from "./pages/SignUp"
import Dashboard from "./pages/Dashboard"
import Header from "./components/Header"
import Footer from "./components/Footer"
import PrivateRoute from "./components/PrivateRoute"
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute"
import Createpost from "./pages/Createpost"
import UpdatePost from "./pages/UpdatePost"
import Chat from "./pages/Chat"
import PostPage from "./pages/PostPage"
import ChatPage from "./pages/ChatPage"
import EditUser from "./pages/EditUSer"


export default function App() {
  return (
    <BrowserRouter>
    <Header />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/about" element={<About />}/>
        <Route path="/sign-in" element={<SignIn />}/>
        <Route path="/sign-up" element={<SignUp />}/>
        <Route element={<PrivateRoute />} >
          <Route path="/dashboard" element={<Dashboard />}/>
        </Route>
        <Route element={<OnlyAdminPrivateRoute />} >
          <Route path="/create-post" element={<Createpost />}/>
          <Route path="/update-post/:postId" element={<UpdatePost />}/>
          <Route path="/update-user/:userId" element={<EditUser />}/>
        </Route>
        <Route path="/chat" element={<Chat />}/>
        <Route path="/chat/:userId" element={<ChatPage />}/>
        <Route path="/post/:postSlug" element={<PostPage />}/>
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}

