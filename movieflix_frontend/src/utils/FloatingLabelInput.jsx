import React from "react";

const FloatingLabelInput = ({ label, type, value, onChange, className }) => {
  // Function to handle label click
  const handleLabelClick = () => {
    // Focus the input field when the label is clicked
    inputRef.current.focus();
  };

  // Reference to the input field
  const inputRef = React.useRef(null);

  return (
    <div className="relative my-4">
      <input
        ref={inputRef} // Assign the input reference
        type={type}
        value={value}
        onChange={onChange}
        className={className}
        placeholder=" "
        autoComplete="current-password"
      />
      {/* Apply onClick handler to the label */}
      <label
        onClick={handleLabelClick}
        className={`absolute left-4 top-2 z-0 h-[24px] w-[282px] origin-[0] -translate-y-4 scale-75 transform overflow-hidden bg-gray-800 bg-transparent px-2 text-[16px] font-normal leading-6 text-gray-400 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75`}
      >
        {label}
      </label>
    </div>
  );
};

export default FloatingLabelInput;
