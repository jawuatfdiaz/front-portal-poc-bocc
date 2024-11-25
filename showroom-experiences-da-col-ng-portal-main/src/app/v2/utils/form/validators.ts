import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';

export function uniqueKeyValidator(parameters: AbstractControl[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const currentKey = control.value

        if (!currentKey) {
            return null
        }

        const otherKeys = parameters
            .filter(param => param !== control.parent && !!control.parent)
            .map(param => param.get('key')?.value?.toUpperCase())

        const isDuplicate = otherKeys.includes(currentKey.toUpperCase())

        return isDuplicate ? { uniqueKey: { value: currentKey } } : null
    }
}

export function checkInvalidCharactersField(component: any, field: string): AsyncValidatorFn {
    return function (control: AbstractControl): Promise<ValidationErrors | null> {
        return new Promise((resolve: any, reject: any) => {

            const value = component?.firstFormGroup?.controls[field]?.value;
            // const pattern = /^\s*(INT|EXT|MKT)-\d{6}-\d{5}\s*$/
            const pattern = /^\$?\d+(\.\d{1,2})?$/

            if (pattern.test(value)) {
                resolve(null)
            } else {
                resolve({ invalidFormat: true });
            }
        })
    }
}

export function checkInvalidFormatField(component: any, field: string): AsyncValidatorFn {
    return function (control: AbstractControl): Promise<ValidationErrors | null> {
        return new Promise((resolve: any, reject: any) => {

            const value = component?.deploymentForm?.controls[field]?.value;
            const pattern = /^\s*(INT|EXT|MKT)-\d{6}-\d{5}\s*$/

            if (pattern.test(value)) {
                resolve(null)
            } else {
                resolve({ invalidFormat: true });
            }
        })
    }
}
