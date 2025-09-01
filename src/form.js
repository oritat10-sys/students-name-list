
const formFields = [
    {
        id: 'helpType',
        type: 'select',
        label: 'איזה סוג מענה אני נותן?',
        placeholder: 'בחר סוג מענה',
        options: [

            'פרטני-אנגלית',
            'פרטני-מתמטיקה',
            'פרטני-מדעים',
            'פרטני-עברית',
            'סל אישי',
            'שילוב',
            'אל"ה',
            'הכלה רגשית',
            'הכלה לימודית',]
    },
    // {
    //     id: 'grade',
    //     type: 'select',
    //     label: 'השכבה בה אני נותן מענה זה',
    //     placeholder: 'בחר שכבה',
    //     options: ['ז', 'ח', 'ט']
    // },
    // {
    //     id: 'class',
    //     type: 'checkbox-select',
    //     label: 'באיזה כיתה/כיתות אני נותן את המענה?',
    //     options: ['1', '2', '3', '4', '5', '6', '7']
    // },
    {
        id: 'students',
        type: 'search-select',
        label: 'בחר את התלמיד/ים לו/להם אתה נותן מענה ',
        placeholder: 'שם התלמיד',
        options: getMockStudentData()
    },
    {
        id: 'day',
        type: 'select',
        label: 'באיזה יום בשבוע אני נותן את המענה?',
        placeholder: 'בחר יום',
        options: ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי']
    },
    {
        id: 'hour',
        type: 'select',
        label: 'באיזו שעה במערכת אני נותן את המענה?',
        placeholder: 'בחר שעה',
        options: ['0', '1', '2', '3', '4', '5', '6', '7', '8']
    }
]

// Create a global reference that works in both environments
globalThis.formFields = formFields;
