// validation.ts
namespace Validation {
  export interface StringValidator {
    isValid(s: string): boolean;
  }

  export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  export class EmailValidator implements StringValidator {
    isValid(s: string): boolean {
      return emailRegex.test(s);
    }
  }
}

const myValidator = new Validation.EmailValidator();
console.log(myValidator.isValid("test@example.com")); // true
