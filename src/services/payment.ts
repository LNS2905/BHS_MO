import { Payment } from "zmp-sdk";
import appConfig from "../../app-config.json";
import { getConfig } from "../components/config-provider";

// export const pay = (amount: number, description?: string) =>
//   new Promise((resolve, reject) => {
//     Payment.createOrder({
//       desc: description ?? `Thanh toán cho ${appConfig.app.title}`,
//       item: [],
//       amount:
//         amount + Number(getConfig((config) => config.template.shippingFee)),
//       success: (data) => {
//         console.log("success: ", data);
//         resolve(data);
//       },
//       fail: (err) => {
//         console.log("err: ", err);
//         reject(err);
//       },
//     });
//   });

export const pay = (amount: number, description?: string) =>
  new Promise((resolve, reject) => {
    Payment.createOrder({
      desc: description ?? `Thanh toán cho ${appConfig.app.title}`,
      item: [],
      amount:
        amount + Number(getConfig((config) => config.template.shippingFee)),
      success: (data) => {
        console.log("success: ", data);
        resolve(data.orderId); // Return only the orderId
      },
      fail: (err) => {
        console.log("err: ", err);
        reject(err);
      },
    });
  });

export const checkTransactionStatus = (orderId: string) =>
  new Promise((resolve, reject) => {
    Payment.checkTransaction({
      data: { orderId },
      success: (data) => {
        console.log("Transaction status:", data);
        resolve(data);
      },
      fail: (err) => {
        console.error("Failed to check transaction:", err);
        reject(err);
      },
    });
  });

const paymentService = { pay, checkTransactionStatus };
export default paymentService;