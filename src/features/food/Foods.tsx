import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useCurrentUser } from '../auth/useCurrentUser';
import FoodNavbar from './FoodNavbar/FoodNavbar';
import CartModal from './CartModal/CartModal';

export interface Food {
  _id?: string;
  name: string;
  price: number;
  type: string;
  description?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type OrderStatus = 'draft' | 'pending' | 'confirmed' | 'rejected';

export interface Order {
  _id: string;
  status: OrderStatus;
  foods: Food[];
  user: string,
  createdAt: string;
  updatedAt: string;
}

const Foods = () => {
  const { user, loading } = useCurrentUser();
  const [foods, setFoods] = useState<Food[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [newFood, setNewFood] = useState<Omit<Food, 'createdAt' | 'updatedAt'>>({
    name: '',
    price: 0,
    description: '',
    type: '',
    imageUrl: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [foodTypes, setFoodTypes] = useState<string[]>([]);
  const [customType, setCustomType] = useState<string>('');
  const [activeType, setActiveType] = useState<string>('');
  const [draftOrder, setDraftOrder] = useState<Order | null>(null)
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await axios.get('/foods');
        setFoods(response.data);
      } catch (err) {
        setError('Failed to fetch foods.');
      }
    };

    const fetchTypes = async () => {
      try {
        const response = await axios.get('/foods/types');
        setFoodTypes(response.data);
      } catch {
        setError('Failed to fetch types.')
      }
    }

    const fetchDraftOrder = async () => {
      try {
        const response = await axios.get('/orders/user');
        let order;
        if (Array.isArray(response.data)) {
          if (response.data.length > 0) {
            order = response.data[0];
          } else {
            order = null;
          }
        } else {
          order = response.data;
        }
        setDraftOrder(order);
      } catch (err) {
        setError('Failed to fetch draft order.');
      }
    }


    fetchFoods();
    fetchTypes();
    fetchDraftOrder();
  }, []);


  useEffect(() => {
    if (foodTypes.length > 0 && !activeType) {
      setActiveType(foodTypes[0])
    }
  }, [activeType, foodTypes])


  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewFood({ ...newFood, [name]: value });
  };



  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingFood) return;
    const { name, value } = e.target;
    setEditingFood({ ...editingFood, [name]: value });
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEditImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    const typeToSubmit = newFood.type === 'custom' ? customType : newFood.type

    formData.append('name', newFood.name);
    formData.append('price', newFood.price.toString());
    formData.append('type', typeToSubmit)
    formData.append('description', newFood.description || '');
    if (imageFile) {
      formData.append('imageUrl', imageFile);
    }

    try {
      const response = await axios.post('/foods', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFoods([...foods, response.data.food]);
      setNewFood({ name: '', price: 0, description: '', type: '', imageUrl: '' });
      setImageFile(null);
    } catch (err) {
      setError('Failed to add food.');
    }
  };

  const handleDelete = async (food_id?: string) => {
    if (!food_id) return;
    if (!window.confirm('Are you sure you want to delete this food?')) return;
    try {
      await axios.delete(`/foods/${food_id}`);
      setFoods(foods.filter((f) => f._id !== food_id));
    } catch (err) {
      setError('Failed to delete food.');
    }
  };

  const handleEdit = (food: Food) => {
    setEditingFood(food);
    setEditImageFile(null);
  };

  let filteredFoods;
  if (activeType) {
    filteredFoods = foods.filter(food => food.type === activeType);
  } else {
    filteredFoods = foods;
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(editingFood)
    if (!editingFood || !editingFood._id) return;
    const formData = new FormData();
    formData.append('name', editingFood.name);
    formData.append('price', editingFood.price.toString());
    formData.append('description', editingFood.description || '');
    if (editImageFile) {
      formData.append('imageUrl', editImageFile);
    }
    try {
      const response = await axios.put(`/foods/${editingFood._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFoods(
        foods.map((f) => (f._id === editingFood._id ? response.data.food : f))
      );
      setEditingFood(null);
      setEditImageFile(null);
    } catch (err) {
      setError('Failed to update food.');
    }

  };


  const handleSubmitOrder = async () => {
    try{
   alert('Oddano naročilo!');
    await axios.post(`/orders`);
      // nadaljuj tu
    setCartOpen(false);
    } catch (err) {
    setError('Oddaja naročila ni uspela.');
  }
 
  };

  const handleAddFood = async (food_id?: string) => {
    if (!food_id) return;
    if (!window.confirm('Are you sure you want to add this food?')) return;
    try {
      const response = await axios.post(`/orders/${food_id}`);
      console.log(response.data.message);

    } catch (err) {
      setError('Failed to delete food.');
    }
  };

  if (loading) return <div className="text-center mt-10 text-lg">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setCartOpen(true)}
          className="relative bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-full shadow flex items-center gap-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007 17h10a1 1 0 00.95-.68L19 13M7 13V6a1 1 0 011-1h5a1 1 0 011 1v7" />
          </svg>
          Košarica
          {draftOrder?.foods && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {draftOrder.foods.length}
            </span>
          )}
        </button>
      </div>
      <CartModal
        open={cartOpen}
        draftOrder={draftOrder}
        onClose={() => setCartOpen(false)}
        onSubmit={handleSubmitOrder}
      />
      <h1 className="text-3xl font-bold mb-6 text-center">Foods Page</h1>
      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

      {user?.role === 'Chef' && (
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-6 mb-10 space-y-4"
        >
          <h2 className="text-xl font-semibold mb-2">Add New Food</h2>
          <div>
            <label className="block font-medium mb-1">Name:</label>
            <input
              type="text"
              name="name"
              value={newFood.name}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Price:</label>
            <input
              type="number"
              name="price"
              value={newFood.price}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Type:</label>
            <select
              name="type"
              value={newFood.type}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            >
              <option value="">Select offer type</option>
              {foodTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                </option>

              ))}
              <option value="custom">Other</option>

            </select>

            {newFood.type === 'custom' && (
              <div className="mt-2">
                <label className="block font-medium mb-1">Custom Type:</label>
                <input
                  type="text"
                  name="customType"
                  value={customType}
                  onChange={e => {
                    setCustomType(e.target.value);
                  }}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                />
              </div>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">Description:</label>
            <textarea
              name="description"
              value={newFood.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 resize-y"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Image:</label>
            <input
              type="file"
              name="imageUrl"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Add Food
          </button>
        </form>
      )}

      {editingFood && (
        <form
          onSubmit={handleEditSubmit}
          className="bg-yellow-50 shadow-md rounded-lg p-6 mb-10 space-y-4 border border-yellow-300"
        >
          <h2 className="text-xl font-semibold mb-2 text-yellow-800">Edit Food</h2>
          <div>
            <label className="block font-medium mb-1">Name:</label>
            <input
              type="text"
              name="name"
              value={editingFood.name}
              onChange={handleEditInputChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Price:</label>
            <input
              type="number"
              name="price"
              value={editingFood.price}
              onChange={handleEditInputChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Description:</label>
            <input
              type="text"
              name="description"
              value={editingFood.description}
              onChange={handleEditInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Image:</label>
            <input
              type="file"
              name="imageUrl"
              accept="image/*"
              onChange={handleEditImageChange}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700 transition"
            >
              Save
            </button>
            <button
              type="button"
              className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400 transition"
              onClick={() => setEditingFood(null)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <FoodNavbar
        foodTypes={foodTypes}
        activeType={activeType}
        setActiveType={setActiveType}
      />

      {filteredFoods.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredFoods.map((food, idx) => (
            <li
              key={food._id ? food._id : `food-${idx}`}
              className="relative bg-white rounded-lg shadow-md p-5 flex flex-col items-center group overflow-hidden"
            >
              <h3 className="text-lg font-semibold mb-2">{food.name}</h3>

              <p className="mb-2 text-blue-700 font-bold">Price: ${food.price}</p>

              <div className="relative w-full flex justify-center items-center">
                {food.imageUrl && (
                  <img
                    src={`http://localhost:5000${food.imageUrl}`}
                    alt={food.name}
                    width="120"
                    className="rounded mb-2 border transition duration-300 group-hover:opacity-40"
                  />
                )}


              </div>

              <button
                onClick={() => handleAddFood(food._id)}
                className="absolute text-white bg-green-600 hover:bg-green-700 transition rounded-full w-10 h-10 flex items-center justify-center text-2xl opacity-0 group-hover:opacity-100"
                style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
              >
                +
              </button>
              {user?.role === 'Chef' && (
                <div className="flex gap-2 mt-2">
                  <button
                    className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600 transition"
                    onClick={() => handleEdit(food)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition"
                    onClick={() => handleDelete(food._id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No foods available.</p>
      )}
    </div>
  );
};

export default Foods;