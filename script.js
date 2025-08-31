// Global variable to store student data from Google Sheets
let studentsData = {};
let currentResponseCount = 1;
const MAX_RESPONSES = 10;

// Load students data when page loads
document.addEventListener('DOMContentLoaded', function () {
    loadStudentsData();
});

// Function to load student data from Google Sheets
function loadStudentsData() {
    try {
        google.script.run
            .withSuccessHandler(onStudentsDataLoaded)
            .withFailureHandler(onStudentsDataError)
            .getStudentsData();
    } catch (error) {
        console.error('Error loading students data:', error);
        onStudentsDataError(error);
    }
}

// Success handler for loading students data
function onStudentsDataLoaded(data) {
    studentsData = data;
    console.log('Students data loaded:', studentsData);

    // Hide loading overlay
    document.getElementById('loadingOverlay').style.display = 'none';

    // Setup first response section
    setupFirstResponseSection();
}

// Error handler for loading students data
function onStudentsDataError(error) {
    console.error('Error loading students data:', error);

    // Hide loading overlay and show error
    document.getElementById('loadingOverlay').style.display = 'none';

    // Fallback to mock data if server connection fails
    studentsData = getMockStudentData();

    // Show error message but continue with mock data
    showMessage('התרחשה שגיאה בטעינת נתוני התלמידים. האפליקציה פועלת עם נתונים לדוגמה.', 'warning');

    // Setup first response section
    setupFirstResponseSection();
}

// Mock data fallback
function getMockStudentData() {
    return {
        'ז': {
            '1': [
                { lastName: 'כהן', firstName: 'דניאל' },
                { lastName: 'לוי', firstName: 'נועה' },
                { lastName: 'אברהם', firstName: 'יוסי' },
                { lastName: 'דוד', firstName: 'מיכל' }
            ],
            '2': [
                { lastName: 'שמואלי', firstName: 'רותם' },
                { lastName: 'גולן', firstName: 'אביב' },
                { lastName: 'אדרי', firstName: 'שירה' },
                { lastName: 'ברק', firstName: 'עידו' }
            ],
            '3': [
                { lastName: 'אלון', firstName: 'גל' },
                { lastName: 'נחום', firstName: 'שקד' }
            ],
            '4': [
                { lastName: 'שרון', firstName: 'עומר' },
                { lastName: 'פרץ', firstName: 'הילה' }
            ],
            '5': [
                { lastName: 'אשכנזי', firstName: 'אורי' },
                { lastName: 'מזרחי', firstName: 'ליאור' }
            ],
            '6': [
                { lastName: 'דהן', firstName: 'יובל' },
                { lastName: 'חן', firstName: 'נועם' }
            ],
            '7': [
                { lastName: 'אוחיון', firstName: 'אלה' },
                { lastName: 'ביטון', firstName: 'איתי' }
            ]
        },
        'ח': {
            '1': [
                { lastName: 'רוזנברג', firstName: 'טל' },
                { lastName: 'פרידמן', firstName: 'מאיה' }
            ],
            '2': [
                { lastName: 'גרינברג', firstName: 'אלון' },
                { lastName: 'שטרן', firstName: 'שיר' }
            ],
            '3': [
                { lastName: 'ויס', firstName: 'עדי' },
                { lastName: 'קליין', firstName: 'רון' }
            ],
            '4': [
                { lastName: 'הופמן', firstName: 'דנה' },
                { lastName: 'ברגר', firstName: 'אסף' }
            ],
            '5': [
                { lastName: 'זילברמן', firstName: 'יעל' },
                { lastName: 'גולדשטיין', firstName: 'אריאל' }
            ],
            '6': [
                { lastName: 'פלדמן', firstName: 'נדב' },
                { lastName: 'הירש', firstName: 'מיה' }
            ],
            '7': [
                { lastName: 'שוורץ', firstName: 'אופיר' },
                { lastName: 'לוינסון', firstName: 'שני' }
            ]
        },
        'ט': {
            '1': [
                { lastName: 'כץ', firstName: 'יותם' },
                { lastName: 'רוזן', firstName: 'נטע' }
            ],
            '2': [
                { lastName: 'פרץ', firstName: 'אגם' },
                { lastName: 'אזולאי', firstName: 'עמית' }
            ],
            '3': [
                { lastName: 'מלכה', firstName: 'ליאם' },
                { lastName: 'אוחנה', firstName: 'אביגיל' }
            ],
            '4': [
                { lastName: 'גבאי', firstName: 'אלעד' },
                { lastName: 'דיין', firstName: 'הדר' }
            ],
            '5': [
                { lastName: 'חדד', firstName: 'אורי' },
                { lastName: 'אטיאס', firstName: 'נויה' }
            ],
            '6': [
                { lastName: 'סויסה', firstName: 'רועי' },
                { lastName: 'בוזגלו', firstName: 'מאי' }
            ],
            '7': [
                { lastName: 'אלמליח', firstName: 'דור' },
                { lastName: 'אמסלם', firstName: 'שירי' }
            ]
        }
    };
}

// Setup first response section after data is loaded
function setupFirstResponseSection() {
    setupClassCheckboxes(1);
    document.getElementById('grade1').addEventListener('change', function () {
        updateClassCheckboxes(1);
    });

    // Submit form
    document.getElementById('submitBtn').addEventListener('click', function () {
        if (validateForm()) {
            submitForm();
        }
    });

    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            const x = e.clientX - e.target.getBoundingClientRect().left;
            const y = e.clientY - e.target.getBoundingClientRect().top;

            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Show message function
function showMessage(message, type = 'error') {
    let errorDiv;
    if (message.includes('תלמידים')) {
        errorDiv = document.getElementById('errorMessage');
    } else {
        errorDiv = document.getElementById('errorMessageBottom');
    }

    const errorText = document.getElementById('errorText');
    const successDiv = document.getElementById('successMessage');

    if (type === 'success') {
        successDiv.classList.remove('hidden');
        errorDiv.classList.add('hidden');
    } else {
        errorText.textContent = message;
        errorDiv.classList.remove('hidden');
        successDiv.classList.add('hidden');
    }
}

function renumberResponseSections() {
    const sections = document.querySelectorAll('[id^="responseSection"]');
    let newIndex = 1;

    sections.forEach(section => {
        const oldIndex = section.id.replace('responseSection', '');

        if (oldIndex != newIndex) {
            // Update section ID
            section.id = `responseSection${newIndex}`;

            // Update heading
            const heading = section.querySelector('h3');
            heading.innerHTML = heading.innerHTML.replace(`מענה מספר ${oldIndex} שאני נותן`, `מענה מספר ${newIndex} שאני נותן`);

            // Update remove button data attribute
            const removeBtn = section.querySelector('.remove-response-btn');
            if (removeBtn) {
                removeBtn.setAttribute('data-response', newIndex);
            }

            // Update all input IDs and labels
            updateElementIds(section, oldIndex, newIndex);
        }

        newIndex++;
    });

    // Update current response count
    currentResponseCount = newIndex - 1;
}

function updateElementIds(section, oldIndex, newIndex) {
    // Update select elements
    ['responseType', 'grade', 'day', 'hour'].forEach(prefix => {
        const element = document.getElementById(`${prefix}${oldIndex}`);
        if (element) {
            element.id = `${prefix}${newIndex}`;
            // Update associated label
            const label = section.querySelector(`label[for="${prefix}${oldIndex}"]`);
            if (label) {
                label.setAttribute('for', `${prefix}${newIndex}`);
            }
        }
    });

    // Update class checkboxes
    const checkboxContainer = section.querySelector(`#classCheckboxes${oldIndex}`);
    if (checkboxContainer) {
        checkboxContainer.id = `classCheckboxes${newIndex}`;

        const checkboxes = checkboxContainer.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            const classNum = checkbox.value;
            checkbox.id = `class${newIndex}_${classNum}`;
            checkbox.setAttribute('data-response', newIndex);

            // Update associated label
            const label = checkboxContainer.querySelector(`label[for="class${oldIndex}_${classNum}"]`);
            if (label) {
                label.setAttribute('for', `class${newIndex}_${classNum}`);
            }
        });
    }

    // Update students container
    const studentsContainer = section.querySelector(`#studentsContainer${oldIndex}`);
    if (studentsContainer) {
        studentsContainer.id = `studentsContainer${newIndex}`;
    }

    // Re-setup event listeners
    setupClassCheckboxes(newIndex);
    document.getElementById(`grade${newIndex}`).addEventListener('change', function () {
        updateClassCheckboxes(newIndex);
    });
}

function setupClassCheckboxes(responseNum) {
    const checkboxes = document.querySelectorAll(`.class-checkbox[data-response="${responseNum}"]`);

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            updateStudentDropdowns(responseNum);
        });
    });
}

function updateClassCheckboxes(responseNum) {
    // const grade = document.getElementById(`grade${responseNum}`).value;
    const checkboxes = document.querySelectorAll(`.class-checkbox[data-response="${responseNum}"]`);

    // Reset checkboxes
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    // Reset student dropdowns
    updateStudentDropdowns(responseNum);
}

function updateStudentDropdowns(responseNum) {
    const grade = document.getElementById(`grade${responseNum}`).value;
    const studentsContainer = document.getElementById(`studentsContainer${responseNum}`);
    const selectedClasses = [];

    // Get selected classes
    document.querySelectorAll(`.class-checkbox[data-response="${responseNum}"]:checked`).forEach(checkbox => {
        selectedClasses.push(checkbox.value);
    });

    // Clear previous dropdowns
    studentsContainer.innerHTML = '';

    if (selectedClasses.length === 0) {
        studentsContainer.innerHTML = '<div class="text-sky-600 italic">יש לבחור כיתה/כיתות תחילה</div>';
        return;
    }

    // Create student dropdowns for each selected class
    selectedClasses.forEach(classNum => {
        if (grade && studentsData[grade] && studentsData[grade][classNum]) {
            const classContainer = document.createElement('div');
            classContainer.className = 'p-4 bg-sky-50 rounded-lg';

            const classTitle = document.createElement('h4');
            classTitle.className = 'font-medium text-sky-800 mb-3';
            classTitle.textContent = `כיתה ${grade}${classNum}`;
            classContainer.appendChild(classTitle);

            const studentsDiv = document.createElement('div');
            studentsDiv.className = 'space-y-2';

            // Create checkboxes for each student
            studentsData[grade][classNum].forEach((student, index) => {
                const studentDiv = document.createElement('div');
                studentDiv.className = 'flex items-center';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `student${responseNum}_${classNum}_${index}`;
                checkbox.className = 'h-5 w-5 text-sky-600 rounded border-sky-300 focus:ring-sky-500 student-checkbox';
                checkbox.setAttribute('data-response', responseNum);
                checkbox.setAttribute('data-class', classNum);
                checkbox.value = `${student.lastName} ${student.firstName}`;

                const label = document.createElement('label');
                label.htmlFor = `student${responseNum}_${classNum}_${index}`;
                label.className = 'mr-2';
                label.textContent = `${student.lastName} ${student.firstName}`;

                studentDiv.appendChild(checkbox);
                studentDiv.appendChild(label);
                studentsDiv.appendChild(studentDiv);
            });

            classContainer.appendChild(studentsDiv);
            studentsContainer.appendChild(classContainer);
        }
    });
}

function validateForm() {
    // Basic validation for required fields
    const teacherName = document.getElementById('teacherName').value.trim();
    if (!teacherName) {
        alert('נא להזין שם מלא');
        return false;
    }

    // Get all response sections
    const responseSections = document.querySelectorAll('[id^="responseSection"]');

    // Validate each response section
    for (let i = 0; i < responseSections.length; i++) {
        const responseNum = i + 1;

        // Select all elements with an id that contains "responseType"
        const elements = document.querySelectorAll('[id*="responseType"]');

        console.log(elements);
        // Validate response type
        const responseType = document.getElementById(`responseType${responseNum}`).value;
        if (!responseType) {
            alert(`נא לבחור סוג מענה עבור מענה ${responseNum}`);
            return false;
        }

        // Validate grade
        const grade = document.getElementById(`grade${responseNum}`).value;
        if (!grade) {
            alert(`נא לבחור שכבה עבור מענה ${responseNum}`);
            return false;
        }

        // Validate class selection
        const selectedClasses = document.querySelectorAll(`.class-checkbox[data-response="${responseNum}"]:checked`);
        if (selectedClasses.length === 0) {
            alert(`נא לבחור לפחות כיתה אחת עבור מענה ${responseNum}`);
            return false;
        }

        // Validate student selection
        const studentCheckboxes = document.querySelectorAll(`.student-checkbox[data-response="${responseNum}"]:checked`);
        if (studentCheckboxes.length === 0) {
            alert(`נא לבחור לפחות תלמיד אחד עבור מענה ${responseNum}`);
            return false;
        }

        // Validate day
        const day = document.getElementById(`day${responseNum}`).value;
        if (!day) {
            alert(`נא לבחור יום עבור מענה ${responseNum}`);
            return false;
        }

        // Validate hour
        const hour = document.getElementById(`hour${responseNum}`).value;
        if (!hour && hour !== '0') {
            alert(`נא לבחור שעה עבור מענה ${responseNum}`);
            return false;
        }
    }

    return true;
}

function submitForm() {
    // Show loading state
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'שולח...';
    submitBtn.disabled = true;

    // Collect form data
    const formData = {
        teacherName: document.getElementById('teacherName').value,
        responses: []
    };

    // Get all response sections
    const responseSections = document.querySelectorAll('[id^="responseSection"]');

    // Collect data from each response section
    responseSections.forEach((section, index) => {
        const responseNum = index + 1;
        formData.responses.push(collectResponseData(responseNum));
    });

    // Send data to Google Apps Script
    try {
        google.script.run
            .withSuccessHandler(onFormSubmitSuccess)
            .withFailureHandler(onFormSubmitError)
            .saveFormData(formData);
    } catch (error) {
        console.error('Error submitting form:', error);
        onFormSubmitError(error);
    }
}

function onFormSubmitSuccess(result) {
    console.log('Form submitted successfully:', result);

    // Reset submit button
    const submitBtn = document.getElementById('submitBtn');
    const originalText = 'שלח טופס';
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;

    if (result.success) {
        // Hide form and show success message
        document.getElementById('mainForm').classList.add('hidden');
        document.getElementById('successMessage').classList.remove('hidden');
        document.getElementById('errorMessageBottom').classList.add('hidden');
    } else {
        showMessage(result.message || 'שגיאה בשמירת הנתונים');
    }
}

function onFormSubmitError(error) {
    console.error('Error submitting form:', error);

    // Reset submit button
    const submitBtn = document.getElementById('submitBtn');
    const originalText = 'שלח טופס';
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;

    showMessage('שגיאה בשליחת הטופס: ' + (error.message || error));
}

function collectResponseData(responseNum) {
    const responseData = {
        responseType: document.getElementById(`responseType${responseNum}`).value,
        grade: document.getElementById(`grade${responseNum}`).value,
        classes: [],
        students: [],
        day: document.getElementById(`day${responseNum}`).value,
        hour: document.getElementById(`hour${responseNum}`).value
    };

    // Collect selected classes
    document.querySelectorAll(`.class-checkbox[data-response="${responseNum}"]:checked`).forEach(checkbox => {
        responseData.classes.push(checkbox.value);
    });

    // Collect selected students
    const studentsContainer = document.getElementById(`studentsContainer${responseNum}`);
    studentsContainer.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
        responseData.students.push({
            name: checkbox.value,
            class: checkbox.getAttribute('data-class')
        });
    });

    return responseData;
}