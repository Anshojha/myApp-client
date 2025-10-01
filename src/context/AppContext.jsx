import { createContext, useContext, useEffect, useState } from "react";
export const AppContext = createContext();
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from 'axios'


axios.defaults.withCredentials = true // It will send the cookies throught axious url
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL  //This s sets a default base URL for Axios.So when we make a request like axios.get('/users'), it will automatically send it to:[baseURL]/users
export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();
  const [user, setUser] = useState(true);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [isSeller, setIsSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState([]);
  const [cartLoaded, setCartLoaded] = useState(false);



  // Fetching seller status

  const fetchSeller = async () => {
    try {
      const {data} =await axios.get('/api/seller/is-auth');
      console.log(data)
      if(data.success) {
        setIsSeller(true)
      }
      else {
        setIsSeller(false)
      }
    } catch (error) {
      setIsSeller(false)
    }
  }


// fetch user 

const fetchUser = async () => {
  try {
    const {data} = await axios.get('/api/user/is-auth') 
    if(data.success) {
      setUser(data.user)
      setCartItems(data.user.cartItems)
    }
    
  } catch (error) {
    setUser(null)
  }
}

  //fetch all products
  const fetchProducts = async () => {
    try {
      const {data} = await axios.get('/api/product/list')
      if(data.success) {
        setProducts(data.products)
      }
      else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  };

  //   

  // function to add to cart
  const addToCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }

    setCartItems(cartData);
    toast.success("Item added to cart");
  };

  // function to update cart item

  const updateCartItem = (itemId, count) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);
    toast.success("Cart updated successfully");
  };

  // function to remove item from cart
  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
    }
    setCartItems(cartData);
    toast.success("Item removed from cart");
  };

  const getCartCount = () => {
    let totalCouunt = 0;
    for (const items in cartItems) {
      totalCouunt += cartItems[items];
    }
    return totalCouunt;
  }

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if(cartItems[items] > 0) {
        totalAmount += itemInfo.price * cartItems[items];
      }
    }
    return Math.floor(totalAmount * 100)/ 100;
  }

  useEffect(() => {
    fetchUser();
    fetchSeller();
    fetchProducts();
  }, []);

  useEffect(() => {

    const updateCart = async (req , res) => {
      try {
        const { data } = await axios.post('/api/cart/update', {cartItems})
        if(!data.success) {
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }

    if(user) {
      updateCart()
    }

  },[cartItems])

  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    setProducts,
    currency,
    addToCart,
    updateCartItem,
    removeFromCart,
    cartItems,
    setCartItems,
    searchQuery,
    setSearchQuery,
    getCartCount,
    getCartAmount,
    axios, // Now we can access the axios any where using AppContext
    fetchProducts
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
