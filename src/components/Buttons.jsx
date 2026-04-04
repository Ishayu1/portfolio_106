/* eslint-disable react/prop-types -- small shared button */
const Buttons = ({ children, onClick, type="button", className="px-6 py-2 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-500 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-300 shadow-lg"}) => {
    return (
      <button type={type} onClick={onClick}
      className={className}
      >
        {children}
      </button>
    );
  };
  
  export default Buttons;