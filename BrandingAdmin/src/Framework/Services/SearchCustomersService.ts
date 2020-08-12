import MakeRequest from "../Utilities/MakeRequest";
import Globals from "../Globals/Globals";
import { AdminEidHeaderName, AdminEmailHeaderName } from "../Constants/Constants";

export default class SearchCustomersService {

	searchById(customerId: number) {
		return new MakeRequest(
			`${Globals.customersBaseURL}api/customer/getbyid/${customerId}`,
			'get', { [AdminEidHeaderName]: Globals.adminEid, [AdminEmailHeaderName]: Globals.adminEmail }
		).send();
	}

	searchByName(nameSearchText: string, pageNumber = 1, pageSize = 5) {
		return new MakeRequest(
			`${Globals.customersBaseURL}api/customer/searchbyname/${nameSearchText}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
			'get', { [AdminEidHeaderName]: Globals.adminEid, [AdminEmailHeaderName]: Globals.adminEmail }
		).send();
	}

}
