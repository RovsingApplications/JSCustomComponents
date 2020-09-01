import CardDetails from "./CardDetails";
import InvoiceDetails from "./InvoiceDetails";

export default class PaymentDetails {
	cardDetails: CardDetails;
	invoiceDetails: InvoiceDetails;
	paymentMethod: string;
	paymentType: string;
}


