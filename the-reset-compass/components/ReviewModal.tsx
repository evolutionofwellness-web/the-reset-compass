import React, { useState } from 'react';

interface ReviewModalProps {
  onClose: () => void;
  onSubmit: (rating: number, tags: string[], text: string) => void;
}

const TAGS = ["Beautiful Design", "Calming", "Helpful Activities", "Easy to Use", "The Oracle", "Weekly Plans", "Gamification"];

const ReviewModal: React.FC<ReviewModalProps> = ({ onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
        setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
        setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = () => {
      // 1. Save locally via prop to update XP and stats
      onSubmit(rating, selectedTags, feedback);
      
      // 2. Open Email Client to send to Admin
      const subject = encodeURIComponent(`Reset Compass Review: ${rating} Stars`);
      const body = encodeURIComponent(
          `EXPERIENCE RATING: ${rating}/5 Stars\n` +
          `HIGHLIGHTS: ${selectedTags.length > 0 ? selectedTags.join(', ') : 'None selected'}\n\n` +
          `MESSAGE:\n${feedback || 'No additional text provided.'}\n\n` +
          `--- APP METADATA ---\n` +
          `Date: ${new Date().toLocaleString()}\n` +
          `User Agent: ${navigator.userAgent}`
      );
      
      // We use a small timeout to allow the UI to update first
      setTimeout(() => {
          window.location.href = `mailto:marcus@evolutionofwellness.com?subject=${subject}&body=${body}`;
      }, 300);

      setSubmitted(true);
      setTimeout(() => {
          onClose();
      }, 3000);
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
      <div className="w-full max-w-md bg-brand-teal border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-modal-enter">
        {submitted ? (
             <div className="p-10 flex flex-col items-center justify-center text-center h-80">
                 <div className="text-6xl mb-4 animate-bounce-fast">💖</div>
                 <h2 className="text-2xl font-bold text-brand-cream mb-2">Thank You!</h2>
                 <p className="text-brand-sage mb-6">Your feedback helps us grow.</p>
                 <div className="px-4 py-2 bg-brand-green/20 text-brand-green rounded-full font-bold text-sm border border-brand-green/50">
                     +50 XP Earned
                 </div>
             </div>
        ) : (
            <>
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-brand-dark/50">
                <h2 className="text-xl font-light text-brand-cream">Rate Your Journey</h2>
                </div>

                <div className="p-6">
                    <p className="text-center text-brand-sage text-sm mb-6">
                        How is The Reset Compass helping you?
                    </p>

                    {/* Stars */}
                    <div className="flex justify-center gap-2 mb-8">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                className="transition-transform hover:scale-110 focus:outline-none"
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                                aria-label={`Rate ${star} stars`}
                            >
                                <svg 
                                    className={`w-10 h-10 transition-colors duration-300 ${star <= (hoverRating || rating) ? 'text-amber-400 fill-amber-400' : 'text-white/20 fill-none'}`}
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={1.5}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                </svg>
                            </button>
                        ))}
                    </div>

                    {rating > 0 && (
                        <div className="animate-fade-in">
                            <p className="text-xs font-bold text-brand-sage uppercase tracking-widest mb-3">What do you enjoy?</p>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {TAGS.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => toggleTag(tag)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${selectedTags.includes(tag) ? 'bg-brand-green border-brand-green text-brand-teal' : 'bg-white/5 border-white/10 text-brand-sage hover:border-white/20'}`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>

                            <textarea 
                                className="w-full bg-brand-dark/50 border border-white/10 rounded-xl p-3 text-brand-cream placeholder-brand-sage/50 text-sm focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all mb-6"
                                rows={3}
                                placeholder="Any specific feedback or ideas?"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                            />

                            <button 
                                onClick={handleSubmit}
                                className="w-full py-3 bg-brand-green text-brand-teal font-bold rounded-full hover:bg-brand-green/90 transition-colors shadow-lg"
                            >
                                Submit Review
                            </button>
                        </div>
                    )}
                </div>
            </>
        )}
      </div>
    </div>
  );
};

export default ReviewModal;