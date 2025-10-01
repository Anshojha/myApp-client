import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const InputFeild = ({ type, placeholder, name, handleChange, address }) => (
  <input
    className="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition"
    type={type}
    address={address}
    placeholder={placeholder}
    name={name}
    onChange={handleChange}
    value={address[name]}
    required
  />
);

const AddAdderss = () => {
  const { axios, user, navigate } = useAppContext();

  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
    phone: "",
  });

  const onSubmitHandler = async (e) => {
    e.preventDefault();

  const fullAddress = {
    ...address,
    userId: user?._id
  };

    try {
      const { data } = await axios.post("/api/address/add", fullAddress);
      console.log("Address data " + data);
      if (data.success) {
        toast.success(data.message);
        navigate("/cart");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("From addaddress" + error.message);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/cart");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  return (
    <div className="mt-16 pb-16">
      <p className="text-2xl md:text-3xl text-gray-500">
        Add Shipping <span className="text-primary font-semibold">Address</span>
      </p>
      <div className="flex flex-col-reverse md:flex-row justify-between mt-10">
        <div className="flex-1 max-w-md ">
          <form onSubmit={onSubmitHandler} className="space-y-3 mt-6 text-sm ">
            <div className="grid grid-cols-2 gap-4">
              <InputFeild
                handleChange={handleChange}
                address={address}
                name="firstName"
                type="text"
                placeholder="First Name"
              />
              <InputFeild
                handleChange={handleChange}
                address={address}
                name="lastName"
                type="text"
                placeholder="Last Name"
              />
            </div>
            <InputFeild
              handleChange={handleChange}
              address={address}
              name="email"
              type="email"
              placeholder="Email "
            />
            <InputFeild
              handleChange={handleChange}
              address={address}
              name="street"
              type="text"
              placeholder="Street "
            />
            <div className="grid grid-cols-2 gap-4">
              <InputFeild
                handleChange={handleChange}
                address={address}
                name="city"
                type="text"
                placeholder="City "
              />
              <InputFeild
                handleChange={handleChange}
                address={address}
                name="state"
                type="text"
                placeholder="State "
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputFeild
                handleChange={handleChange}
                address={address}
                name="zipcode"
                type="number"
                placeholder="Zipcode "
              />
              <InputFeild
                handleChange={handleChange}
                address={address}
                name="country"
                type="text"
                placeholder="Country "
              />
            </div>

            <InputFeild
              handleChange={handleChange}
              address={address}
              name="phone"
              type="number"
              placeholder="Phone Number"
            />

            <button
              className="w-full bg-primary mt-6 text-white  py-3 rounded hover:bg-primary-dull transition cursor-pointer"
              type="submit"
            >
              Add Address
            </button>
          </form>
        </div>
        <img src={assets.add_address_iamge} alt="address" />
      </div>
    </div>
  );
};

export default AddAdderss;
