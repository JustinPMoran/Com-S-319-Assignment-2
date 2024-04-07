import React, { useState, useEffect } from "react";
import './App.css';
import { useForm } from "react-hook-form";
import products from "./products.json"; // Importing products from products.json

function openTab(tabName) {
  var tabs = document.getElementsByClassName("tab");
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove("active"); // Remove 'active' class from all tabs
  }
  document.getElementById(tabName).classList.add("active"); // Add 'active' class to the selected tab

  // Check if tab2 is active, hide the div if tab2 is active
  if (tabName === 'productsTab') {
    document.getElementById('divToHide').style.display = 'none';
  } else {
    document.getElementById('divToHide').style.display = 'block';
  }
}

const Shop = () => {

  //pay form 
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [dataF, setDataF] = useState({});
  const [viewer, setViewer] = useState(0);

  //payment page 
  function Payment() {
    const onSubmit = data => {
      console.log(data); // log all data
      console.log(data.fullName); // log only fullname
      // update hooks
      setDataF(data);
      setViewer(2);
    }

    return (<div>

      <form onSubmit={handleSubmit(onSubmit)} className="container mt-5" class="productsTab">

        <div className="form-group">
          <input {...register("fullName", { required: true })} placeholder="Full Name" className="form-control" />
          {errors.fullName && <p className="text-danger">Full Name is required.</p>}
        </div>

        <input {...register("email", { required: true, pattern: /^\S+@\S+$/i })} placeholder="Email" />
        {errors.email && <p>Email is required.</p>}

        <input {...register("creditCard", { required: true })} placeholder="Credit Card" />
        {errors.creditCard && <p>Credit Card is required.</p>}

        <input {...register("address", { required: true })} placeholder="Address" />
        {errors.address && <p>Address is required.</p>}

        <input {...register("address2")} placeholder="Address 2" />
        <input {...register("city", { required: true })} placeholder="City" />
        {errors.city && <p>City is required.</p>}

        <input {...register("state", { required: true })} placeholder="State" />
        {errors.state && <p>State is required.</p>}

        <input {...register("zip", { required: true })} placeholder="Zip" />
        {errors.zip && <p>Zip is required.</p>}

        <button type="submit" className="btn btn-primary">Order</button>

        <button onClick={() => { setViewer(0); setDataF({}); }} className="btn-payment">Return</button>
        
      </form>

    </div>);
  }

  function Summary() {
    const updateHooks = () => {
      setViewer(0);
      setDataF({});
    };

    return (<div>
      <h1>Payment summary:</h1>
      <h3>{dataF.fullName}</h3>
      <p>{dataF.email}</p>
      <p>{dataF.creditCard}</p>
      <p>{dataF.address}</p>
      <p>{dataF.address2}</p>
      <p>{dataF.city},{dataF.state} {dataF.zip} </p>
      <button onClick={updateHooks} className="btn btn-secondary">Back to Catalog</button>
    </div>);
  };

  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    total();
  }, [cart]);

  useEffect(() => {
    const results = products.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  }, [searchTerm]);

  const addToCart = (el) => {
    setCart([...cart, el]);
    itemQuantity(el);
  };

  const total = () => {
    let totalVal = 0;
    for (let i = 0; i < cart.length; i++) {
      totalVal += Number(cart[i].price);
    }
    setCartTotal(totalVal);
  };

  const removeFromCart = (el) => {
    const indexToRemove = cart.findIndex((cartItem) => cartItem.id === el.id);
    if (indexToRemove !== -1) {
      let hardCopy = [...cart];
      hardCopy.splice(indexToRemove, 1);
      setCart(hardCopy);
    }
  };

  const cartItems = cart.map((el) => el.id);
  const cartItemsCount = cart.reduce((acc, currentItem) => {
    if (!acc[currentItem.id]) {
      acc[currentItem.id] = 0;
    }
    acc[currentItem.id]++;
    return acc;
  }, {});

  const cartItemList = Object.keys(cartItemsCount).map((itemId) => {
    const item = cart.find((el) => el.id === parseInt(itemId));
    return (
      <div key={itemId}>
        <img className="img-fluid" src={item.imageSrc} width={150} />
        {item.name} ({cartItemsCount[itemId]}): ${item.price}  
      </div>
    );
  });

  const listItems = searchResults.map((product) => (
    <a key={product.id} href={product.href} className="group">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
        <img
          src={product.imageSrc}
          alt={product.imageAlt}
          className="h-full w-full object-cover object-center group-hover:opacity-75"
        />
      </div>
      <div class="col">
        <button
          type="button"
          variant="light"
          onClick={() => removeFromCart(product)}
        >
          {" "}
          -{" "}
        </button>{" "}
        <button type="button" variant="light" onClick={() => addToCart(product)}>
          {" "}
          +{" "}
        </button>
      </div>
      <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
      <p className="mt-1 text-lg font-medium text-gray-900">${product.price}</p>
    </a>
  ));

  // this is the first page view
  function ProductPage() {
    const updateHooks = () => {
      setViewer(1);
      setDataF({});
    };

    return (
      <div>
        <button onClick={updateHooks} className="btn-payment">Payment</button>
        <div className="bg-white">
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
            <h2 className="sr-only">Products</h2>
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
              {listItems}
            </div>
          </div>
        </div>
        <div>Items in Cart ({cart.length}):</div>
        <div>{cartItemList}</div>
        <div>Order total: ${cartTotal}</div>
      </div>
    );
  }

  function itemQuantity(id) {
    let hmot = cart.filter((cartItem) => cartItem.id === id);
    return hmot.length
  }

  return (
    <div class="divToHide">
      {!viewer && (
        <div className="search-container">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}
      {viewer === 0 && <ProductPage />}
      {viewer === 1 && <Payment />}
      {viewer === 2 && <Summary />}
    </div>
  );
};

export default Shop;
