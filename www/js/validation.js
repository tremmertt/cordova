function validation() {


    this.checkEmpty = function (value, selectorError, name) {
        if (value.trim() == '') {
            document.querySelector(selectorError).innerHTML += name + ' cannot be blank!!!<br>';
            return false;
        }

        document.querySelector(selectorError).innerHTML = '';
        return true;
    }

    this.checkCharacter = function (value, selectorError, name) {
        var regexLetter = /^[A-Z a-z]+$/;

        if (regexLetter.test(value)) {
            document.querySelector(selectorError).innerHTML = '';

            return true;
        }
        document.querySelector(selectorError).innerHTML += name + ' is not allowed number!!!<br>';

        return false;
    }

    this.checkNumber = function (value, selectorError, name) {

        var regexNumber = /^[0-9]+$/;

        if (regexNumber.test(value)) {
            document.querySelector(selectorError).innerHTML = '';

            return true;
        }
        else {
            document.querySelector(selectorError).innerHTML = name + ' must be number!!!<br>';

            return false;
        }
    }

    this.checkLength = function (value, selectorError, minLength, maxLength, name) {
        if (value.trim().length < minLength || value.trim().length > maxLength) {
            //`${name} từ ${minLength} - ${maxLength} ký tự.`
            //name + ' từ ' + minLength + ' - '+ maxLength + ' ký tự.'
            document.querySelector(selectorError).innerHTML += `${name} must be in range ${minLength} to ${maxLength} characters.<br>`;
            return false;
        }
        document.querySelector(selectorError).innerHTML = '';
        return true;
    }

    this.CheckMinMax = function (value, selectorError, minValue, maxValue, name) {
        if (value < minValue || value > maxValue) {
            document.querySelector(selectorError).innerHTML = `${name} must be in range ${minValue.toLocaleString()} VNĐ to ${maxValue.toLocaleString()}VNĐ. <br>`;
            return false;
        }
        document.querySelector(selectorError).innerHTML = '';
        return true;
    }
}