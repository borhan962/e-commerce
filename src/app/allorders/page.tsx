"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  CheckCircle2,
  Package,
  ShoppingBag,
  ArrowRight,
  Truck,
  ShieldCheck,
  Calendar,
  Banknote,
  Clock,
} from "lucide-react";
import { getUserOrders } from "@/services/allOrders.services";

interface IOrder {
  _id: string;
  totalOrderPrice: number;
  paymentMethodType: string;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
  cartItems: Array<{
    _id: string;
    count: number;
    price: number;
    product: {
      title: string;
      imageCover: string;
    };
  }>;
}

export default function AllOrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUserOrders() {
      if (!session?.accessToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await getUserOrders(session.accessToken);
        if (res.ok && res.data) {
          setOrders(res.data);
        }
      } catch (err) {
        console.error("Could not fetch user orders:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserOrders();
  }, [session?.accessToken]);

  return (
    <div className="bg-[#F9FAFB] min-h-screen py-12 sm:py-16">
      <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Banner */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 sm:p-10 shadow-xs text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 text-[#10B981] flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">
            Order Confirmed!
          </h1>
          <p className="text-sm text-[#6B7280] mt-2 max-w-md mx-auto leading-relaxed">
            Thank you for shopping with us,{" "}
            <strong className="text-[#111827]">
              {session?.user?.name || "Customer"}
            </strong>
            ! Your order has been placed and is currently being prepared for
            dispatch.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            <Link
              href="/Products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-sm shadow-xs transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] text-[#111827] font-semibold text-sm transition-colors"
            >
              <span>Back to Home</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Orders History Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <Package className="w-5 h-5 text-[#4F46E5]" />
              <h2 className="text-xl font-bold text-[#111827]">Your Orders</h2>
            </div>
            {orders.length > 0 && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50 text-[#4F46E5]">
                {orders.length} {orders.length === 1 ? "order" : "orders"}
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-12 text-center text-sm text-[#6B7280]">
              Loading your recent orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-10 text-center">
              <Truck className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-[#111827]">
                Your latest order is being processed!
              </p>
              <p className="text-xs text-[#6B7280] mt-1 max-w-sm mx-auto">
                Your delivery receipt and tracking information will be updated
                as soon as the warehouse packs your items.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-2xs hover:border-[#D1D5DB] transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F3F4F6]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#111827]">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            order.isPaid
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {order.isPaid ? "Paid" : "Cash on Delivery"}
                        </span>
                      </div>
                      <div className="text-xs text-[#9CA3AF] flex items-center gap-1.5 mt-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-[#6B7280]">Total Amount</div>
                      <div className="text-lg font-bold text-[#4F46E5]">
                        ${order.totalOrderPrice}
                      </div>
                    </div>
                  </div>

                  {/* Order items preview */}
                  <div className="pt-4 flex flex-wrap gap-4 items-center">
                    {order.cartItems?.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center gap-2.5 text-xs text-[#4B5563]"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]"></span>
                        <span className="font-medium text-[#111827]">
                          {item.product?.title || "Product"}
                        </span>
                        <span className="text-gray-400">×{item.count}</span>
                        <span className="font-semibold text-[#111827]">
                          ${item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

