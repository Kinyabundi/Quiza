// src/components/RoleSelectModal.tsx
import React from 'react';
import { useRouter } from 'next/navigation';

interface RoleSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RoleSelectModal: React.FC<RoleSelectModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();

  if (!isOpen) return null;

  const navigateWithRole = (role: 'client' | 'freelancer' | '') => {
    onClose(); // Close the modal
    router.push("/app/profile");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg space-y-4 w-80 mx-auto">
        <h2 className="text-xl font-bold">Select Your Role</h2>
        <p>Please select whether you are a client or a freelancer:</p>
        <div className="flex justify-around">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => navigateWithRole('')}
          >
            Client
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-4"
            onClick={() => navigateWithRole('')}
          >
            Freelancer
          </button>
        </div>
        <button
          className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default RoleSelectModal;