"use client";

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import {
  CreateOrderData,
  CreateOrderActions,
  OnApproveData,
  OnApproveActions,
} from "@paypal/paypal-js";
import { paypalCheckPayment, setTransactionId } from "@/actions";

interface Props {
  orderId: string;
  amount: number;
}

export const PayPalButton = ({ orderId, amount }: Props) => {
  const [{ isPending }] = usePayPalScriptReducer();

  const rountedAmount = Math.round(amount * 100) / 100;

  if (isPending) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-11 bg-gray-300 rounded"></div>
        <div className="h-11 bg-gray-300 rounded"></div>
      </div>
    );
  }

  const createOrder = async (
    data: CreateOrderData,
    actions: CreateOrderActions
  ): Promise<string> => {
    const transactionId = await actions.order.create({
      intent: "CAPTURE",
      purchase_units: [
        {
          invoice_id: orderId,
          amount: {
            value: rountedAmount.toString(),
            currency_code: "USD",
          },
        },
      ],
    });

    const { ok } = await setTransactionId(orderId, transactionId);
    if (!ok) {
      throw new Error("No se pudo actualizar la orden");
    }

    return transactionId;
  };

  const onApprove = async (
    data: OnApproveData,
    actions: OnApproveActions
  ): Promise<void> => {
    const details = await actions.order?.capture();
    if (!details) return;
    await paypalCheckPayment(details.id ?? "");
  };

  return (
    <div className="relative z-0">
      <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
    </div>
  );
};
