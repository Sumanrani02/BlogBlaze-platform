import React from 'react';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed with this action? This cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 font-inter">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-auto p-6 border border-pink-base">
        <h3 className="text-xl font-bold text-blue-darker mb-4 text-center">{title}</h3>
        <p className="text-blue-darker text-md mb-6 text-center">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-offwhite text-blue-darker rounded-md hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50"
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-pink-base text-blue-base rounded-md font-semibold hover:bg-pink-dark transition-colors duration-200 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
