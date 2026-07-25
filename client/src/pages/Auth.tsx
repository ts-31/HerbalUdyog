import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { motion, AnimatePresence } from 'motion/react';

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
  const { login, register, isAuthenticated, isCustomer } = useAuth();

  // Customer-only page: redirect authenticated customers to dashboard
  useEffect(() => {
    if (isAuthenticated && isCustomer) {
      const from = (location.state as any)?.from?.pathname;
      navigate(from || '/dashboard', { replace: true });
    }
  }, [isAuthenticated, isCustomer, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        await login({ email, password });
        toast.success('Welcome back!');
      } else {
        await register({ 
          email, 
          password,
          first_name: firstName,
          last_name: lastName
        });
        toast.success('Account created successfully!');
      }
    } catch (err: any) {
      const errMsg = err.message || 'Authentication failed. Please check your credentials.';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-surface flex items-center justify-center py-12 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] bg-white border border-outline-variant/30 rounded-[2rem] shadow-sm p-8 sm:p-10"
      >
        <div className="text-center mb-8">
          <h1 className="font-display-lg text-3xl sm:text-4xl mb-3 tracking-tight text-on-surface">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="font-body-md text-on-surface-variant">
            {isLogin ? 'Sign in to access your account' : 'Join HerbalUdyog today'}
          </p>
        </div>

        <div className="flex gap-2 mb-8 bg-surface-container-lowest p-1.5 rounded-2xl border border-outline-variant/20">
          <button
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 py-2.5 font-label-md text-sm rounded-xl transition-all ${
              isLogin ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface hover:bg-surface-container'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 py-2.5 font-label-md text-sm rounded-xl transition-all ${
              !isLogin ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface hover:bg-surface-container'
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            className="mb-6 p-4 bg-error-container text-on-error-container rounded-xl font-body-sm text-sm border border-error/20"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <AnimatePresence mode="popLayout">
            {!isLogin && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-2 gap-4"
              >
                <Input
                  label="First Name"
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required={!isLogin}
                />
                <Input
                  label="Last Name"
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required={!isLogin}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <Input
            label="Email Address"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />

          <Button
            type="submit"
            isLoading={loading}
            className="w-full h-12 text-base mt-4"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};
