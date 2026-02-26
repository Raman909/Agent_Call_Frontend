import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
    return (
        <div className="min-h-screen flex bg-background text-textMain">
            {/* Abstract Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 flex w-full h-screen">
                <Sidebar />
                <main className="flex-1 overflow-y-auto p-12">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
