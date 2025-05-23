import { OrderBook as OrderBookType } from "@/utils/types";
import { formatPrice } from "@/utils/utils";

interface OrderBookProps {
  orderBook: OrderBookType;
}

export default function OrderBook({ orderBook }: OrderBookProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-xl font-bold mb-4 text-red-500">Sell Orders</h2>
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Cumulative
                  </th>
                </tr>
              </thead>
            </table>
            <div className="max-h-[469px] overflow-y-auto">
              <table className="w-full">
                <tbody className="divide-y divide-gray-700">
                  {orderBook.sell_orders.map((order, index) => (
                    <tr key={`sell-${index}`}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-white">
                        {formatPrice(order.price)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">
                        {order.quantity}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">
                        {order.cumulative_quantity}
                      </td>
                    </tr>
                  ))}
                  {orderBook.sell_orders.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-4 text-center text-gray-400"
                      >
                        No sell orders available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4 text-green-500">Buy Orders</h2>
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Cumulative
                  </th>
                </tr>
              </thead>
            </table>
            <div className="max-h-[469px] overflow-y-auto">
              <table className="w-full">
                <tbody className="divide-y divide-gray-700">
                  {orderBook.buy_orders.map((order, index) => (
                    <tr key={`buy-${index}`}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-white">
                        {formatPrice(order.price)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">
                        {order.quantity}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">
                        {order.cumulative_quantity}
                      </td>
                    </tr>
                  ))}
                  {orderBook.buy_orders.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-4 text-center text-gray-400"
                      >
                        No buy orders available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
