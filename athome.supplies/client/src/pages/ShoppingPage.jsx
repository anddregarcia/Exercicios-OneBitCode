// src/pages/ShoppingPage.jsx
import { useEffect, useState } from "react";
import FormContainer from "../components/ui/FormContainer";
import ShoppingChecklist from "../components/shopping/ShoppingChecklist";
import MarketModal from "../components/modals/MarketModal";
import ProductModal from "../components/modals/ProductModal";
import Button from "../components/ui/Button";
import "../styles/ShoppingChecklist.css";

export default function ShoppingPage() {
  const [markets, setMarkets] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState("");
  const [productChecklist, setProductChecklist] = useState([]);
  const [isModalMarketOpen, setIsModalMarketOpen] = useState(false);
  const [isModalProductOpen, setIsModalProductOpen] = useState(false);

  useEffect(() => {
    // Carregar mercados
    fetch("http://localhost:3001/api/market")
      .then((res) => res.json())
      .then(setMarkets)
      .catch(() => alert("Erro ao carregar mercados."));

    // Carregar produtos
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    fetch("http://localhost:3001/api/product")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort((a, b) => a.name.localeCompare(b.name));
        setProductChecklist(
          sorted.map((p) => ({
            product: p._id,
            name: p.name,
            checked: false,
            quantity: "",
            value: "",
          }))
        );
      })
      .catch(() => alert("Erro ao carregar produtos."));
  };

  const handleUpdateProduct = (id, field, value) => {
    setProductChecklist((prev) =>
      prev.map((p) => (p.product === id ? { ...p, [field]: value } : p))
    );
  };

  const handleSubmit = async () => {
    if (!selectedMarket) {
      alert("Selecione um mercado antes de salvar.");
      return;
    }

    const newShop = { market: selectedMarket, date: new Date().toISOString() };

    const res = await fetch("http://localhost:3001/api/shop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newShop),
    });

    if (!res.ok) {
      alert("Erro ao criar a compra (Shop).");
      return;
    }

    const shopData = await res.json();

    await Promise.all(
      productChecklist
        .filter((p) => p.checked)
        .map((p) => {
          const productPrice = {
            product: p.product,
            shop: shopData._id,
            value: parseFloat(p.value) || 0,
            quantity: parseFloat(p.quantity) || 0,
            date: new Date().toISOString(),
          };
          return fetch("http://localhost:3001/api/productPrice", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productPrice),
          });
        })
    );

    alert("Compra salva com sucesso!");

    // Resetar estado
    setSelectedMarket("");
    setProductChecklist((prev) =>
      prev.map((p) => ({ ...p, checked: false, quantity: "", value: "" }))
    );
  };

  return (
    <FormContainer title="Checklist de Compras">
      {/* Seletor de mercado */}
      <div className="market-bar">
        <label htmlFor="market-select">Mercado:</label>
        <select
          id="market-select"
          value={selectedMarket}
          onChange={(e) => setSelectedMarket(e.target.value)}
        >
          <option value="">Selecione um mercado</option>
          {markets.map((m) => (
            <option key={m._id} value={m._id}>
              {m.name}
            </option>
          ))}
        </select>
        <Button onClick={() => setIsModalMarketOpen(true)}>+ Adicionar</Button>
      </div>

      {/* Checklist de produtos */}
      <div className="product-bar">
        <h3 className="section-title">Lista de Produtos</h3>
        <Button onClick={() => setIsModalProductOpen(true)}>+ Adicionar Produto</Button>
      </div>

      <ShoppingChecklist
        products={productChecklist}
        onUpdateProduct={handleUpdateProduct}
      />

      <div className="actions">
        <Button variant="primary" onClick={handleSubmit}>
          Salvar Compra
        </Button>
      </div>

      {/* Modal de Mercado */}
      <MarketModal
        isOpen={isModalMarketOpen}
        onClose={() => setIsModalMarketOpen(false)}
        onMarketCreated={(m) => {
          setMarkets((prev) => [...prev, m]);
          setSelectedMarket(m._id);
        }}
      />

      {/* Modal de Produto */}
      <ProductModal
        isOpen={isModalProductOpen}
        onClose={() => setIsModalProductOpen(false)}
        onProductCreated={(newProduct) => {
          setProductChecklist((prev) => {
            const updated = [...prev, {
              product: newProduct._id,
              name: newProduct.name,
              checked: false,
              quantity: "",
              value: ""
            }];
            return updated.sort((a, b) => a.name.localeCompare(b.name));
          });
        }}
      />
    </FormContainer>
  );
}
