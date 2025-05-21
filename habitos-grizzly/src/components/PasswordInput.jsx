import { useState } from "react";

export const PasswordInput = ({ value, onChange, placeholder, name, id }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        name={name}
        id={id}
        placeholder={placeholder}
        className="border-b border-gray-300 focus:outline-none focus:border-purple-500 py-1 pr-10 w-full"
      />
      {value.length > 0 && (
        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 pr-2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? "Ocultar" : "Ver"}
        </button>
      )}
    </div>
  );
}
