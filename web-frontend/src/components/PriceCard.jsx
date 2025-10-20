import { useNavigate } from 'react-router-dom';

export default function PriceCard({ plan, price, description, features, isPopular }) {
  const navigate = useNavigate();
  return (
    <div
      className={`relative flex max-w-sm flex-1 flex-col rounded-xl bg-white p-8 shadow-lg ${isPopular ? 'border-4 border-indigo-500 shadow-xl' : ''}`}
    >
      {isPopular && (
        <div className='absolute -top-4 left-1/2 -translate-x-1/2 transform'>
          <span className='rounded-full bg-indigo-500 px-4 py-1 text-sm font-bold text-white'>
            MÁS POPULAR
          </span>
        </div>
      )}

      <div className='flex-1'>
        <h3 className='mb-2 text-xl font-semibold text-indigo-600'>{plan}</h3>
        <p className='mb-4 text-3xl font-bold text-indigo-700'>
          Bs{price}
          <span className='text-base font-normal text-gray-500'>/mes</span>
        </p>
        <p className='mb-6 text-gray-600'>{description}</p>
        <ul className='mb-6 space-y-2 text-gray-700'>
          {features.map((feature, index) => (
            <li key={index} className='flex items-center'>
              <svg
                className='mr-2 h-5 w-5 text-green-500'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M5 13l4 4L19 7'
                ></path>
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => navigate('/register-boutique')}
        className={`mt-4 w-full rounded-lg px-4 py-3 font-semibold transition ${
          isPopular
            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
            : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
        }`}
      >
        Empezar ahora
      </button>
    </div>
  );
}
