import "./App.css";
import Header from "./components/layout/Header/Header";
import NotFound from "./components/layout/NotFound/NotFound.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./components/layout/Footer/Footer";
import Home from "./components/Home/Home.js";
import ProductDetails from "./components/Product/ProductDetails.js";
import Products from "./components/Product/Products.js";
import LogIn from "./components/User/LogIn";
import Register from "./components/User/Register";
import { useEffect } from "react";
import store from "./Store.js";
import { isAuth } from "./actions/userAction";
import UserProfile from "./components/User/UserProflie.js";
import UpdateProfile from "./components/User/UpdateProflie.js";
import UpdatePassword from "./components/User/UpdatePassword.js";
import ForgotPassword from "./components/User/ForgotPassword.js";
import ResetPassword from "./components/User/ResetPassword.js";
import Cart from "./components/Cart/Cart";
import Shipping from "./components/Cart/Shipping";
import ConfirmOrder from "./components/Cart/ConfirmOrder.js";
import Payment from "./components/Cart/Payment.js";
import OrderSuccess from "./components/Cart/OrderSuccess.js";
import MyOrders from "./components/Order/MyOrders.js";
import OrderDetails from "./components/Order/OrderDetails.js";
import AdminDashboard from "./components/Admin/Dashboard.js";
import AdminProducts from "./components/Admin/AllProducts.js";
import NewProduct from "./components/Admin/NewProduct.js";
import UpdateProduct from "./components/Admin/UpdateProduct";
import AllOrders from "./components/Admin/AllOrders.js";
import UpdateOrder from "./components/Admin/UpdateOrder.js";
import AllUsers from "./components/Admin/AllUsers.js";
import UpdateUser from "./components/Admin/UpdateUser.js";
import AllReviewsOfProduct from "./components/Admin/AllReviewsOfProduct.js";
import { useSelector } from "react-redux";
import ProtectedRoute from "./components/Route/ProtectedRoute.js";
import AdminProtectedRoute from "./components/Route/AdminProtectedRoute.js";

function App() {
  const { user } = useSelector((state) => state.user);

  // const [stripeApiKey, setStripeApiKey] = useState("");

  // async function getStripeApiKey() {
  //   const { data } = await axios.get("/api/v1/stripeapikey");
  //   setStripeApiKey(data.stripeApiKey);
  //   //console.log("stripeApiKey", stripeApiKey);
  // }

  useEffect(() => {
    store.dispatch(isAuth());
  }, []);

  // window.addEventListener("contextmenu", (e) => e.preventDefault());
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/cart" element={<Cart />} />

        <Route exact path="/account" element={<ProtectedRoute />}>
          <Route exact path="/account" element={<UserProfile user={user} />} />
          <Route
            exact
            path="/account/update"
            element={<UpdateProfile user={user} />}
          />
          <Route
            exact
            path="/account/update-password"
            element={<UpdatePassword />}
          />
        </Route>
        <Route exact path="/" element={<ProtectedRoute />}>
          <Route exact path="/login/shipping" element={<Shipping />} />
          <Route exact path="/login/order/confirm" element={<ConfirmOrder />} />
          <Route exact path="/process/payment" element={<Payment />} />
          <Route exact path="/success" element={<OrderSuccess />} />
          <Route exact path="/orders" element={<MyOrders />} />
          <Route exact path="/order/:id" element={<OrderDetails />} />
        </Route>
        <Route
          exact
          path="/admin"
          element={<AdminProtectedRoute isAdmin={true} />}>
          <Route exact path="/admin/dashboard" element={<AdminDashboard />} />
          <Route exact path="/admin/products" element={<AdminProducts />} />
          <Route exact path="/admin/product/new" element={<NewProduct />} />
          <Route exact path="/admin/product/:id" element={<UpdateProduct />} />
          <Route exact path="/admin/orders" element={<AllOrders />} />
          <Route exact path="/admin/order/:id" element={<UpdateOrder />} />
          <Route exact path="/admin/users" element={<AllUsers />} />
          <Route exact path="/admin/user/:id" element={<UpdateUser />} />
          <Route
            exact
            path="/admin/product/reviews/:productId"
            element={<AllReviewsOfProduct />}
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
