
import React, { useState } from 'react';

interface ContactModalProps {
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ onClose }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const bodyContent = `Name: ${name || 'Not provided'}\nEmail: ${email || 'Not provided'}\n\nMessage:\n${message}`;
    
    const mailtoLink = `mailto:marcus@evolutionofwellness.com?subject=${encodeURIComponent("Compass Feedback: " + subject)}&body=${encodeURIComponent(bodyContent)}`;
    
    window.location.href = mailtoLink;
    setTimeout(() => {
        onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/90 backdrop-blur-md animate-fade-in">
      {/* Safe area adjusted close button */}
      <button 
        onClick={onClose} 
        style={{ 
          top: 'calc(max(60px, env(safe-area-inset-top) + 16px))',
          minWidth: '44px',
          minHeight: '44px'
        }}
        className="absolute right-6 z-[60] rounded-full bg-brand-dark/50 backdrop-blur-md border border-white/10 text-brand-sage hover:text-white flex items-center justify-center shadow-lg transition-all text-xl" 
        aria-label="Close"
      >
        ✕
      </button>
      <div className="w-full max-w-lg bg-brand-teal border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-modal-enter">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-brand-teal">
          <h2 className="text-xl font-light text-brand-cream">Contact Us</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-brand-sage mb-4">
            We value your feedback. Let us know how we can improve your journey or if you have any questions.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-sage uppercase tracking-widest mb-2">Name <span className="text-[10px] font-normal lowercase">(optional)</span></label>
                <input 
                  type="text" 
                  className="w-full bg-brand-dark border border-white/10 rounded-lg p-3 text-brand-cream focus:border-brand-green focus:outline-none transition-colors"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-brand-sage uppercase tracking-widest mb-2">Email <span className="text-[10px] font-normal lowercase">(optional)</span></label>
                <input 
                  type="email" 
                  className="w-full bg-brand-dark border border-white/10 rounded-lg p-3 text-brand-cream focus:border-brand-green focus:outline-none transition-colors"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-sage uppercase tracking-widest mb-2">Subject</label>
            <input 
              type="text" 
              required
              className="w-full bg-brand-dark border border-white/10 rounded-lg p-3 text-brand-cream focus:border-brand-green focus:outline-none transition-colors"
              placeholder="Feedback, Feature Request, Question..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-sage uppercase tracking-widest mb-2">Message</label>
            <textarea 
              required
              rows={5}
              className="w-full bg-brand-dark border border-white/10 rounded-lg p-3 text-brand-cream focus:border-brand-green focus:outline-none transition-colors"
              placeholder="Tell us what's on your mind..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
             <button type="button" onClick={onClose} className="px-4 py-2 text-brand-sage hover:text-white transition-colors">Cancel</button>
             <button 
                type="submit" 
                className="px-6 py-2 bg-brand-green hover:bg-brand-green/90 text-brand-teal rounded-full font-bold transition-all shadow-lg"
             >
                Submit
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;
