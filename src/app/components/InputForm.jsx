const Input = ({ label, type, id, ...props }) => {
  return (
    <div className="mb-4 ">
      <label htmlFor={id} className="block text-gray-600 font-semibold mb-2">{label}</label>
      <input 
        type={type}
        id={id}
        name={id}
        autoComplete="off"
        className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-400"
        {...props}
      />
    </div>
  )
}

export default Input