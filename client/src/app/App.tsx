import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "../components/pages/Home";
import ProductPage from "../components/pages/Product";
import ProductInfoPage from "../components/pages/ProductInfo";
import CartPage from "../components/pages/Cart";
import LoginPage from "../components/pages/Login";
import RegisterPage from "../components/pages/Register";
import { ToastContainer } from "react-toastify";
import ProfilePage from "../layouts/Profile";
import ProfileMainPage from "../components/pages/Profile/MainPage";
import AddressPage from "../components/pages/Profile/AddressPage";
import AddressForm from "../components/pages/Profile/AddressForm";
import OrdersPage from "../components/pages/Profile/OrdersPage";
import UpdateForm from "../components/pages/Profile/UpdateForm";
import { UserProvider } from "../contexts/UserContext";
import AdminLayout from "../layouts/Admin";
import DashboardPage from "../components/pages/Admin/Dashboard";
import OrdersAdminPage from "../components/pages/Admin/OrdersPage";
import UsersAdminPage from "../components/pages/Admin/UsersPage";
import ProductAdminPage from "../components/pages/Admin/ProductsPage";
import AddProductForm from "../components/pages/Admin/AddProduct";
import UpdateProductForm from "../components/pages/Admin/UpdateProduct";
import OrderInfoPage from "../components/pages/Profile/OrderInfoPage";
import OrderAdminInfoPage from "../components/pages/Admin/OrderInfoPage";
import PaymentVerify from "../components/pages/PaymentVerify";

export default function App() {
    return (
        <>
            <UserProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" Component={HomePage} />
                        <Route path="/products" Component={ProductPage} />
                        <Route
                            path="/products/:id"
                            Component={ProductInfoPage}
                        />
                        <Route path="/cart" Component={CartPage} />
                        <Route path="/login" Component={LoginPage} />
                        <Route path="/register" Component={RegisterPage} />

                        <Route path="/profile" Component={ProfilePage}>
                            <Route index Component={ProfileMainPage} />
                            <Route path="address">
                                <Route index Component={AddressPage} />
                                <Route path="add" Component={AddressForm} />
                            </Route>
                            <Route path="orders">
                                <Route index Component={OrdersPage} />
                                <Route path=":id" Component={OrderInfoPage} />
                            </Route>
                            <Route path="update" Component={UpdateForm} />
                        </Route>

                        <Route path="/admin" Component={AdminLayout}>
                            <Route index Component={DashboardPage} />
                            <Route path="orders" Component={OrdersAdminPage} />
                            <Route path="orders">
                                <Route index Component={OrdersAdminPage} />
                                <Route
                                    path=":id"
                                    Component={OrderAdminInfoPage}
                                />
                            </Route>
                            <Route path="products">
                                <Route index Component={ProductAdminPage} />
                                <Route path="add" Component={AddProductForm} />
                                <Route
                                    path="update/:id"
                                    Component={UpdateProductForm}
                                />
                            </Route>
                            <Route path="users" Component={UsersAdminPage} />
                        </Route>
                        <Route
                            path="payment-verify"
                            Component={PaymentVerify}
                        />
                    </Routes>
                </BrowserRouter>
            </UserProvider>
            <ToastContainer />
        </>
    );
}
