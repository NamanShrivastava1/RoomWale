import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Navbar } from '../features/shared/components/Navbar.jsx';
import { SmoothScroll } from '../features/shared/components/SmoothScroll.jsx';
import { usePageMotion } from '../features/shared/hooks/usePageMotion.js';
export default function AppLayout(){
 const location=useLocation(); usePageMotion(location.pathname);
 return <SmoothScroll><div className="app-shell"><Navbar/><main className="main-content"><Outlet/></main><footer className="site-footer"><span>ROOM WALE</span><span>Good homes are shared.</span></footer></div></SmoothScroll>;
}
