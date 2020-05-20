export default class CaseConverter {
    data: any;
    constructor(data) {
        this.data = data;
    }
    camel() {
        for (let prop in this.data) {
            if (this.data.hasOwnProperty(prop)) {
                const camelcaseProperty = prop.substring(0, 1).toLowerCase() + prop.substring(1);
                const arrayConverter = (array) => {
                    const tempArray = [];
                    for (let index = 0; index < array.length; index++) {
                        if (array[index] === null || array[index] === undefined) {
                            continue;
                        }
                        const elementType = typeof array[index];
                        if (elementType === 'string' || elementType === 'number') {
                            tempArray.push(array[index]);
                            continue;
                        }
                        if (Array.isArray(array[index])) {
                            tempArray.push(arrayConverter(array[index]));
                            continue;
                        }
                        if (typeof array[index] === 'object') {
                            tempArray.push(new CaseConverter(array[index]).camel());
                            continue;
                        }
                    }
                    return tempArray;
                };
                if (Array.isArray(this.data[prop])) {
                    this.data[camelcaseProperty] = arrayConverter(this.data[prop]);
                    delete this.data[prop];
                    continue;
                }
                this.data[camelcaseProperty] = this.data[prop];
                delete this.data[prop];
            }
        }
        return this.data;
    }
}