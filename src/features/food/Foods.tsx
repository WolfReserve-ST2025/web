import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useCurrentUser } from '../auth/useCurrentUser';
import FoodNavbar from './FoodNavbar/FoodNavbar';
import CartModal from './CartModal/CartModal';
import { Order } from '../orders/Orders';
import FoodModal from './FoodModal/FoodModal';
import { serialize } from 'v8';
import { showNotification } from '../../utils/notifications';

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



const Foods = () => {
  const { user, loading } = useCurrentUser();
  const [foods, setFoods] = useState<Food[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeFood, setActiveFood] = useState<Omit<Food, 'createdAt' | 'updatedAt'>>({
    name: '',
    price: 0,
    description: '',
    type: '',
    imageUrl: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [foodTypes, setFoodTypes] = useState<string[]>([]);
  const [customType, setCustomType] = useState<string>('');
  const [activeType, setActiveType] = useState<string>('');
  const [draftOrder, setDraftOrder] = useState<Order | null>(null)
  const [cartOpen, setCartOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false)
  const [action, setAction] = useState<"Add" | "Edit">('Add')


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

    if (user?.role === "User") {
      fetchDraftOrder();
    }
  }, [user]);


  useEffect(() => {
    if (foodTypes.length > 0 && !activeType) {
      setActiveType(foodTypes[0])
    }
  }, [activeType, foodTypes])

  // Dodajanje nove hrane 
  // Ko se obrazec spremeni (tekst)
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setActiveFood({ ...activeFood, [name]: value });
  };
  // Ko se obrazec spremeni (slika)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    const typeToSubmit = activeFood.type === 'custom' ? customType : activeFood.type

    formData.append('name', activeFood.name);
    formData.append('price', activeFood.price.toString());
    formData.append('type', typeToSubmit)
    formData.append('description', activeFood.description || '');
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
      if (typeToSubmit && !foodTypes.includes(typeToSubmit)) {
        setFoodTypes([...foodTypes, typeToSubmit]);
      }

      // OS notifiaciton za dodajanje hrane
      showNotification(`${activeFood.name} added to foods!`)

      setActiveFood({ name: '', price: 0, description: '', type: '', imageUrl: '' });
      setImageFile(null);
      setModalOpen(false)
    } catch (err) {
      setError('Failed to add food.');
    }
  };
  // modal za dodajanje
  const openAddModal = () => {
    setAction("Add");
    setModalOpen(true);
  };
  //Update hrane

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(activeFood)
    const typeToSubmit = activeFood.type === 'custom' ? customType : activeFood.type
    if (!activeFood || !activeFood._id) return;
    const formData = new FormData();
    formData.append('name', activeFood.name);
    formData.append('price', activeFood.price.toString());
    formData.append('description', activeFood.description || '');
    formData.append('type', typeToSubmit)
    formData.append('imageUrl', activeFood.imageUrl || '')

    if (imageFile) {
      formData.append('imageUrl', imageFile);
      //  console.log('Image url obstaja')
    }

    try {
      const response = await axios.put(`/foods/${activeFood._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFoods(
        foods.map((f) => (f._id === activeFood._id ? response.data.food : f))
      );
      if (typeToSubmit && !foodTypes.includes(typeToSubmit)) {
        setFoodTypes([...foodTypes, typeToSubmit]);
      }
      
      // OS notifiaciton za dodajanje hrane
      showNotification(`${activeFood.name} edited successfully!`)

      setModalOpen(false)
      setActiveFood({ name: '', price: 0, description: '', type: '', imageUrl: '' });
      setImageFile(null);
    } catch (err) {
      setError('Failed to update food.');
    }

  };
  // modal za editanje
  const openEditModal = (food: Food) => {
    setAction("Edit");
    setActiveFood(food)
    setImageFile(null)
    setModalOpen(true);
  };


  // ko se modal zapre

  const handleOnClose = () => {
    setModalOpen(false)
    setActiveFood({ name: '', price: 0, description: '', type: '', imageUrl: '' })
  }

  // Brisanje hrane
  const handleDelete = async (food_id?: string) => {
    if (!food_id) return;
    if (!window.confirm('Are you sure you want to delete this food?')) return;
    try {
      await axios.delete(`/foods/${food_id}`);
      setFoods(foods.filter((f) => f._id !== food_id));
      
      // OS notifiaciton za brisanje hrane
      showNotification(`Food deleted successfully!`)

    } catch (err) {
      setError('Failed to delete food.');
    }
  };

  // filtracija 
  let filteredFoods;
  if (activeType) {
    filteredFoods = foods.filter(food => food.type === activeType);
  } else {
    filteredFoods = foods;
  }


  // oddaj naročilo
  const handleSubmitOrder = async () => {
    try {
      alert('Oddano naročilo!');
      await axios.post(`/orders`);
      
      // OS notifiaciton za oddajo naročila hrane
      showNotification(`Order submitted successfully!`)

      setDraftOrder(null)
      setCartOpen(false);
    } catch (err) {
      setError('Oddaja naročila ni uspela.');
    }

  };

  // dodaj hrano v cart
  const handleAddFood = async (food_id?: string) => {
    if (!food_id) return;
    if (!window.confirm('Are you sure you want to add this food?')) return;
    try {
      const response = await axios.post(`/orders/${food_id}`);
      setDraftOrder(response.data.order)
      

    } catch (err: any) {
      // sporočilo uporabniku
      setError(err.response.data.message);

    }
  };

  // odstrani hrano iz carta
  const handleRemoveFood = async (food_id: string) => {
    if (!food_id) return;
    if (!window.confirm('Are you sure you want to remove this food?')) return;
    try {
      const response = await axios.delete(`/orders/${food_id}`);
      setDraftOrder(response.data.order)

    } catch (err) {
      setError('Failed to delete food.');
    }
  };


  if (loading) return <div className="text-center mt-10 text-lg">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {user?.role === 'User' && (
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
          <CartModal
            open={cartOpen}
            draftOrder={draftOrder}
            onClose={() => setCartOpen(false)}
            onSubmit={handleSubmitOrder}
            onRemove={handleRemoveFood}
          />
        </div>
      )}


      <h1 className="text-3xl font-bold mb-6 text-center">Foods Page</h1>
      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
      <button
        onClick={openAddModal}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-full shadow transition mb-6"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Dodaj hrano
      </button>

      <FoodNavbar
        foodTypes={foodTypes}
        activeType={activeType}
        setActiveType={setActiveType}
      />

      <FoodModal
        open={modalOpen}
        onClose={handleOnClose}
        action={action}
        handleSubmit={action === "Edit" ? handleEditSubmit : handleSubmit}
        handleInputChange={handleInputChange}
        handleImageChange={handleImageChange}
        activeFood={activeFood}
        customType={customType}
        setCustomType={setCustomType}
        foodTypes={foodTypes}
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

              {user?.role == 'User' && (
                <button
                  className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition"
                  onClick={() => handleAddFood(food._id)}
                >
                  Add to cart
                </button>
              )}

              {user?.role === 'Chef' && (
                <div className="flex gap-2 mt-2">
                  <button
                    className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600 transition"
                    onClick={() => openEditModal(food)}
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