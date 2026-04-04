/* eslint-disable react/prop-types */
const Alerts = ({ children, onClose }) => {
  return (
    <div className="fixed inset-x-4 top-20 z-50 mx-auto flex max-w-lg items-center justify-between rounded-2xl border-b-2 border-yellow-500 bg-yellow-100 px-4 py-3 text-yellow-800 shadow-md sm:inset-x-auto sm:left-1/2 sm:top-24 sm:w-full sm:max-w-xl sm:-translate-x-1/2 sm:px-6 sm:py-4">
      <div className="min-w-0 flex-1 text-sm sm:text-lg">
        <strong>{children}</strong>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="text-yellow-800 hover:text-yellow-900 ml-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default Alerts;
