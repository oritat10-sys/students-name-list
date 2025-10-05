# Students Name List

This project is a system for managing student data in Google Sheets. It consists of a web app built with Google Apps Script that allows users to input student data and view the data in a user-friendly interface.

## Features

-   Input student data for 21 different classes
-   View student data in a table format
-   Save and update student data
-   Export data to a CSV file

## Prerequisites

Before running this project, make sure you have the following:

-   A Google account
-   Google Sheets account with access to the desired spreadsheet

## Installation

### Option 1: Using clasp (Command Line)

1.  Clone the repository: git clone https://github.com/Star69995/students-name-list.git
2.  Install clasp globally: npm install -g @google/clasp
3.  Login to your Google account: clasp login
4.  Push the code to Google Apps Script: clasp push
5.  Set the SPREADSHEET\_ID constant in the code.gs file to the ID of your desired spreadsheet
6.  Deploy the web app: clasp deploy

### Option 2: Manual Setup (Without clasp)

1.  Download or clone the repository: git clone https://github.com/Star69995/students-name-list.git
2.  Go to [Google Apps Script](https://script.google.com)
3.  Click "New Project"
4.  Copy and paste the contents of each file from the repository into the corresponding files in the Apps Script editor:
    -   Copy code.gs content into the default Code.gs file
    -   For HTML files, click the "+" button → "HTML file" and create new files with the same names
    -   Copy the content from each HTML file in the repository
5.  Set the SPREADSHEET\_ID constant in the code.gs file to the ID of your desired spreadsheet
6.  Save the project (Ctrl+S or Cmd+S)
7.  Deploy the web app:
    -   Click "Deploy" → "New deployment"
    -   Choose type: "Web app"
    -   Set execute as: "Me"
    -   Set access: "Anyone" or as per your requirements
    -   Click "Deploy"

## Usage

1.  Open the web app in your browser (use the URL provided after deployment)
2.  Select the desired class from the dropdown menu
3.  Enter student data in the input fields
4.  Click the "Submit" button to save the data
5.  View the student data in the table format

## TODO

- fix gulp convert
- טו דו ליסט לטופס המענים הבית ספריים:
1.  בבחירת התלמידים להוסיף הוראות.
כתבו את שם התלמיד, ולחצו עליו מתוך הרשימה הנפתחת. 
2.  אני נותן מענה זה לקבוצה זו בעוד יום ושעה? ככה 4 פעמים. 
3.  לעשות אפשרות שאפשר לסגור את הלחצן של 'מענה נוסף'. כרגע אם פתחתי בטעות 'מענה נוסף' אני חייבת למלא אותו כי כל השדות בו חובה והוא לא נותן לשלוח את הטופס בלי שאמלא את הכל..  
4.  יוצר ע''י אורית עטר וסטאר