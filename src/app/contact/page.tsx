// components/ContactForm.tsx
'use client';
import { useState } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
  };

  return (
    <div className="max-w-2xl mx-auto my-6 p-6 border border-black rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Contact Us</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Input */}
        <div className="relative">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border-b border-black rounded-none px-4 pt-4 pb-2 bg-transparent outline-none focus:border-b-2 transition-all duration-300"
          />
          <label
            className={`absolute left-4 top-2 text-gray-500 pointer-events-none transition-all duration-300 ${
              formData.name ? '-translate-y-3 scale-75' : 'translate-y-0'
            }`}
          >
            Name
          </label>
        </div>

        {/* Email Input */}
        <div className="relative">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border-b border-black rounded-none px-4 pt-4 pb-2 bg-transparent outline-none focus:border-b-2 transition-all duration-300"
          />
          <label
            className={`absolute left-4 top-2 text-gray-500 pointer-events-none transition-all duration-300 ${
              formData.email ? '-translate-y-3 scale-75' : 'translate-y-0'
            }`}
          >
            Email
          </label>
        </div>

        {/* Message Textarea */}
        <div className="relative">
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full border-b border-black rounded-none px-4 pt-4 pb-2 h-32 bg-transparent outline-none focus:border-b-2 transition-all duration-300"
          />
          <label
            className={`absolute left-4 top-2 text-gray-500 pointer-events-none transition-all duration-300 ${
              formData.message ? '-translate-y-3 scale-75' : 'translate-y-0'
            }`}
          >
            Message
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full border border-black text-black font-semibold py-2 rounded transition duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
