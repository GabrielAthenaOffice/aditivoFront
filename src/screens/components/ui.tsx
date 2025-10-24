export const Card = ({ children }: any) =>
  <div className="bg-white rounded-2xl shadow-sm border p-4">{children}</div>

export const Button = ({ children, className='', ...props }: any) =>
  <button {...props} className={`px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 ${className}`} >
    {children}
  </button>

export const Input = (props: any) =>
  <input {...props} className={`border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${props.className||''}`} />
