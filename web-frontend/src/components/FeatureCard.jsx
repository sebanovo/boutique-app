export default function FeatureCard({ icon, title, description }) {
  return (
    <div className='rounded-xl bg-indigo-50 p-6'>
      <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100'>
        {icon}
      </div>
      <h3 className='mb-2 text-xl font-semibold text-indigo-700'>{title}</h3>
      <p className='text-gray-600'>{description}</p>
    </div>
  );
}
