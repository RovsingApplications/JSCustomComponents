import { FTPType } from "./FTPType";

export default interface IDeliveryProfile {
	url: string;
	port: number;
	connectionMode: string;
	protocol: FTPType;
	userName: string;
	Password: string;
	folderTemplate: string;
	fileTemplate: string;
	email: string;
}