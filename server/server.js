exports = {
    onCallCreateHandler: function (payload) {
      console.log("[DEBUG] onCallCreate event triggered with timestamp:", new Date().toISOString());
      console.log("[DEBUG] Payload overview:", {
        account_id: payload.account_id,
        domain: payload.domain,
        event: payload.event,
        timestamp: payload.timestamp
      });
      
      try {
        // 전화 정보 추출 및 로깅
        const call = payload.data.call;
        console.log("[DEBUG] Call info:", {
          id: call.id,
          direction: call.direction,
          phone_number: call.phone_number
        });
        
        // 참가자 정보 추출 및 로깅
        const participants = call.participants || [];
        const customer = participants.find(p => p.participant_type === "Customer");
        console.log("[DEBUG] Customer info:", customer ? {
          caller_number: customer.caller_number,
          call_status: customer.call_status
        } : "No customer found");
        
        const callerNumber = customer ? customer.caller_number : null;
        console.log("[DEBUG] Extracted caller number:", callerNumber);
        
        // iparams 정보 확인
        const freshdeskDomain = payload.iparams.domainName;
        const apiKey = payload.iparams.apiKey;
        console.log("[DEBUG] Freshdesk domain:", freshdeskDomain);
        console.log("[DEBUG] API key exists:", !!apiKey);
  
        if (!callerNumber) {
          console.log("[DEBUG] No caller number available, returning early");
          renderData(null, { message: "No caller number available" });
          return;
        }
  
        // API 호출 URL 로깅
        const apiUrl = `https://${freshdeskDomain}.freshdesk.com/api/v2/contacts?phone=${encodeURIComponent(callerNumber)}`;
        console.log("[DEBUG] API URL:", apiUrl);
        
        // 요청 헤더 로깅 (실제 키는 보안상 생략)
        console.log("[DEBUG] Making API request with auth header");
        /*
        $request.invoke(
          apiUrl,
          {
            headers: {
              Authorization: "Basic " + Buffer.from(apiKey + ":X").toString("base64"),
              "Content-Type": "application/json",
            },
          }
        ).then(
          function(data) {
            console.log("[DEBUG] API response received");
            console.log("[DEBUG] Response status:", data.status);
            console.log("[DEBUG] Response headers:", JSON.stringify(data.headers));
            
            try {
              const response = JSON.parse(data.response);
              console.log("[DEBUG] Parsed API response:", {
                type: Array.isArray(response) ? "array" : typeof response,
                length: Array.isArray(response) ? response.length : "N/A"
              });
              
              if (response.length > 0) {
                console.log("[DEBUG] Contact found:", {
                  id: response[0].id,
                  name: response[0].name,
                  email: response[0].email
                });
                renderData(null, { contact: response[0] });
              } else {
                console.log("[DEBUG] No contact found for number:", callerNumber);
                renderData(null, { message: "No contact found for this number" });
              }
            } catch (parseError) {
              console.error("[DEBUG] Parse error:", parseError.message);
              console.log("[DEBUG] Raw response (partial):", data.response.substring(0, 100) + "...");
              renderData({ message: "Failed to parse API response: " + parseError.message }, null);
            }
          },
          function(error) {
            console.error("[DEBUG] API call error:", error);
            console.error("[DEBUG] Error details:", JSON.stringify(error, null, 2));
            renderData({ message: "API call error: " + (error.message || "Unknown error") }, null);
          }
        );*/
      } catch (error) {
        console.error("[DEBUG] Unexpected error in handler:", error.message);
        console.error("[DEBUG] Error stack:", error.stack);
        renderData({ message: "Unexpected error: " + error.message }, null);
      }
    },
  };
  
  /*
  exports = {
      onCallCreateHandler: function (payload) {
        console.log("onCallCreate event triggered with payload:", payload);
        const callerNumber = payload.data.caller_number;
        const freshdeskDomain = payload.iparams.freshdesk_domain;
        const apiKey = payload.iparams.freshdesk_api_key;
    
        if (!callerNumber) {
          renderData(null, { message: "No caller number available" });
          return;
        }
    
        $request.invoke(
          `https://${freshdeskDomain}/api/v2/contacts?phone=${encodeURIComponent(callerNumber)}`,
          {
            headers: {
              Authorization: "Basic " + Buffer.from(apiKey + ":X").toString("base64"),
              "Content-Type": "application/json",
            },
          }
        ).then(
          (data) => {
            console.log("Freshdesk API response:", data.response);
            const response = JSON.parse(data.response);
            if (response.length > 0) {
              renderData(null, { contact: response[0] });
            } else {
              renderData(null, { message: "No contact found for this number" });
            }
          },
          (error) => {
            console.error("API call error:", error);
            renderData(error, null);
          }
        );
      },
    };
    */