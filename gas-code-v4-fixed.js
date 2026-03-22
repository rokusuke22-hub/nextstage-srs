// ===== シス単 SRS 同期API v4 (修正版) =====
// タイムスタンプを「データ書き込み日時」のみに限定
// 読み込み操作では**絶対に**タイムスタンプを更新しない

function doGet(e) {
  try {
    var sheet = getOrCreateSheet();
    var action = (e && e.parameter && e.parameter.action) || "read";
    var requestId = e && e.parameter && e.parameter.id || "unknown";
    
    if (action === "write") {
      // === GET書き込み（フォールバック）===
      var ts = e.parameter.ts || String(Date.now());
      var data = decodeURIComponent(e.parameter.data || "");
      
      // 書き込み時のみタイムスタンプ更新
      sheet.getRange("A2").setValue(Number(ts));
      sheet.getRange("B2").setValue(data);
      sheet.getRange("C2").setValue(requestId);
      appendDebugLog("GET write: ts=" + ts + ", id=" + requestId);
      
      return jsonResponse({ 
        status: "ok", 
        action: "write", 
        timestamp: Number(ts),
        requestId: requestId
      });
    }
    
    // === GET読み込み（action=read のデフォルト）===
    // ★★★ ここでは**絶対に**タイムスタンプを更新しない ★★★
    var timestamp = sheet.getRange("A2").getValue() || 0;
    var raw = sheet.getRange("B2").getValue() || "";
    appendDebugLog("GET read: ts=" + timestamp + ", id=" + requestId + ", hasData=" + (raw ? "yes" : "no"));
    
    return jsonResponse({
      status: "ok", 
      action: "read", 
      timestamp: Number(timestamp),  // ← 読むだけ。更新しない
      data: raw ? JSON.parse(raw) : null,
      requestId: requestId
    });
  } catch (err) {
    appendDebugLog("doGet error: " + err.toString());
    return jsonResponse({ status: "error", message: err.toString() });
  }
}

function doPost(e) {
  try {
    var sheet = getOrCreateSheet();
    var body = JSON.parse(e.postData.contents);
    var ts = body.timestamp || Date.now();
    var requestId = body.requestId || "unknown";
    
    // === POST書き込み===
    // 書き込み時のみタイムスタンプ更新
    sheet.getRange("A2").setValue(Number(ts));
    sheet.getRange("B2").setValue(JSON.stringify(body.data));
    sheet.getRange("C2").setValue(requestId);
    appendDebugLog("POST write: ts=" + ts + ", id=" + requestId + ", words=" + Object.keys(body.data.words || {}).length);
    
    return jsonResponse({ 
      status: "ok", 
      action: "write", 
      timestamp: Number(ts),
      requestId: requestId
    });
  } catch (err) {
    appendDebugLog("doPost error: " + err.toString());
    return jsonResponse({ status: "error", message: err.toString() });
  }
}

function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("SRS_Data");
  if (!sheet) {
    sheet = ss.insertSheet("SRS_Data");
    sheet.getRange("A1").setValue("write_timestamp");
    sheet.getRange("B1").setValue("data");
    sheet.getRange("C1").setValue("last_request_id");
    sheet.getRange("D1").setValue("debug_log");
  }
  return sheet;
}

function appendDebugLog(msg) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var logSheet = ss.getSheetByName("SRS_Debug_Log");
    if (!logSheet) {
      logSheet = ss.insertSheet("SRS_Debug_Log");
      logSheet.getRange("A1").setValue("timestamp");
      logSheet.getRange("B1").setValue("message");
    }
    var nextRow = logSheet.getLastRow() + 1;
    logSheet.getRange(nextRow, 1).setValue(new Date().toISOString());
    logSheet.getRange(nextRow, 2).setValue(msg);
  } catch (e) {}
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ===== デバッグ用：ログをクライアントで確認 =====
function getDebugLog() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var logSheet = ss.getSheetByName("SRS_Debug_Log");
    if (!logSheet) return { logs: [] };
    var data = logSheet.getDataRange().getValues();
    var logs = [];
    for (var i = 1; i < data.length; i++) {
      logs.push({ ts: data[i][0], msg: data[i][1] });
    }
    return { logs: logs.slice(-50) };  // 最新50件
  } catch (e) {
    return { logs: [], error: e.toString() };
  }
}
