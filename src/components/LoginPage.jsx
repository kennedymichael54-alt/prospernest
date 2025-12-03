import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function LoginPage({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage('Account created! You can now sign in.');
        setIsSignUp(false);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (onLogin) onLogin(data.user);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Logo/Title */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>🏠</div>
          <h1 style={{
            color: '#fff',
            fontSize: '28px',
            fontWeight: '700',
            margin: '0 0 5px 0'
          }}>
            ProsperNest
          </h1>
          <p style={{
            color: 'rgba(255, 255, 255, 0.6)',
            margin: 0,
            fontSize: '14px'
          }}>
            Family Finance Dashboard
          </p>
        </div>

        {/* Toggle */}
        <div style={{
          display: 'flex',
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '10px',
          padding: '4px',
          marginBottom: '25px'
        }}>
          <button
            onClick={() => setIsSignUp(false)}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.2s',
              background: !isSignUp ? '#6366f1' : 'transparent',
              color: !isSignUp ? '#fff' : 'rgba(255, 255, 255, 0.6)'
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignUp(true)}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.2s',
              background: isSignUp ? '#6366f1' : 'transparent',
              color: isSignUp ? '#fff' : 'rgba(255, 255, 255, 0.6)'
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Error/Message */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.5)',
            borderRadius: '10px',
            padding: '12px',
            marginBottom: '20px',
            color: '#fca5a5',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}
        {message && (
          <div style={{
            background: 'rgba(34, 197, 94, 0.2)',
            border: '1px solid rgba(34, 197, 94, 0.5)',
            borderRadius: '10px',
            padding: '12px',
            marginBottom: '20px',
            color: '#86efac',
            fontSize: '14px'
          }}>
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '10px',
                background: 'rgba(0, 0, 0, 0.3)',
                color: '#fff',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s'
              }}
              placeholder="you@example.com"
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '10px',
                background: 'rgba(0, 0, 0, 0.3)',
                color: '#fff',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s'
              }}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              border: 'none',
              borderRadius: '10px',
              background: loading ? '#4b5563' : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: '#fff',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
            }}
          >
            {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        {/* Footer */}
        <p style={{
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.4)',
          fontSize: '12px',
          marginTop: '25px',
          marginBottom: 0
        }}>
          Secure family finance management
        </p>
      </div>
    </div>
  );
}
