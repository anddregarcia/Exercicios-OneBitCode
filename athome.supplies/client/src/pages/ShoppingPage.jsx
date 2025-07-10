import { useState, useEffect, useRef } from 'react';
import '../css/Shop.css';
import MarketModal from '../components/modals/MarketModal.jsx';
import MarketForm from '../components/forms/MarketForm.jsx';

export default function ShoppingChecklist() 
{
  const [markets, setMarkets] = useState([]);
  const [selectedMarkets, setSelectedMarkets] = useState({ _id: null, code: '', name: '' });
  const [newMarket, setNewMarket] = useState({ code: '', name: '' });
  const [productChecklist, setProductChecklist] = useState([]);
  const [isMarketModalOpen, setIsMarketModalOpen] = useState(false);

  const nameInputRef = useRef(null);

  useEffect(() => 
  {
    fetch('http://localhost:3001/api/market')
      .then(res => res.json())
      .then(setMarkets);
      
    fetch('http://localhost:3001/api/product')
      .then(res => res.json())
      .then(data => 
      {        
        const sorted = data.sort((a, b) => a.name.localeCompare(b.name));
        
        setProductChecklist(sorted.map(product => (
        {
          product: product._id,
          name: product.name,
          checked: false,
          quantity: '',
          value: ''
        })));

      });

  }, []);

  useEffect(() =>
  {
    if (isMarketModalOpen && nameInputRef.current)
    {
      nameInputRef.current.focus();
    }
  }, [isMarketModalOpen]);

  useEffect(() =>
  {
    
  }, [selectedMarkets]);

  const handleMarketChange = (market) => 
  {
    setSelectedMarkets(market);
  };

  const handleChecklistChange = (index, field, value) => 
  {
    const updated = [...productChecklist];
    updated[index][field] = field === 'checked' ? value.target.checked : value.target.value;
    setProductChecklist(updated);
  };

  const handleSubmit = async () => 
  {
    const now = new Date();
    const newShop = { market: selectedMarkets, date: new Date(now.getTime() - now.getTimezoneOffset() * 60000) };

    const res = await fetch('http://localhost:3001/api/shop', 
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newShop)
    })

    if (!res.ok)
    {
      alert('Erro ao criar Shop.');
      return;
    }

    const shopData = await res.json();
    const createdShopId = shopData._id;    
    
    const promises = productChecklist.map(item => 
    {
      if (item.checked) 
      {
        const now = new Date();

        const productPrice = 
        {
          product: item.product,
          shop: createdShopId,
          value: parseFloat(item.value),
          quantity: parseFloat(item.quantity),
          date: new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        };
        
        fetch('http://localhost:3001/api/productPrice', 
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productPrice)
        });
      } 
      else
      {
        return Promise.resolve();
      }
    });

    await Promise.all(promises);

    alert('Compra salva com sucesso!');

    setSelectedMarkets('');
    setProductChecklist(productChecklist.map(item => (
    {
      ...item,
      checked: false,
      quantity: '',
      value: ''
    })));
  };

  return (
    <div className="shop-container">
      <h1>Checklist de Compra</h1>

      <div className="market-bar">
        <label>Mercado:</label>
        <select
          value={selectedMarkets}
          onChange={(e) => setSelectedMarkets(e.target.value)}
        >
          <option value="">Selecione um mercado</option>
          {markets.map(market => (
            <option key={market._id} value={market._id}>
              {market.name}
            </option>
          ))}
        </select>

        <button onClick={() => setIsMarketModalOpen(true)}>+</button>
      </div>

      <h2>Produtos</h2>
      <table className="shop-table">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Peguei?</th>
            <th>Quantidade</th>
            <th>Valor Unitário</th>
          </tr>
        </thead>
        <tbody>
          {productChecklist.map((item, index) => (
            <tr key={item.product}>
              <td>{item.name}</td>
              <td>
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={(e) => handleChecklistChange(index, 'checked', e)}
                />
              </td>
              <td>
                <input
                  type="number"
                  step="0.01"
                  value={item.quantity}
                  onChange={(e) => handleChecklistChange(index, 'quantity', e)}
                />
              </td>
              <td>
                <input
                  type="number"
                  step="0.01"
                  value={item.value}
                  onChange={(e) => handleChecklistChange(index, 'value', e)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={handleSubmit}>Salvar Compra</button>

      <MarketModal
        isOpen={isMarketModalOpen}
        onClose={() => setIsMarketModalOpen(false)}
        onMarketCreated={(newMarket) => {
          setMarkets((prev) => [...prev, newMarket]);
          setSelectedMarkets(newMarket._id);
        }}
      />
    </div>
  );
}