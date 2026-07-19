import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { productsApi } from '../../api/products';

interface ReviewFormProps {
  slug: string;
  onSuccess: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ slug, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      setError('Please select a valid rating');
      return;
    }
    if (!comment.trim()) {
      setError('Please write a review comment');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await productsApi.addReview(slug, { rating, comment });
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-error/10 text-error rounded-xl font-body-sm text-sm">
          {error}
        </div>
      )}
      
      <div>
        <label className="block font-label-md mb-2">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(star)}
              className="p-1"
            >
              <Star 
                className={`w-6 h-6 ${
                  star <= (hoveredRating || rating) 
                    ? 'fill-[#154212] text-[#154212]' 
                    : 'text-outline-variant/30'
                } transition-colors`} 
              />
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block font-label-md mb-2">Review</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Share your experience with this product..."
          className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 bg-surface focus:ring-2 focus:ring-[#154212] outline-none transition-all font-body-md"
        />
      </div>
      
      <button 
        type="submit" 
        disabled={submitting}
        className="px-8 py-3 bg-[#154212] text-white rounded-xl font-label-md hover:bg-[#2d5a27] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};
