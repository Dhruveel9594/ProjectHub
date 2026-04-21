// src/components/InputField.jsx
// Reusable labeled input used in Login, Register, CreateProject forms

export default function InputField({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder = "",
  error = "",
  required = false,
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-gray-300 font-medium">
        {label} {required && <span className="text-orange-400">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`bg-[#16161f] border ${
          error ? "border-red-500" : "border-white/10"
        } text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 transition-all placeholder:text-gray-600`}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}