const Icon = ({ name, className = 'w-5 h-5' }) => {
  return (
    <img
      src={`/icons/${name}.svg`}
      alt={name}
      className={className + ' brightness-0 invert'}
      onError={(e) => {
        // Fallback si el SVG no se carga
        e.target.style.display = 'none';
      }}
    />
  );
};

export default Icon;
