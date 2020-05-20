import IDynamicRadioButton from "./IDynamicRadioButton";
import IDropdownListItem from "./IDropdownListItem";
import IOptionsItem from "./IOptionsItem";

export default interface IFieldModel {
    fieldName: string;
    title: string;
    description: string;
    mandatory: boolean;
    fieldId: number;
    dependentOn: number;
    dependentValue: string;
    dynamicFormField: string;
    type: string;
    value: string;
    radioButtons: IDynamicRadioButton[];
    needComparison: number;
    comparisonText: string;
    customErrorMessage: string;
    dropdownListDefaultText: IDropdownListItem;
    options: IOptionsItem[];
}