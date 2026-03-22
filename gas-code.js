function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || "read";
  if (action === "read") {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("SRS_Data");
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ ts: 0, data: null })).setMimeType(ContentService.MimeType.JSON);
    }
    var ts = sheet.getRange("A2").getValue() || 0;
    var data = sheet.getRange("B2").getValue() || "";
    var rid = sheet.getRange("C2").getValue() || "";
    return ContentService.createTextOutput(JSON.stringify({ ts: ts, data: data, requestId: rid })).setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput(JSON.stringify({ error: "unknown action" })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    if (body.action === "write") {
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      var sheet = ss.getSheetByName("SRS_Data");
      if (!sheet) {
        sheet = ss.insertSheet("SRS_Data");
        sheet.getRange("A1").setValue("timestamp");
        sheet.getRange("B1").setValue("data");
        sheet.getRange("C1").setValue("requestId");
        sheet.getRange("D1").setValue("debug");
      }
      var now = Date.now();
      sheet.getRange("A2").setValue(now);
      sheet.getRange("B2").setValue(body.data || "");
      sheet.getRange("C2").setValue(body.requestId || "");

      var logSheet = ss.getSheetByName("SRS_Debug_Log");
      if (!logSheet) {
        logSheet = ss.insertSheet("SRS_Debug_Log");
        logSheet.getRange("A1").setValue("timestamp");
        logSheet.getRange("B1").setValue("requestId");
        logSheet.getRange("C1").setValue("action");
        logSheet.getRange("D1").setValue("dataSize");
      }
      logSheet.appendRow([new Date(), body.requestId || "", "write", (body.data || "").length]);

      return ContentService.createTextOutput(JSON.stringify({ success: true, ts: now })).setMimeType(ContentService.MimeType.JSON);
    }
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput(JSON.stringify({ error: "unknown" })).setMimeType(ContentService.MimeType.JSON);
}
