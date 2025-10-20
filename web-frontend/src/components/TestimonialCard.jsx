export default function TestimonialCard({ name, role, testimonial }) {
  const shortName = name
    .toUpperCase()
    .split(' ')
    .map((n) => n[0])
    .join('');
  return (
    <div className='rounded-xl bg-indigo-50 p-6'>
      <div className='mb-4 flex items-center'>
        <div className='mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100'>
          <span className='font-bold text-indigo-600'>{shortName}</span>
        </div>
        <div>
          <h4 className='font-semibold'>{name}</h4>
          <p className='text-sm text-gray-500'>{role}</p>
        </div>
      </div>
      <p className='text-gray-600'>"{testimonial}"</p>
    </div>
  );
}
