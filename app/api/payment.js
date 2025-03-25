import Iyzipay from "iyzipay";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const iyzipay = new Iyzipay({
    apiKey: process.env.IYZIPAY_API_KEY,
    secretKey: process.env.IYZIPAY_SECRET_KEY,
    uri: "https://sandbox-api.iyzipay.com", // Test ortamı, canlıda değiştir
  });

  const paymentRequest = {
    locale: Iyzipay.LOCALE.TR,
    conversationId: "123456789",
    price: "100.0",
    paidPrice: "100.0",
    currency: Iyzipay.CURRENCY.TRY,
    installment: 1,
    paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
    paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
    buyer: {
      id: "BY789",
      name: "Müşteri",
      surname: "Soyadi",
      gsmNumber: "+905350000000",
      email: "test@buyer.com",
      identityNumber: "74300864791",
      lastLoginDate: "2023-01-01 12:00:00",
      registrationDate: "2022-01-01 12:00:00",
      registrationAddress: "İstanbul",
      ip: "85.34.78.112",
      city: "İstanbul",
      country: "Türkiye",
    },
    shippingAddress: {
      contactName: "Müşteri Adi",
      city: "İstanbul",
      country: "Türkiye",
      address: "Test adresi",
    },
    billingAddress: {
      contactName: "Müşteri Adi",
      city: "İstanbul",
      country: "Türkiye",
      address: "Test adresi",
    },
    basketItems: [
      {
        id: "BI101",
        name: "Bileklik",
        category1: "Aksesuar",
        price: "100.0",
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
      },
    ],
  };

  iyzipay.payment.create(paymentRequest, function (err, result) {
    if (err) {
      console.error("Payment Error:", err);
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(result);
  });
}
