/**
 * app/scripts/app.js - 클라이언트 측 로직
 */

// 전역 변수
let client;

// 앱 초기화 및 이벤트 설정
async function initApp() {
  try {
    // 앱 초기화
    client = await app.initialized();
    console.log('App initialized successfully');
    
    // 앱 활성화 이벤트 처리
    client.events.on('app.activated', function() {
      console.log('App activated event triggered');
      
      // 성공 메시지 표시
      displayCallStatus('success', 'Full page app loaded successfully!');
      
      // 이벤트 데이터 가져오기
      setTimeout(fetchPayloadData, 1000); // 약간의 지연을 두고 실행
    });
    
  } catch (error) {
    console.error('Failed to initialize app:', error);
    displayCallStatus('error', 'Error initializing app: ' + error.message);
  }
}

// 통화 상태 표시 함수
function displayCallStatus(type, message) {
  const detailsElement = document.getElementById('callDetails');
  if (!detailsElement) {
    console.error('Call details element not found');
    return;
  }
  
  let className = 'info-msg';
  if (type === 'success') className = 'success-msg';
  if (type === 'error') className = 'error-msg';
  if (type === 'warning') className = 'warning-msg';
  
  detailsElement.innerHTML = `
    <div class="${className}">
      <p><strong>${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}</strong> ${message}</p>
      <p>Time: ${new Date().toLocaleTimeString()}</p>
    </div>
  `;
}

// 페이로드 데이터 가져오기 함수
async function fetchPayloadData() {
  // 페이로드 데이터 표시 요소 찾기
  const payloadElement = document.getElementById('payload-data');
  
  if (!payloadElement) {
    console.error('Payload element not found in the DOM');
    return;
  }
  
  try {
    console.log('Attempting to fetch payload data...');
    
    // 페이로드 데이터를 가져오기 위한 여러 방법 시도
    let payloadData = null;
    let dataSource = '';
    
    // 방법 1: context API 사용
    try {
      console.log('Trying context.getContext() method...');
      const contextData = await client.context.getContext();
      console.log('Context API response:', contextData);
      if (contextData) {
        payloadData = contextData;
        dataSource = 'Context API';
      }
    } catch (err1) {
      console.log('Context API failed:', err1.message);
      
      // 방법 2: 앱 데이터 가져오기
      try {
        console.log('Trying app.get() method...');
        const appData = await client.instance.get();
        console.log('App data response:', appData);
        if (appData) {
          payloadData = appData;
          dataSource = 'App Instance API';
        }
      } catch (err2) {
        console.log('App data method failed:', err2.message);
        
        // 방법 3: 환경 정보 대체 데이터 사용
        console.log('Using environment info as fallback');
        payloadData = getEnvironmentInfo();
        dataSource = 'Environment Info (Fallback)';
      }
    }
    
    // 결과 표시
    displayPayloadData(payloadData, dataSource);
    
  } catch (error) {
    console.error('Failed to fetch payload data:', error);
    
    if (payloadElement) {
      payloadElement.innerHTML = `
        <div class="error-msg">
          <p><strong>Error fetching data:</strong> ${error.message}</p>
          <p>Check console for details.</p>
        </div>
      `;
    }
  }
}

// 환경 정보 가져오기
function getEnvironmentInfo() {
  return {
    environment: {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      platform: navigator.platform,
      language: navigator.language
    },
    app: {
      name: "Freshcaller Integration",
      purpose: "Display call details when a call is received",
      testMode: true
    }
  };
}

// 페이로드 데이터 표시 함수
function displayPayloadData(data, source) {
  const payloadElement = document.getElementById('payload-data');
  if (!payloadElement) {
    console.error('Payload element still not found');
    return;
  }
  
  if (!data) {
    payloadElement.innerHTML = `
      <div class="warning-msg">
        <p><strong>Warning:</strong> No payload data available</p>
      </div>
    `;
    return;
  }
  
  // 데이터 형식화
  let formattedData;
  try {
    const dataObj = typeof data === 'string' ? JSON.parse(data) : data;
    formattedData = JSON.stringify(dataObj, null, 2);
  } catch (e) {
    formattedData = typeof data === 'string' ? data : JSON.stringify(data);
  }
  
  // 데이터 표시
  payloadElement.innerHTML = `
    <h3>Data from ${source || 'API'}:</h3>
    <div class="data-section">
      <pre class="payload-pre">${escapeHtml(formattedData)}</pre>
    </div>
  `;
}

// HTML 이스케이프 함수 (XSS 방지)
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// 문서 로드 완료 시 앱 초기화 실행
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM content loaded, initializing app...');
  
  // DOM 요소 확인 (디버깅용)
  const payloadElement = document.getElementById('payload-data');
  console.log('payload-data element found in DOM:', !!payloadElement);
  
  const callDetailsElement = document.getElementById('callDetails');
  console.log('callDetails element found in DOM:', !!callDetailsElement);
  
  // 앱 초기화
  initApp();
});