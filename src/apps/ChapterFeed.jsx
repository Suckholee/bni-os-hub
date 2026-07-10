import React from 'react';
import { MessageSquare, Heart, Share2, MoreHorizontal } from 'lucide-react';

export default function ChapterFeed() {
  const posts = [
    { author: '홍길동 대표 (세무)', time: '2시간 전', content: '오늘 OOO 대표님께서 소개해 주신 거래처 덕분에 큰 계약을 성사시켰습니다! 정말 감사드립니다. 다음 주 조찬 모임에서 커피 쏘겠습니다! ☕️🎉', tags: '#감사인사 #리퍼럴성공', likes: 15, comments: 4 },
    { author: '이영희 대표 (인테리어)', time: '5시간 전', content: '혹시 강남구 쪽에 믿을만한 철거 업체 아시는 대표님 계실까요? 급하게 다음 주 화요일부터 공사 들어갈 현장이 하나 생겼습니다. (Asks)', tags: '#Asks #도움요청', likes: 3, comments: 8 },
    { author: '챕터 디렉터 (운영진)', time: '어제', content: '공지사항 📢 다음 주 목요일 조찬 모임은 방문객스 데이로 진행됩니다. 각 파워팀별로 최소 1명 이상의 방문객을 모셔올 수 있도록 미리 준비 부탁드립니다.', tags: '#공식공지 #방문객스데이', likes: 45, comments: 12 }
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '24px', color: '#ffa502' }}>챕터 피드 💬</h2>
      
      <div className="responsive-flex-row" style={{ flex: 1, overflow: 'hidden' }}>
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', paddingRight: '8px' }}>
          {/* Post Input Box */}
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '20px' }}>
            <textarea 
              placeholder="챕터 멤버들에게 알리고 싶은 소식이나 감사 인사, 도움 요청(Asks)을 남겨보세요..." 
              style={{ width: '100%', height: '80px', background: 'transparent', border: 'none', color: '#fff', outline: 'none', resize: 'none', fontSize: '14px' }} 
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button style={{ background: 'rgba(255,255,255,0.1)', border: 'none', padding: '6px 12px', borderRadius: '16px', color: '#fff', fontSize: '12px', cursor: 'pointer' }}>#감사인사</button>
                <button style={{ background: 'rgba(255,255,255,0.1)', border: 'none', padding: '6px 12px', borderRadius: '16px', color: '#fff', fontSize: '12px', cursor: 'pointer' }}>#Asks</button>
              </div>
              <button style={{ padding: '8px 24px', background: '#ffa502', color: '#000', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>
                게시하기
              </button>
            </div>
          </div>

          {/* Feed Posts */}
          {posts.map((post, idx) => (
            <div key={idx} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ffa502', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#000' }}>
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{post.author}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{post.time}</div>
                  </div>
                </div>
                <MoreHorizontal size={20} color="rgba(255,255,255,0.5)" style={{ cursor: 'pointer' }} />
              </div>
              <p style={{ fontSize: '15px', lineHeight: 1.6, marginBottom: '12px' }}>{post.content}</p>
              <div style={{ fontSize: '12px', color: '#ffa502', marginBottom: '16px' }}>{post.tags}</div>
              <div style={{ display: 'flex', gap: '24px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'rgba(255,255,255,0.7)' }}>
                  <Heart size={16} /> <span style={{ fontSize: '14px' }}>{post.likes}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'rgba(255,255,255,0.7)' }}>
                  <MessageSquare size={16} /> <span style={{ fontSize: '14px' }}>{post.comments}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'rgba(255,255,255,0.7)' }}>
                  <Share2 size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>인기 태그</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['#감사인사', '#리퍼럴성공', '#Asks', '#파워팀', '#방문객환영', '#원투원후기'].map((tag, i) => (
                <span key={i} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', fontSize: '12px', cursor: 'pointer' }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
