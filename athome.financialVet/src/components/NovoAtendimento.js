"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NovoAtendimento = NovoAtendimento;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const button_1 = require("./ui/button");
const input_1 = require("./ui/input");
const label_1 = require("./ui/label");
const textarea_1 = require("./ui/textarea");
const select_1 = require("./ui/select");
const card_1 = require("./ui/card");
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
function NovoAtendimento({ onSuccess }) {
    const [data, setData] = (0, react_1.useState)(new Date().toISOString().split('T')[0]);
    const [nomeAnimal, setNomeAnimal] = (0, react_1.useState)('');
    const [idadeAnimal, setIdadeAnimal] = (0, react_1.useState)('');
    const [especie, setEspecie] = (0, react_1.useState)('');
    const [nomeProprietario, setNomeProprietario] = (0, react_1.useState)('');
    const [telefoneProprietario, setTelefoneProprietario] = (0, react_1.useState)('');
    const [local, setLocal] = (0, react_1.useState)('');
    const [endereco, setEndereco] = (0, react_1.useState)('');
    const [observacoes, setObservacoes] = (0, react_1.useState)('');
    const [procedimentosSelecionados, setProcedimentosSelecionados] = (0, react_1.useState)([]);
    const [materiaisUtilizados, setMateriaisUtilizados] = (0, react_1.useState)([]);
    const [medicacoesUtilizadas, setMedicacoesUtilizadas] = (0, react_1.useState)([]);
    const [procedimentosCadastrados, setProcedimentosCadastrados] = (0, react_1.useState)([]);
    const [materiaisCadastrados, setMateriaisCadastrados] = (0, react_1.useState)([]);
    const [medicacoesCadastradas, setMedicacoesCadastradas] = (0, react_1.useState)([]);
    const [especiesDisponiveis, setEspeciesDisponiveis] = (0, react_1.useState)([]);
    const [salvando, setSalvando] = (0, react_1.useState)(false);
    // Inicializar dados padrão se não existirem
    (0, react_1.useEffect)(() => {
        // Inicializar procedimentos
        let procStored = localStorage.getItem('procedimentos');
        if (!procStored) {
            const procedimentosIniciais = PROCEDIMENTOS_PADRAO.map((p, index) => ({
                id: `proc-${index}`,
                nome: p.nome,
                valor: p.valor
            }));
            localStorage.setItem('procedimentos', JSON.stringify(procedimentosIniciais));
            setProcedimentosCadastrados(procedimentosIniciais);
        }
        else {
            setProcedimentosCadastrados(JSON.parse(procStored));
        }
        // Inicializar materiais
        let matStored = localStorage.getItem('materiais');
        if (!matStored) {
            localStorage.setItem('materiais', JSON.stringify(MATERIAIS_PADRAO));
            setMateriaisCadastrados(MATERIAIS_PADRAO);
        }
        else {
            setMateriaisCadastrados(JSON.parse(matStored));
        }
        // Inicializar medicações
        let medStored = localStorage.getItem('medicacoes');
        if (!medStored) {
            localStorage.setItem('medicacoes', JSON.stringify(MEDICACOES_PADRAO));
            setMedicacoesCadastradas(MEDICACOES_PADRAO);
        }
        else {
            setMedicacoesCadastradas(JSON.parse(medStored));
        }
        // Inicializar espécies
        let espStored = localStorage.getItem('especies');
        if (!espStored) {
            localStorage.setItem('especies', JSON.stringify(ESPECIES_PADRAO));
            setEspeciesDisponiveis(ESPECIES_PADRAO);
        }
        else {
            setEspeciesDisponiveis(JSON.parse(espStored));
        }
    }, []);
    // Carregar procedimentos e materiais cadastrados
    const getProcedimentosCadastrados = () => {
        const stored = localStorage.getItem('procedimentos');
        return stored ? JSON.parse(stored) : [];
    };
    const getMateriaisCadastrados = () => {
        const stored = localStorage.getItem('materiais');
        return stored ? JSON.parse(stored) : [];
    };
    const getMedicacoesCadastradas = () => {
        const stored = localStorage.getItem('medicacoes');
        return stored ? JSON.parse(stored) : [];
    };
    const adicionarProcedimento = (procedimentoId) => {
        const procedimentos = getProcedimentosCadastrados();
        const proc = procedimentos.find(p => p.id === procedimentoId);
        if (proc && !procedimentosSelecionados.find(p => p.id === proc.id)) {
            setProcedimentosSelecionados([...procedimentosSelecionados, proc]);
        }
    };
    const removerProcedimento = (id) => {
        setProcedimentosSelecionados(procedimentosSelecionados.filter(p => p.id !== id));
    };
    const adicionarMaterial = () => {
        const novoMaterial = {
            id: Date.now().toString(),
            nome: '',
            quantidade: 1,
            valorUnitario: 0
        };
        setMateriaisUtilizados([...materiaisUtilizados, novoMaterial]);
    };
    const atualizarMaterial = (id, campo, valor) => {
        setMateriaisUtilizados(materiaisUtilizados.map(m => {
            if (m.id === id) {
                // Se estiver alterando o nome do material, buscar o valor cadastrado
                if (campo === 'nome') {
                    const materialCadastrado = materiaisCadastrados.find(mat => mat.nome === valor);
                    if (materialCadastrado) {
                        return {
                            ...m,
                            nome: valor,
                            valorUnitario: materialCadastrado.valorUnitario
                        };
                    }
                }
                return { ...m, [campo]: valor };
            }
            return m;
        }));
    };
    const removerMaterial = (id) => {
        setMateriaisUtilizados(materiaisUtilizados.filter(m => m.id !== id));
    };
    const adicionarMedicacao = () => {
        const novaMedicacao = {
            id: Date.now().toString(),
            nome: '',
            quantidade: 1,
            valorUnitario: 0,
            unidade: 'frasco'
        };
        setMedicacoesUtilizadas([...medicacoesUtilizadas, novaMedicacao]);
    };
    const atualizarMedicacao = (id, campo, valor) => {
        setMedicacoesUtilizadas(medicacoesUtilizadas.map(m => {
            if (m.id === id) {
                // Se estiver alterando o nome da medicação, buscar o valor e unidade cadastrados
                if (campo === 'nome') {
                    const medicacaoCadastrada = medicacoesCadastradas.find(med => med.nome === valor);
                    if (medicacaoCadastrada) {
                        return {
                            ...m,
                            nome: valor,
                            valorUnitario: medicacaoCadastrada.valorUnitario,
                            unidade: medicacaoCadastrada.unidade
                        };
                    }
                }
                return { ...m, [campo]: valor };
            }
            return m;
        }));
    };
    const removerMedicacao = (id) => {
        setMedicacoesUtilizadas(medicacoesUtilizadas.filter(m => m.id !== id));
    };
    const calcularTotal = () => {
        const totalProcedimentos = procedimentosSelecionados.reduce((sum, p) => sum + p.valor, 0);
        const totalMateriais = materiaisUtilizados.reduce((sum, m) => sum + (m.quantidade * m.valorUnitario), 0);
        const totalMedicacoes = medicacoesUtilizadas.reduce((sum, m) => sum + (m.quantidade * m.valorUnitario), 0);
        return totalProcedimentos + totalMateriais + totalMedicacoes;
    };
    const salvarAtendimento = async () => {
        if (!nomeAnimal || !especie || !nomeProprietario || !telefoneProprietario) {
            sonner_2_0_3_1.toast.error('Preencha todos os campos obrigatórios');
            return;
        }
        setSalvando(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        const novoAtendimento = {
            id: Date.now().toString(),
            data,
            nomeAnimal,
            idadeAnimal,
            especie,
            nomeProprietario,
            telefoneProprietario,
            local,
            endereco,
            procedimentos: procedimentosSelecionados,
            materiais: materiaisUtilizados,
            medicacoes: medicacoesUtilizadas,
            observacoes,
            valorTotal: calcularTotal()
        };
        const atendimentos = JSON.parse(localStorage.getItem('atendimentos') || '[]');
        atendimentos.push(novoAtendimento);
        localStorage.setItem('atendimentos', JSON.stringify(atendimentos));
        sonner_2_0_3_1.toast.success('Atendimento salvo com sucesso!');
        // Limpar formulário
        setNomeAnimal('');
        setIdadeAnimal('');
        setEspecie('');
        setNomeProprietario('');
        setTelefoneProprietario('');
        setLocal('');
        setEndereco('');
        setObservacoes('');
        setProcedimentosSelecionados([]);
        setMateriaisUtilizados([]);
        setMedicacoesUtilizadas([]);
        setSalvando(false);
        onSuccess();
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Dados do Atendimento" }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "data", children: "Data do Atendimento *" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "data", type: "date", value: data, onChange: (e) => setData(e.target.value) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "local", children: "Local" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "local", value: local, onChange: (e) => setLocal(e.target.value), placeholder: "Nome do local" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "md:col-span-2 space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "endereco", children: "Endere\u00E7o" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "endereco", value: endereco, onChange: (e) => setEndereco(e.target.value), placeholder: "Endere\u00E7o completo" })] })] }) })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Dados do Animal e Propriet\u00E1rio" }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "nomeAnimal", children: "Nome do Animal *" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "nomeAnimal", value: nomeAnimal, onChange: (e) => setNomeAnimal(e.target.value), placeholder: "Nome do animal" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "idadeAnimal", children: "Idade do Animal" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "idadeAnimal", value: idadeAnimal, onChange: (e) => setIdadeAnimal(e.target.value), placeholder: "Ex: 5 anos" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "especie", children: "Esp\u00E9cie *" }), (0, jsx_runtime_1.jsxs)(select_1.Select, { value: especie, onValueChange: setEspecie, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { id: "especie", children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, { placeholder: "Selecione a esp\u00E9cie" }) }), (0, jsx_runtime_1.jsx)(select_1.SelectContent, { children: especiesDisponiveis.map((esp) => ((0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: esp, children: esp }, esp))) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "nomeProprietario", children: "Nome do Propriet\u00E1rio *" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "nomeProprietario", value: nomeProprietario, onChange: (e) => setNomeProprietario(e.target.value), placeholder: "Nome completo" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "md:col-span-2 space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "telefone", children: "Telefone/WhatsApp do Propriet\u00E1rio *" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "telefone", value: telefoneProprietario, onChange: (e) => setTelefoneProprietario(e.target.value), placeholder: "(00) 00000-0000" })] })] }) })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between", children: (0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Procedimentos Realizados" }) }) }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { children: "Adicionar Procedimento" }), (0, jsx_runtime_1.jsxs)(select_1.Select, { onValueChange: adicionarProcedimento, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, { placeholder: "Selecione um procedimento" }) }), (0, jsx_runtime_1.jsx)(select_1.SelectContent, { children: procedimentosCadastrados
                                                    .filter(p => !procedimentosSelecionados.find(ps => ps.id === p.id))
                                                    .map((proc) => ((0, jsx_runtime_1.jsxs)(select_1.SelectItem, { value: proc.id, children: [proc.nome, " - R$ ", proc.valor.toFixed(2)] }, proc.id))) })] })] }), procedimentosSelecionados.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [procedimentosSelecionados.map((proc) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-3 bg-blue-50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("p", { children: proc.nome }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsxs)("p", { className: "text-blue-600", children: ["R$ ", proc.valor.toFixed(2)] }), (0, jsx_runtime_1.jsx)(button_1.Button, { size: "sm", variant: "ghost", onClick: () => removerProcedimento(proc.id), children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "size-4 text-red-500" }) })] })] }, proc.id))), (0, jsx_runtime_1.jsxs)("div", { className: "text-right text-blue-600", children: ["Subtotal: R$ ", procedimentosSelecionados.reduce((sum, p) => sum + p.valor, 0).toFixed(2)] })] }))] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Materiais Utilizados" }), (0, jsx_runtime_1.jsxs)(button_1.Button, { onClick: adicionarMaterial, size: "sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "size-4 mr-2" }), "Adicionar Material"] })] }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "space-y-3", children: materiaisUtilizados.map((material) => ((0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-green-50 rounded-lg space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "md:col-span-2 space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { children: "Material" }), (0, jsx_runtime_1.jsxs)(select_1.Select, { value: material.nome, onValueChange: (valor) => atualizarMaterial(material.id, 'nome', valor), children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, { placeholder: "Selecione o material" }) }), (0, jsx_runtime_1.jsx)(select_1.SelectContent, { children: materiaisCadastrados.map((mat, index) => ((0, jsx_runtime_1.jsxs)(select_1.SelectItem, { value: mat.nome, children: [mat.nome, " - R$ ", mat.valorUnitario.toFixed(2)] }, index))) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { children: "Quantidade" }), (0, jsx_runtime_1.jsx)(input_1.Input, { type: "number", min: "1", value: material.quantidade, onChange: (e) => atualizarMaterial(material.id, 'quantidade', parseInt(e.target.value) || 1) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { children: "Valor Unit. (R$)" }), (0, jsx_runtime_1.jsx)(input_1.Input, { type: "number", step: "0.01", min: "0", value: material.valorUnitario, onChange: (e) => atualizarMaterial(material.id, 'valorUnitario', parseFloat(e.target.value) || 0) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(button_1.Button, { size: "sm", variant: "ghost", onClick: () => removerMaterial(material.id), className: "text-red-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "size-4 mr-2" }), "Remover"] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right text-gray-700", children: ["Subtotal: R$ ", (material.quantidade * material.valorUnitario).toFixed(2)] })] })] }, material.id))) })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Medica\u00E7\u00F5es Utilizadas" }), (0, jsx_runtime_1.jsxs)(button_1.Button, { onClick: adicionarMedicacao, size: "sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "size-4 mr-2" }), "Adicionar Medica\u00E7\u00E3o"] })] }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "space-y-3", children: medicacoesUtilizadas.map((medicacao) => ((0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-purple-50 rounded-lg space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-5 gap-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "md:col-span-2 space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { children: "Medica\u00E7\u00E3o" }), (0, jsx_runtime_1.jsxs)(select_1.Select, { value: medicacao.nome, onValueChange: (valor) => atualizarMedicacao(medicacao.id, 'nome', valor), children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, { placeholder: "Selecione a medica\u00E7\u00E3o" }) }), (0, jsx_runtime_1.jsx)(select_1.SelectContent, { children: medicacoesCadastradas.map((med, index) => ((0, jsx_runtime_1.jsxs)(select_1.SelectItem, { value: med.nome, children: [med.nome, " - R$ ", med.valorUnitario.toFixed(2), "/", med.unidade] }, index))) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { children: "Unidade" }), (0, jsx_runtime_1.jsxs)(select_1.Select, { value: medicacao.unidade, onValueChange: (valor) => atualizarMedicacao(medicacao.id, 'unidade', valor), children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, {}) }), (0, jsx_runtime_1.jsxs)(select_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "frasco", children: "Frasco" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "ml", children: "ML" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { children: "Quantidade" }), (0, jsx_runtime_1.jsx)(input_1.Input, { type: "number", min: "1", step: medicacao.unidade === 'ml' ? '0.1' : '1', value: medicacao.quantidade, onChange: (e) => atualizarMedicacao(medicacao.id, 'quantidade', parseFloat(e.target.value) || 1) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { children: "Valor Unit. (R$)" }), (0, jsx_runtime_1.jsx)(input_1.Input, { type: "number", step: "0.01", min: "0", value: medicacao.valorUnitario, onChange: (e) => atualizarMedicacao(medicacao.id, 'valorUnitario', parseFloat(e.target.value) || 0) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(button_1.Button, { size: "sm", variant: "ghost", onClick: () => removerMedicacao(medicacao.id), className: "text-red-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "size-4 mr-2" }), "Remover"] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right text-gray-700", children: ["Subtotal: R$ ", (medicacao.quantidade * medicacao.valorUnitario).toFixed(2)] })] })] }, medicacao.id))) })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsx)(card_1.CardTitle, { children: "Observa\u00E7\u00F5es" }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)(textarea_1.Textarea, { value: observacoes, onChange: (e) => setObservacoes(e.target.value), placeholder: "Observa\u00E7\u00F5es sobre o atendimento...", rows: 4 }) })] }), (0, jsx_runtime_1.jsx)(card_1.Card, { className: "bg-gradient-to-r from-blue-600 to-green-600 text-white", children: (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "pt-6 bg-[rgb(26,13,102)]", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-[rgb(255,255,255)]", children: "Valor Total do Atendimento" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-3xl text-[rgb(255,255,255)]", children: ["R$ ", calcularTotal().toFixed(2)] })] }), (0, jsx_runtime_1.jsx)(button_1.Button, { onClick: salvarAtendimento, size: "lg", disabled: salvando, className: "bg-white text-[rgb(0,0,0)] hover:bg-blue-50", children: salvando ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "size-5 mr-2 animate-spin" }), "Salvando..."] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Save, { className: "size-5 mr-2" }), "Salvar Atendimento"] })) })] }) }) })] }));
}
//# sourceMappingURL=NovoAtendimento.js.map