
// WeatherAPI 키
const API_KEY = '6ccc2e26982346178c025029250708';
const BASE_URL = 'https://api.weatherapi.com/v1/current.json';

// DOM 요소들
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');
const weatherInfo = document.getElementById('weatherInfo');
const errorMessage = document.getElementById('errorMessage');

// 날씨 정보 표시 요소들
const cityName = document.getElementById('cityName');
const weatherIcon = document.getElementById('weatherIcon');
const currentTemp = document.getElementById('currentTemp');
const weatherDescription = document.getElementById('weatherDescription');
const lastUpdated = document.getElementById('lastUpdated');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const uvIndex = document.getElementById('uvIndex');
const pressure = document.getElementById('pressure');
const visibility = document.getElementById('visibility');

// 이벤트 리스너
searchBtn.addEventListener('click', searchWeather);
cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchWeather();
  }
});

// 페이지 로드 시 서울 날씨 표시
window.addEventListener('load', () => {
  cityInput.value = 'Seoul';
  searchWeather();
});

// 날씨 검색 함수
async function searchWeather() {
  const city = cityInput.value.trim();
  
  if (!city) {
    showError('도시 이름을 입력해주세요.');
    return;
  }
  
  showLoading();
  
  try {
    const response = await fetch(`${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(city)}&aqi=yes&lang=ko`);
    
    if (!response.ok) {
      throw new Error('도시를 찾을 수 없습니다.');
    }
    
    const data = await response.json();
    displayWeatherData(data);
    
  } catch (error) {
    console.error('Error fetching weather data:', error);
    showError('날씨 정보를 가져올 수 없습니다. 도시 이름을 확인해주세요.');
  }
}

// 날씨 데이터 표시 함수
function displayWeatherData(data) {
  const { location, current } = data;
  
  // 기본 정보
  cityName.textContent = `${location.name}, ${location.country}`;
  currentTemp.textContent = Math.round(current.temp_c);
  weatherDescription.textContent = current.condition.text;
  weatherIcon.src = `https:${current.condition.icon}`;
  weatherIcon.alt = current.condition.text;
  
  // 마지막 업데이트 시간
  const updateTime = new Date(current.last_updated);
  lastUpdated.textContent = `마지막 업데이트: ${updateTime.toLocaleString('ko-KR')}`;
  
  // 상세 정보
  feelsLike.textContent = `${Math.round(current.feelslike_c)}°C`;
  humidity.textContent = `${current.humidity}%`;
  windSpeed.textContent = `${current.wind_kph} km/h`;
  uvIndex.textContent = current.uv;
  pressure.textContent = `${current.pressure_mb} mb`;
  visibility.textContent = `${current.vis_km} km`;
  
  // 표시 상태 변경
  hideLoading();
  hideError();
  weatherInfo.style.display = 'block';
}

// 로딩 표시
function showLoading() {
  loading.style.display = 'block';
  weatherInfo.style.display = 'none';
  errorMessage.style.display = 'none';
}

// 로딩 숨김
function hideLoading() {
  loading.style.display = 'none';
}

// 에러 표시
function showError(message) {
  hideLoading();
  weatherInfo.style.display = 'none';
  errorMessage.style.display = 'block';
  errorMessage.querySelector('p').textContent = `⚠️ ${message}`;
}

// 에러 숨김
function hideError() {
  errorMessage.style.display = 'none';
}

// 도시 이름 자동완성을 위한 인기 도시 목록
const popularCities = [
  'Seoul', 'Tokyo', 'New York', 'London', 'Paris', 'Berlin', 
  'Madrid', 'Rome', 'Moscow', 'Beijing', 'Shanghai', 'Sydney',
  'Melbourne', 'Toronto', 'Vancouver', 'Los Angeles', 'Chicago'
];

// 입력 필드에 포커스가 있을 때 도시 제안
cityInput.addEventListener('input', (e) => {
  const value = e.target.value.toLowerCase();
  if (value.length > 1) {
    const suggestions = popularCities.filter(city => 
      city.toLowerCase().includes(value)
    );
    // 여기에 자동완성 드롭다운을 구현할 수 있습니다.
  }
});
