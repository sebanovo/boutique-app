import { SYSTEM_NAME } from '../constants/index';
import NavBar from '../components/NavBar';
import FeatureCard from '../components/FeatureCard';
import TestimonialCard from '../components/TestimonialCard';

function LandingPage() {
  return (
    <main className='flex min-h-screen flex-col bg-gradient-to-br from-amber-50 to-green-50'>
      <NavBar
        routes={[
          {
            name: 'Características',
            href: '#features',
          },
          {
            name: 'Testimonios',
            href: '#testimonials',
          },
        ]}
      ></NavBar>
      <header className='flex flex-col items-center justify-center px-4 py-16 text-center'>
        <h1 className='mb-6 text-4xl font-extrabold text-green-800 md:text-6xl'>
          Transforma la Gestión de tu boutique
        </h1>
        <p className='mb-8 max-w-3xl text-lg text-gray-700 md:text-xl'>
          La plataforma todo-en-uno que simplifica la administración de boutiques, mejora la
          comunicación con residentes y optimiza los procesos de mantenimiento.
        </p>
        <div className='flex flex-col gap-4 sm:flex-row'>
          <a
            href='#pricing'
            className='rounded-lg bg-green-600 px-8 py-3 font-semibold text-white shadow transition hover:bg-green-700'
          >
            Comenzar gratis
          </a>
        </div>
        <img
          src='https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80'
          alt={`Dashboard ${SYSTEM_NAME}`}
          className='mt-12 w-full max-w-5xl rounded-xl border border-gray-200 shadow-2xl'
        />
      </header>
      {/* Features Section */}
      <section id='features' className='bg-white px-4 py-16'>
        <div className='mx-auto max-w-6xl'>
          <h2 className='mb-4 text-center text-3xl font-bold text-green-800 md:text-4xl'>
            Todo lo que necesitas para administrar tu boutique
          </h2>
          <p className='mx-auto mb-12 max-w-3xl text-center text-gray-600'>
            Diseñado específicamente para boutiques y conjuntos residenciales, con herramientas
            que facilitan la gestión diaria.
          </p>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
            <FeatureCard
              icon={
                <svg
                  className='h-6 w-6 text-amber-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
                  ></path>
                </svg>
              }
              title='Gestión de Residentes'
              description='Administra información de residentes, unidades habitacionales, y mantén un directorio actualizado.'
            ></FeatureCard>

            <FeatureCard
              icon={
                <svg
                  className='h-6 w-6 text-amber-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  ></path>
                </svg>
              }
              title='Administración Financiera'
              description='Controla cuotas de mantenimiento, gastos comunes, facturación y estados de cuenta automatizados.'
            ></FeatureCard>

            <FeatureCard
              icon={
                <svg
                  className='h-6 w-6 text-amber-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
                  ></path>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                  ></path>
                </svg>
              }
              title='Mantenimiento y Servicios'
              description='Programa mantenimiento de áreas comunes, control de proveedores y gestión de servicios.'
            ></FeatureCard>
          </div>
        </div>
      </section>
      <section id='testimonials' className='bg-white px-4 py-16'>
        <div className='mx-auto max-w-6xl'>
          <h2 className='mb-12 text-center text-3xl font-bold text-green-800 md:text-4xl'>
            Lo que dicen nuestros clientes
          </h2>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
            <TestimonialCard
              name='Carlos Méndez'
              role='Administrador, boutique Las Palmas'
              testimonial={`Desde que implementamos ${SYSTEM_NAME}, hemos reducido un 50% el tiempo dedicado a tareas administrativas. La comunicación con los residentes es ahora mucho más efectiva.`}
            ></TestimonialCard>

            <TestimonialCard
              name='Laura Rodríguez'
              role='Presidente del Comité, Residencial El Bosque'
              testimonial='El control de gastos y cuotas se ha simplificado enormemente. Los reportes automáticos nos permiten tomar mejores decisiones para nuestra comunidad.'
            ></TestimonialCard>

            <TestimonialCard
              name='José González'
              role='Síndico, Conjunto Residencial Aurora'
              testimonial='La gestión de mantenimiento es ahora más eficiente. Podemos programar servicios y llevar control de proveedores desde una sola plataforma.'
            ></TestimonialCard>
          </div>
        </div>
      </section>
  
      {/* Footer */}
      <footer className='bg-green-800 px-4 py-12 text-white'>
        <div className='mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-4'>
          <div>
            <div className='mb-4 flex items-center'>
              <img src='/images/logo.png' alt={`${SYSTEM_NAME} logo`} className='mr-2 h-8 w-auto' />
              <span className='text-xl font-bold'>{SYSTEM_NAME}</span>
            </div>
            <p className='text-green-200'>
              La plataforma integral para la gestión de boutiques del siglo XXI.
            </p>
          </div>

          <div>
            <h4 className='mb-4 font-semibold'>Producto</h4>
            <ul className='space-y-2'>
              <li>
                <a href='#features' className='text-green-200 transition hover:text-white'>
                  Características
                </a>
              </li>
              <li>
                <a href='#testimonials' className='text-green-200 transition hover:text-white'>
                  Casos de éxito
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className='mx-auto mt-8 max-w-6xl border-t border-green-700 pt-8 text-center text-green-200'>
          <p>
            &copy; {new Date().getFullYear()} {SYSTEM_NAME}. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </main>
  );
}

export default LandingPage;
