const NikhilAILogo = ({ size = 22, className = '' }) => {
  const pixelSize = typeof size === 'number' ? `${size}px` : size;

  return (
    <img
      src="/images/nikhil-ai-logo.png"
      alt="Nikhil AI Logo"
      width={size}
      height={size}
      className={`shrink-0 object-contain transition-transform duration-300 ${className}`}
      style={{
        width: pixelSize,
        height: pixelSize,
      }}
    />
  );
};

export default NikhilAILogo;
