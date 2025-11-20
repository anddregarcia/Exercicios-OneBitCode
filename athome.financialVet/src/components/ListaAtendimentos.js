"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListaAtendimentos = ListaAtendimentos;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const card_1 = require("./ui/card");
const button_1 = require("./ui/button");
const input_1 = require("./ui/input");
const badge_1 = require("./ui/badge");
const lucide_react_1 = require("lucide-react");
const DetalhesAtendimento_1 = require("./DetalhesAtendimento");
const alert_dialog_1 = require("./ui/alert-dialog");
const sonner_2_0_3_1 = require("sonner@2.0.3");
const ESPECIES_CORES = {
    'Equinos': 'bg-amber-100 text-amber-800',
    'Caninos': 'bg-blue-100 text-blue-800',
    'Felinos': 'bg-purple-100 text-purple-800',
    'Bovinos': 'bg-green-100 text-green-800',
    'Caprinos': 'bg-orange-100 text-orange-800',
};
function ListaAtendimentos() {
    const [atendimentos, setAtendimentos] = (0, react_1.useState)([]);
    const [atendimentoSelecionado, setAtendimentoSelecionado] = (0, react_1.useState)(null);
    const [atendimentoParaExcluir, setAtendimentoParaExcluir] = (0, react_1.useState)(null);
    const [filtro, setFiltro] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
        carregarAtendimentos();
    }, []);
    const carregarAtendimentos = () => {
        const stored = localStorage.getItem('atendimentos');
        if (stored) {
            const atendimentosCarregados = JSON.parse(stored);
            // Ordenar por data (mais recente primeiro)
            atendimentosCarregados.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
            setAtendimentos(atendimentosCarregados);
        }
    };
    const excluirAtendimento = (id) => {
        const novosAtendimentos = atendimentos.filter(a => a.id !== id);
        localStorage.setItem('atendimentos', JSON.stringify(novosAtendimentos));
        setAtendimentos(novosAtendimentos);
        setAtendimentoParaExcluir(null);
        sonner_2_0_3_1.toast.success('Atendimento excluído com sucesso');
    };
    const formatarData = (data) => {
        const [ano, mes, dia] = data.split('-');
        return `${dia}/${mes}/${ano}`;
    };
    const atendimentosFiltrados = atendimentos.filter(atendimento => {
        const termoBusca = filtro.toLowerCase();
        return (atendimento.nomeAnimal.toLowerCase().includes(termoBusca) ||
            atendimento.nomeProprietario.toLowerCase().includes(termoBusca) ||
            atendimento.local.toLowerCase().includes(termoBusca) ||
            atendimento.especie.toLowerCase().includes(termoBusca));
    });
    if (atendimentoSelecionado) {
        return ((0, jsx_runtime_1.jsx)(DetalhesAtendimento_1.DetalhesAtendimento, { atendimento: atendimentoSelecionado, onVoltar: () => setAtendimentoSelecionado(null), onAtualizar: carregarAtendimentos }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Atendimentos Realizados" }) }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-4", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "size-5 text-gray-400" }), (0, jsx_runtime_1.jsx)(input_1.Input, { placeholder: "Buscar por animal, propriet\u00E1rio, local ou esp\u00E9cie...", value: filtro, onChange: (e) => setFiltro(e.target.value) })] }), atendimentosFiltrados.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-12 text-gray-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "size-12 mx-auto mb-4 text-gray-300" }), (0, jsx_runtime_1.jsx)("p", { children: "Nenhum atendimento encontrado" })] })) : ((0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: atendimentosFiltrados.map(atendimento => ((0, jsx_runtime_1.jsx)("div", { className: "border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer", onClick: () => setAtendimentoSelecionado(atendimento), children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1 space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 flex-wrap", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-gray-900", children: atendimento.nomeAnimal }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { className: ESPECIES_CORES[atendimento.especie] || 'bg-gray-100 text-gray-800', children: atendimento.especie })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-600 space-y-1", children: [(0, jsx_runtime_1.jsxs)("p", { children: ["Propriet\u00E1rio: ", atendimento.nomeProprietario] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 flex-wrap", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "size-4" }), (0, jsx_runtime_1.jsx)("span", { children: formatarData(atendimento.data) })] }), atendimento.local && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "size-4" }), (0, jsx_runtime_1.jsx)("span", { children: atendimento.local })] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 flex-wrap", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-xs text-gray-500", children: [atendimento.procedimentos.length, " procedimento(s)"] }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-400", children: "\u2022" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-xs text-gray-500", children: [atendimento.materiais.length, " material(is)"] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-end gap-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Valor Total" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-green-600", children: ["R$ ", atendimento.valorTotal.toFixed(2)] })] }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", onClick: (e) => {
                                                            e.stopPropagation();
                                                            setAtendimentoParaExcluir(atendimento.id);
                                                        }, children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "size-4 text-red-500" }) })] })] }) }, atendimento.id))) })), atendimentosFiltrados.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "mt-6 pt-4 border-t", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsxs)("p", { className: "text-gray-600", children: ["Total de atendimentos: ", atendimentosFiltrados.length] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Valor Total" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-green-600", children: ["R$ ", atendimentosFiltrados.reduce((sum, a) => sum + a.valorTotal, 0).toFixed(2)] })] })] }) }))] })] }), (0, jsx_runtime_1.jsx)(alert_dialog_1.AlertDialog, { open: !!atendimentoParaExcluir, onOpenChange: () => setAtendimentoParaExcluir(null), children: (0, jsx_runtime_1.jsxs)(alert_dialog_1.AlertDialogContent, { children: [(0, jsx_runtime_1.jsxs)(alert_dialog_1.AlertDialogHeader, { children: [(0, jsx_runtime_1.jsx)(alert_dialog_1.AlertDialogTitle, { children: "Confirmar exclus\u00E3o" }), (0, jsx_runtime_1.jsx)(alert_dialog_1.AlertDialogDescription, { children: "Tem certeza que deseja excluir este atendimento? Esta a\u00E7\u00E3o n\u00E3o pode ser desfeita." })] }), (0, jsx_runtime_1.jsxs)(alert_dialog_1.AlertDialogFooter, { children: [(0, jsx_runtime_1.jsx)(alert_dialog_1.AlertDialogCancel, { children: "Cancelar" }), (0, jsx_runtime_1.jsx)(alert_dialog_1.AlertDialogAction, { onClick: () => atendimentoParaExcluir && excluirAtendimento(atendimentoParaExcluir), className: "bg-red-600 hover:bg-red-700", children: "Excluir" })] })] }) })] }));
}
//# sourceMappingURL=ListaAtendimentos.js.map