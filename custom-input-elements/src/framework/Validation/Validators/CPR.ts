import IValidation from '../IValidator.interface';

export default class CprValidator implements IValidation {
    isSatisfiedBy(input: string, allowEmpty: boolean = true): boolean {
        return this.checkCpr(input, allowEmpty);
    }
    private modulus11Multiply(value: number, index: number): number {
        const control: number[] = [4, 3, 2, 7, 6, 5, 4, 3, 2, 1];
        return control[index] * value;
    }

    private modulus11Exceptions(input: string): boolean {
        const exceptionDates: Date[] = [
            1960,
            1964,
            1965,
            1966,
            1969,
            1970,
            1980,
            1982,
            1984,
            1985,
            1986,
            1987,
            1988,
            1989,
            1990,
        ].map(x => new Date(x, 0, 1)); // months are 0-indexed

        const cprDate: Date = this.getCprDate(input);

        return exceptionDates.some(x => x.getDate() === cprDate.getDate());
    }

    private checkCprDate(input: string): boolean {
        let year: number = +input.substr(4, 2) + 2000;
        year -= year > new Date().getFullYear() ? 100 : 0; // is 20xx or 19xx
        const month: number = +input.substr(2, 2) - 1;
        const day: number = +input.substr(0, 2);
        const date: Date = new Date(year, month, day);
        return (
            date.getFullYear() === year &&
            date.getMonth() === month &&
            date.getDate() === day
        );
    }

    private getCprDate(input: string): Date {
        let year: number = +input.substr(4, 2) + 2000;
        year -= year > new Date().getFullYear() ? 100 : 0; // is 20xx or 19xx
        const month: number = +input.substr(2, 2) - 1;
        const day: number = +input.substr(0, 2);
        return new Date(year, month, day);
    }

    private checkCpr(input: string, allowEmpty: boolean = true): boolean {
        if (!input) {
            return allowEmpty;
        }
        const cprnr: string = input.replace(' ', '').replace('-', '');
        if (!cprnr.match(/^\d{10}$/)) {
            return false;
        }
        if (!this.checkCprDate(cprnr)) {
            return false;
        }
        if (this.modulus11Exceptions(cprnr)) {
            return true;
        }

        let output: number = 0;
        for (let i: number = 0; i < 10; i++) {
            output += this.modulus11Multiply(
                parseInt(cprnr.substr(i, 1), 10),
                i,
            );
        }

        return output % 11 === 0; // hvis output går op i 11, er det et gyldigt cpr.
    }
}
