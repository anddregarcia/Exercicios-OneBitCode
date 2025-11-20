"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GerenciarPrecos = GerenciarPrecos;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const card_1 = require("./ui/card");
const button_1 = require("./ui/button");
const input_1 = require("./ui/input");
const label_1 = require("./ui/label");
const select_1 = require("./ui/select");
const tabs_1 = require("./ui/tabs");
const lucide_react_1 = require("lucide-react");
const sonner_2_0_3_1 = require("sonner@2.0.3");
const PROCEDIMENTOS_PADRAO = [
    { nome: 'Orquiectomia', valor: 350.00 },
    { nome: 'Infiltrações', valor: 200.00 },
    { nome: 'Raio-X', valor: 150.00 },
    { nome: 'Ultrassom', valor: 180.00 },
    { nome: 'Pequenas Cirurgias', valor: 300.00 },
    { nome: 'Exame Clínico', valor: 120.00 },
    { nome: 'Exame Oftalmológico', valor: 150.00 },
    { nome: 'Consulta Mensal', valor: 100.00 },
];
const MATERIAIS_PADRAO = [
    { nome: 'Agulha 40x12', valorUnitario: 2.50 },
    { nome: 'Agulha 25x7', valorUnitario: 2.00 },
    { nome: 'Seringa 3ml', valorUnitario: 3.00 },
    { nome: 'Seringa 5ml', valorUnitario: 3.50 },
    { nome: 'Seringa 10ml', valorUnitario: 4.00 },
    { nome: 'Seringa 20ml', valorUnitario: 5.00 },
    { nome: 'Cateter Intravenoso', valorUnitario: 15.00 },
    { nome: 'Cateter 14G', valorUnitario: 18.00 },
    { nome: 'Equipo de Soro', valorUnitario: 8.00 },
    { nome: 'Luva Cirúrgica (par)', valorUnitario: 4.00 },
    { nome: 'Fio de Sutura', valorUnitario: 25.00 },
    { nome: 'Gaze Estéril', valorUnitario: 5.00 },
    { nome: 'Esparadrapo', valorUnitario: 6.00 },
    { nome: 'Atadura', valorUnitario: 4.50 },
];
const MEDICACOES_PADRAO = [
    { nome: 'Dipirona 500mg/ml', valorUnitario: 25.00, unidade: 'frasco' },
    { nome: 'Flunixin Meglumine', valorUnitario: 45.00, unidade: 'frasco' },
    { nome: 'Penicilina Benzatina', valorUnitario: 38.00, unidade: 'frasco' },
    { nome: 'Ivermectina', valorUnitario: 3.50, unidade: 'ml' },
    { nome: 'Dexametasona', valorUnitario: 2.80, unidade: 'ml' },
    { nome: 'Ringer Lactato', valorUnitario: 18.00, unidade: 'frasco' },
];
const ESPECIES_PADRAO = ['Equinos', 'Caninos', 'Felinos', 'Bovinos', 'Caprinos'];
function GerenciarPrecos() {
    const [procedimentos, setProcedimentos] = (0, react_1.useState)([]);
    const [materiais, setMateriais] = (0, react_1.useState)([]);
    const [medicacoes, setMedicacoes] = (0, react_1.useState)([]);
    const [especies, setEspecies] = (0, react_1.useState)([]);
    // Loading states
    const [salvandoProc, setSalvandoProc] = (0, react_1.useState)(false);
    const [salvandoMat, setSalvandoMat] = (0, react_1.useState)(false);
    const [salvandoMed, setSalvandoMed] = (0, react_1.useState)(false);
    const [salvandoEsp, setSalvandoEsp] = (0, react_1.useState)(false);
    // Novos procedimentos/materiais/medicações
    const [novoProcNome, setNovoProcNome] = (0, react_1.useState)('');
    const [novoProcValor, setNovoProcValor] = (0, react_1.useState)('');
    const [novoMatNome, setNovoMatNome] = (0, react_1.useState)('');
    const [novoMatValor, setNovoMatValor] = (0, react_1.useState)('');
    const [novaMedNome, setNovaMedNome] = (0, react_1.useState)('');
    const [novaMedValor, setNovaMedValor] = (0, react_1.useState)('');
    const [novaMedUnidade, setNovaMedUnidade] = (0, react_1.useState)('frasco');
    const [novaEspecie, setNovaEspecie] = (0, react_1.useState)('');
    // Edição
    const [editandoProcId, setEditandoProcId] = (0, react_1.useState)(null);
    const [editandoMatIndex, setEditandoMatIndex] = (0, react_1.useState)(null);
    const [editandoMedIndex, setEditandoMedIndex] = (0, react_1.useState)(null);
    const [editandoEspIndex, setEditandoEspIndex] = (0, react_1.useState)(null);
    const [editProcNome, setEditProcNome] = (0, react_1.useState)('');
    const [editProcValor, setEditProcValor] = (0, react_1.useState)('');
    const [editMatNome, setEditMatNome] = (0, react_1.useState)('');
    const [editMatValor, setEditMatValor] = (0, react_1.useState)('');
    const [editMedNome, setEditMedNome] = (0, react_1.useState)('');
    const [editMedValor, setEditMedValor] = (0, react_1.useState)('');
    const [editMedUnidade, setEditMedUnidade] = (0, react_1.useState)('frasco');
    const [editEspNome, setEditEspNome] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
        carregarDados();
    }, []);
    const carregarDados = () => {
        // Carregar procedimentos
        let procStored = localStorage.getItem('procedimentos');
        if (!procStored) {
            const procedimentosIniciais = PROCEDIMENTOS_PADRAO.map((p, index) => ({
                id: `proc-${index}`,
                nome: p.nome,
                valor: p.valor
            }));
            localStorage.setItem('procedimentos', JSON.stringify(procedimentosIniciais));
            setProcedimentos(procedimentosIniciais);
        }
        else {
            setProcedimentos(JSON.parse(procStored));
        }
        // Carregar materiais
        let matStored = localStorage.getItem('materiais');
        if (!matStored) {
            localStorage.setItem('materiais', JSON.stringify(MATERIAIS_PADRAO));
            setMateriais(MATERIAIS_PADRAO);
        }
        else {
            setMateriais(JSON.parse(matStored));
        }
        // Carregar medicações
        let medStored = localStorage.getItem('medicacoes');
        if (!medStored) {
            localStorage.setItem('medicacoes', JSON.stringify(MEDICACOES_PADRAO));
            setMedicacoes(MEDICACOES_PADRAO);
        }
        else {
            setMedicacoes(JSON.parse(medStored));
        }
        // Carregar espécies
        let espStored = localStorage.getItem('especies');
        if (!espStored) {
            localStorage.setItem('especies', JSON.stringify(ESPECIES_PADRAO));
            setEspecies(ESPECIES_PADRAO);
        }
        else {
            setEspecies(JSON.parse(espStored));
        }
    };
    // ===== PROCEDIMENTOS =====
    const adicionarProcedimento = async () => {
        if (!novoProcNome || !novoProcValor) {
            sonner_2_0_3_1.toast.error('Preencha o nome e o valor do procedimento');
            return;
        }
        setSalvandoProc(true);
        await new Promise(resolve => setTimeout(resolve, 300));
        const novoProcedimento = {
            id: Date.now().toString(),
            nome: novoProcNome,
            valor: parseFloat(novoProcValor)
        };
        const novosProcedimentos = [...procedimentos, novoProcedimento];
        setProcedimentos(novosProcedimentos);
        localStorage.setItem('procedimentos', JSON.stringify(novosProcedimentos));
        setNovoProcNome('');
        setNovoProcValor('');
        setSalvandoProc(false);
        sonner_2_0_3_1.toast.success('Procedimento adicionado com sucesso!');
    };
    const excluirProcedimento = (id) => {
        const novosProcedimentos = procedimentos.filter(p => p.id !== id);
        setProcedimentos(novosProcedimentos);
        localStorage.setItem('procedimentos', JSON.stringify(novosProcedimentos));
        sonner_2_0_3_1.toast.success('Procedimento excluído');
    };
    const iniciarEdicaoProcedimento = (proc) => {
        setEditandoProcId(proc.id);
        setEditProcNome(proc.nome);
        setEditProcValor(proc.valor.toString());
    };
    const salvarEdicaoProcedimento = async (id) => {
        if (!editProcNome || !editProcValor) {
            sonner_2_0_3_1.toast.error('Preencha todos os campos');
            return;
        }
        setSalvandoProc(true);
        await new Promise(resolve => setTimeout(resolve, 300));
        const novosProcedimentos = procedimentos.map(p => p.id === id ? { ...p, nome: editProcNome, valor: parseFloat(editProcValor) } : p);
        setProcedimentos(novosProcedimentos);
        localStorage.setItem('procedimentos', JSON.stringify(novosProcedimentos));
        setEditandoProcId(null);
        setSalvandoProc(false);
        sonner_2_0_3_1.toast.success('Procedimento atualizado!');
    };
    const cancelarEdicaoProcedimento = () => {
        setEditandoProcId(null);
        setEditProcNome('');
        setEditProcValor('');
    };
    // ===== MATERIAIS =====
    const adicionarMaterial = async () => {
        if (!novoMatNome || !novoMatValor) {
            sonner_2_0_3_1.toast.error('Preencha o nome e o valor do material');
            return;
        }
        setSalvandoMat(true);
        await new Promise(resolve => setTimeout(resolve, 300));
        const novoMaterial = {
            nome: novoMatNome,
            valorUnitario: parseFloat(novoMatValor)
        };
        const novosMateriais = [...materiais, novoMaterial];
        setMateriais(novosMateriais);
        localStorage.setItem('materiais', JSON.stringify(novosMateriais));
        setNovoMatNome('');
        setNovoMatValor('');
        setSalvandoMat(false);
        sonner_2_0_3_1.toast.success('Material adicionado com sucesso!');
    };
    const excluirMaterial = (index) => {
        const novosMateriais = materiais.filter((_, i) => i !== index);
        setMateriais(novosMateriais);
        localStorage.setItem('materiais', JSON.stringify(novosMateriais));
        sonner_2_0_3_1.toast.success('Material excluído');
    };
    const iniciarEdicaoMaterial = (mat, index) => {
        setEditandoMatIndex(index);
        setEditMatNome(mat.nome);
        setEditMatValor(mat.valorUnitario.toString());
    };
    const salvarEdicaoMaterial = async (index) => {
        if (!editMatNome || !editMatValor) {
            sonner_2_0_3_1.toast.error('Preencha todos os campos');
            return;
        }
        setSalvandoMat(true);
        await new Promise(resolve => setTimeout(resolve, 300));
        const novosMateriais = materiais.map((m, i) => i === index ? { nome: editMatNome, valorUnitario: parseFloat(editMatValor) } : m);
        setMateriais(novosMateriais);
        localStorage.setItem('materiais', JSON.stringify(novosMateriais));
        setEditandoMatIndex(null);
        setSalvandoMat(false);
        sonner_2_0_3_1.toast.success('Material atualizado!');
    };
    const cancelarEdicaoMaterial = () => {
        setEditandoMatIndex(null);
        setEditMatNome('');
        setEditMatValor('');
    };
    // ===== MEDICAÇÕES =====
    const adicionarMedicacao = async () => {
        if (!novaMedNome || !novaMedValor) {
            sonner_2_0_3_1.toast.error('Preencha o nome e o valor da medicação');
            return;
        }
        setSalvandoMed(true);
        await new Promise(resolve => setTimeout(resolve, 300));
        const novaMedicacao = {
            nome: novaMedNome,
            valorUnitario: parseFloat(novaMedValor),
            unidade: novaMedUnidade
        };
        const novasMedicacoes = [...medicacoes, novaMedicacao];
        setMedicacoes(novasMedicacoes);
        localStorage.setItem('medicacoes', JSON.stringify(novasMedicacoes));
        setNovaMedNome('');
        setNovaMedValor('');
        setNovaMedUnidade('frasco');
        setSalvandoMed(false);
        sonner_2_0_3_1.toast.success('Medicação adicionada com sucesso!');
    };
    const excluirMedicacao = (index) => {
        const novasMedicacoes = medicacoes.filter((_, i) => i !== index);
        setMedicacoes(novasMedicacoes);
        localStorage.setItem('medicacoes', JSON.stringify(novasMedicacoes));
        sonner_2_0_3_1.toast.success('Medicação excluída');
    };
    const iniciarEdicaoMedicacao = (med, index) => {
        setEditandoMedIndex(index);
        setEditMedNome(med.nome);
        setEditMedValor(med.valorUnitario.toString());
        setEditMedUnidade(med.unidade);
    };
    const salvarEdicaoMedicacao = async (index) => {
        if (!editMedNome || !editMedValor) {
            sonner_2_0_3_1.toast.error('Preencha todos os campos');
            return;
        }
        setSalvandoMed(true);
        await new Promise(resolve => setTimeout(resolve, 300));
        const novasMedicacoes = medicacoes.map((m, i) => i === index ? { nome: editMedNome, valorUnitario: parseFloat(editMedValor), unidade: editMedUnidade } : m);
        setMedicacoes(novasMedicacoes);
        localStorage.setItem('medicacoes', JSON.stringify(novasMedicacoes));
        setEditandoMedIndex(null);
        setSalvandoMed(false);
        sonner_2_0_3_1.toast.success('Medicação atualizada!');
    };
    const cancelarEdicaoMedicacao = () => {
        setEditandoMedIndex(null);
        setEditMedNome('');
        setEditMedValor('');
        setEditMedUnidade('frasco');
    };
    // ===== ESPÉCIES =====
    const adicionarEspecie = async () => {
        if (!novaEspecie) {
            sonner_2_0_3_1.toast.error('Digite o nome da espécie');
            return;
        }
        if (especies.includes(novaEspecie)) {
            sonner_2_0_3_1.toast.error('Esta espécie já existe');
            return;
        }
        setSalvandoEsp(true);
        await new Promise(resolve => setTimeout(resolve, 300));
        const novasEspecies = [...especies, novaEspecie];
        setEspecies(novasEspecies);
        localStorage.setItem('especies', JSON.stringify(novasEspecies));
        setNovaEspecie('');
        setSalvandoEsp(false);
        sonner_2_0_3_1.toast.success('Espécie adicionada com sucesso!');
    };
    const excluirEspecie = (index) => {
        const novasEspecies = especies.filter((_, i) => i !== index);
        setEspecies(novasEspecies);
        localStorage.setItem('especies', JSON.stringify(novasEspecies));
        sonner_2_0_3_1.toast.success('Espécie excluída');
    };
    const iniciarEdicaoEspecie = (esp, index) => {
        setEditandoEspIndex(index);
        setEditEspNome(esp);
    };
    const salvarEdicaoEspecie = async (index) => {
        if (!editEspNome) {
            sonner_2_0_3_1.toast.error('Digite o nome da espécie');
            return;
        }
        setSalvandoEsp(true);
        await new Promise(resolve => setTimeout(resolve, 300));
        const novasEspecies = especies.map((e, i) => i === index ? editEspNome : e);
        setEspecies(novasEspecies);
        localStorage.setItem('especies', JSON.stringify(novasEspecies));
        setEditandoEspIndex(null);
        setSalvandoEsp(false);
        sonner_2_0_3_1.toast.success('Espécie atualizada!');
    };
    const cancelarEdicaoEspecie = () => {
        setEditandoEspIndex(null);
        setEditEspNome('');
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)(card_1.Card, { children: (0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Gerenciar Pre\u00E7os e Configura\u00E7\u00F5es" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "Cadastre e atualize valores de procedimentos, materiais, medica\u00E7\u00F5es e esp\u00E9cies" })] }) }), (0, jsx_runtime_1.jsxs)(tabs_1.Tabs, { defaultValue: "procedimentos", className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)(tabs_1.TabsList, { className: "grid w-full grid-cols-4", children: [(0, jsx_runtime_1.jsx)(tabs_1.TabsTrigger, { value: "procedimentos", children: "Procedimentos" }), (0, jsx_runtime_1.jsx)(tabs_1.TabsTrigger, { value: "materiais", children: "Materiais" }), (0, jsx_runtime_1.jsx)(tabs_1.TabsTrigger, { value: "medicacoes", children: "Medica\u00E7\u00F5es" }), (0, jsx_runtime_1.jsx)(tabs_1.TabsTrigger, { value: "especies", children: "Esp\u00E9cies" })] }), (0, jsx_runtime_1.jsxs)(tabs_1.TabsContent, { value: "procedimentos", className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-lg", children: "Adicionar Novo Procedimento" }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "md:col-span-2 space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "novoProcNome", children: "Nome do Procedimento" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "novoProcNome", value: novoProcNome, onChange: (e) => setNovoProcNome(e.target.value), placeholder: "Ex: Castra\u00E7\u00E3o" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "novoProcValor", children: "Valor (R$)" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)(input_1.Input, { id: "novoProcValor", type: "number", step: "0.01", min: "0", value: novoProcValor, onChange: (e) => setNovoProcValor(e.target.value), placeholder: "0.00" }), (0, jsx_runtime_1.jsx)(button_1.Button, { onClick: adicionarProcedimento, disabled: salvandoProc, className: "text-[rgb(255,255,255)]", children: salvandoProc ? (0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "size-4 animate-spin" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "size-4" }) })] })] })] }) })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "text-lg", children: ["Procedimentos Cadastrados (", procedimentos.length, ")"] }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: procedimentos.map((proc) => ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-2 p-3 bg-blue-50 rounded-lg", children: editandoProcId === proc.id ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(input_1.Input, { value: editProcNome, onChange: (e) => setEditProcNome(e.target.value), className: "flex-1 bg-white" }), (0, jsx_runtime_1.jsx)(input_1.Input, { type: "number", step: "0.01", min: "0", value: editProcValor, onChange: (e) => setEditProcValor(e.target.value), className: "w-32 bg-white" }), (0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", onClick: () => salvarEdicaoProcedimento(proc.id), disabled: salvandoProc, className: "bg-green-600 hover:bg-green-700", children: salvandoProc ? (0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "size-4 animate-spin" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Check, { className: "size-4" }) }), (0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", variant: "ghost", onClick: cancelarEdicaoProcedimento, children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "size-4" }) })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("p", { className: "flex-1", children: proc.nome }), (0, jsx_runtime_1.jsxs)("p", { className: "w-32 text-blue-600", children: ["R$ ", proc.valor.toFixed(2)] }), (0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", variant: "ghost", onClick: () => iniciarEdicaoProcedimento(proc), children: (0, jsx_runtime_1.jsx)(lucide_react_1.Edit2, { className: "size-4" }) }), (0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", variant: "ghost", onClick: () => excluirProcedimento(proc.id), children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "size-4 text-red-500" }) })] })) }, proc.id))) }) })] })] }), (0, jsx_runtime_1.jsxs)(tabs_1.TabsContent, { value: "materiais", className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-lg", children: "Adicionar Novo Material" }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "md:col-span-2 space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "novoMatNome", children: "Nome do Material" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "novoMatNome", value: novoMatNome, onChange: (e) => setNovoMatNome(e.target.value), placeholder: "Ex: Seringa 10ml" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "novoMatValor", children: "Valor Unit\u00E1rio (R$)" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)(input_1.Input, { id: "novoMatValor", type: "number", step: "0.01", min: "0", value: novoMatValor, onChange: (e) => setNovoMatValor(e.target.value), placeholder: "0.00" }), (0, jsx_runtime_1.jsx)(button_1.Button, { onClick: adicionarMaterial, disabled: salvandoMat, className: "text-[rgb(255,255,255)]", children: salvandoMat ? (0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "size-4 animate-spin" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "size-4" }) })] })] })] }) })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "text-lg", children: ["Materiais Cadastrados (", materiais.length, ")"] }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: materiais.map((mat, index) => ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-2 p-3 bg-green-50 rounded-lg", children: editandoMatIndex === index ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(input_1.Input, { value: editMatNome, onChange: (e) => setEditMatNome(e.target.value), className: "flex-1 bg-white" }), (0, jsx_runtime_1.jsx)(input_1.Input, { type: "number", step: "0.01", min: "0", value: editMatValor, onChange: (e) => setEditMatValor(e.target.value), className: "w-32 bg-white" }), (0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", onClick: () => salvarEdicaoMaterial(index), disabled: salvandoMat, className: "bg-green-600 hover:bg-green-700", children: salvandoMat ? (0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "size-4 animate-spin" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Check, { className: "size-4" }) }), (0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", variant: "ghost", onClick: cancelarEdicaoMaterial, children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "size-4" }) })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("p", { className: "flex-1", children: mat.nome }), (0, jsx_runtime_1.jsxs)("p", { className: "w-32 text-green-600", children: ["R$ ", mat.valorUnitario.toFixed(2)] }), (0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", variant: "ghost", onClick: () => iniciarEdicaoMaterial(mat, index), children: (0, jsx_runtime_1.jsx)(lucide_react_1.Edit2, { className: "size-4" }) }), (0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", variant: "ghost", onClick: () => excluirMaterial(index), children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "size-4 text-red-500" }) })] })) }, index))) }) })] })] }), (0, jsx_runtime_1.jsxs)(tabs_1.TabsContent, { value: "medicacoes", className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-lg", children: "Adicionar Nova Medica\u00E7\u00E3o" }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "md:col-span-2 space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "novaMedNome", children: "Nome da Medica\u00E7\u00E3o" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "novaMedNome", value: novaMedNome, onChange: (e) => setNovaMedNome(e.target.value), placeholder: "Ex: Dipirona 500mg/ml" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "novaMedUnidade", children: "Unidade" }), (0, jsx_runtime_1.jsxs)(select_1.Select, { value: novaMedUnidade, onValueChange: (value) => setNovaMedUnidade(value), children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { id: "novaMedUnidade", children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, {}) }), (0, jsx_runtime_1.jsxs)(select_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "frasco", children: "Por Frasco" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "ml", children: "Por ML" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "novaMedValor", children: "Valor (R$)" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)(input_1.Input, { id: "novaMedValor", type: "number", step: "0.01", min: "0", value: novaMedValor, onChange: (e) => setNovaMedValor(e.target.value), placeholder: "0.00" }), (0, jsx_runtime_1.jsx)(button_1.Button, { onClick: adicionarMedicacao, disabled: salvandoMed, className: "text-[rgb(255,255,255)]", children: salvandoMed ? (0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "size-4 animate-spin" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "size-4" }) })] })] })] }) })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "text-lg", children: ["Medica\u00E7\u00F5es Cadastradas (", medicacoes.length, ")"] }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: medicacoes.map((med, index) => ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-2 p-3 bg-purple-50 rounded-lg", children: editandoMedIndex === index ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(input_1.Input, { value: editMedNome, onChange: (e) => setEditMedNome(e.target.value), className: "flex-1 bg-white" }), (0, jsx_runtime_1.jsxs)(select_1.Select, { value: editMedUnidade, onValueChange: (value) => setEditMedUnidade(value), children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { className: "w-32 bg-white", children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, {}) }), (0, jsx_runtime_1.jsxs)(select_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "frasco", children: "Frasco" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "ml", children: "ML" })] })] }), (0, jsx_runtime_1.jsx)(input_1.Input, { type: "number", step: "0.01", min: "0", value: editMedValor, onChange: (e) => setEditMedValor(e.target.value), className: "w-32 bg-white" }), (0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", onClick: () => salvarEdicaoMedicacao(index), disabled: salvandoMed, className: "bg-green-600 hover:bg-green-700", children: salvandoMed ? (0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "size-4 animate-spin" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Check, { className: "size-4" }) }), (0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", variant: "ghost", onClick: cancelarEdicaoMedicacao, children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "size-4" }) })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("p", { className: "flex-1", children: med.nome }), (0, jsx_runtime_1.jsxs)("p", { className: "w-24 text-purple-600 text-sm", children: ["(", med.unidade, ")"] }), (0, jsx_runtime_1.jsxs)("p", { className: "w-32 text-purple-600", children: ["R$ ", med.valorUnitario.toFixed(2)] }), (0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", variant: "ghost", onClick: () => iniciarEdicaoMedicacao(med, index), children: (0, jsx_runtime_1.jsx)(lucide_react_1.Edit2, { className: "size-4" }) }), (0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", variant: "ghost", onClick: () => excluirMedicacao(index), children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "size-4 text-red-500" }) })] })) }, index))) }) })] })] }), (0, jsx_runtime_1.jsxs)(tabs_1.TabsContent, { value: "especies", className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-lg", children: "Adicionar Nova Esp\u00E9cie" }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)("div", { className: "flex gap-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "novaEspecie", children: "Nome da Esp\u00E9cie" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)(input_1.Input, { id: "novaEspecie", value: novaEspecie, onChange: (e) => setNovaEspecie(e.target.value), placeholder: "Ex: Su\u00EDnos" }), (0, jsx_runtime_1.jsx)(button_1.Button, { onClick: adicionarEspecie, disabled: salvandoEsp, className: "text-[rgb(255,255,255)]", children: salvandoEsp ? (0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "size-4 animate-spin" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "size-4" }) })] })] }) }) })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "text-lg", children: ["Esp\u00E9cies Cadastradas (", especies.length, ")"] }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: especies.map((esp, index) => ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-2 p-3 bg-amber-50 rounded-lg", children: editandoEspIndex === index ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(input_1.Input, { value: editEspNome, onChange: (e) => setEditEspNome(e.target.value), className: "flex-1 bg-white" }), (0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", onClick: () => salvarEdicaoEspecie(index), disabled: salvandoEsp, className: "bg-green-600 hover:bg-green-700", children: salvandoEsp ? (0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "size-4 animate-spin" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Check, { className: "size-4" }) }), (0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", variant: "ghost", onClick: cancelarEdicaoEspecie, children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "size-4" }) })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("p", { className: "flex-1", children: esp }), (0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", variant: "ghost", onClick: () => iniciarEdicaoEspecie(esp, index), children: (0, jsx_runtime_1.jsx)(lucide_react_1.Edit2, { className: "size-4" }) }), (0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", variant: "ghost", onClick: () => excluirEspecie(index), children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "size-4 text-red-500" }) })] })) }, index))) }) })] })] })] })] }));
}
//# sourceMappingURL=GerenciarPrecos.js.map