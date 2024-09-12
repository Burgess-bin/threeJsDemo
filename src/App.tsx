import './App.css'
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { router } from './router';
import github from './assets/logo/github.png';
import juejin from './assets/logo/juejin.png';
import csdn from './assets/logo/csdn.png';
import { useState } from 'react';

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
    <nav className='h-full border-r border-gray-200 p-5'>
      <ul className='space-y-6 lg:space-y-2 border-l border-slate-100 dark:border-slate-800'>
        {
          routes?.[0]?.children?.map((item) => {
            if (item.path == '/') return;
            return (
              <li key={item.id} className='text-left'>
                <NavLink
                  onClick={() => setSelectedMenu(item.path as string)}
                  to={item.path as string}
                  className={[
                    "block border-l pl-4 -ml-px dark:text-slate-400 dark:hover:text-slate-300 text-lg",
                    `${selectedMenu === item.path ?
                      'text-sky-500 border-current' :
                      'text-slate-700 hover:text-slate-900 border-transparent hover:border-slate-400 dark:hover:border-slate-500'}`,
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
    </nav>
  )
}

function App() {
  const location = useLocation();
  console.log('Current location:', location); // 添加调试日志

  return (
    <div className='h-screen w-screen flex flex-col'>
      <header className="flex justify-between items-center px-10 py-3 border-b border-gray-200">
        <span className='text-3xl font-bold'>Three.js Demo</span>
        <span className='flex gap-5'>
          <img className='w-6 h-6 cursor-pointer' onClick={() => window.open(linkUrl.github, '_blank')} src={github} alt="" />
          <img className='w-6 h-6 cursor-pointer' onClick={() => window.open(linkUrl.juejin, '_blank')} src={juejin} alt="" />
          <img className='w-6 h-6 cursor-pointer' onClick={() => window.open(linkUrl.csdn, '_blank')} src={csdn} alt="" />
        </span>
      </header>
      <div className='flex flex-1 overflow-hidden'>
        <Menu />
        <main id='main' className='flex-1 flex flex-col overflow-hidden'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default App
