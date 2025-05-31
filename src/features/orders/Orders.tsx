import { useEffect, useState } from "react";
import { Food } from "../food/Foods";
import axios from '../../api/axios';
import { useCurrentUser, User, getUserFromToken } from "../auth/useCurrentUser";
import { showNotification } from "../../utils/notifications";
import VoiceControl from '../../components/VoiceControl/VoiceControl';
import { indexedDBService } from "../../utils/indexDB";
import { useOnline } from "../../hooks/useOnline/useOnline";

export type OrderStatus = 'draft' | 'pending' | 'confirmed' | 'rejected';

export interface OrderFood {
  food: Food;
  quantity: number;
}

export interface Order {
  _id: string;
  status: OrderStatus;
  foods: OrderFood[];
  user: User,
  createdAt: string;
  updatedAt: string;
}


const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null)
  const { loading } = useCurrentUser();
  const [showFilters, setShowFilters] = useState(false)
  const [activeFilter, setActiveFilter] = useState<string | null>("pending");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const isOnline = useOnline();
  const user = getUserFromToken();
  const userRole = user?.role;

  const filters = [
    { label: "pending", value: "pending" },
    { label: "confirmed", value: "confirmed" },
    { label: "rejected", value: "rejected" }
  ];



  useEffect(() => {
    if (user?.role === "Chef") {
      fetchOrders();
    }
    if (user?.role === "User") {
      fetchUserOrders();
    }
  }, [isOnline])

  const fetchOrders = async () => {
    try {
      if (!isOnline) {
        const cachedOrders = await indexedDBService.getOrders();
        setOrders(cachedOrders);
        
        if (cachedOrders.length === 0) {
          setError('No cached orders available. Please connect to the internet.');
        } else {
          setError(null);
        }
      } else {
        console.log('Loading orders from API (online mode)');
        const response = await axios.get('/orders');
        setOrders(response.data);
        
        // Save to IndexedDB for offline use
        await indexedDBService.saveOrders(response.data);
        setError(null);
      }
    } catch (apiError) {
      console.error('Error loading orders:', apiError);
      if (!isOnline) {
        setError('Failed to load cached orders.');
      } else {
        setError('Failed to fetch orders.');
      }
    }
  }

  const fetchUserOrders = async () => {
    try {
      if (!isOnline) {
        const cachedUserOrders = await indexedDBService.getUserOrders();
        setUserOrders(cachedUserOrders);
        
        if (cachedUserOrders.length === 0) {
          setError('No cached user orders available. Please connect to the internet.');
        } else {
          setError(null);
        }
      } else {
        const response = await axios.get('/orders/user');
        setUserOrders(response.data);
        
        // Save to IndexedDB for offline use
        await indexedDBService.saveUserOrders(response.data);
        setError(null);
      }
    } catch (apiError) {
      console.error('Error loading user orders:', apiError);
      if (!isOnline) {
        setError('Failed to load cached user orders.');
      } else {
        setError('Failed to fetch user orders.');
      }
    }
  }


  const handleConfirm = async (order_id: string) => {
    if (!isOnline) {
      setError('Cannot confirm orders while offline. Please connect to the internet.');
      return;
    }

    const response = await axios.put(`/orders/${order_id}`, { status: 'confirmed' });
    setOrders(orders.map((o) => o._id === order_id ? response.data.order : o))

    // OS notifiaciton za potrditev naročila hrane
    showNotification(`Order #${order_id} confirmed!`);
    
    fetchOrders();

  };

  const handleReject = async (order_id: string) => {
    if (!isOnline) {
      setError('Cannot reject orders while offline. Please connect to the internet.');
      return;
    }

    const response = await axios.put(`/orders/${order_id}`, { status: 'rejected' });
    setOrders(orders.map((o) => o._id === order_id ? response.data.order : o))

    // OS notifiaciton za zavrnitev naročila hrane
    showNotification(`Order #${order_id} rejected!`);

    fetchOrders();

  };

  //voice control functions
  const handleVoiceConfirm = () => {
    if (selectedOrderId) {
      handleConfirm(selectedOrderId);
      setSelectedOrderId(null);
    }
  };

  const handleVoiceReject = () => {
    if (selectedOrderId) {
      handleReject(selectedOrderId);
      setSelectedOrderId(null);
    }
  };

  const filteredOrders = activeFilter
    ? orders.filter(order => order.status === activeFilter)
    : orders;

  if (loading) return <div className="text-center mt-10 text-lg">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {user?.role === 'Hotel' && (
        <div className="text-gray-500 mb-8 italic text-center text-xl">
          Users with the "Hotel" role do not have access to view orders.
        </div>
      )}

      

      {user?.role === "Chef" && (
        <div>
          {!isOnline && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
              <strong>Offline Mode:</strong> You are viewing cached data. Complete and reject actions will carry out when you are back online.
            </div>
          )}
          <VoiceControl 
            onConfirm={handleVoiceConfirm}
            onReject={handleVoiceReject}
            isEnabled={!!selectedOrderId}
          />
          <div className="ml-auto relative mb-16 flex justify-end">
            <div className="relative">
              <button
                className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded transition"
                onClick={() => setShowFilters((prev) => !prev)}
              >
                Filter by status
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showFilters && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow z-10">
                  <button
                    className={`block w-full text-left px-4 py-2 hover:bg-yellow-100 ${activeFilter === null ? 'font-bold text-blue-700' : ''}`}
                    onClick={() => {
                      setActiveFilter(null);
                      setShowFilters(false);
                    }}
                  >
                    Show all
                  </button>
                  {filters.map((filter) => (
                    <button
                      key={filter.value}
                      className={`block w-full text-left px-4 py-2 hover:bg-yellow-100 ${activeFilter === filter.value ? 'font-bold text-blue-700' : ''}`}
                      onClick={() => {
                        setActiveFilter(filter.value);
                        setShowFilters(false);
                      }}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {filteredOrders.length === 0 ? (
            <div className="text-gray-500 mb-8 italic text-center text-xl">No orders.</div>
          ) : (
            <ul className="space-y-8 mb-10">
              {filteredOrders.map(order => (
                <li
                  key={order._id}
                  className={`bg-white rounded-2xl shadow-lg border p-8 transition hover:shadow-2xl  ${
                    selectedOrderId === order._id ? 'border-blue-500 bg-blue-50' : 'border-blue-100'
                  }`}
                  onClick={() => order.status === "pending" && isOnline && setSelectedOrderId(order._id)}
                >
                  {selectedOrderId === order._id && (
                    <div className="mb-4 text-sm text-blue-600 font-medium">
                      🎤 Selected for voice control
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <span className="font-bold text-xl text-blue-900">
                        Order no. <span className="text-gray-400">#{order._id.slice(-5)}</span>
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
                      <span className="font-semibold">User:</span>{" "}
                      <span className="text-gray-700">{order.user.email}</span>
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Contents of order: </span>
                      <div className="overflow-x-auto mt-2">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700"></th>
                              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Name</th>
                              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Quantity</th>
                              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">Price</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {order.foods.map(f => (
                              <tr key={f.food._id} className="hover:bg-gray-50 transition">
                                <td className="px-3 py-2 text-center">
                                  <input
                                    type="checkbox"
                                    disabled={!isOnline}
                                  />
                                </td>
                                <td className="px-3 py-2 text-gray-700">{f.food.name}</td>
                                <td className="px-3 py-2 text-gray-700">{f.quantity}</td>
                                <td className="px-3 py-2 text-gray-700 font-bold text-right">${f.food.price}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="text-right font-bold text-lg mt-2">
                        Total: <span className="text-blue-700">
                          {order.foods.reduce((sum, f) => sum + (f.food.price * f.quantity), 0).toFixed(2)}$
                        </span>
                      </div>
                    </div>
                    {order.status === "pending" && (
                      <div className="flex justify-end gap-3 mt-6">
                        <button
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold shadow transition"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConfirm(order._id);
                          }}
                        >
                          ✓
                        </button>
                        <button
                          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold shadow transition"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReject(order._id);
                          }}
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
          {!isOnline && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
              <strong>Offline Mode:</strong> You are viewing cached data. Order actions will be available when you are back online.
            </div>
          )}
          <h2 className="text-2xl font-semibold mb-4 text-black-700">Your orders</h2>
          {userOrders.length === 0 ? (
            <div className="text-gray-500 mb-8 italic text-center text-xl">No orders.</div>
          ) : (
            <ul className="space-y-8 mb-10">
              {userOrders.map(order => (
                <li
                  key={order._id}
                  className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 flex flex-col md:flex-row md:justify-between md:items-center transition hover:shadow-2xl"
                >
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <span className="font-bold text-xl text-blue-900">
                        Order no. <span className="text-gray-400">#{order._id.slice(-5)}</span>
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
                      <span className="font-semibold">Contents of order: </span>
                      <div className="overflow-x-auto mt-2">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700"></th>
                              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Name</th>
                              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Quantity</th>
                              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">Price</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {order.foods.map(f => (
                              <tr key={f.food._id} className="hover:bg-gray-50 transition">
                                <td className="px-3 py-2 text-center">
                                  <input
                                    type="checkbox"
                                    disabled
                                  />
                                </td>
                                <td className="px-3 py-2 text-gray-700">{f.food.name}</td>
                                <td className="px-3 py-2 text-gray-700">{f.quantity}</td>
                                <td className="px-3 py-2 text-gray-700 font-bold text-right">${f.food.price}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="text-right font-bold text-lg mt-2">
                        Total: <span className="text-blue-700">
                          {order.foods.reduce((sum, f) => sum + (f.food.price * f.quantity), 0).toFixed(2)}$
                        </span>
                      </div>
                    </div>
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
