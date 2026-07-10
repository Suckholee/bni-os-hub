import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Loader2, ShieldCheck } from 'lucide-react';

export default function OnboardingScreen() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { updateUserPassword } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return setError('비밀번호가 일치하지 않습니다.');
    }
    if (newPassword.length < 6) {
      return setError('비밀번호는 최소 6자리 이상이어야 합니다.');
    }

    try {
      setError('');
      setLoading(true);
      await updateUserPassword(newPassword);
    } catch (err) {
      setError('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
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
          background: 'linear-gradient(135deg, #00b894, #00cec9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px'
        }}>
          <ShieldCheck size={40} color="#fff" />
        </div>
        <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>보안 설정 (온보딩)</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '32px', textAlign: 'center', fontSize: '14px' }}>
          초기 비밀번호(000000)를 사용 중입니다.<br/>안전을 위해 새 비밀번호로 변경해주세요.
        </p>
        
        {error && <div style={{ width: '100%', padding: '12px', background: 'rgba(255,71,87,0.2)', color: '#ff4757', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', padding: '0 16px' }}>
            <Lock size={18} color="rgba(255,255,255,0.5)" />
            <input 
              type="password" 
              placeholder="새 비밀번호 (6자리 이상)" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '16px 12px', background: 'transparent', border: 'none', color: '#fff', outline: 'none' }} 
            />
          </div>
          <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', padding: '0 16px' }}>
            <Lock size={18} color="rgba(255,255,255,0.5)" />
            <input 
              type="password" 
              placeholder="새 비밀번호 확인" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              background: '#00b894', 
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
            {loading ? <Loader2 className="animate-spin" size={20} /> : '변경 및 시작하기'}
          </button>
        </form>
      </div>
    </div>
  );
}
