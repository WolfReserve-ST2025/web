import { useEffect, useState } from "react";
import { Food } from "../food/Foods";
import axios from '../../api/axios';
import { useCurrentUser, User } from "../auth/useCurrentUser";

export type OrderStatus = 'draft' | 'pending' | 'confirmed' | 'rejected';

export interface Order {
  _id: string;
  status: OrderStatus;
  foods: Food[];
  user: User,
  createdAt: string;
  updatedAt: string;
}


const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user, loading } = useCurrentUser();


  useEffect(() => {

    const fetchOrders = async () => {
      try {
        const response = await axios.get('/orders');
        console.log(response.data)
        setOrders(response.data);
      } catch {
        setError('Failed to fetch orders.')
      }
    }

    const fetchUserOrders = async () => {
      try {
        const response = await axios.get('/orders/user');
        setUserOrders(response.data);
        console.log(response.data)
      } catch {
        setError('Failed to fetch user orders.')
      }
    }

    if (user?.role === "Chef") {
      fetchOrders();
    }
    if (user?.role === "User") {
      fetchUserOrders();
    }
  }, [user])


  const handleConfirm = async (order_id: string) => {
      const response = await axios.put(`/orders/${order_id}`, { status: 'confirmed' });
      setOrders(orders.map((o) => o._id === order_id ? response.data.order : o))
  };

  const handleReject = async (order_id: string) => {
  const response = await axios.put(`/orders/${order_id}`, { status: 'rejected' });
      setOrders(orders.map((o) => o._id === order_id ? response.data.order : o))
  };

  if (loading) return <div className="text-center mt-10 text-lg">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">

      {error && <div className="text-red-600 mb-4">{error}</div>}


      {user?.role === "Chef" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Vsa naročila</h2>
          {orders.length === 0 ? (
            <div className="text-gray-500 mb-8">Ni naročil.</div>
          ) : (
            <ul className="space-y-8 mb-10">
              {orders.map(order => (
                <li
                  key={order._id}
                  className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 flex flex-col md:flex-row md:justify-between md:items-center transition hover:shadow-2xl"
                >
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <span className="font-bold text-xl text-blue-900">
                        Naročilo <span className="text-gray-400">#{order._id.slice(-5)}</span>
                      </span>
                      <span className="text-sm text-gray-400 mt-2 sm:mt-0">
                        {new Date(order.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="font-semibold">Status:</span>
                      <span
                        className={
                          "inline-block px-3 py-1 rounded-full text-xs font-bold " +
                          (order.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : order.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : order.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-500")
                        }
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Uporabnik:</span>{" "}
                      <span className="text-gray-700">{order.user.email}</span>
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Jedilnik:</span>
                      <div className="overflow-x-auto mt-2">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Ime</th>
                              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Tip</th>
                              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Količina</th>
                              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">Cena</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {order.foods.map(food => (
                              <tr key={food._id} className="hover:bg-gray-50 transition">
                                <td className="px-3 py-2 text-gray-700">{food.name}</td>
                                <td className="px-3 py-2 text-gray-700">{food.type}</td>
                                <td className="px-3 py-2 text-gray-700">{food.type}</td>
                                <td className="px-3 py-2 text-gray-700 font-bold text-right">${food.price}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    {order.status === "pending" && (
                      <div className="flex justify-end gap-3 mt-6">
                        <button
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold shadow transition"
                          onClick={() => handleConfirm(order._id)}
                        >
                          ✓
                        </button>
                        <button
                          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold shadow transition"
                          onClick={() => handleReject(order._id)}
                        >
                          X
                        </button>
                      </div>
                    )}
                  </div>

                </li>
              ))}
            </ul>
          )}
        </div>
      )}


      {user?.role === "User" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-green-700">Moja naročila</h2>
          {userOrders.length === 0 ? (
            <div className="text-gray-500">Nimaš še nobenega naročila.</div>
          ) : (
            <ul className="space-y-6">
              {userOrders.map(order => (
                <li key={order._id} className="bg-white rounded-lg shadow p-6 border border-green-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-lg text-green-900">Naročilo #{order._id.slice(-5)}</span>
                    <span className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Status:</span>{" "}
                    <span className={
                      order.status === "confirmed"
                        ? "text-green-700 font-bold"
                        : order.status === "rejected"
                          ? "text-red-700 font-bold"
                          : order.status === "pending"
                            ? "text-yellow-600 font-bold"
                            : "text-gray-500"
                    }>
                      {order.status}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">Jedilnik:</span>
                    <ul className="ml-4 list-disc">
                      {order.foods.map(food => (
                        <li key={food._id}>
                          {food.name} <span className="text-blue-700 font-bold">${food.price}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;
