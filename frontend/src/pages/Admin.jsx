import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("products");
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stock: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const productsRes = await api.get("/products");
      setProducts(productsRes.data);
      if (user?.role === "admin") {
        const ordersRes = await api.get("/orders");
        setOrders(ordersRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  };

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(""), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editProduct) {
        await api.put(`/products/${editProduct._id}`, {
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
        });
        showSuccess("Product updated!");
      } else {
        await api.post("/products", {
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
        });
        showSuccess("Product added!");
      }
      setForm({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
        stock: "",
      });
      setShowForm(false);
      setEditProduct(null);
      fetchAll();
    } catch (err) {
      if (err.response?.status === 429) {
        showError(err.response.data.message);
      } else {
        showError("Something went wrong, try again");
      }
    }
  };

  const handleEdit = (product) => {
    if (product.seller?._id !== user._id && user.role !== "admin") {
      showError("You can only edit your own products!");
      return;
    }
    setEditProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      stock: product.stock,
    });
    setShowForm(true);
  };

  const handleDelete = async (product) => {
    if (product.seller?._id !== user._id && user.role !== "admin") {
      showError("You can only delete your own products!");
      return;
    }
    if (window.confirm("Delete this product?")) {
      await api.delete(`/products/${product._id}`);
      showSuccess("Product deleted!");
      fetchAll();
    }
  };

  const handleDeliver = async (id) => {
    await api.put(`/orders/${id}/deliver`);
    showSuccess("Order marked as delivered!");
    fetchAll();
  };

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{
            width: "50px",
            height: "50px",
            border: "5px solid #f0f0f0",
            borderTopColor: "#e96c4c",
            borderRadius: "50%",
          }}
        />
      </div>
    );

  const myProducts = products.filter(
    (p) => p.seller?._id === user._id || p.seller === user._id,
  );
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ maxWidth: "1200px", margin: "2rem auto", padding: "2rem" }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>
            {user.role === "admin"
              ? "⚙️ Admin Dashboard"
              : "🛍️ Seller Dashboard"}
          </h1>
          <p style={{ color: "#999" }}>
            Welcome, {user.name}!{" "}
            {user.role !== "admin" && (
              <span style={{ color: "#e96c4c" }}>
                You can add 1 product per day.
              </span>
            )}
          </p>
        </div>
        {activeTab === "products" && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setShowForm(!showForm);
              setEditProduct(null);
              setForm({
                name: "",
                description: "",
                price: "",
                category: "",
                image: "",
                stock: "",
              });
            }}
            style={{
              background: "linear-gradient(135deg, #e96c4c, #f0a500)",
              color: "white",
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "12px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "0.95rem",
            }}
          >
            {showForm ? "✕ Cancel" : "+ Add Product"}
          </motion.button>
        )}
      </div>

      {/* Success / Error messages */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              background: "#d4edda",
              color: "#155724",
              padding: "0.75rem 1.25rem",
              borderRadius: "10px",
              marginBottom: "1.5rem",
              fontWeight: "bold",
            }}
          >
            ✓ {success}
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              background: "#ffe0e0",
              color: "#c0392b",
              padding: "0.75rem 1.25rem",
              borderRadius: "10px",
              marginBottom: "1.5rem",
              fontWeight: "bold",
            }}
          >
            ⚠️ {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            user.role === "admin" ? "repeat(4, 1fr)" : "repeat(2, 1fr)",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {user.role === "admin"
          ? [
              {
                label: "Total Products",
                value: products.length,
                icon: "",
                color: "#e96c4c",
              },
              {
                label: "Total Orders",
                value: orders.length,
                icon: "",
                color: "#3498db",
              },
              {
                label: "Revenue",
                value: `$${totalRevenue.toFixed(2)}`,
                icon: "",
                color: "#27ae60",
              },
              {
                label: "Delivered",
                value: orders.filter((o) => o.isDelivered).length,
                icon: "",
                color: "#9b59b6",
              },
            ]
          : [
              {
                label: "My Products",
                value: myProducts.length,
                icon: "",
                color: "#e96c4c",
              },
              {
                label: "Daily Limit",
                value: `${
                  myProducts.filter((p) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return new Date(p.createdAt) >= today;
                  }).length
                }/1`,
                icon: "⏰",
                color: "#f0a500",
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "1.5rem",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                  borderLeft: `4px solid ${stat.color}`,
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                  {stat.icon}
                </div>
                <div
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: "bold",
                    color: stat.color,
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ color: "#999", fontSize: "0.85rem" }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
      </div>

      {/* Tabs — only admin sees orders tab */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setActiveTab("products")}
          style={{
            padding: "0.6rem 1.5rem",
            background:
              activeTab === "products"
                ? "linear-gradient(135deg, #e96c4c, #f0a500)"
                : "white",
            color: activeTab === "products" ? "white" : "#666",
            border: "none",
            borderRadius: "10px",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          {user.role === "admin"
            ? `All Products (${products.length})`
            : `My Products (${myProducts.length})`}
        </motion.button>
        {user.role === "admin" && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveTab("orders")}
            style={{
              padding: "0.6rem 1.5rem",
              background:
                activeTab === "orders"
                  ? "linear-gradient(135deg, #e96c4c, #f0a500)"
                  : "white",
              color: activeTab === "orders" ? "white" : "#666",
              border: "none",
              borderRadius: "10px",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            Orders ({orders.length})
          </motion.button>
        )}
      </div>

      {/* Add/Edit Product Form */}
      <AnimatePresence>
        {showForm && activeTab === "products" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "2rem",
              marginBottom: "2rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              overflow: "hidden",
            }}
          >
            <h2 style={{ marginBottom: "1.5rem" }}>
              {editProduct ? " Edit Product" : " Add New Product"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.3rem",
                      fontWeight: "600",
                      fontSize: "0.9rem",
                      color: "#555",
                    }}
                  >
                    Product Name
                  </label>
                  <input
                    placeholder="Nike Air Max"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.3rem",
                      fontWeight: "600",
                      fontSize: "0.9rem",
                      color: "#555",
                    }}
                  >
                    Category
                  </label>
                  <input
                    placeholder="Shoes"
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.3rem",
                      fontWeight: "600",
                      fontSize: "0.9rem",
                      color: "#555",
                    }}
                  >
                    Price ($)
                  </label>
                  <input
                    placeholder="99.99"
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.3rem",
                      fontWeight: "600",
                      fontSize: "0.9rem",
                      color: "#555",
                    }}
                  >
                    Stock
                  </label>
                  <input
                    placeholder="50"
                    type="number"
                    value={form.stock}
                    onChange={(e) =>
                      setForm({ ...form, stock: e.target.value })
                    }
                    required
                  />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.3rem",
                      fontWeight: "600",
                      fontSize: "0.9rem",
                      color: "#555",
                    }}
                  >
                    Image URL
                  </label>
                  <input
                    placeholder="https://..."
                    value={form.image}
                    onChange={(e) =>
                      setForm({ ...form, image: e.target.value })
                    }
                  />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.3rem",
                      fontWeight: "600",
                      fontSize: "0.9rem",
                      color: "#555",
                    }}
                  >
                    Description
                  </label>
                  <input
                    placeholder="Product description..."
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                style={{
                  marginTop: "1rem",
                  padding: "0.85rem 2rem",
                  background: "linear-gradient(135deg, #e96c4c, #f0a500)",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "1rem",
                }}
              >
                {editProduct ? "Update Product" : "Add Product"}
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Tab */}
      {activeTab === "products" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1rem",
            }}
          >
            {(user.role === "admin" ? products : myProducts).map(
              (product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    background: "white",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                  }}
                >
                  <img
                    src={
                      product.image ||
                      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"
                    }
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "160px",
                      objectFit: "cover",
                    }}
                  />
                  <div style={{ padding: "1rem" }}>
                    <h3 style={{ margin: "0 0 0.25rem", fontSize: "1rem" }}>
                      {product.name}
                    </h3>
                    <p
                      style={{
                        color: "#999",
                        fontSize: "0.8rem",
                        margin: "0 0 0.5rem",
                      }}
                    >
                      {product.category}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "0.75rem",
                      }}
                    >
                      <span style={{ fontWeight: "bold", color: "#e96c4c" }}>
                        ${product.price}
                      </span>
                      <span style={{ fontSize: "0.8rem", color: "#666" }}>
                        Stock: {product.stock}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleEdit(product)}
                        style={{
                          flex: 1,
                          padding: "0.5rem",
                          background: "#1a1a2e",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: "bold",
                          fontSize: "0.85rem",
                        }}
                      >
                        ✏️ Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleDelete(product)}
                        style={{
                          flex: 1,
                          padding: "0.5rem",
                          background: "#ffe0e0",
                          color: "#e96c4c",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: "bold",
                          fontSize: "0.85rem",
                        }}
                      >
                        🗑️ Delete
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ),
            )}
            {user.role !== "admin" && myProducts.length === 0 && (
              <div
                style={{
                  gridColumn: "1/-1",
                  textAlign: "center",
                  padding: "3rem",
                  color: "#999",
                }}
              >
                <p style={{ fontSize: "3rem" }}></p>
                <p>You haven't added any products yet!</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Orders Tab — admin only */}
      {activeTab === "orders" && user.role === "admin" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {orders.map((order, i) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "1.5rem",
                marginBottom: "1rem",
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <div>
                  <p
                    style={{
                      margin: "0 0 0.25rem",
                      fontSize: "0.8rem",
                      color: "#999",
                    }}
                  >
                    Order ID
                  </p>
                  <p
                    style={{
                      margin: "0 0 0.5rem",
                      fontWeight: "bold",
                      fontSize: "0.9rem",
                    }}
                  >
                    {order._id}
                  </p>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#666" }}>
                    {order.user?.name || "User"} — {order.user?.email || ""}
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      background: order.isPaid ? "#d4edda" : "#fff3cd",
                      color: order.isPaid ? "#155724" : "#856404",
                      padding: "0.3rem 0.8rem",
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                    }}
                  >
                    {order.isPaid ? "✓ Paid" : " Unpaid"}
                  </span>
                  <span
                    style={{
                      background: order.isDelivered ? "#d4edda" : "#f8d7da",
                      color: order.isDelivered ? "#155724" : "#721c24",
                      padding: "0.3rem 0.8rem",
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                    }}
                  >
                    {order.isDelivered ? "✓ Delivered" : " Processing"}
                  </span>
                  <span
                    style={{
                      fontWeight: "bold",
                      color: "#e96c4c",
                      fontSize: "1.1rem",
                    }}
                  >
                    ${order.totalPrice}
                  </span>
                  {!order.isDelivered && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDeliver(order._id)}
                      style={{
                        background: "linear-gradient(135deg, #27ae60, #2ecc71)",
                        color: "white",
                        border: "none",
                        padding: "0.4rem 1rem",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "0.85rem",
                      }}
                    >
                      Mark Delivered
                    </motion.button>
                  )}
                </div>
              </div>
              <div
                style={{
                  marginTop: "1rem",
                  display: "flex",
                  gap: "0.5rem",
                  flexWrap: "wrap",
                }}
              >
                {order.items.map((item, j) => (
                  <span
                    key={j}
                    style={{
                      background: "#f8f9fa",
                      padding: "0.3rem 0.75rem",
                      borderRadius: "8px",
                      fontSize: "0.8rem",
                      color: "#555",
                    }}
                  >
                    {item.name} x{item.qty}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Admin;
