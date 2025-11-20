"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DetalhesAtendimento = DetalhesAtendimento;
const jsx_runtime_1 = require("react/jsx-runtime");
const card_1 = require("./ui/card");
const button_1 = require("./ui/button");
const badge_1 = require("./ui/badge");
const lucide_react_1 = require("lucide-react");
const sonner_2_0_3_1 = require("sonner@2.0.3");
const jspdf_1 = __importDefault(require("jspdf"));
const react_1 = require("react");
const ESPECIES_CORES = {
    'Equinos': 'bg-amber-100 text-amber-800',
    'Caninos': 'bg-blue-100 text-blue-800',
    'Felinos': 'bg-purple-100 text-purple-800',
    'Bovinos': 'bg-green-100 text-green-800',
    'Caprinos': 'bg-orange-100 text-orange-800',
};
function DetalhesAtendimento({ atendimento, onVoltar, onAtualizar }) {
    const formatarData = (data) => {
        const [ano, mes, dia] = data.split('-');
        return `${dia}/${mes}/${ano}`;
    };
    const gerarPDF = () => {
        const doc = new jspdf_1.default();
        const margemEsquerda = 20;
        let y = 20;
        // Carregar dados profissionais
        const dadosProfissionaisStr = localStorage.getItem('dadosProfissional');
        const dadosProfissionais = dadosProfissionaisStr ? JSON.parse(dadosProfissionaisStr) : null;
        // Logo no cabeçalho (se existir)
        if (dadosProfissionais?.logo) {
            try {
                const logoWidth = 40;
                const logoHeight = 20;
                doc.addImage(dadosProfissionais.logo, 'PNG', 150, y, logoWidth, logoHeight);
            }
            catch (error) {
                console.error('Erro ao adicionar logo ao PDF:', error);
            }
        }
        // Cabeçalho com dados profissionais
        if (dadosProfissionais && dadosProfissionais.nome) {
            doc.setFontSize(14);
            doc.text(dadosProfissionais.nome, margemEsquerda, y);
            y += 6;
            if (dadosProfissionais.crmv) {
                doc.setFontSize(10);
                doc.text(dadosProfissionais.crmv, margemEsquerda, y);
                y += 5;
            }
            if (dadosProfissionais.telefone || dadosProfissionais.email) {
                doc.setFontSize(9);
                const contato = [];
                if (dadosProfissionais.telefone)
                    contato.push(dadosProfissionais.telefone);
                if (dadosProfissionais.email)
                    contato.push(dadosProfissionais.email);
                doc.text(contato.join(' | '), margemEsquerda, y);
                y += 8;
            }
            else {
                y += 5;
            }
        }
        // Ajustar y se houver logo mas não houver nome
        if (dadosProfissionais?.logo && !dadosProfissionais?.nome) {
            y += 25;
        }
        // Título
        doc.setFontSize(18);
        doc.text('RELATÓRIO DE ATENDIMENTO VETERINÁRIO', margemEsquerda, y);
        y += 10;
        // Linha separadora
        doc.setLineWidth(0.5);
        doc.line(margemEsquerda, y, 190, y);
        y += 10;
        // Informações do atendimento
        doc.setFontSize(12);
        doc.text(`Data: ${formatarData(atendimento.data)}`, margemEsquerda, y);
        y += 7;
        if (atendimento.local) {
            doc.text(`Local: ${atendimento.local}`, margemEsquerda, y);
            y += 7;
        }
        if (atendimento.endereco) {
            doc.text(`Endereço: ${atendimento.endereco}`, margemEsquerda, y);
            y += 7;
        }
        y += 5;
        // Dados do Animal
        doc.setFontSize(14);
        doc.text('DADOS DO ANIMAL', margemEsquerda, y);
        y += 8;
        doc.setFontSize(11);
        doc.text(`Nome: ${atendimento.nomeAnimal}`, margemEsquerda, y);
        y += 6;
        if (atendimento.idadeAnimal) {
            doc.text(`Idade: ${atendimento.idadeAnimal}`, margemEsquerda, y);
            y += 6;
        }
        doc.text(`Espécie: ${atendimento.especie}`, margemEsquerda, y);
        y += 10;
        // Dados do Proprietário
        doc.setFontSize(14);
        doc.text('DADOS DO PROPRIETÁRIO', margemEsquerda, y);
        y += 8;
        doc.setFontSize(11);
        doc.text(`Nome: ${atendimento.nomeProprietario}`, margemEsquerda, y);
        y += 6;
        doc.text(`Telefone/WhatsApp: ${atendimento.telefoneProprietario}`, margemEsquerda, y);
        y += 10;
        // Procedimentos
        if (atendimento.procedimentos.length > 0) {
            doc.setFontSize(14);
            doc.text('PROCEDIMENTOS REALIZADOS', margemEsquerda, y);
            y += 8;
            doc.setFontSize(11);
            atendimento.procedimentos.forEach(proc => {
                if (y > 270) {
                    doc.addPage();
                    y = 20;
                }
                doc.text(`• ${proc.nome}`, margemEsquerda + 5, y);
                doc.text(`R$ ${proc.valor.toFixed(2)}`, 160, y);
                y += 6;
            });
            y += 4;
            doc.text(`Subtotal Procedimentos: R$ ${atendimento.procedimentos.reduce((sum, p) => sum + p.valor, 0).toFixed(2)}`, margemEsquerda, y);
            y += 10;
        }
        // Materiais
        if (atendimento.materiais.length > 0) {
            if (y > 240) {
                doc.addPage();
                y = 20;
            }
            doc.setFontSize(14);
            doc.text('MATERIAIS UTILIZADOS', margemEsquerda, y);
            y += 8;
            doc.setFontSize(11);
            atendimento.materiais.forEach(mat => {
                if (y > 270) {
                    doc.addPage();
                    y = 20;
                }
                const subtotal = mat.quantidade * mat.valorUnitario;
                doc.text(`• ${mat.nome}`, margemEsquerda + 5, y);
                y += 6;
                doc.text(`  Qtd: ${mat.quantidade} x R$ ${mat.valorUnitario.toFixed(2)} = R$ ${subtotal.toFixed(2)}`, margemEsquerda + 5, y);
                y += 7;
            });
            y += 2;
            doc.text(`Subtotal Materiais: R$ ${atendimento.materiais.reduce((sum, m) => sum + (m.quantidade * m.valorUnitario), 0).toFixed(2)}`, margemEsquerda, y);
            y += 10;
        }
        // Medicações
        if (atendimento.medicacoes && atendimento.medicacoes.length > 0) {
            if (y > 240) {
                doc.addPage();
                y = 20;
            }
            doc.setFontSize(14);
            doc.text('MEDICAÇÕES UTILIZADAS', margemEsquerda, y);
            y += 8;
            doc.setFontSize(11);
            atendimento.medicacoes.forEach(med => {
                if (y > 270) {
                    doc.addPage();
                    y = 20;
                }
                const subtotal = med.quantidade * med.valorUnitario;
                doc.text(`• ${med.nome}`, margemEsquerda + 5, y);
                y += 6;
                doc.text(`  Qtd: ${med.quantidade} ${med.unidade} x R$ ${med.valorUnitario.toFixed(2)} = R$ ${subtotal.toFixed(2)}`, margemEsquerda + 5, y);
                y += 7;
            });
            y += 2;
            doc.text(`Subtotal Medicações: R$ ${atendimento.medicacoes.reduce((sum, m) => sum + (m.quantidade * m.valorUnitario), 0).toFixed(2)}`, margemEsquerda, y);
            y += 10;
        }
        // Observações
        if (atendimento.observacoes) {
            if (y > 240) {
                doc.addPage();
                y = 20;
            }
            doc.setFontSize(14);
            doc.text('OBSERVAÇÕES', margemEsquerda, y);
            y += 8;
            doc.setFontSize(11);
            const linhasObs = doc.splitTextToSize(atendimento.observacoes, 170);
            linhasObs.forEach((linha) => {
                if (y > 270) {
                    doc.addPage();
                    y = 20;
                }
                doc.text(linha, margemEsquerda, y);
                y += 6;
            });
            y += 10;
        }
        // Valor Total
        if (y > 250) {
            doc.addPage();
            y = 20;
        }
        doc.setFillColor(59, 130, 246);
        doc.rect(margemEsquerda, y, 170, 15, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.text('VALOR TOTAL:', margemEsquerda + 5, y + 10);
        doc.text(`R$ ${atendimento.valorTotal.toFixed(2)}`, 140, y + 10);
        y += 20;
        doc.setTextColor(0, 0, 0);
        // Dados Bancários para Pagamento
        if (dadosProfissionais && (dadosProfissionais.pix || dadosProfissionais.banco)) {
            if (y > 230) {
                doc.addPage();
                y = 20;
            }
            y += 5;
            doc.setFontSize(14);
            doc.text('DADOS PARA PAGAMENTO', margemEsquerda, y);
            y += 8;
            doc.setFontSize(11);
            if (dadosProfissionais.pix) {
                doc.text('PIX:', margemEsquerda, y);
                doc.text(dadosProfissionais.pix, margemEsquerda + 15, y);
                y += 6;
            }
            if (dadosProfissionais.banco || dadosProfissionais.agencia || dadosProfissionais.conta) {
                if (dadosProfissionais.banco) {
                    doc.text('Banco:', margemEsquerda, y);
                    doc.text(dadosProfissionais.banco, margemEsquerda + 15, y);
                    y += 6;
                }
                if (dadosProfissionais.agencia) {
                    doc.text('Agência:', margemEsquerda, y);
                    doc.text(dadosProfissionais.agencia, margemEsquerda + 20, y);
                    y += 6;
                }
                if (dadosProfissionais.conta) {
                    doc.text('Conta:', margemEsquerda, y);
                    doc.text(dadosProfissionais.conta, margemEsquerda + 15, y);
                    y += 6;
                }
            }
            if (dadosProfissionais.observacoesPagamento) {
                y += 3;
                doc.setFontSize(10);
                const linhasPag = doc.splitTextToSize(dadosProfissionais.observacoesPagamento, 170);
                linhasPag.forEach((linha) => {
                    if (y > 275) {
                        doc.addPage();
                        y = 20;
                    }
                    doc.text(linha, margemEsquerda, y);
                    y += 5;
                });
            }
        }
        // Salvar PDF
        const nomeArquivo = `atendimento_${atendimento.nomeAnimal}_${atendimento.data}.pdf`;
        doc.save(nomeArquivo);
        sonner_2_0_3_1.toast.success('PDF gerado com sucesso!');
    };
    const compartilharWhatsApp = () => {
        const mensagem = `*Relatório de Atendimento Veterinário*\n\n` +
            `*Data:* ${formatarData(atendimento.data)}\n` +
            `*Animal:* ${atendimento.nomeAnimal} (${atendimento.especie})\n` +
            `*Proprietário:* ${atendimento.nomeProprietario}\n\n` +
            `*Procedimentos:*\n` +
            atendimento.procedimentos.map(p => `• ${p.nome} - R$ ${p.valor.toFixed(2)}`).join('\n') +
            `\n\n*Materiais:*\n` +
            atendimento.materiais.map(m => `• ${m.nome} (${m.quantidade}x) - R$ ${(m.quantidade * m.valorUnitario).toFixed(2)}`).join('\n') +
            `\n\n*VALOR TOTAL: R$ ${atendimento.valorTotal.toFixed(2)}*`;
        const telefone = atendimento.telefoneProprietario.replace(/\D/g, '');
        const url = `https://wa.me/55${telefone}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank');
        sonner_2_0_3_1.toast.success('Abrindo WhatsApp...');
    };
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsxs)(button_1.Button, { onClick: onVoltar, variant: "outline", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ArrowLeft, { className: "size-4 mr-2" }), "Voltar"] }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1" }), (0, jsx_runtime_1.jsxs)(button_1.Button, { onClick: compartilharWhatsApp, variant: "outline", className: "bg-green-50 hover:bg-green-100", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Share2, { className: "size-4 mr-2" }), "Enviar WhatsApp"] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { onClick: () => {
                            setIsLoading(true);
                            gerarPDF();
                            setIsLoading(false);
                        }, className: "bg-blue-600 hover:bg-blue-700", children: [isLoading ? (0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "size-4 mr-2 animate-spin" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.FileDown, { className: "size-4 mr-2" }), "Gerar PDF"] })] }), (0, jsx_runtime_1.jsx)(card_1.Card, { children: (0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)(card_1.CardTitle, { children: ["Atendimento - ", atendimento.nomeAnimal] }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 mt-1", children: formatarData(atendimento.data) })] }), (0, jsx_runtime_1.jsx)(badge_1.Badge, { className: ESPECIES_CORES[atendimento.especie] || 'bg-gray-100 text-gray-800', children: atendimento.especie })] }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-lg", children: "Dados do Animal" }) }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Nome" }), (0, jsx_runtime_1.jsx)("p", { children: atendimento.nomeAnimal })] }), atendimento.idadeAnimal && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Idade" }), (0, jsx_runtime_1.jsx)("p", { children: atendimento.idadeAnimal })] })), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Esp\u00E9cie" }), (0, jsx_runtime_1.jsx)("p", { children: atendimento.especie })] })] })] }), (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-lg", children: "Dados do Propriet\u00E1rio" }) }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Nome" }), (0, jsx_runtime_1.jsx)("p", { children: atendimento.nomeProprietario })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Telefone/WhatsApp" }), (0, jsx_runtime_1.jsx)("p", { children: atendimento.telefoneProprietario })] })] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-lg", children: "Localiza\u00E7\u00E3o" }) }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "space-y-2", children: [atendimento.local && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Local" }), (0, jsx_runtime_1.jsx)("p", { children: atendimento.local })] })), atendimento.endereco && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Endere\u00E7o" }), (0, jsx_runtime_1.jsx)("p", { children: atendimento.endereco })] })), !atendimento.local && !atendimento.endereco && ((0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 italic", children: "N\u00E3o informado" }))] })] }) }), atendimento.procedimentos.length > 0 && ((0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-lg", children: "Procedimentos Realizados" }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [atendimento.procedimentos.map(proc => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-3 bg-blue-50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("p", { children: proc.nome }), (0, jsx_runtime_1.jsxs)("p", { className: "text-blue-600", children: ["R$ ", proc.valor.toFixed(2)] })] }, proc.id))), (0, jsx_runtime_1.jsxs)("div", { className: "pt-3 border-t flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("p", { children: "Subtotal Procedimentos" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-blue-600", children: ["R$ ", atendimento.procedimentos.reduce((sum, p) => sum + p.valor, 0).toFixed(2)] })] })] }) })] })), atendimento.materiais.length > 0 && ((0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-lg", children: "Materiais Utilizados" }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [atendimento.materiais.map(mat => ((0, jsx_runtime_1.jsx)("div", { className: "p-3 bg-green-50 rounded-lg", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { children: mat.nome }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-600", children: [mat.quantidade, " x R$ ", mat.valorUnitario.toFixed(2)] })] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-green-600", children: ["R$ ", (mat.quantidade * mat.valorUnitario).toFixed(2)] })] }) }, mat.id))), (0, jsx_runtime_1.jsxs)("div", { className: "pt-3 border-t flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("p", { children: "Subtotal Materiais" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-green-600", children: ["R$ ", atendimento.materiais.reduce((sum, m) => sum + (m.quantidade * m.valorUnitario), 0).toFixed(2)] })] })] }) })] })), atendimento.medicacoes && atendimento.medicacoes.length > 0 && ((0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-lg", children: "Medica\u00E7\u00F5es Utilizadas" }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [atendimento.medicacoes.map(med => ((0, jsx_runtime_1.jsx)("div", { className: "p-3 bg-red-50 rounded-lg", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { children: med.nome }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-600", children: [med.quantidade, " ", med.unidade, " x R$ ", med.valorUnitario.toFixed(2)] })] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-red-600", children: ["R$ ", (med.quantidade * med.valorUnitario).toFixed(2)] })] }) }, med.id))), (0, jsx_runtime_1.jsxs)("div", { className: "pt-3 border-t flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("p", { children: "Subtotal Medica\u00E7\u00F5es" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-red-600", children: ["R$ ", atendimento.medicacoes.reduce((sum, m) => sum + (m.quantidade * m.valorUnitario), 0).toFixed(2)] })] })] }) })] })), atendimento.observacoes && ((0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { children: (0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-lg", children: "Observa\u00E7\u00F5es" }) }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsx)("p", { className: "whitespace-pre-wrap text-gray-700", children: atendimento.observacoes }) })] })), (0, jsx_runtime_1.jsx)(card_1.Card, { className: "bg-gradient-to-r from-blue-600 to-green-600 text-white", children: (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "pt-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-[rgb(0,0,0)]", children: "Valor Total do Atendimento" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-3xl text-[rgb(0,0,0)]", children: ["R$ ", atendimento.valorTotal.toFixed(2)] })] }) }) })] }));
}
//# sourceMappingURL=DetalhesAtendimento.js.map