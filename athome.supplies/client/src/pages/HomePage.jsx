import { Link } from "react-router-dom";
import "../styles/homepage.css";

function HomePage() {
  const menus = [
    { path: "/City", label: "Cidades" },
    { path: "/State", label: "Estados" },
    { path: "/Country", label: "Países" },
    { path: "/Market", label: "Mercados" },
    { path: "/Brand", label: "Marcas" },
    { path: "/Product", label: "Produtos" },
    { path: "/ProductPrice", label: "Preço de Produtos" },
    { path: "/Pantry", label: "Despensa" },
    { path: "/Shopping", label: "Compras" },
  ];

  return (
    <div className="home-container">
      <h1>🏠 AtHomeSupplies</h1>
      <p>Selecione uma área para gerenciar:</p>

      <div className="menu-grid">
        {menus.map((menu, index) => (
          <Link key={index} to={menu.path} className="menu-card">
            {menu.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
