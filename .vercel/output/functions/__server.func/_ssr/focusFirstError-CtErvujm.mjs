const focusFirstError = (formSelector, errorMap) => {
    if (!errorMap) {
        return;
    }
    const invalidInputs = [...document.querySelectorAll(`${formSelector} [aria-invalid="true"]`)];
    let firstInvalidInput;
    for (const input of invalidInputs) {
        if (errorMap[input.name]) {
            firstInvalidInput = input;
            break;
        }
    }
    firstInvalidInput?.focus();
};
export { focusFirstError as f };
