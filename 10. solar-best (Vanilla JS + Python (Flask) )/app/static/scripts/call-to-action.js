const formBody = document.getElementById('formBody');
const requiredFields = formBody.querySelectorAll('.required-input, .required-select');

function resetField(field) {
    field.classList.remove('invalid');
}

function checkbox() {
    document.getElementById('checkbox_label').classList.remove('invalid')
}

requiredFields.forEach(field => {
    field.addEventListener('focus', () => resetField(field));
});

async function sendData() {
    const formData = new FormData(formBody);
    let isValid = true;

    // requiredFields.forEach(field => {
    //     if (!formData.get(field.name)?.trim()) {
    //         isValid = false;
    //         field.classList.add('invalid');
    //     }
    // });

    const checkbox = document.getElementById('accountOwnerDisabled');
    if (!checkbox.checked) {
        // checkbox.classList.remove('default');
        document.getElementById('checkbox_label').classList.add('invalid')
        // checkbox.classList.add('inactive');
        isValid = false;
    }

    if (isValid) {
        try {
            document.getElementById("submitButton").textContent = "Ihre Anfrage wurde weitergeleitet";
            document.getElementById("submitButton").disabled = true;
            const response = await fetch('/send-email/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(Object.fromEntries(formData.entries()))
            });
            const result = await response.json();
            document.getElementById("popup").style.display = 'block';
            console.log(result);
        } catch (e) {
            console.error(`[ERROR]: `, e);
        }
    }
}

formBody.addEventListener('submit', async e => {
    e.preventDefault();
    await sendData();
});

document.addEventListener('DOMContentLoaded', function () {
    const fields = {
        'sex': {empty: 'Anrede', filled: 'Anrede'},
        'Vorname*': {empty: 'Vorname', filled: 'Vorname'},
        'Name*': {empty: 'Nachname', filled: 'Nachname'},
        'Strasse und Hausnr.*': {empty: 'Strasse und Hausnr.', filled: 'Strasse und Hausnr.'},
        'PLZ*': {empty: 'Postleitzahl', filled: 'PLZ'},
        'Ort': {empty: 'Ort', filled: 'Ort'},
        'Mail': {empty: 'E-Mail', filled: 'E-Mail'},
        'Telefonnummer*': {empty: 'Telefonnummer', filled: 'Telefonnummer'},
        'type_real_estate': {empty: 'Immobilienart', filled: 'Immobilienart'},
        'building_type': {empty: 'Gebäudetyp', filled: 'Gebäudetyp'},
        'how_do_you_heat': {empty: 'Heizart', filled: 'Wie heizen Sie?'},
        'consumption': {empty: 'Strom-Jahresverbrauch', filled: 'Jahresverbrauch an Strom (kWh)'},
        'start_construction': {empty: 'Baubeginn', filled: 'Baubeginn'},
        'roof_shape': {empty: 'Dachform', filled: 'Welche Dachform haben Sie?'},
        'description': {empty: 'Geben Sie ggf. eine Nachricht ein', filled: 'Ihre Nachricht'}
    };

    Object.keys(fields).forEach(function (id) {
        const inputField = document.getElementById(id);
        const label = document.querySelector('label[for="' + id + '"]');

        inputField.addEventListener('focus', function () {
            if (!inputField.value) {
                label.textContent = fields[id].filled;
            }
        });

        inputField.addEventListener('blur', function () {
            if (!inputField.value) {
                label.textContent = fields[id].empty;
            }
        });

        if (inputField.value) {
            label.textContent = fields[id].filled;
        } else {
            label.textContent = fields[id].empty;
        }
    });
});


document.addEventListener('DOMContentLoaded', function () {
    const typeRealEstateSelect = document.getElementById('type_real_estate');
    const buildingTypeSelect = document.getElementById('building_type');

    const gewerblichOptions = [
        {text: 'Wohnanlage', value: 'Wohnanlage'},
        {text: 'Gewerbebetrieb', value: 'Gewerbebetrieb'},
        {text: 'Landwirtschaftlicher Betrieb', value: 'Landwirtschaftlicher Betrieb'},
        {text: 'Sonstiges', value: 'Sonstiges'}
    ];

    const privatOptions = [
        {text: 'Einfamilienhaus', value: 'Einfamilienhaus'},
        {text: 'Zweifamilienhaus', value: 'Zweifamilienhaus'},
        {text: 'Mehrfamilienhaus', value: 'Mehrfamilienhaus'},
        {text: 'Sonstiges', value: 'Sonstiges'}
    ];

    function updateBuildingTypeOptions(options) {
        buildingTypeSelect.innerHTML = '<option value="" disabled selected></option>';

        options.forEach(function (option) {
            const newOption = document.createElement('option');
            newOption.text = option.text;
            newOption.value = option.value;
            buildingTypeSelect.appendChild(newOption);
        });
    }

    typeRealEstateSelect.addEventListener('change', function () {
        const selectedValue = typeRealEstateSelect.value;

        if (selectedValue === 'Gewerblich') {
            updateBuildingTypeOptions(gewerblichOptions);
        } else if (selectedValue === 'Privat') {
            updateBuildingTypeOptions(privatOptions);
        }
    });
});



