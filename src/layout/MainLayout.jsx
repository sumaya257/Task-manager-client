import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";
import { Outlet } from "react-router";
const MainLayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <div className="min-h-[calc(100vh-117px)]">
            <Outlet></Outlet>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default MainLayout;