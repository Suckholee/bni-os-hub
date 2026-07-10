import React, { useState, useEffect } from 'react';
import { Map, CustomOverlayMap, useMap } from 'react-kakao-maps-sdk';
import { Search, Users, Calendar, MapPin, Navigation, X } from 'lucide-react';
import { subscribeToMembers, subscribeToMeetings } from '../services/memberService';

const getCategoryColorAndIcon = (member) => {
  const category = (member.category || '').toLowerCase();
  const tag = (member.tag || '').toLowerCase();
  
  if (tag.includes('음식') || tag.includes('요식') || category.includes('음식') || category.includes('요식') || category.includes('식품')) return { color: '#e15f41', icon: '🍽️' };
  if (tag.includes('건축') || tag.includes('인테리어') || category.includes('인테리어') || category.includes('건축') || category.includes('조명')) return { color: '#f19066', icon: '🏗️' };
  if (tag.includes('유통') || category.includes('유통')) return { color: '#786fa6', icon: '📦' };
  if (tag.includes('건강') || tag.includes('의료') || category.includes('건강') || category.includes('의료') || category.includes('병원') || category.includes('안과')) return { color: '#ea8685', icon: '⚕️' };
  if (tag.includes('교육') || tag.includes('코칭') || category.includes('교육') || category.includes('코칭')) return { color: '#63cdda', icon: '🎓' };
  if (tag.includes('부동산') || category.includes('부동산')) return { color: '#f3a683', icon: '🏠' };
  if (category.includes('꽃') || category.includes('플라워')) return { color: '#ffb8b8', icon: '🌸' };
  if (category.includes('법률') || category.includes('세무') || category.includes('노무') || category.includes('회계') || category.includes('변호사')) return { color: '#3dc1d3', icon: '⚖️' };
  if (category.includes('금융') || category.includes('보험')) return { color: '#f5cd79', icon: '💰' };
  if (category.includes('it') || category.includes('소프트웨어') || category.includes('개발') || category.includes('컴퓨터') || category.includes('마케팅')) return { color: '#546de5', icon: '💻' };
  if (category.includes('스포츠') || category.includes('골프') || category.includes('레져')) return { color: '#1abc9c', icon: '⛳' };
  
  return { color: '#3742fa', icon: '👤' };
};

const FILTER_CATEGORIES = [
  { id: 'all', label: '전체', icon: '🌐' },
  { id: '음식', label: '음식/식품', icon: '🍽️', keywords: ['음식', '요식', '식품'] },
  { id: '건축', label: '건축/인테리어', icon: '🏗️', keywords: ['건축', '인테리어', '조명'] },
  { id: '유통', label: '유통', icon: '📦', keywords: ['유통'] },
  { id: '의료', label: '건강/의료', icon: '⚕️', keywords: ['건강', '의료', '병원', '안과'] },
  { id: '교육', label: '교육/코칭', icon: '🎓', keywords: ['교육', '코칭'] },
  { id: '부동산', label: '부동산', icon: '🏠', keywords: ['부동산'] },
  { id: '법률', label: '법률/세무', icon: '⚖️', keywords: ['법률', '세무', '노무', '회계', '변호사'] },
  { id: '금융', label: '금융/보험', icon: '💰', keywords: ['금융', '보험'] },
  { id: 'IT', label: 'IT/개발', icon: '💻', keywords: ['it', '소프트웨어', '개발', '컴퓨터', '마케팅'] },
  { id: '스포츠', label: '스포츠', icon: '⛳', keywords: ['스포츠', '골프', '레져'] },
  { id: '꽃', label: '플라워', icon: '🌸', keywords: ['꽃', '플라워'] },
];

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // metres
  const p1 = lat1 * Math.PI/180;
  const p2 = lat2 * Math.PI/180;
  const dp = (lat2-lat1) * Math.PI/180;
  const dl = (lon2-lon1) * Math.PI/180;
  const a = Math.sin(dp/2) * Math.sin(dp/2) + Math.cos(p1) * Math.cos(p2) * Math.sin(dl/2) * Math.sin(dl/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function OutOfBoundsOverlay({ members, meetings, showMembers, showMeetings }) {
  const map = useMap();
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    if (!map || !window.kakao) return;

    const updateMarkers = () => {
      const bounds = map.getBounds();
      const center = map.getCenter();
      const projection = map.getProjection();
      
      const mapDiv = map.getNode();
      const size = { x: mapDiv.clientWidth, y: mapDiv.clientHeight };
      const pad = 30; // padding from edge
      
      const newMarkers = [];
      const processItems = (items, type) => {
        items.forEach(item => {
          if (!item.lat || !item.lng) return;
          const itemLatLng = new window.kakao.maps.LatLng(item.lat, item.lng);
          
          if (!bounds.contain(itemLatLng)) {
            const dist = getDistance(center.getLat(), center.getLng(), item.lat, item.lng);
            const distStr = dist > 1000 ? (dist/1000).toFixed(1) + 'km' : Math.round(dist) + 'm';
            
            let pt;
            try {
              pt = projection.containerPointFromCoords(itemLatLng);
            } catch(e) {
              return;
            }
            if(!pt) return;
            
            const c = { x: size.x/2, y: size.y/2 };
            const dx = pt.x - c.x;
            const dy = pt.y - c.y;
            
            let t = Infinity;
            if (dx < 0) t = Math.min(t, (pad - c.x) / dx);
            if (dx > 0) t = Math.min(t, (size.x - pad - c.x) / dx);
            if (dy < 0) t = Math.min(t, (pad - c.y) / dy);
            if (dy > 0) t = Math.min(t, (size.y - pad - c.y) / dy);
            
            const ix = c.x + t * dx;
            const iy = c.y + t * dy;
            
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;

            newMarkers.push({
              id: item.id,
              type,
              distStr,
              distRaw: dist,
              x: ix,
              y: iy,
              angle
            });
          }
        });
      };

      if (showMembers) processItems(members, 'member');
      if (showMeetings) processItems(meetings, 'meeting');

      // Cluster
      const CLUSTER_RADIUS = 60;
      const clusters = [];

      newMarkers.sort((a,b) => a.distRaw - b.distRaw);

      newMarkers.forEach(marker => {
        let addedToCluster = false;
        for (let cluster of clusters) {
          const dist = Math.hypot(cluster.x - marker.x, cluster.y - marker.y);
          if (dist < CLUSTER_RADIUS) {
            cluster.items.push(marker);
            addedToCluster = true;
            break;
          }
        }
        if (!addedToCluster) {
          clusters.push({
            id: `cluster-${marker.id}`,
            x: marker.x,
            y: marker.y,
            angle: marker.angle,
            distStr: marker.distStr,
            type: marker.type,
            items: [marker]
          });
        }
      });

      setMarkers(clusters);
    };

    window.kakao.maps.event.addListener(map, 'center_changed', updateMarkers);
    window.kakao.maps.event.addListener(map, 'zoom_changed', updateMarkers);
    window.addEventListener('resize', updateMarkers);
    
    // initial update
    setTimeout(updateMarkers, 100);

    return () => {
      window.kakao.maps.event.removeListener(map, 'center_changed', updateMarkers);
      window.kakao.maps.event.removeListener(map, 'zoom_changed', updateMarkers);
      window.removeEventListener('resize', updateMarkers);
    };
  }, [map, members, meetings, showMembers, showMeetings]);

  if (markers.length === 0) return null;

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1000, overflow: 'hidden' }}>
      {markers.map(m => {
        const count = m.items.length;
        const isCluster = count > 1;
        return (
          <div key={m.id} style={{
            position: 'absolute',
            left: m.x,
            top: m.y,
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            border: `1px solid ${m.type === 'member' ? '#3742fa' : '#ff4757'}`,
            backdropFilter: 'blur(4px)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            whiteSpace: 'nowrap'
          }}>
            <div style={{ transform: `rotate(${m.angle}deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>➤</div>
            {isCluster ? `+${count}명 (${m.distStr} 외)` : m.distStr}
          </div>
        );
      })}
    </div>
  );
}

export default function BusinessMap() {
  const [members, setMembers] = useState([]);
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    const unsubMembers = subscribeToMembers(data => setMembers(data));
    const unsubMeetings = subscribeToMeetings(data => setMeetings(data));
    return () => {
      unsubMembers();
      unsubMeetings();
    };
  }, []);

  const [showMembers, setShowMembers] = useState(true);
  const [showMeetings, setShowMeetings] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState({ lat: 37.503, lng: 127.040 });
  const [mapZoom, setMapZoom] = useState(6); // 1-14, 6 is roughly city-level
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [activeMarker, setActiveMarker] = useState(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    // 1. Check local members
    const foundMember = members.find(m => 
      m.name?.includes(searchQuery) || m.company?.includes(searchQuery) || m.category?.includes(searchQuery)
    );
    if (foundMember) {
      setShowMembers(true);
      setMapCenter({ lat: foundMember.lat, lng: foundMember.lng });
      setMapZoom(3);
      setSearchedLocation(null);
      return;
    }

    // 2. Check local meetings
    const foundMeeting = meetings.find(m => 
      m.title?.includes(searchQuery) || m.locationName?.includes(searchQuery) || m.memberName?.includes(searchQuery)
    );
    if (foundMeeting) {
      setShowMeetings(true);
      setMapCenter({ lat: foundMeeting.lat, lng: foundMeeting.lng });
      setMapZoom(3);
      setSearchedLocation(null);
      return;
    }

    // 3. Kakao Local Search API
    setIsSearching(true);
    if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
      const ps = new window.kakao.maps.services.Places();
      ps.keywordSearch(searchQuery, (data, status) => {
        setIsSearching(false);
        if (status === window.kakao.maps.services.Status.OK) {
          const result = data[0];
          setSearchedLocation({ lat: parseFloat(result.y), lng: parseFloat(result.x), name: result.place_name });
          setMapCenter({ lat: parseFloat(result.y), lng: parseFloat(result.x) });
          setMapZoom(3);
        } else {
          alert('검색 결과가 없습니다.');
        }
      });
    } else {
      setIsSearching(false);
      alert('카카오맵 서비스를 불러오지 못했습니다.');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const resetMap = () => {
    setMapCenter({ lat: 37.503, lng: 127.040 });
    setMapZoom(6);
    setSearchedLocation(null);
    setSearchQuery('');
    setActiveMarker(null);
  };

  const filteredMembers = members.filter(member => {
    if (activeFilter === 'all') return true;
    const catDef = FILTER_CATEGORIES.find(c => c.id === activeFilter);
    if (!catDef) return true;
    
    const category = (member.category || '').toLowerCase();
    const tag = (member.tag || '').toLowerCase();
    
    return catDef.keywords.some(kw => category.includes(kw) || tag.includes(kw));
  });

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header & Controls */}
      <div style={{ padding: '16px 24px', paddingBottom: '12px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', display: 'none' }}>비즈니스 맵 🗺️</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Filters Row */}
          <div className="hide-scrollbar" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {FILTER_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  padding: '6px 12px', borderRadius: '20px',
                  background: activeFilter === cat.id ? 'rgba(55, 66, 250, 0.8)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${activeFilter === cat.id ? '#3742fa' : 'rgba(255,255,255,0.1)'}`,
                  color: activeFilter === cat.id ? '#fff' : 'rgba(255,255,255,0.7)',
                  fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap',
                  transition: 'all 0.2s', flexShrink: 0
                }}
              >
                <span>{cat.icon}</span> {cat.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input 
                type="text" 
                placeholder="카카오 장소 검색, 혹은 멤버 상호명 검색..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{ width: '100%', padding: '10px 16px 10px 40px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.3)', color: '#fff' }}
              />
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '11px', color: 'rgba(255,255,255,0.5)' }} />
            </div>
            <button 
              onClick={handleSearch}
              disabled={isSearching}
              style={{ padding: '0 20px', borderRadius: '8px', background: '#3742fa', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {isSearching ? '검색중...' : '검색'}
            </button>
            <button 
              onClick={resetMap}
              style={{ padding: '0 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', cursor: 'pointer' }}
              title="초기 위치로"
            >
              <Navigation size={18} />
            </button>
          </div>

          {/* Toggles */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => setShowMembers(!showMembers)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', background: showMembers ? 'rgba(55, 66, 250, 0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${showMembers ? '#3742fa' : 'rgba(255,255,255,0.1)'}`, color: showMembers ? '#fff' : 'rgba(255,255,255,0.5)', fontSize: '13px', cursor: 'pointer' }}
            >
              <Users size={14} /> 멤버 사업장 ({members.length})
            </button>
            <button 
              onClick={() => setShowMeetings(!showMeetings)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', background: showMeetings ? 'rgba(255, 71, 87, 0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${showMeetings ? '#ff4757' : 'rgba(255,255,255,0.1)'}`, color: showMeetings ? '#fff' : 'rgba(255,255,255,0.5)', fontSize: '13px', cursor: 'pointer' }}
            >
              <Calendar size={14} /> 예정된 원투원 ({meetings.length})
            </button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative', zIndex: 1, background: '#e5e3df' }}>
        <Map
          center={mapCenter}
          level={mapZoom}
          style={{ width: '100%', height: '100%' }}
          onClick={() => setActiveMarker(null)} // Close popups on map click
        >
          {/* Member Pins */}
          {showMembers && filteredMembers.map(member => {
            const { color, icon } = getCategoryColorAndIcon(member);
            return (
              <CustomOverlayMap key={`member-${member.id}`} position={{ lat: member.lat || 37.5, lng: member.lng || 127.0 }} yAnchor={1} zIndex={activeMarker === member.id ? 100 : 1}>
                <div style={{ position: 'relative' }}>
                  <div onClick={(e) => { e.stopPropagation(); setActiveMarker(member.id); }} style={{ backgroundColor: color, width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid white', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', cursor: 'pointer', marginBottom: '8px' }}>
                    <div style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>{icon}</div>
                  </div>
                  {activeMarker === member.id && (
                    <div style={{ position: 'absolute', bottom: '60px', left: '50%', transform: 'translateX(-50%)', background: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.25)', width: '220px', zIndex: 1000, pointerEvents: 'auto' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#000', marginBottom: '2px' }}>{member.name} 대표</div>
                        <div style={{ color: '#555', fontSize: '13px', marginBottom: '8px', fontWeight: '500' }}>{member.company} <span style={{ color: color }}>({member.category})</span></div>
                        <div style={{ color: '#888', fontSize: '12px', marginBottom: '12px', wordBreak: 'keep-all', lineHeight: '1.4' }}>{member.address}</div>
                        <button style={{ width: '100%', padding: '8px', background: color, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', transition: 'opacity 0.2s' }} onMouseOver={(e) => e.target.style.opacity=0.8} onMouseOut={(e) => e.target.style.opacity=1}>프로필 보기</button>
                        <button onClick={(e) => { e.stopPropagation(); setActiveMarker(null); }} style={{ position: 'absolute', top: '8px', right: '8px', border: 'none', background: 'rgba(0,0,0,0.05)', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '14px', color: '#666' }}>&times;</button>
                      </div>
                      <div style={{ position: 'absolute', bottom: '-8px', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderTop: '10px solid white' }}></div>
                    </div>
                  )}
                </div>
              </CustomOverlayMap>
            );
          })}

          {/* Meeting Pins */}
          {showMeetings && meetings.map(meeting => (
            <CustomOverlayMap key={`meeting-${meeting.id}`} position={{ lat: meeting.lat || 37.5, lng: meeting.lng || 127.0 }} yAnchor={1} zIndex={activeMarker === `mtg-${meeting.id}` ? 100 : 1}>
              <div style={{ position: 'relative' }}>
                <div onClick={(e) => { e.stopPropagation(); setActiveMarker(`mtg-${meeting.id}`); }} style={{ backgroundColor: '#ff4757', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid white', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', cursor: 'pointer', marginBottom: '8px' }}>
                  <div style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>🤝</div>
                </div>
                {activeMarker === `mtg-${meeting.id}` && (
                  <div style={{ position: 'absolute', bottom: '60px', left: '50%', transform: 'translateX(-50%)', background: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.25)', width: '220px', zIndex: 1000, pointerEvents: 'auto' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#ff4757', marginBottom: '4px' }}>원투원 미팅</div>
                      <div style={{ color: '#000', fontSize: '14px', margin: '8px 0', fontWeight: 'bold' }}>{meeting.title}</div>
                      <div style={{ color: '#666', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '4px' }}><Calendar size={14} /> {meeting.date}</div>
                      <div style={{ color: '#666', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><MapPin size={14} /> {meeting.locationName}</div>
                      <button onClick={(e) => { e.stopPropagation(); setActiveMarker(null); }} style={{ position: 'absolute', top: '8px', right: '8px', border: 'none', background: 'rgba(0,0,0,0.05)', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '14px', color: '#666' }}>&times;</button>
                    </div>
                    <div style={{ position: 'absolute', bottom: '-8px', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderTop: '10px solid white' }}></div>
                  </div>
                )}
              </div>
            </CustomOverlayMap>
          ))}

          {/* Search Result Pin */}
          {searchedLocation && (
            <CustomOverlayMap position={{ lat: searchedLocation.lat, lng: searchedLocation.lng }} yAnchor={1} zIndex={100}>
              <div style={{ position: 'relative' }}>
                <div style={{ backgroundColor: '#2ed573', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid white', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', cursor: 'pointer', marginBottom: '8px' }}>
                  <div style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>📍</div>
                </div>
                <div style={{ position: 'absolute', bottom: '60px', left: '50%', transform: 'translateX(-50%)', background: 'white', padding: '12px 16px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.25)', minWidth: '160px', zIndex: 1000, pointerEvents: 'auto' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#2ed573', marginBottom: '4px' }}>검색 결과</div>
                    <div style={{ color: '#444', fontSize: '13px', wordBreak: 'keep-all', fontWeight: '500' }}>{searchedLocation.name}</div>
                  </div>
                  <div style={{ position: 'absolute', bottom: '-8px', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderTop: '10px solid white' }}></div>
                </div>
              </div>
            </CustomOverlayMap>
          )}

          <OutOfBoundsOverlay 
            members={filteredMembers} 
            meetings={meetings} 
            showMembers={showMembers} 
            showMeetings={showMeetings} 
          />
        </Map>
      </div>
    </div>
  );
}
