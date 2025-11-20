"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const NovoAtendimento_1 = require("./components/NovoAtendimento");
const ListaAtendimentos_1 = require("./components/ListaAtendimentos");
const GerenciarPrecos_1 = require("./components/GerenciarPrecos");
const MeusDados_1 = require("./components/MeusDados");
const tabs_1 = require("./components/ui/tabs");
const lucide_react_1 = require("lucide-react");
function App() {
    const [activeTab, setActiveTab] = (0, react_1.useState)('novo');
    return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 to-green-50", children: (0, jsx_runtime_1.jsxs)("div", { className: "container mx-auto p-4 max-w-7xl", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-lg shadow-lg p-6 mb-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-[rgb(26,13,102)] p-3 rounded-full", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Stethoscope, { className: "size-8 text-white" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-blue-900", children: "VetField Pro" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "Sistema de Gest\u00E3o para Atendimento Veterin\u00E1rio a Campo" })] })] }) }), (0, jsx_runtime_1.jsxs)(tabs_1.Tabs, { value: activeTab, onValueChange: setActiveTab, className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)(tabs_1.TabsList, { className: "grid w-full grid-cols-4 bg-white p-1 rounded-lg shadow", children: [(0, jsx_runtime_1.jsx)(tabs_1.TabsTrigger, { value: "novo", children: "Novo Atendimento" }), (0, jsx_runtime_1.jsx)(tabs_1.TabsTrigger, { value: "lista", children: "Atendimentos" }), (0, jsx_runtime_1.jsx)(tabs_1.TabsTrigger, { value: "precos", children: "Gerenciar Pre\u00E7os" }), (0, jsx_runtime_1.jsx)(tabs_1.TabsTrigger, { value: "dados", children: "Meus Dados" })] }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "novo", className: "mt-0", children: (0, jsx_runtime_1.jsx)(NovoAtendimento_1.NovoAtendimento, { onSuccess: () => setActiveTab('lista') }) }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "lista", className: "mt-0", children: (0, jsx_runtime_1.jsx)(ListaAtendimentos_1.ListaAtendimentos, {}) }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "precos", className: "mt-0", children: (0, jsx_runtime_1.jsx)(GerenciarPrecos_1.GerenciarPrecos, {}) }), (0, jsx_runtime_1.jsx)(tabs_1.TabsContent, { value: "dados", className: "mt-0", children: (0, jsx_runtime_1.jsx)(MeusDados_1.MeusDados, {}) })] })] }) }));
}
//# sourceMappingURL=App.js.map