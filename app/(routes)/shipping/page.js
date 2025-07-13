import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function Shipping() {
  return (
    <div className="px-6 py-8 bg-gray-100 text-darkgreen-900 [&>h1]:mb-8 [&>p]:my-2">
      <h1 className="px-20 my-4">SHIPMENT POLICY</h1>
      <ul className="mb-6 ps-24 group [&>li]:py-3 [&>li]:list-disc">
        <li>
          For purchases from Europe over 150 euros shipping costs are free.
        </li>
        <li>
          For purchases from Usa/ Canada over 200 euros shipping costs are free.
        </li>
        <li>
          For purchases from rest of the World over 250 euros shipping costs are
          free.
        </li>
      </ul>
      <Table className="flex flex-col items-center justify-center">
        <TableCaption className="text-3xl ">Shipping Table</TableCaption>
        <TableHeader>
          <TableRow className="w-[100px] text-xl">
            <TableHead>Destination</TableHead>
            <TableHead>Carrier</TableHead>
            <TableHead>Charges</TableHead>
            <TableHead>Delivery time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">
              Greece for purchases up to 69,99€{" "}
            </TableCell>
            <TableCell>ACS</TableCell>
            <TableCell>3,00€</TableCell>
            <TableCell className="text-right">1-3 working days</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">
              Europe for purchases up to 149,99€
            </TableCell>
            <TableCell>DHL</TableCell>
            <TableCell>20,00 €</TableCell>
            <TableCell className="text-right">2-3 working days</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">
              USA, Canada, Mexico & Middle East for purchases up to 199,99€
            </TableCell>
            <TableCell>DHL</TableCell>
            <TableCell>25,00 €</TableCell>
            <TableCell className="text-right">3-4 working days</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">
              Rest of the World for purchases up to 249,99€
            </TableCell>
            <TableCell>DHL</TableCell>
            <TableCell>30,00 €</TableCell>
            <TableCell className="text-right">4-6 working days</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <p>* Estee Gold Ltd does not deliver to P.O. boxes.</p>
      <p>
        Deliveries outside the EU are usually subject to customs clearance and
        import duties in the country of receipt and are the sole responsibility
        of the consignee.
      </p>
      <p>
        The estimated delivery time is indicative and counts from the day of
        shipment. Saturdays, Sundays and official Turkey holidays are excluded
        from working days. “ Estee Gold Ltd” is not responsible for delays in
        shipments caused by weather conditions, international customs issues or
        any other circumstances beyond its control.
      </p>
      <p>
        When your order is sent, you receive an e-mail, with the bill of landing
        number and a link to monitor the status of your shipment on the site of
        the cooperating courier. Orders are delivered from 9:00 to 17:00. Please
        make sure someone is available to pick up and sign for your delivery. In
        case someone is not available for delivery, the courier will leave a
        message with a contact phone number where you will need to call to
        arrange your delivery again. Delivery returns are returned to us after
        one week. In this case, the reshipment is charged with shipping costs.
      </p>
      <p>
        In case the packaging of the order has been visibly damaged due to poor
        transport service please do not accept the shipment. Otherwise you are
        deemed to have accepted the packaging and contents as is. If you don’t
        accept the package it is mandatory to take photos of the package and
        contact us as soon as possible via email: info@technimashop.gr.
      </p>
      <h1>GIFTS</h1>
      <p>
        During checkout, you have the opportunity to state if you want your
        order or some products of your order to be prepared as a gift. This
        includes a gift box and a gift change card with return instructions in
        case the recipient wishes to exchange the gift for another product. You
        are also given the opportunity to write a personal message on a
        handwritten card enclosed in your gift. The order receipt is placed on
        the outside of the gift box.
      </p>
      <p></p>You can also choose to send your gift directly to the recipient. In
      this case, please fill in the recipient’s details in the Shipping
      Information upon payment and you will be notified via email when the
      recipient receives your gift. The gift receipt will be sent exclusively to
      you via email.
      <h1>RETURNS POLICY</h1>
      <p>
        If for any reason you are not satisfied with your purchase, the products
        can be returned within 10 days from the date of delivery of the order.
        Any shipping costs arising from the ordering process are non-refundable.
        Return costs are the responsibility of the customer and are
        non-refundable. In order for the return to be accepted, all products
        must be in excellent condition, with their labels and original
        packaging. A necessary condition is that they be returned together with
        all the documents that accompany the products.
      </p>
      <p>
        Returns are not accepted on custom made products and for products marked
        “NON RETURNABLE” in their description. Also, returns on discounted
        products are not accepted.
      </p>
      <p>
        “Aikaterini Makrygianni” reserves the right to refuse returns that are
        not authorized and / or are not sent in accordance with the terms of
        return that are listed in detail online and in the instructions that
        accompany each order. In case of unapproved or unacceptable returns, the
        products will be returned to the shipping address of the original order
        at the recipient’s expense. If you do not wish to receive the products
        in the condition in which they were returned to “Aikaterini
        Makrygianni”, “Aikaterini Makrygianni” has the right to keep the
        products and to withhold the amount already received.
      </p>
      <h1>RETURN OPTIONS:</h1>
      <p>
        Exchange of Item: The products can be exchanged with any available
        different size or type, of equal or greater value, and any difference in
        price will be charged. You can contact us by mail at
        info@techmimashop.com or by phone at 2821046069 Monday to Friday 9.00 am
        – 14.00 pm, and we will be happy to help you with the change of item.
      </p>
      <p>
        Issuance of Credit Balance: The credit balance is credited to your
        account and can be used within 12 months from the date of return.
      </p>
      <p>
        Refund: Refunds are made within 5 working days from the time the
        returned items are received and checked. Refunds are only made to the
        original credit card, Paypal account or bank account used to pay for the
        order. Processing time varies depending on the bank and the type of
        credit card. “Aikaterini Makrygianni is not responsible for exchange
        rate fluctuations that occur when returning money on a credit or debit
        card in a currency other than the euro. Bank charges are non-refundable.
      </p>
      <h1>RETURN INSTRUCTIONS</h1>
      <p>
        To return your purchase, just follow the instructions below and make
        sure we receive your return within 10 days of receiving your order.
      </p>
      <p>
        Send an email to info@technimashop.com or call us at 2821046069 Monday
        to Friday 9.00 am – 14.00 pm.
      </p>
      <p>
        Within the next business day, you will receive an email confirming your
        request as well as instructions on how to arrange your return shipment.
        For the return of one or more products to “Aikaterini Makrygianni” you
        must always use a shipping method with a tracking service. The safety of
        the product until the completion of the return is the responsibility of
        the customer. In case you are interested in completing the return with
        the courier companies we work with (Acs, Dhl). we will send you a
        prepaid bill of lading, the cost of which will be deducted from the
        value of the product you want to return or exchange.
      </p>
      <h2>Return costs</h2>
      <p>
        Destination Carrier* Return costs Non sales items Return costs Sales
        items Greece ACS 5€ 3€ Europe (EE) DHL 25,00 € 15€ Europe (except ΕΕ)
        DHL 35,00 € Not returned ΗΠΑ, Canada, Mexico DHL 35,00 € Not returned
        Υπόλοιπος κόσμος DHL 40,00 € Not returned
      </p>
      <p>
        Once we receive and accept your returned goods, you will receive an
        email confirming your exchange, credit balance or refund.
      </p>
      <h3>Gift Returns</h3>
      <p>
        If you have received a gift from “Aikaterini Makrygianni” and you want
        to return it, just follow the instructions included in your gift. Note
        that gifts can only be exchanged for items of equal or greater value,
        and any difference in price will be charged. Credit notes and refunds do
        not apply.
      </p>
    </div>
  );
}

export default Shipping;
