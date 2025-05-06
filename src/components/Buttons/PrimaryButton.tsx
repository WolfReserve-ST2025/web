type Props = {
    children: React.ReactNode;
    type?: 'button' | 'submit';
    onClick?: () => void;
    color?: 'blue' | 'green' | 'gray' | 'stone';
    width?: 'full' | 'auto' | 'fit';
    className?: string;
  };
  
  const PrimaryButton = ({
    children,
    type = 'button',
    onClick,
    color = 'blue',
    width = 'auto',
    className = '',
  }: Props) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-600 hover:bg-blue-700',
      green: 'bg-green-600 hover:bg-green-700',
      stone: 'bg-stone-700 hover:bg-stone-600',
      gray: 'bg-gray-600 hover:bg-gray-700',
    };
  
    const widths: Record<string, string> = {
      full: 'w-full',
      auto: 'w-auto',
      fit: 'w-fit',
    };
  
    return (
      <button
        type={type}
        onClick={onClick}
        className={`px-6 py-2 text-white rounded transition ${colors[color]} ${widths[width]} ${className}`}
      >
        {children}
      </button>
    );
  };
  
  export default PrimaryButton;
  