import { SYSTEM_NAME } from '../constants/index';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { server } from '../utils/server';

function SignUpPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await server().signUp({
        username,
        email,
        password,
      });

      await new Promise((resolve) => setTimeout(resolve, 100));
      const sessionResponse = await server().validateSession();

      if (sessionResponse.valid) {
        navigate('/panel-admin');
      } else {
        setError('Error al establecer la sesión');
      }
    } catch (error) {
      console.error('Error en registro:', error);
      setError('Error al Registrarse. Intenta nuevamente.');
    } finally {
      setLoading(false);
      
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 to-green-50 px-4 py-12 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-lg'>
        <div className='text-center'>
          <img className='mx-auto h-12 w-auto' src='/images/logo.png' alt={SYSTEM_NAME} />
          <h2 className='mt-6 text-3xl font-extrabold text-green-800'>Registrarse</h2>
          <p className='mt-2 text-sm text-gray-600'>Crea tu cuenta en {SYSTEM_NAME}</p>
        </div>

        {error && (
          <div className='rounded-md bg-red-50 p-4'>
            <div className='flex'>
              <div className='flex-shrink-0'>
                <svg className='h-5 w-5 text-red-400' viewBox='0 0 20 20' fill='currentColor'>
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <div className='ml-3'>
                <h3 className='text-sm font-medium text-red-800'>{error}</h3>
              </div>
            </div>
          </div>
        )}

        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          <div className='space-y-4'>
            <div>
              <label htmlFor='username' className='block text-sm font-medium text-gray-700'>
                Nombre de usuario
              </label>
              <input
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                id='username'
                name='username'
                type='text'
                autoComplete='username'
                required
                className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm'
                placeholder='Alejandro López'
              />
            </div>
            <div>
              <label htmlFor='email-address' className='block text-sm font-medium text-gray-700'>
                Correo electrónico
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                id='email-address'
                name='email'
                type='email'
                autoComplete='email'
                required
                className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm'
                placeholder='correo@ejemplo.com'
              />
            </div>
            <div>
              <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
                Contraseña
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                id='password'
                name='password'
                type='password'
                autoComplete='new-password'
                required
                className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm'
                placeholder='Tu contraseña'
              />
            </div>
          </div>

          <div>
            <button
              type='submit'
              disabled={loading}
              className={`group relative flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none ${
                loading ? 'cursor-not-allowed bg-gray-400' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {loading ? (
                <div className='flex items-center'>
                  <svg
                    className='mr-3 -ml-1 h-5 w-5 animate-spin text-white'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                  Registrando...
                </div>
              ) : (
                'Registrarse'
              )}
            </button>
          </div>

          <div className='text-center'>
            <p className='text-sm text-gray-600'>
              ¿Ya tienes una cuenta?{' '}
              <Link to='/login' className='font-medium text-green-600 hover:text-green-500'>
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </form>

        <div className='text-center'>
          <Link
            to='/'
            className='inline-flex items-center text-sm font-medium text-green-600 hover:text-green-500'
          >
            <svg className='mr-1 h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M10 19l-7-7m0 0l7-7m-7 7h18'
              />
            </svg>
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
