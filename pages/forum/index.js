import React, { useState } from 'react';
import SEO from '../../components/SEO';
import Link from 'next/link';
import { ChevronLeft, MessageSquare, User, Lock, X } from 'lucide-react';
import { forumPosts as initialPosts } from '../../data/forumPosts';

export default function Forum() {
  const [posts, setPosts] = useState(initialPosts.map(post => ({
    ...post,
    comments: post.comments.length
  })));

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  
  // Login form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // New post form state
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginUsername && loginPassword) {
      setIsLoggedIn(true);
      setUsername(loginUsername);
      setShowLoginModal(false);
      setLoginUsername('');
      setLoginPassword('');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
  };

  const handleStartNewDiscussion = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      setShowNewPostModal(true);
    }
  };

  const handleSubmitNewPost = (e) => {
    e.preventDefault();
    if (newPostTitle && newPostContent) {
      const newPost = {
        id: posts.length + 1,
        title: newPostTitle,
        author: username,
        date: new Date().toISOString().split('T')[0],
        content: newPostContent,
        comments: 0
      };
      setPosts([newPost, ...posts]);
      setNewPostTitle('');
      setNewPostContent('');
      setShowNewPostModal(false);
    }
  };

  return (
    <>
      <SEO 
        title="No Commute Community Forum" 
        description="Connect with remote professionals, share experiences, and get career advice."
      />
      <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <Link 
              href="/" 
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors font-semibold"
            >
              <ChevronLeft className="mr-2" /> Back to Home
            </Link>
            
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-700 font-medium">Welcome, {username}!</span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                <User className="w-4 h-4" />
                Login
              </button>
            )}
          </div>

          <div className="text-center mb-12">
            <h1 className="text-5xl font-black text-gray-900 mb-4">Community Forum</h1>
            <p className="text-xl text-gray-600">Connect, share, and grow with remote professionals worldwide</p>
          </div>
          
          <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
            <div className="bg-gray-900 border-b border-gray-700 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-6 h-6" />
                Recent Discussions
              </h2>
            </div>
            
            {posts.map((post, index) => (
              <div key={post.id} className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${index === posts.length - 1 ? 'border-b-0' : ''}`}>
                <Link href={`/forum/${post.id}`} className="block p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">{post.title}</h3>
                    <span className="text-sm text-gray-500 whitespace-nowrap ml-4">{post.date}</span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{post.content}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 font-medium">By {post.author}</span>
                    <span className="text-sm text-blue-600 font-semibold">{post.comments} comments</span>
                  </div>
                </Link>
              </div>
            ))}
            
            <div className="p-6 bg-gray-50 border-t border-gray-200 text-center">
              <button 
                onClick={handleStartNewDiscussion}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all font-bold text-lg shadow-md hover:shadow-lg"
              >
                Start a New Discussion
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Login to Forum</h2>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all font-bold text-lg shadow-md"
              >
                Login
              </button>
            </form>
            
            <p className="text-sm text-gray-500 text-center mt-4">
              Note: This is a demo login. Any username/password will work.
            </p>
          </div>
        </div>
      )}

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowNewPostModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Start a New Discussion</h2>
            
            <form onSubmit={handleSubmitNewPost} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Discussion Title
                </label>
                <input
                  type="text"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="What's your discussion about?"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  rows="6"
                  placeholder="Share your thoughts, questions, or experiences..."
                  required
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all font-bold shadow-md"
                >
                  Post Discussion
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewPostModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
