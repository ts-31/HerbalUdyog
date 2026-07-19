import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      const from = (location.state as any)?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else {
        if (user.role === 'admin') navigate('/admin');
        else navigate('/dashboard');
      }
    }
  }, [isAuthenticated, user, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        await login({ email, password });
      } else {
        await register({ 
          email, 
          password,
          first_name: firstName,
          last_name: lastName
        });
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 px-6 py-12 bg-surface-container-lowest border border-outline-variant/30 rounded-3xl shadow-lg">
      <div className="text-center mb-8">
        <h1 className="font-display-lg text-3xl mb-2 text-primary">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="font-body-md text-outline-variant">
          {isLogin ? 'Sign in to your account' : 'Join HerbalUdyog today'}
        </p>
      </div>

      <div className="flex gap-4 mb-8 bg-surface-container p-1 rounded-xl">
        <button
          onClick={() => { setIsLogin(true); setError(''); }}
          className={`flex-1 py-2 font-label-md rounded-lg transition-colors ${
            isLogin ? 'bg-primary text-on-primary shadow' : 'text-on-surface hover:bg-surface-container-highest'
          }`}
        >
          Login
        </button>
        <button
          onClick={() => { setIsLogin(false); setError(''); }}
          className={`flex-1 py-2 font-label-md rounded-lg transition-colors ${
            !isLogin ? 'bg-primary text-on-primary shadow' : 'text-on-surface hover:bg-surface-container-highest'
          }`}
        >
          Register
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-xl font-body-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {!isLogin && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-label-md text-on-surface mb-2" htmlFor="firstName">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required={!isLogin}
              />
            </div>
            <div>
              <label className="block font-label-md text-on-surface mb-2" htmlFor="lastName">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required={!isLogin}
              />
            </div>
          </div>
        )}

        <div>
          <label className="block font-label-md text-on-surface mb-2" htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            required
          />
        </div>

        <div>
          <label className="block font-label-md text-on-surface mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            required
            minLength={8}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 flex justify-center bg-primary text-on-primary rounded-xl font-label-md text-lg hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-md disabled:opacity-50"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
          ) : (
            isLogin ? 'Sign In' : 'Create Account'
          )}
        </button>
      </form>
    </div>
  );
};
