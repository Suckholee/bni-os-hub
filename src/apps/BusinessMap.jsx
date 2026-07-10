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

const memberIcon = createCustomIcon('#3742fa', '👤');
const meetingIcon = createCustomIcon('#ff4757', '🤝');
const searchIcon = createCustomIcon('#2ed573', '📍');

function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { duration: 1.5 });
    }
  }, [center, zoom, map]);
  return null;
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

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header & Controls */}
      <div style={{ paddingBottom: '16px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>비즈니스 맵 🗺️</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
      <div style={{ flex: 1, borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', zIndex: 1 }}>
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
          {showMembers && members.map(member => (
            <Marker key={`member-${member.id}`} position={[member.lat || 37.5, member.lng || 127.0]} icon={memberIcon}>
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
        </MapContainer>
      </div>
    </div>
  );
}
