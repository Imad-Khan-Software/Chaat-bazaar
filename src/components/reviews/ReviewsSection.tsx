'use client';

import React, { useEffect, useState } from 'react';
import { Star, CheckCircle, Plus, MessageSquare, AlertCircle } from 'lucide-react';
import { supabase } from '@/src/lib/supabase';

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch only real reviews submitted to Supabase
  const fetchReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('Review')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setReviews(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.comment.trim()) return;

    setSubmitting(true);
    setErrorMessage('');

    const { error } = await supabase.from('Review').insert([
      {
        name: newReview.name.trim(),
        rating: Number(newReview.rating),
        comment: newReview.comment.trim(),
      },
    ]);

    setSubmitting(false);
    if (error) {
      setErrorMessage(error.message || 'Failed to submit review. Please try again.');
    } else {
      setShowModal(false);
      setNewReview({ name: '', rating: 5, comment: '' });
      fetchReviews();
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const diff = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
    if (diff < 3600) return 'Just now';
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return `${Math.floor(diff / 604800)}w ago`;
  };

  return (
    <section id="reviews" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
        <div>
          <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest">
            Loved Across Town
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white mt-1">
            Customer Reviews
          </h2>
        </div>

        <button
          onClick={() => {
            setErrorMessage('');
            setShowModal(true);
          }}
          className="self-start sm:self-auto bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition active:scale-95 shadow-lg"
        >
          <Plus className="w-4 h-4" /> Write a Review
        </button>
      </div>

      {/* Reviews Display */}
      {loading ? (
        <div className="text-center py-12 text-neutral-500 text-xs">Loading customer reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 bg-neutral-900/40 rounded-3xl border border-neutral-800 p-8">
          <MessageSquare className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white mb-1">No reviews yet</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-5">
            Be the first customer to share your thoughts on our street food!
          </p>
          <button
            onClick={() => {
              setErrorMessage('');
              setShowModal(true);
            }}
            className="bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold px-4 py-2 rounded-xl text-xs transition"
          >
            Leave the First Review
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between hover:border-amber-500/30 transition shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-neutral-500 font-mono">
                    {formatTimeAgo(rev.created_at)}
                  </span>
                </div>

                <p className="text-neutral-300 text-xs sm:text-sm italic leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="flex items-center justify-between pt-6 mt-6 border-t border-neutral-800/80">
                <span className="font-bold text-white text-xs sm:text-sm">{rev.name}</span>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5" /> Verified Customer
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-bold font-serif text-white">Share Your Review</h3>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Your Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Tariq Khan"
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Rating</label>
                <select
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                  <option value={3}>⭐⭐⭐ (3 Stars)</option>
                  <option value={2}>⭐⭐ (2 Stars)</option>
                  <option value={1}>⭐ (1 Star)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Your Feedback</label>
                <textarea
                  required
                  rows={3}
                  placeholder="How was the flavor, delivery, and overall experience?"
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-1/2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold py-2.5 rounded-xl text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-1/2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-neutral-950 font-bold py-2.5 rounded-xl text-xs transition"
                >
                  {submitting ? 'Posting...' : 'Post Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}