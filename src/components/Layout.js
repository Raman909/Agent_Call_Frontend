import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
const Layout = () => {
    return (_jsxs("div", { className: "min-h-screen flex bg-background text-textMain", children: [_jsxs("div", { className: "fixed inset-0 overflow-hidden pointer-events-none z-0", children: [_jsx("div", { className: "absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]" }), _jsx("div", { className: "absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[120px]" })] }), _jsxs("div", { className: "relative z-10 flex w-full h-screen", children: [_jsx(Sidebar, {}), _jsx("main", { className: "flex-1 overflow-y-auto p-12", children: _jsx(Outlet, {}) })] })] }));
};
export default Layout;
