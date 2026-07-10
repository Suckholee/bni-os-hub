import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Lock, Loader2 } from 'lucide-react';

export default function LoginScreen() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(name, password);
    } catch (err) {
      setError('로그인에 실패했습니다. 이름과 비밀번호를 확인해주세요.');
    }
    setLoading(false);
  }

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '24px',
        padding: '48px',
        width: '90%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #a29bfe, #6c5ce7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px'
        }}>
          <User size={40} color="#fff" />
        </div>
        <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>BNI 커뮤니티 OS</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '32px' }}>멤버 계정으로 로그인해주세요</p>
        
        {error && <div style={{ width: '100%', padding: '12px', background: 'rgba(255,71,87,0.2)', color: '#ff4757', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', padding: '0 16px' }}>
            <User size={18} color="rgba(255,255,255,0.5)" />
            <input 
              type="text" 
              placeholder="이름 (예: 홍길동)" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: '100%', padding: '16px 12px', background: 'transparent', border: 'none', color: '#fff', outline: 'none' }} 
            />
          </div>
          <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', padding: '0 16px' }}>
            <Lock size={18} color="rgba(255,255,255,0.5)" />
            <input 
              type="password" 
              placeholder="비밀번호" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '16px 12px', background: 'transparent', border: 'none', color: '#fff', outline: 'none' }} 
            />
          </div>
          
          <button 
            disabled={loading}
            type="submit" 
            style={{ 
              marginTop: '16px',
              padding: '16px', 
              background: '#6c5ce7', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '12px', 
              fontSize: '16px', 
              fontWeight: 'bold', 
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px'
            }}>
            {loading ? <Loader2 size={20} /> : '로그인'}
          </button>
        </form>
      </div>
    </div>
  );
}
