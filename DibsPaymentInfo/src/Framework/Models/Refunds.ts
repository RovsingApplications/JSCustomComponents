import Item from "./Item";

export default class Refunds {
	refundId: string;
	state: string;
	amount: number;
	lastUpdated: string;
	orderItems: Item[];
}
