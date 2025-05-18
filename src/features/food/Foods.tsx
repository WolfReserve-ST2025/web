import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useCurrentUser } from '../auth/useCurrentUser';

interface Food {
  _id?: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

const Foods = () => {
  const { user, loading } = useCurrentUser();
  const [foods, setFoods] = useState<Food[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [newFood, setNewFood] = useState<Omit<Food, 'createdAt' | 'updatedAt'>>({
    name: '',
    price: 0,
    description: '',
    imageUrl: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);


  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await axios.get('/foods');
        setFoods(response.data);
      } catch (err) {
        setError('Failed to fetch foods.');
      }
    };

    fetchFoods();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    formData.append('name', newFood.name);
    formData.append('price', newFood.price.toString());
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
      setNewFood({ name: '', price: 0, description: '', imageUrl: '' });
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

  if (loading) return <div className="text-center mt-10 text-lg">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
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
            <label className="block font-medium mb-1">Description:</label>
            <input
              type="text"
              name="description"
              value={newFood.description}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
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


      {foods.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {foods.map((food) => (
            <li
              key={food._id || food.name}
              className="bg-white rounded-lg shadow-md p-5 flex flex-col items-center"
            >
              <h3 className="text-lg font-semibold mb-2">{food.name}</h3>
              <p className="mb-1 text-gray-700">{food.description}</p>
              <p className="mb-2 text-blue-700 font-bold">Price: ${food.price}</p>
              {food.imageUrl && (
                <img
                  src={`http://localhost:5000${food.imageUrl}`}
                  alt={food.name}
                  width="120"
                  className="rounded mb-2 border"
                />
              )}
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