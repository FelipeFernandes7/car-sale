import { RegisterOptions, UseFormRegister } from "react-hook-form";

interface InputProps {
  type: string;
  placeholder: string;
  name: string;
  register: UseFormRegister<any>;
  errors?: string;
  rules?: RegisterOptions;
}
export function Input({
  name,
  placeholder,
  type,
  register,
  errors,
  rules,
}: InputProps) {
  return (
    <div>
      <input
        className="w-full border-2 rounded-md px-2 h-11 outline-none"
        style={{ border: errors ? "2px solid red" : "" }}
        type={type}
        placeholder={placeholder}
        {...register(name, rules)}
        id={name}
      />
      {errors && <p className="my-1 text-red-500">{errors}</p>}
    </div>
  );
}
