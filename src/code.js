/**
 * קובץ Code.gs מתוקן למערכת מענים בית ספריים
 * מקושר לאפליקציית HTML ובסיס נתונים ב-Google Sheets
 * מותאם למבנה של 21 גליונות עם נתוני תלמידים
 */

// הגדרות בסיסיות - ה-ID של הגיליון שלך
const SPREADSHEET_ID = '1_yiLmG0tQNqmxzcQphFBzR1jB5n6FrXksjApXAPyJDc';
const MAIN_SHEET_NAME = 'מענים בית ספריים';

// מפת שמות הגליונות לפי שכבות וכיתות
const SHEET_NAMES = {
  'ז1': "ז' 1", 'ז2': "ז' 2", 'ז3': "ז' 3", 'ז4': "ז' 4", 'ז5': "ז' 5", 'ז6': "ז' 6", 'ז7': "ז' 7",
  'ח1': "ח' 1", 'ח2': "ח' 2", 'ח3': "ח' 3", 'ח4': "ח' 4", 'ח5': "ח' 5", 'ח6': "ח' 6", 'ח7': "ח' 7",
  'ט1': "ט' 1", 'ט2': "ט' 2", 'ט3': "ט' 3", 'ט4': "ט' 4", 'ט5': "ט' 5", 'ט6': "ט' 6", 'ט7': "ט' 7"
};

/**
 * פונקציה לטעינת אפליקציית ה-HTML
 */
function doGet() {
  return HtmlService.createTemplateFromFile('index.html')
    .evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1')
    .setTitle('מענים בית ספריים תשפ"ו')
    .setFaviconUrl('https://www.gstatic.com/images/branding/product/1x/sheets_24dp.png');
}

/**
 * פונקציה להכללת קבצי CSS/JS נוספים אם נדרש
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * הפונקציה הקריטית לטעינת נתוני תלמידים מהגיליונות הקיימים
 * מותאמת למבנה של 21 גליונות עם נתונים מ-A4 ו-B4
 */
function getStudentsData() {
  try {
    console.log('מנסה לפתוח גיליון עם ID:', SPREADSHEET_ID);

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    console.log('הגיליון נפתח בהצלחה');

    const students = {};
    let totalStudents = 0;

    // עבור כל שכבה וכיתה
    Object.keys(SHEET_NAMES).forEach(gradeClass => {
      const grade = gradeClass.charAt(0); // ז, ח, או ט
      const classNum = gradeClass.charAt(1); // 1-7
      const sheetName = SHEET_NAMES[gradeClass];

      try {
        const sheet = spreadsheet.getSheetByName(sheetName);

        if (!sheet) {
          console.log(`גיליון ${sheetName} לא נמצא - מדלג`);
          return;
        }

        console.log(`טוען נתונים מגיליון: ${sheetName}`);

        // קבלת כל הנתונים מהגיליון
        const data = sheet.getDataRange().getValues();

        if (data.length < 4) {
          console.log(`גיליון ${sheetName} לא מכיל מספיק שורות - מדלג`);
          return;
        }

        // אתחול מבנה הנתונים לשכבה אם לא קיים
        if (!students[grade]) {
          students[grade] = {};
        }

        if (!students[grade][classNum]) {
          students[grade][classNum] = [];
        }

        // טעינת שמות התלמידים החל מהשורה 4 (אינדקס 3)
        let row = 3; // שורה 4 באקסל = אינדקס 3 במערך

        while (row < data.length) {
          const lastName = data[row][1] ? data[row][1].toString().trim() : ''; // עמודה B
          const firstName = data[row][2] ? data[row][2].toString().trim() : ''; // עמודה C

          // בדיקה שיש גם שם משפחה וגם שם פרטי
          if (lastName && firstName) {
            students[grade][classNum].push({
              lastName: lastName,
              firstName: firstName
            });
            totalStudents++;
          } else if (!lastName && !firstName) {
            // אם אין נתונים בשתי העמודות, מפסיקים לסרוק
            break;
          }

          row++;
        }

        console.log(`נטענו ${students[grade][classNum].length} תלמידים מכיתה ${grade}${classNum}`);

      } catch (sheetError) {
        console.error(`שגיאה בטעינת גיליון ${sheetName}:`, sheetError.message);
      }
    });

    console.log(`נטענו בסה"כ ${totalStudents} תלמידים מ-${Object.keys(students).length} שכבות`);

    // הדפסת פירוט לבדיקה
    Object.keys(students).forEach(grade => {
      const gradeTotal = Object.values(students[grade]).reduce((sum, classStudents) => sum + classStudents.length, 0);
      console.log(`שכבה ${grade}: ${Object.keys(students[grade]).length} כיתות, ${gradeTotal} תלמידים`);
    });

    return students;

  } catch (error) {
    console.error('שגיאה בטעינת נתוני התלמידים:', error);
    console.error('פרטי השגיאה:', error.toString());

    // החזרת שגיאה מפורטת
    throw new Error('שגיאה בטעינת נתוני התלמידים: ' + error.message);
  }
}

/**
 * הכנת הגיליון הראשי (ליצירת טבלת המענים)
 */
function setupMainSheet() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(MAIN_SHEET_NAME);

    if (!sheet) {
      sheet = spreadsheet.insertSheet(MAIN_SHEET_NAME);
    }

    // יצירת כותרות
    const headers = [
      'תאריך הגשה',
      'שם המורה',
      'מספר מענה',
      'סוג מענה',
      'שכבה',
      'כיתות',
      'תלמידים',
      'יום',
      'שעה',
      'מזהה ייחודי'
    ];

    // בדיקה אם כבר יש כותרות
    const existingHeaders = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
    const hasHeaders = existingHeaders.some(cell => cell && cell.toString().trim().length > 0);

    if (!hasHeaders) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

      // עיצוב כותרות
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#0ea5e9');
      headerRange.setFontColor('white');
      headerRange.setFontWeight('bold');
      headerRange.setHorizontalAlignment('center');

      // הגדרת רוחב עמודות
      sheet.setColumnWidth(1, 120); // תאריך
      sheet.setColumnWidth(2, 200); // שם מורה
      sheet.setColumnWidth(3, 100); // מספר מענה
      sheet.setColumnWidth(4, 150); // סוג מענה
      sheet.setColumnWidth(5, 80);  // שכבה
      sheet.setColumnWidth(6, 100); // כיתות
      sheet.setColumnWidth(7, 300); // תלמידים
      sheet.setColumnWidth(8, 80);  // יום
      sheet.setColumnWidth(9, 80);  // שעה
      sheet.setColumnWidth(10, 150); // מזהה ייחודי
    }

    return 'הגיליון הראשי הוכן בהצלחה!';

  } catch (error) {
    console.error('שגיאה בהכנת הגיליון הראשי:', error);
    throw new Error('שגיאה בהכנת הגיליון הראשי: ' + error.message);
  }
}

/**
 * פונקציה לשמירת נתוני הטופס
 */

function test() {
  const formData = {
    teacherName: "יולי בכמן",
    responses: [
      {
        responseType: "שילוב",
        students: [
          { name: "פריאל אבו דגה", class: "7", grade: "ט" },
          { name: "עידן אליהו", class: "7", grade: "ט" },
          { name: "נויה אשכנזי", class: "7", grade: "ט" }
        ],
        day: "א'",
        hour: "2"
      }
    ]

  };
  saveFormData(formData)
}
/**
 * פונקציה מעודכנת לשמירת נתוני הטופס
 * שומרת בשני מקומות: בגליונות הכיתות ובגיליון סיכום
 */
function saveFormData(formData) {
  try {
    console.log('מתחיל עיבוד נתוני טופס:', formData);

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const timestamp = new Date();

    // שלב 1: שמירה בגליונות הכיתות
    const classResults = saveToClassSheets(spreadsheet, formData, timestamp);

    // שלב 2: שמירה בגיליון הסיכום עם תוצאות העדכון
    const summaryResults = saveToSummarySheet(spreadsheet, formData, timestamp, classResults);

    const hasErrors = classResults.some(result => !result.success);

    return {
      success: !hasErrors,
      message: hasErrors ?
        'הנתונים נשמרו חלקית - חלק מהגליונות לא נמצאו' :
        'הנתונים נשמרו בהצלחה בכל הגליונות!',
      classUpdates: classResults,
      summaryRecords: summaryResults,
      timestamp: timestamp.toLocaleString('he-IL')
    };

  } catch (error) {
    console.error('שגיאה בשמירת הנתונים:', error);
    return {
      success: false,
      message: 'שגיאה בשמירת הנתונים: ' + error.message
    };
  }
}

/**
 * שמירה בגליונות הכיתות
 */
function saveToClassSheets(spreadsheet, formData, timestamp) {
  const results = [];

  formData.responses.forEach((response, responseIndex) => {
    // Group students by their class
    const studentsByClass = {};

    response.students.forEach(student => {
      const className = student.grade + student.class;
      if (!studentsByClass[className]) {
        studentsByClass[className] = [];
      }
      studentsByClass[className].push(student);
    });

    // Process each class group
    Object.keys(studentsByClass).forEach(className => {
      const sheet = spreadsheet.getSheetByName(SHEET_NAMES[className]);

      if (!sheet) {
        console.error(`גיליון ${className} לא נמצא`);
        results.push({
          success: false,
          sheetName: className,
          message: `גיליון ${className} לא נמצא`
        });
        return;
      }

      console.log(`מעבד גיליון: ${className}`);

      const data = sheet.getDataRange().getValues();
      let updatedStudents = 0;

      // קבלת אינדקס העמודה לפי סוג המענה
      const columnIndex = getResponseColumnIndex(response.responseType, response.subject);
      if (columnIndex === -1) {
        console.error(`סוג מענה לא מוכר: ${response.responseType} ${response.subject || ''}`);
        return;
      }

      // עדכון כל תלמיד בכיתה זו
      studentsByClass[className].forEach(student => {
        const studentRowIndex = findStudentInSheet(data, student.name);

        if (studentRowIndex !== -1) {
          // עדכון יום ושעה במשבצת המענה
          updateStudentResponse(sheet, studentRowIndex + 1, columnIndex, response.day, response.hour);

          // עדכון שם המורה (עמודה L - אינדקס 11)
          updateTeacherInfo(sheet, studentRowIndex + 1, formData.teacherName, response.responseType, response.subject);

          updatedStudents++;
          console.log(`עודכן תלמיד: ${student.name} בעמודה ${String.fromCharCode(67 + columnIndex)}`);
        } else {
          console.warn(`תלמיד ${student.name} לא נמצא בגיליון ${className}`);
        }
      });

      results.push({
        success: true,
        sheetName: className,
        studentsUpdated: updatedStudents,
        responseType: response.responseType,
        subject: response.subject || '',
        message: `עודכנו ${updatedStudents} תלמידים בגיליון ${className}`
      });
    });
  });

  return results;
}

/**
 * קבלת אינדקס העמודה לפי סוג המענה והמקצוע
 */
function getResponseColumnIndex(responseType, subject) {
  // מיפוי עמודות (אינדקס מתחיל מ-0, עמודה C = אינדקס 2)
  const columnMapping = {
    // פרטני לפי מקצועות
    'פרטני-אנגלית': 3,      // עמודה D
    'פרטני-מתמטיקה': 4,     // עמודה E
    'פרטני-מדעים': 5,       // עמודה F
    'פרטני-ערבית': 6,       // עמודה G
    'פרטני-היסטוריה': 7,       // עמודה H
    'פרטני-מקרא': 8,       // עמודה I
    'פרטני-אמנות': 9,       // עמודה J
    'פרטני-כללי': 10,       // עמודה K

    // מענים אחרים
    'מורה באמצעות': 11,       // עמודה L
    'סל אישי': 12,            // עמודה M
    'שילוב': 13,              // עמודה N
    'אל"ה': 14,               // עמודה O
    'סלון': 15,       // עמודה P
    'הכלה רגשית': 16,         // עמודה Q
    'הכלה לימודית': 17,      // עמודה R
    'הכלה בספורט': 18       // עמודה S
  };

  // אם זה מענה פרטני, צרף את המקצוע
  if (responseType === 'פרטני' && subject) {
    const key = responseType + '_' + subject;
    return columnMapping[key] || -1;
  }

  // אחרת, חפש לפי סוג המענה
  return columnMapping[responseType] || -1;
}

/**
 * מציאת תלמיד בגיליון
 */
function findStudentInSheet(data, studentName) {
  const nameParts = studentName.trim().split(' ');

  if (nameParts.length < 2) {
    Logger.log("Invalid name - less than 2 parts");
    return -1;
  }

  const firstPart = nameParts[0];                        // First word
  const lastPart = nameParts[nameParts.length - 1];     // Last word

  // Logger.log("firstPart: "+firstPart)
  // Logger.log("lastPart: "+lastPart)
  // חיפוש החל מהשורה 4 (אינדקס 3)
  for (let i = 3; i < data.length; i++) {

    const rowLastName = data[i][1] ? data[i][1].toString().trim() : '';
    const rowFirstName = data[i][2] ? data[i][2].toString().trim() : '';

    if (!rowLastName && !rowFirstName) break; // הגענו לסוף הרשימה
    // Logger.log("rowFirstName: " + rowFirstName)
    // Logger.log("rowLastName: "+ rowLastName)
    // Check if both parts are contained in the row (simple approach)
    const fullRowName = rowFirstName + ' ' + rowLastName;
    // Logger.log("fullRowName: "+ fullRowName)
    if (fullRowName.includes(firstPart) && fullRowName.includes(lastPart)) {
      Logger.log("Found student at row " + (i + 1));
      return i;
    }
  }
}


/**
 * עדכון תגובת תלמיד (יום ושעה)
 */
function updateStudentResponse(sheet, row, columnIndex, day, hour) {
  const cell = sheet.getRange(row, columnIndex + 1);
  const currentValue = cell.getValue().toString().trim();
  const newValue = `${day} ${hour}`;

  let finalValue;
  if (currentValue && currentValue !== '') {
    // אם יש כבר ערך, הוסף בפסיק
    finalValue = currentValue + ', ' + newValue;
  } else {
    finalValue = newValue;
  }

  cell.setValue(finalValue);
}

/**
 * עדכון מידע המורה
 */
function updateTeacherInfo(sheet, row, teacherName, responseType, subject) {
  const teacherCell = sheet.getRange(row, 20); // עמודה T
  const currentValue = teacherCell.getValue().toString().trim();

  // יצירת תיאור המענה
  let responseDescription = responseType;
  if (subject) {
    responseDescription += ' ' + subject;
  }

  const newTeacherInfo = teacherName;

  let finalValue;
  if (currentValue && currentValue !== '') {
    finalValue = currentValue + ', ' + teacherName;
  } else {
    finalValue = newTeacherInfo;
  }

  teacherCell.setValue(finalValue);
  // teacherCell.setBackground('#fff3cd');
  // teacherCell.setHorizontalAlignment('right');
}

/**
 * שמירה בגיליון הסיכום (גיליון 22)
 */
function saveToSummarySheet(spreadsheet, formData, timestamp, classUpdateResults = []) {
  const summarySheetName = 'סיכום מענים';
  let summarySheet = spreadsheet.getSheetByName(summarySheetName);

  // יצירת הגיליון אם לא קיים
  if (!summarySheet) {
    summarySheet = spreadsheet.insertSheet(summarySheetName);
    setupSummarySheet(summarySheet);
  }

  const rowsToAdd = [];

  // Create a map of errors by class
  const errorsByClass = {};
  classUpdateResults.forEach(result => {
    if (!result.success) {
      errorsByClass[result.sheetName] = result.message;
    }
  });

  // הוספת כל תלמיד כשורה נפרדת
  formData.responses.forEach(response => {
    response.students.forEach(student => {
      const subject = response.subject || '';
      const fullResponseType = response.responseType + (subject ? ' - ' + subject : '');
      const className = student.grade + student.class;

      // Check if there was an error for this class
      const hasError = errorsByClass[className];
      const status = hasError ? 'שגיאה' : 'הצלחה';
      const errorMessage = hasError || '';

      const rowData = [
        timestamp,                           // תאריך שליחה
        formData.teacherName,               // שם מלא המורה
        fullResponseType,                   // סוג מענה
        subject,                            // מקצוע (אם פרטני)
        student.grade,                      // שכבה
        className,                          // כיתה
        student.name,                       // תלמיד
        response.day,                       // יום
        response.hour,                      // שעה
        1,                                  // מספר תלמידים
        status,                             // סטטוס
        errorMessage                        // הודעת שגיאה
      ];

      rowsToAdd.push(rowData);
    });
  });

  // הוספת השורות
  if (rowsToAdd.length > 0) {
    const lastRow = summarySheet.getLastRow();
    // Note: Now we have 12 columns instead of 10
    summarySheet.getRange(lastRow + 1, 1, rowsToAdd.length, 12).setValues(rowsToAdd);

    // עיצוב השורות החדשות
    formatSummaryRows(summarySheet, lastRow + 1, rowsToAdd.length);
  }

  return {
    recordsAdded: rowsToAdd.length,
    message: `נוספו ${rowsToAdd.length} רשומות לגיליון הסיכום`,
    hasErrors: Object.keys(errorsByClass).length > 0
  };
}

/**
 * הכנת גיליון הסיכום
 */
function setupSummarySheet(sheet) {
  const headers = [
    'תאריך שליחה',
    'שם המורה',
    'סוג מענה',
    'מקצוע',
    'שכבה',
    'כיתה',
    'תלמידים',
    'יום',
    'שעה',
    'מספר תלמידים',
    'סטטוס',           // New column
    'הודעת שגיאה'      // New column
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // עיצוב כותרות
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#1e40af');
  headerRange.setFontColor('white');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');

  // הגדרת רוחב עמודות
  sheet.setColumnWidth(1, 150); // תאריך
  sheet.setColumnWidth(2, 150); // שם מורה
  sheet.setColumnWidth(3, 180); // סוג מענה
  sheet.setColumnWidth(4, 100); // מקצוע
  sheet.setColumnWidth(5, 60);  // שכבה
  sheet.setColumnWidth(6, 80);  // כיתה
  sheet.setColumnWidth(7, 300); // תלמידים
  sheet.setColumnWidth(8, 80);  // יום
  sheet.setColumnWidth(9, 80);  // שעה
  sheet.setColumnWidth(10, 120); // מספר תלמידים
  sheet.setColumnWidth(11, 80); // סטטוס
  sheet.setColumnWidth(12, 200); // הודעת שגיאה
}

/**
 * עיצוב שורות בגיליון הסיכום
 */
function formatSummaryRows(sheet, startRow, numRows) {
  const range = sheet.getRange(startRow, 1, numRows, 12); // Changed to 12 columns

  // עיצוב בסיסי
  range.setHorizontalAlignment('right');
  range.setBorder(true, true, true, true, true, true);

  // צביעת שורות והדגשת שגיאות
  for (let i = 0; i < numRows; i++) {
    const rowRange = sheet.getRange(startRow + i, 1, 1, 12);
    const statusCell = sheet.getRange(startRow + i, 11); // Status column
    const statusValue = statusCell.getValue();

    if (statusValue === 'שגיאה') {
      // Highlight error rows in light red
      rowRange.setBackground('#fee2e2');
      statusCell.setFontColor('#dc2626');
      statusCell.setFontWeight('bold');
    } else if ((startRow + i) % 2 === 0) {
      // Regular alternating colors for non-error rows
      rowRange.setBackground('#f1f5f9');
    }
  }

  // עיצוב עמודת התאריך
  const dateRange = sheet.getRange(startRow, 1, numRows, 1);
  dateRange.setNumberFormat('dd/MM/yyyy HH:mm');
}

/**
 * עיצוב שורות חדשות
 */
function formatNewRows(sheet, startRow, numRows) {
  const range = sheet.getRange(startRow, 1, numRows, 10);

  // עיצוב בסיסי
  range.setHorizontalAlignment('right');
  range.setBorder(true, true, true, true, true, true);

  // צביעת שורות לחלופין
  for (let i = 0; i < numRows; i++) {
    const rowRange = sheet.getRange(startRow + i, 1, 1, 10);
    if ((startRow + i) % 2 === 0) {
      rowRange.setBackground('#f8fafc');
    } else {
      rowRange.setBackground('#ffffff');
    }
  }

  // עיצוב עמודת התאריך
  const dateRange = sheet.getRange(startRow, 1, numRows, 1);
  dateRange.setNumberFormat('dd/MM/yyyy HH:mm');
}

/**
 * שליחת אימייל אישור (אופציונלי)
 */
function sendConfirmationEmail(formData) {
  try {
    // כתובת האימייל של מנהל המערכת - יש לשנות לכתובת הרצויה
    const adminEmail = 'admin@school.edu'; // החלף בכתובת אמיתית

    if (!adminEmail || adminEmail === 'admin@school.edu') {
      // אם לא הוגדרה כתובת אימייל תקינה, לא נשלח אימייל
      console.log('לא הוגדרה כתובת אימייל לאישור');
      return;
    }

    const subject = 'מענה בית ספרי חדש נרשם במערכת';

    let body = `שלום,\n\n`;
    body += `נרשם מענה בית ספרי חדש במערכת:\n\n`;
    body += `שם המורה: ${formData.teacherName}\n`;
    body += `מספר מענים: ${formData.responses.length}\n\n`;

    formData.responses.forEach((response, index) => {
      body += `מענה ${index + 1}:\n`;
      body += `- סוג מענה: ${response.responseType}\n`;
      body += `- שכבה: ${response.grade}\n`;
      body += `- כיתות: ${response.classes.join(', ')}\n`;
      body += `- מספר תלמידים: ${response.students.length}\n`;
      body += `- יום: ${response.day}\n`;
      body += `- שעה: ${response.hour}\n\n`;
    });

    body += `תאריך רישום: ${new Date().toLocaleString('he-IL')}\n\n`;
    body += `בברכה,\n`;
    body += `מערכת מענים בית ספריים`;

    MailApp.sendEmail(adminEmail, subject, body);
    console.log('אימייל אישור נשלח לכתובת:', adminEmail);

  } catch (error) {
    console.error('שגיאה בשליחת אימייל:', error);
    // לא נזרוק שגיאה כי זה לא קריטי לפעולת השמירה
  }
}

/**
 * פונקציה לבדיקת חיבור לגיליון והגליונות הקיימים
 */
function testConnection() {
  try {
    console.log('מנסה לפתוח גיליון עם ID:', SPREADSHEET_ID);

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    console.log('הגיליון נפתח בהצלחה');

    const mainSheet = spreadsheet.getSheetByName(MAIN_SHEET_NAME);
    const allSheets = spreadsheet.getSheets();

    let message = 'בדיקת חיבור:\n';
    message += `ID גיליון: ${SPREADSHEET_ID}\n`;
    message += `שם הגיליון: ${spreadsheet.getName()}\n`;
    message += `מספר גליונות: ${allSheets.length}\n\n`;

    if (!mainSheet) {
      message += '❌ הגיליון הראשי לא נמצא - ייווצר בהרצה הבאה\n';
    } else {
      const mainLastRow = mainSheet.getLastRow();
      message += `✅ הגיליון הראשי קיים (${Math.max(0, mainLastRow - 1)} רשומות)\n`;
    }

    // בדיקת גליונות התלמידים
    let foundSheets = 0;
    let totalStudents = 0;

    message += '\nגליונות תלמידים שנמצאו:\n';

    Object.keys(SHEET_NAMES).forEach(gradeClass => {
      const sheetName = SHEET_NAMES[gradeClass];
      const sheet = spreadsheet.getSheetByName(sheetName);

      if (sheet) {
        foundSheets++;
        const data = sheet.getDataRange().getValues();
        let studentCount = 0;

        // ספירת תלמידים בגיליון זה
        if (data.length > 3) {
          for (let row = 3; row < data.length; row++) {
            const lastName = data[row][0] ? data[row][0].toString().trim() : '';
            const firstName = data[row][1] ? data[row][1].toString().trim() : '';

            if (lastName && firstName) {
              studentCount++;
            } else if (!lastName && !firstName) {
              break;
            }
          }
        }

        totalStudents += studentCount;
        message += `✅ ${sheetName}: ${studentCount} תלמידים\n`;
      } else {
        message += `❌ ${sheetName}: לא נמצא\n`;
      }
    });

    message += `\nסיכום: ${foundSheets}/21 גליונות נמצאו, ${totalStudents} תלמידים בסה"כ\n`;

    if (foundSheets === 0) {
      message += '\n⚠️ לא נמצאו גליונות תלמידים! בדוק את שמות הגליונות.';
    }

    return message;

  } catch (error) {
    console.error('שגיאה בבדיקת חיבור:', error);
    return 'שגיאה בחיבור לגיליון: ' + error.message + '\nבדוק את ה-SPREADSHEET_ID';
  }
}

// /**
//  * פונקציה לבדיקת שמות הגליונות הקיימים
//  */
// function listAllSheets() {
//   try {
//     const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
//     const sheets = spreadsheet.getSheets();

//     let report = `שמות כל הגליונות בקובץ (${sheets.length} גליונות):\n`;
//     report += '================================\n';

//     sheets.forEach((sheet, index) => {
//       const name = sheet.getName();
//       const rows = sheet.getLastRow();
//       const cols = sheet.getLastColumn();
//       report += `${index + 1}. "${name}" (${rows}x${cols})\n`;
//     });

//     report += '\n\nגליונות שהמערכת מחפשת:\n';
//     report += '=========================\n';
//     Object.values(SHEET_NAMES).forEach((sheetName, index) => {
//       const exists = sheets.find(sheet => sheet.getName() === sheetName);
//       report += `${index + 1}. "${sheetName}" ${exists ? '✅' : '❌'}\n`;
//     });

//     return report;

//   } catch (error) {
//     return 'שגיאה בקבלת רשימת גליונות: ' + error.message;
//   }
// }

/**
 * פונקציה להתקנה ראשונית
 */
function initialSetup() {
  try {
    console.log('מתחיל התקנה ראשונית...');

    // הכנת הגיליון הראשי
    const setupResult = setupMainSheet();
    console.log('הכנת גיליון ראשי:', setupResult);

    // בדיקת חיבור
    const connectionResult = testConnection();
    console.log('בדיקת חיבור:', connectionResult);

    // בדיקת נתוני תלמידים
    const studentsData = getStudentsData();
    console.log('מספר שכבות שנטענו:', Object.keys(studentsData).length);

    return 'התקנה ראשונית הושלמה בהצלחה!\n\n' + connectionResult;

  } catch (error) {
    console.error('שגיאה בהתקנה ראשונית:', error);
    return 'שגיאה בהתקנה ראשונית: ' + error.message;
  }
}