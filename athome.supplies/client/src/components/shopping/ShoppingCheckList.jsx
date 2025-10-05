// src/components/shopping/ShoppingChecklist.jsx
import React from "react";
import "../../styles/ShoppingChecklist.css";

export default function ShoppingChecklist({ products, onUpdateProduct }) {
  return (
    <table className="checklist" aria-label="Tabela de produtos comprados">
      <thead>
        <tr>
          <th scope="col">Produto</th>
          <th scope="col">Peguei</th>
          <th scope="col">Quantidade</th>
          <th scope="col">Valor Unitário</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.product}>
            <td data-label="Produto">{product.name}</td>
            <td data-label="Peguei">
              <input
                type="checkbox"
                aria-label={`Peguei ${product.name}`}
                checked={product.checked}
                onChange={(e) =>
                  onUpdateProduct(product.product, "checked", e.target.checked)
                }
              />
            </td>
            <td data-label="Quantidade">
              <input
                type="number"
                min="0"
                step="1"
                aria-label={`Quantidade de ${product.name}`}
                value={product.quantity}
                onChange={(e) =>
                  onUpdateProduct(product.product, "quantity", e.target.value)
                }
              />
            </td>
            <td data-label="Valor Unitário (R$)">
              <input
                type="number"
                min="0"
                step="0.01"
                aria-label={`Valor unitário de ${product.name}`}
                value={product.value}
                onChange={(e) =>
                  onUpdateProduct(product.product, "value", e.target.value)
                }
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
