import { SYSTEM_NAME } from '../constants/index';

export default function NavBar({ routes }) {
  return (
    <nav className='flex items-center justify-between bg-white px-6 py-4 shadow-md'>
      <div className='flex items-center' id={SYSTEM_NAME}>
        <img src='/images/logo.png' alt='Logo' className='mr-2 h-10 w-auto' />
        <span className='text-xl font-bold text-indigo-700'>{SYSTEM_NAME}</span>
      </div>
      <div className='hidden space-x-8 md:flex'>
        {routes.map((route) => (
          <a
            key={route.name + route.href}
            href={route.href}
            className='text-gray-700 transition hover:text-indigo-600'
          >
            {route.name}
          </a>
        ))}
      </div>
      <div className='flex gap-2'>
        <a
          href='/login'
          className='rounded-lg bg-indigo-600 px-4 py-2 text-white shadow transition hover:bg-indigo-700'
        >
          Iniciar sesión
        </a>
        <a
          href='/signup'
          className='rounded-lg bg-gray-200 px-4 py-2 text-black shadow transition hover:bg-gray-400'
        >
          Registrarse
        </a>
      </div>
    </nav>
  );
}
