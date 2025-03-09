import "./global.css";
// import Signup from "./pages/Signup/Signup";
import CenterSignup from "./pages/Signup/Center/CenterSignup";
import AddSenior from "./pages/Signup/Center/AddSenior";
import AddJob from "./pages/Signup/Center/AddJob";
import JobDetail from "./pages/Signup/Center/JobDetail";
import Recommend from "./pages/Signup/Center/Recommend";
import Home from "./pages/Signup/Center/Home";
import SeniorManagement from "./pages/Signup/Center/SeniorManagement";
import ChatList from "./pages/Signup/Center/ChatList";
import Chat from "./pages/Signup/Center/Chat";
import MyPage from "./pages/Signup/Center/MyPage";
import Menu from "./pages/Signup/Center/Menu";
import Login from "./pages/Signup/Center/Login";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import useAuth from "./apis/auth";
import CareHome from "./pages/Caregiver/CareHome";
import CareMatching from "./pages/Caregiver/CareMatching";
import CareJobDetail from "./pages/Caregiver/CareJobDetail";
import CareChat from "./pages/Caregiver/CareChat";
import CareChatList from "./pages/Caregiver/CareChatList";
import CareMenu from "./pages/Caregiver/CareMenu";
import CareMyPage from "./pages/Caregiver/CareMyPage";
import CareSignup from "./pages/Caregiver/CareSignup";
import CareAddResume from "./pages/Caregiver/CareAddResume";
import CareAddJobSearch from "./pages/Caregiver/CareAddJobSearch";


function App() {
  const { getLoggedIn, getUserType } = useAuth();

  const PrivateRoute = () => {
    return (
      getLoggedIn()
        ? <Outlet />
        : <Navigate replace to="/login" />
    );
  }

  return (
    <>
      <Routes>
        <Route path="/login" element={getLoggedIn() ? <Navigate replace to="/" /> : <Login />} />
        <Route path="/signup/center" element={<CenterSignup />} />
        <Route path="/signup/caregiver" element={<CareSignup />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={getUserType() === 1 ? <CareHome /> : <Home />} />
          <Route path="/jobs/add" element={getUserType() === 1 ? <CareAddJobSearch /> : <Navigate replace to="/" />} />
          <Route path="/seniors/:seniorId/jobs/add" element={getUserType() === 1 ? <Navigate replace to="/" /> : <AddJob />} />
          <Route path="/jobs/:jobId" element={getUserType() === 1 ? <CareJobDetail /> : <JobDetail />} />
          <Route path="/jobs/:jobId/recommend" element={getUserType() === 1 ? <Navigate replace to="/" /> : <Recommend />} />
          <Route path="/resume" element={getUserType() === 1 ? <CareAddResume /> : <Navigate replace to="/" />} />
          <Route path="/matching" element={getUserType() === 1 ? <CareMatching /> : <Navigate replace to="/" />} />
          <Route path="/seniors" element={getUserType() === 1 ? <Navigate replace to="/" /> : <SeniorManagement />} />
          <Route path="/seniors/add" element={getUserType() === 1 ? <Navigate replace to="/" /> : <AddSenior />} />
          <Route path="/chats" element={getUserType() === 1 ? <CareChatList /> : <ChatList />} />
          <Route path="/chats/detail" element={getUserType() === 1 ? <CareChat /> : <Chat />} />
          <Route path="/mypage" element={getUserType() === 1 ? <CareMyPage /> : <MyPage />} />
          <Route path="/menu" element={getUserType() === 1 ? <CareMenu /> : <Menu />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
