"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeusDados = MeusDados;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const card_1 = require("./ui/card");
const button_1 = require("./ui/button");
const input_1 = require("./ui/input");
const label_1 = require("./ui/label");
const textarea_1 = require("./ui/textarea");
const lucide_react_1 = require("lucide-react");
const sonner_2_0_3_1 = require("sonner@2.0.3");
function MeusDados() {
    const [dados, setDados] = (0, react_1.useState)({
        nome: '',
        crmv: '',
        telefone: '',
        email: '',
        pix: '',
        banco: '',
        agencia: '',
        conta: '',
        observacoesPagamento: ''
    });
    const [salvando, setSalvando] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const dadosSalvos = localStorage.getItem('dadosProfissional');
        if (dadosSalvos) {
            setDados(JSON.parse(dadosSalvos));
        }
    }, []);
    const salvarDados = async () => {
        setSalvando(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        localStorage.setItem('dadosProfissional', JSON.stringify(dados));
        sonner_2_0_3_1.toast.success('Dados salvos com sucesso!');
        setSalvando(false);
    };
    const atualizarCampo = (campo, valor) => {
        setDados({ ...dados, [campo]: valor });
    };
    const handleLogoUpload = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setDados({ ...dados, logo: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };
    const removeLogo = () => {
        setDados({ ...dados, logo: undefined });
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "space-y-6", children: (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "size-6 text-blue-600" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Meus Dados Profissionais" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 text-sm mt-1", children: "Estes dados ser\u00E3o inclu\u00EDdos nos PDFs enviados aos clientes" })] })] }) }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-gray-900", children: "Dados Pessoais" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "nome", children: "Nome Completo" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "nome", value: dados.nome, onChange: (e) => atualizarCampo('nome', e.target.value), placeholder: "Dr(a). Seu Nome" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "crmv", children: "CRMV" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "crmv", value: dados.crmv, onChange: (e) => atualizarCampo('crmv', e.target.value), placeholder: "CRMV-UF 12345" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "telefone", children: "Telefone" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "telefone", value: dados.telefone, onChange: (e) => atualizarCampo('telefone', e.target.value), placeholder: "(00) 00000-0000" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "email", children: "E-mail" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "email", type: "email", value: dados.email, onChange: (e) => atualizarCampo('email', e.target.value), placeholder: "seu.email@exemplo.com" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "border-t pt-6 space-y-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-gray-900", children: "Dados Banc\u00E1rios para Pagamento" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Essas informa\u00E7\u00F5es aparecer\u00E3o no final do PDF para que o cliente possa efetuar o pagamento" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-2 md:col-span-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "pix", children: "Chave PIX" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "pix", value: dados.pix, onChange: (e) => atualizarCampo('pix', e.target.value), placeholder: "CPF, CNPJ, E-mail, Telefone ou Chave Aleat\u00F3ria" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "banco", children: "Banco" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "banco", value: dados.banco, onChange: (e) => atualizarCampo('banco', e.target.value), placeholder: "Ex: Banco do Brasil" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "agencia", children: "Ag\u00EAncia" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "agencia", value: dados.agencia, onChange: (e) => atualizarCampo('agencia', e.target.value), placeholder: "0000-0" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2 md:col-span-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "conta", children: "Conta" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "conta", value: dados.conta, onChange: (e) => atualizarCampo('conta', e.target.value), placeholder: "00000-0" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2 md:col-span-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "observacoesPagamento", children: "Observa\u00E7\u00F5es sobre Pagamento" }), (0, jsx_runtime_1.jsx)(textarea_1.Textarea, { id: "observacoesPagamento", value: dados.observacoesPagamento, onChange: (e) => atualizarCampo('observacoesPagamento', e.target.value), placeholder: "Ex: Pagamento \u00E0 vista tem 10% de desconto. Parcelamento em at\u00E9 3x sem juros.", rows: 3 })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "border-t pt-6 space-y-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-gray-900", children: "Logo da Cl\u00EDnica" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Adicione um logo para que ele apare\u00E7a no cabe\u00E7alho dos PDFs enviados aos clientes" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: dados.logo ? ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "border-2 border-gray-200 rounded-lg p-4 bg-white", children: (0, jsx_runtime_1.jsx)("img", { src: dados.logo, alt: "Logo da empresa", className: "max-h-24 max-w-48 object-contain" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600 mb-2", children: "Preview do logo que aparecer\u00E1 no PDF" }), (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", onClick: removeLogo, className: "text-red-600 hover:text-red-700 hover:bg-red-50", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "size-4 mr-2" }), "Remover Logo"] })] })] })) : ((0, jsx_runtime_1.jsxs)("div", { className: "border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Image, { className: "size-12 mx-auto text-gray-400 mb-3" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 mb-4", children: "Nenhum logo carregado" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "logo", type: "file", accept: "image/*", onChange: handleLogoUpload, className: "hidden" }), (0, jsx_runtime_1.jsxs)(button_1.Button, { type: "button", className: "bg-blue-600 hover:bg-blue-700", onClick: () => document.getElementById('logo')?.click(), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Upload, { className: "size-4 mr-2" }), "Fazer Upload do Logo"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500 mt-2", children: "PNG, JPG ou JPEG (recomendado: fundo transparente)" })] })) })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex justify-end pt-4 border-t", children: (0, jsx_runtime_1.jsxs)(button_1.Button, { onClick: salvarDados, className: "bg-blue-600 hover:bg-blue-700", children: [salvando ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "size-4 mr-2 animate-spin" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.Save, { className: "size-4 mr-2" })), "Salvar Dados"] }) })] })] }) }));
}
//# sourceMappingURL=MeusDados.js.map