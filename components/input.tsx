import { ForwardedRef, InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  errors?: string[];
}

const _Input = (
  { name, errors = [], ...rest }: InputProps,
  ref: ForwardedRef<HTMLInputElement>
) => {
  return (
    <div className="flex flex-col gap-2">
      <input
        name={name}
        ref={ref}
        className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-400 px-3"
        {...rest}
        onWheel={(e) => e.currentTarget.blur()}
      />
      {errors.map((error, index) => (
        <span key={index} className="text-red-500 font-medium">
          {error}
        </span>
      ))}
    </div>
  );
};

export default forwardRef(_Input);
