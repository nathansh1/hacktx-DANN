// components/SignInModal.tsx
import React, { useState, useEffect, useRef } from 'react';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

interface SignInModalProps {
  isOpen: boolean;  // Define type for isOpen
  onClose: () => void;  // Define type for onClose function
}

const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onClose(); // Close the modal on successful sign in
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Close the modal when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div ref={modalRef} className="bg-[#c69292] p-8 rounded-md border border-black border-[1.5px] shadow-sm z-60 relative">
        <button 
          className="absolute top-2 right-2 text-black text-sm"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-lg font-semibold text-black mb-2">Sign In</h2>
        {error && <p className="text-red-600">{error}</p>}
        <form onSubmit={handleSignIn}>
          <div className="relative mb-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="border-t-0 border-l-0 border-r-0 border-b border-black rounded-none bg-transparent w-full text-black placeholder-black focus:outline-none"
              required
            />
          </div>
          <div className="relative mb-6">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="border-t-0 border-l-0 border-r-0 border-b border-black rounded-none bg-transparent w-full text-black placeholder-black focus:outline-none"
              required
            />
            <label className="absolute left-2 top-2 text-black transition-all duration-200 ease-in-out transform scale-100 origin-left opacity-100">
            </label>
          </div>
          <button 
            type="submit" 
            className="bg-transparent text-black border border-black rounded-md p-3 hover:scale-105 transition-transform duration-200 ease-in-out"
          >
            Sign In
          </button>
        </form>
        <button 
          onClick={onClose} 
          className="mt-2 bg-transparent text-black border border-black rounded-md p-3 hover:scale-105 transition-transform duration-200 ease-in-out"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SignInModal;
