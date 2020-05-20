export class StringUtil {

    constructor() {

    }

    public static StringFormat(str: string, ...args: string[]) {
        return str.replace(/{(\d+)}/g, (match, index) => args[index] || '')
    }
}