import { NavLink } from "react-router-dom";

function Menu() {
  return (
    <nav>
      <ul>
        <li><NavLink to="/City">Cidade</NavLink></li>
        <li><NavLink to="/State">Estado</NavLink></li>
        <li><NavLink to="/Country">País</NavLink></li>
        <li><NavLink to="/Product">Produto</NavLink></li>
        <li><NavLink to="/Pantry">Despensa</NavLink></li>
        <li><NavLink to="/Shopping">Compras</NavLink></li>
      </ul>
    </nav>
  );
}

export default Menu;
