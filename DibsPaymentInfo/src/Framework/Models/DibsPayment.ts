import Checkout from "./Checkout";
import Consumer from "./Consumer";
import OrderDetails from "./OrderDetails";
import PaymentDetails from "./PaymentDetails";
import Refunds from "./Refunds";
import Summary from "./Summary";

export default class DibsPayment {
	checkout: Checkout;
	consumer: Consumer;
	created: Date;
	orderDetails: OrderDetails;
	paymentDetails: PaymentDetails;
	paymentId: string;
	refunds: Refunds[];
	summary: Summary;
}




