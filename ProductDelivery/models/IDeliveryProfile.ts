import { FTPType } from "./FTPType";

export default interface IDeliveryProfile
{
		customerApiKey: string;
		url: string;
		port: number;
		type: FTPType;
		FileTemplate: string;
		PathTemplate: string;
		Username: string;
		Password: string;
}