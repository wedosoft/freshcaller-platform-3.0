// server/server.js
let lastCallPayload = null;

exports = {
  onCallCreateHandler: function(payload) {
    console.log("==== Call Received Event Triggered ====");
    console.log("Call ID:", payload.data && payload.data.call ? payload.data.call.id : "Unknown");
    console.log("Timestamp:", new Date().toISOString());
    
    // 페이로드 데이터 로깅 및 저장
    console.log("Full payload:", JSON.stringify(payload, null, 2));
    lastCallPayload = payload;
    
    try {
      // 전화 정보 추출
      if (payload.data && payload.data.call) {
        const call = payload.data.call;
        console.log("Call details:", {
          id: call.id,
          direction: call.direction,
          phoneNumber: call.phone_number,
          created: call.created_time
        });
      }
      
      // 성공 응답 반환
      renderData(null, { success: true });
    } catch (error) {
      console.error("Error in call handler:", error);
      renderData({ error: error.message }, null);
    }
  },
  
  // 페이로드 데이터를 가져오기 위한 서버 메서드
  getLastCallPayload: function() {
    console.log("Client requested call payload data");
    renderData(null, {
      success: true,
      payload: lastCallPayload,
      timestamp: new Date().toISOString()
    });
  }
};