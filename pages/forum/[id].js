import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import SEO from '../../components/SEO';
import { ChevronLeft } from 'lucide-react';
import { forumPosts } from '../../data/forumPosts';

export default function ForumPost() {
  const router = useRouter();
  const { id } = router.query;

  const post = forumPosts.find(p => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-8">This discussion may have been removed or doesn't exist.</p>
          <Link href="/forum" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold inline-block">
            Back to Forum
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={`${post.title} - No Commute Forum`} 
        description={`Discussion about ${post.title}`}
      />
      <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link 
              href="/forum" 
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="mr-2" /> Back to Forum
            </Link>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
                <span className="text-sm text-gray-500">{post.date}</span>
              </div>
              <p className="text-gray-600 mt-4">{post.content}</p>
              <div className="mt-4 text-sm text-gray-500">Posted by {post.author}</div>
            </div>

            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Comments ({post.comments.length})</h2>
              {post.comments.map(comment => (
                <div key={comment.id} className="border-b border-gray-200 py-4 last:border-b-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-700">{comment.author}</span>
                    <span className="text-sm text-gray-500">{comment.date}</span>
                  </div>
                  <p className="text-gray-600">{comment.content}</p>
                </div>
              ))}
            </div>

            <div className="p-6 bg-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Add a Comment</h3>
              <textarea 
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                placeholder="Write your comment here..."
                rows="4"
              ></textarea>
              <button 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                disabled
              >
                Post Comment
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
