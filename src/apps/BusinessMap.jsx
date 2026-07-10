import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Search, Users, Calendar, MapPin, Navigation } from 'lucide-react';
import { subscribeToMembers, subscribeToMeetings } from '../services/memberService';

// Custom icons using Lucide SVGs wrapped in L.divIcon
const createCustomIcon = (color, IconComponent) => {
  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`;
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `<div style="background-color: ${color}; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);"><div style="color: white; font-weight: bold; font-size: 14px;">${IconComponent}</div></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36]
  });
};

const getCategoryIcon = (member) => {
  const category = (member.category || '').toLowerCase();
  const tag = (member.tag || '').toLowerCase();
  
  if (tag.includes('음식') || tag.includes('요식') || category.includes('음식') || category.includes('요식') || category.includes('식품')) return createCustomIcon('#e15f41', '🍽️');
  if (tag.includes('건축') || tag.includes('인테리어') || category.includes('인테리어') || category.includes('건축') || category.includes('조명')) return createCustomIcon('#f19066', '🏗️');
  if (tag.includes('유통') || category.includes('유통')) return createCustomIcon('#786fa6', '📦');
  if (tag.includes('건강') || tag.includes('의료') || category.includes('건강') || category.includes('의료') || category.includes('병원') || category.includes('안과')) return createCustomIcon('#ea8685', '⚕️');
  if (tag.includes('교육') || tag.includes('코칭') || category.includes('교육') || category.includes('코칭')) return createCustomIcon('#63cdda', '🎓');
  if (tag.includes('부동산') || category.includes('부동산')) return createCustomIcon('#f3a683', '🏠');
  if (category.includes('꽃') || category.includes('플라워')) return createCustomIcon('#ffb8b8', '🌸');
  if (category.includes('법률') || category.includes('세무') || category.includes('노무') || category.includes('회계') || category.includes('변호사')) return createCustomIcon('#3dc1d3', '⚖️');
  if (category.includes('금융') || category.includes('보험')) return createCustomIcon('#f5cd79', '💰');
  if (category.includes('it') || category.includes('소프트웨어') || category.includes('개발') || category.includes('컴퓨터') || category.includes('마케팅')) return createCustomIcon('#546de5', '💻');
  if (category.includes('스포츠') || category.includes('골프') || category.includes('레져')) return createCustomIcon('#1abc9c', '⛳');
  
  return createCustomIcon('#3742fa', '👤');
};

const meetingIcon = createCustomIcon('#ff4757', '🤝');
const searchIcon = createCustomIcon('#2ed573', '📍');

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

function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { duration: 1.5 });
    }
  }, [center, zoom, map]);
  return null;
}

function OutOfBoundsOverlay({ members, meetings, showMembers, showMeetings }) {
  const map = useMap();
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const updateMarkers = () => {
      const bounds = map.getBounds();
      const center = map.getCenter();
      const size = map.getSize();
      const pad = 30; // padding from edge
      
      const newMarkers = [];
      const processItems = (items, type) => {
        items.forEach(item => {
          if (!item.lat || !item.lng) return;
          const latlng = L.latLng(item.lat, item.lng);
          if (!bounds.contains(latlng)) {
            const dist = center.distanceTo(latlng);
            const distStr = dist > 1000 ? (dist/1000).toFixed(1) + 'km' : Math.round(dist) + 'm';
            
            const pt = map.latLngToContainerPoint(latlng);
            const c = { x: size.x/2, y: size.y/2 };
            const dx = pt.x - c.x;
            const dy = pt.y - c.y;
            
            // Intersection with rect [pad, pad, size.x-pad, size.y-pad]
            let t = Infinity;
            if (dx < 0) t = Math.min(t, (pad - c.x) / dx);
            if (dx > 0) t = Math.min(t, (size.x - pad - c.x) / dx);
            if (dy < 0) t = Math.min(t, (pad - c.y) / dy);
            if (dy > 0) t = Math.min(t, (size.y - pad - c.y) / dy);
            
            const ix = c.x + t * dx;
            const iy = c.y + t * dy;
            
            // Calculate angle for arrow (pointing outwards from center to marker)
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

      // Cluster markers that are close to each other on the screen border
      const CLUSTER_RADIUS = 60; // pixels
      const clusters = [];

      newMarkers.sort((a,b) => a.distRaw - b.distRaw);

      newMarkers.forEach(marker => {
        let addedToCluster = false;
        for (let cluster of clusters) {
          const dist = Math.hypot(cluster.x - marker.x, cluster.y - marker.y);
          if (dist < CLUSTER_RADIUS) {
            cluster.items.push(marker);
            // Optional: Recalculate average position and angle
            // For simplicity, we just keep the position of the closest marker (which is the first one since we sorted)
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

    map.on('move', updateMarkers);
    map.on('zoom', updateMarkers);
    map.on('resize', updateMarkers);
    
    setTimeout(updateMarkers, 100);

    return () => {
      map.off('move', updateMarkers);
      map.off('zoom', updateMarkers);
      map.off('resize', updateMarkers);
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
  const [mapCenter, setMapCenter] = useState([37.503, 127.040]);
  const [mapZoom, setMapZoom] = useState(13);
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    // 1. Check local members
    const foundMember = members.find(m => 
      m.name?.includes(searchQuery) || m.company?.includes(searchQuery) || m.category?.includes(searchQuery)
    );
    if (foundMember) {
      setShowMembers(true);
      setMapCenter([foundMember.lat, foundMember.lng]);
      setMapZoom(16);
      setSearchedLocation(null);
      return;
    }

    // 2. Check local meetings
    const foundMeeting = meetings.find(m => 
      m.title?.includes(searchQuery) || m.locationName?.includes(searchQuery) || m.memberName?.includes(searchQuery)
    );
    if (foundMeeting) {
      setShowMeetings(true);
      setMapCenter([foundMeeting.lat, foundMeeting.lng]);
      setMapZoom(16);
      setSearchedLocation(null);
      return;
    }

    // 3. Fallback to OpenStreetMap Nominatim API
    setIsSearching(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lon = parseFloat(result.lon);
        setSearchedLocation({ lat, lng: lon, name: result.display_name });
        setMapCenter([lat, lon]);
        setMapZoom(16);
      } else {
        alert('검색 결과가 없습니다.');
      }
    } catch (error) {
      console.error('Map search error:', error);
      alert('위치 검색 중 오류가 발생했습니다.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const resetMap = () => {
    setMapCenter([37.503, 127.040]);
    setMapZoom(13);
    setSearchedLocation(null);
    setSearchQuery('');
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
                placeholder="멤버 이름, 회사명, 지명 검색..." 
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
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative', zIndex: 1 }}>
        <MapContainer 
          center={mapCenter} 
          zoom={mapZoom} 
          style={{ width: '100%', height: '100%' }}
        >
          <MapController center={mapCenter} zoom={mapZoom} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Member Pins */}
          {showMembers && filteredMembers.map(member => (
            <Marker key={`member-${member.id}`} position={[member.lat || 37.5, member.lng || 127.0]} icon={getCategoryIcon(member)}>
              <Popup>
                <div style={{ textAlign: 'center', minWidth: '150px' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#000' }}>{member.name} 대표</div>
                  <div style={{ color: '#666', fontSize: '12px', margin: '4px 0' }}>{member.company} ({member.category})</div>
                  <div style={{ color: '#888', fontSize: '11px', marginTop: '8px' }}>{member.address}</div>
                  <button style={{ marginTop: '10px', width: '100%', padding: '6px', background: '#3742fa', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                    프로필 보기
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Meeting Pins */}
          {showMeetings && meetings.map(meeting => (
            <Marker key={`meeting-${meeting.id}`} position={[meeting.lat || 37.5, meeting.lng || 127.0]} icon={meetingIcon}>
              <Popup>
                <div style={{ textAlign: 'center', minWidth: '150px' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#ff4757' }}>원투원 미팅</div>
                  <div style={{ color: '#000', fontSize: '13px', margin: '6px 0', fontWeight: 'bold' }}>{meeting.title}</div>
                  <div style={{ color: '#666', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <Calendar size={12} /> {meeting.date}
                  </div>
                  <div style={{ color: '#666', fontSize: '12px', marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <MapPin size={12} /> {meeting.locationName}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Search Result Pin */}
          {searchedLocation && (
            <Marker position={[searchedLocation.lat, searchedLocation.lng]} icon={searchIcon}>
              <Popup>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#2ed573' }}>검색 결과</div>
                  <div style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>{searchedLocation.name}</div>
                </div>
              </Popup>
            </Marker>
          )}

          <OutOfBoundsOverlay 
            members={filteredMembers} 
            meetings={meetings} 
            showMembers={showMembers} 
            showMeetings={showMeetings} 
          />
        </MapContainer>
      </div>
    </div>
  );
}
