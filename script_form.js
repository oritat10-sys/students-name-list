
let formCounter = 1;

function createFormFieldLabel(name, label){
    const labelElement = document.createElement('label');
    labelElement.className = 'input-label';
    labelElement.textContent = label;
    labelElement.htmlFor = name;
    const appendit = `<span class="text-red-500">*</span>`;
    labelElement.innerHTML += appendit;
    
    return labelElement
}

function createFormField(name, type, label, placeholder, options) {
    const fieldContainer = document.createElement('div');
    fieldContainer.className = 'form-control';

    const labelElement = createFormFieldLabel(name, label);
    fieldContainer.appendChild(labelElement);

    let field
    if (type === 'select') {
        field = document.createElement('select');
        field.name = name;
        field.id = name;
        field.className = 'input-field';

        if (placeholder) {
            const placeholderOption = document.createElement('option');
            placeholderOption.value = '';
            placeholderOption.textContent = placeholder;
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            field.appendChild(placeholderOption);
        }

        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            field.appendChild(optionElement);
        });
    }else if (type === 'checkbox-select') {
        field = document.createElement('div');
        field.name = name;
        field.id = name;
        field.className = 'class-checkbox-container';

        options.forEach(option => {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = option;
            checkbox.id = `${name}-${option}`;
            checkbox.className = 'class-checkbox';
            checkbox.setAttribute('data-response', name);

            const label = document.createElement('label');
            label.htmlFor = `${name}-${option}`;
            label.textContent = `כיתה ${option}`;

            const classContainer = document.createElement('div');
            classContainer.className = 'class-container';
            classContainer.appendChild(checkbox);
            classContainer.appendChild(label);

            field.appendChild(classContainer);
        });
    }else if (type === 'search-select') {
        console.log(4);
        field = document.createElement('input');
        field.type = 'text';
        field.name = name;
        field.id = name;
        field.className = 'input-field';
        field.placeholder = placeholder;
    }
    
    fieldContainer.appendChild(field);

    return fieldContainer;
}

function createForm() {
    const num = formCounter;
    formCounter++;
    const form = document.createElement('form');
    form.className = 'form-section';

    const section = document.createElement('div');
    section.className = 'form-section';
    section.innerHTML = `<h3 class="text-xl font-semibold text-sky-700 mb-4 flex items-center">
                        <svg class="w-6 h-6 mr-2 inline-block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                            fill="#0ea5e9">
                            <path
                                d="M9 12h6m-6-4h6m-6 8h3m3-12H8a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2z"
                                stroke="#0ea5e9" stroke-width="2" stroke-linecap="round" fill="none" />
                        </svg>
                        מענה מספר ${num} שאני נותן
                    </h3>`
    form.appendChild(section);

    formFields.forEach(field => {
        const fieldContainer = createFormField(`${field.id}${num}`, field.type, field.label, field.placeholder, field.options);
        form.appendChild(fieldContainer);
    });

    document.getElementById('responseSectionsContainer').appendChild(form);
}
createForm();


document.getElementById('addResponseBtn').addEventListener('click', function () {
    createForm();
});