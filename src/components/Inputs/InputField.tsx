type Props = {
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    required?: boolean;
    name?: string;
  };
  
  const InputField = ({ type = 'text', value, onChange, placeholder, required = false, name }: Props) => (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      name={name}
      className="w-full border p-2"
    />
  );
  
  export default InputField;
  