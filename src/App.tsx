import './App.css'
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { router } from './router';
import github from './assets/logo/github.png';
import juejin from './assets/logo/juejin.png';
import csdn from './assets/logo/csdn.png';
import { useEffect, useState } from 'react';
import logo from '../public/burgess.png';

const linkUrl = {
  github: 'https://github.com/Burgess-bin/threeJsDemo',
  juejin: 'https://juejin.cn/user/4336916970080542',
  csdn: 'https://blog.csdn.net/burgessbin'
}

const Menu = () => {
  const { routes } = router;
  //当前选中的menu
  const [selectedMenu, setSelectedMenu] = useState(location.pathname);

  return (
    <nav className='h-full  border-gray-200 px-2 py-5 flex flex-col justify-between bg-[#1f1f1f]'>
      <div className='flex flex-col'>
        <img src={logo} alt="" className='h-12 object-contain' />
        <ul className='space-y-6 lg:space-y-2 border-slate-100 dark:border-slate-800 mt-8 '>
          {
            routes?.[0]?.children?.map((item) => {
              if (item.path == '/') return;
              return (
                <li key={item.id} className='text-left'>
                  <NavLink
                    onClick={() => setSelectedMenu(item.path as string)}
                    to={item.path as string}
                    className={[
                      "block pl-8 w-[150px] -ml-px dark:text-slate-400 dark:hover:text-slate-300 text-lg text-[#f7f7f780]",
                      `${selectedMenu === item.path ?
                        'text-sky-500 bg-[#252934] text-[#4d95ff]' :
                        'text-slate-700 hover:text-[#4d95ff]  hover:border-slate-400 dark:hover:border-slate-500'}`,
                    ].join(" ")
                    }
                  >
                    {item.id}
                  </NavLink>
                </li>
              )
            })
          }
        </ul>
      </div>
      <span className='flex gap-5 justify-center'>
        <img className='w-6 h-6 cursor-pointer' onClick={() => window.open(linkUrl.github, '_blank')} src={github} alt="" />
        <img className='w-6 h-6 cursor-pointer' onClick={() => window.open(linkUrl.juejin, '_blank')} src={juejin} alt="" />
        <img className='w-6 h-6 cursor-pointer' onClick={() => window.open(linkUrl.csdn, '_blank')} src={csdn} alt="" />
      </span>
    </nav>
  )
}

function App() {
  const location = useLocation();
  console.log('Current location:', location); // 添加调试日志

  return (
    <div className='h-screen w-screen flex flex-col'>
      {/* <header className="flex justify-between items-center px-10 py-3 border-b border-gray-200">
        <span className='text-3xl font-bold'>Three.js Demo</span>
        <span className='flex gap-5'>
          <img className='w-6 h-6 cursor-pointer' onClick={() => window.open(linkUrl.github, '_blank')} src={github} alt="" />
          <img className='w-6 h-6 cursor-pointer' onClick={() => window.open(linkUrl.juejin, '_blank')} src={juejin} alt="" />
          <img className='w-6 h-6 cursor-pointer' onClick={() => window.open(linkUrl.csdn, '_blank')} src={csdn} alt="" />
        </span>
      </header> */}
      <div className='flex flex-1 overflow-hidden'>
        <Menu />
        <main id='main' className='flex-1 flex flex-col overflow-hidden bg-[#111]'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default App
