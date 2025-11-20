import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, FileDown, Share2, Loader2 } from 'lucide-react';
import type { Atendimento } from '../App';
import type { DadosProfissional } from './MeusDados';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import { useState } from 'react';

interface DetalhesAtendimentoProps {
  atendimento: Atendimento;
  onVoltar: () => void;
  onAtualizar: () => void;
}

const ESPECIES_CORES: Record<string, string> = {
  'Equinos': 'bg-amber-100 text-amber-800',
  'Caninos': 'bg-blue-100 text-blue-800',
  'Felinos': 'bg-purple-100 text-purple-800',
  'Bovinos': 'bg-green-100 text-green-800',
  'Caprinos': 'bg-orange-100 text-orange-800',
};

export function DetalhesAtendimento({ atendimento, onVoltar, onAtualizar }: DetalhesAtendimentoProps) {
  const formatarData = (data: string) => {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const gerarPDF = () => {
    const doc = new jsPDF();
    const margemEsquerda = 20;
    let y = 20;

    // Carregar dados profissionais
    const dadosProfissionaisStr = localStorage.getItem('dadosProfissional');
    const dadosProfissionais: DadosProfissional | null = dadosProfissionaisStr ? JSON.parse(dadosProfissionaisStr) : null;

    // Logo no cabeçalho (se existir)
    if (dadosProfissionais?.logo) {
      try {
        const logoWidth = 40;
        const logoHeight = 20;
        doc.addImage(dadosProfissionais.logo, 'PNG', 150, y, logoWidth, logoHeight);
      } catch (error) {
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
        if (dadosProfissionais.telefone) contato.push(dadosProfissionais.telefone);
        if (dadosProfissionais.email) contato.push(dadosProfissionais.email);
        doc.text(contato.join(' | '), margemEsquerda, y);
        y += 8;
      } else {
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
      linhasObs.forEach((linha: string) => {
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
        linhasPag.forEach((linha: string) => {
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
    
    toast.success('PDF gerado com sucesso!');
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
    toast.success('Abrindo WhatsApp...');
  };

  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button onClick={onVoltar} variant="outline">
          <ArrowLeft className="size-4 mr-2" />
          Voltar
        </Button>
        
        <div className="flex-1" />
        
        <Button onClick={compartilharWhatsApp} variant="outline" className="bg-green-50 hover:bg-green-100">
          <Share2 className="size-4 mr-2" />
          Enviar WhatsApp
        </Button>
        
        <Button onClick={() => {
          setIsLoading(true);
          gerarPDF();
          setIsLoading(false);
        }} className="bg-blue-600 hover:bg-blue-700">
          {isLoading ? <Loader2 className="size-4 mr-2 animate-spin" /> : <FileDown className="size-4 mr-2" />}
          Gerar PDF
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Atendimento - {atendimento.nomeAnimal}</CardTitle>
              <p className="text-gray-600 mt-1">{formatarData(atendimento.data)}</p>
            </div>
            <Badge className={ESPECIES_CORES[atendimento.especie] || 'bg-gray-100 text-gray-800'}>
              {atendimento.especie}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dados do Animal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-gray-600">Nome</p>
              <p>{atendimento.nomeAnimal}</p>
            </div>
            {atendimento.idadeAnimal && (
              <div>
                <p className="text-sm text-gray-600">Idade</p>
                <p>{atendimento.idadeAnimal}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600">Espécie</p>
              <p>{atendimento.especie}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dados do Proprietário</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-gray-600">Nome</p>
              <p>{atendimento.nomeProprietario}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Telefone/WhatsApp</p>
              <p>{atendimento.telefoneProprietario}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Localização</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {atendimento.local && (
              <div>
                <p className="text-sm text-gray-600">Local</p>
                <p>{atendimento.local}</p>
              </div>
            )}
            {atendimento.endereco && (
              <div>
                <p className="text-sm text-gray-600">Endereço</p>
                <p>{atendimento.endereco}</p>
              </div>
            )}
            {!atendimento.local && !atendimento.endereco && (
              <p className="text-gray-400 italic">Não informado</p>
            )}
          </CardContent>
        </Card>
      </div>

      {atendimento.procedimentos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Procedimentos Realizados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {atendimento.procedimentos.map(proc => (
                <div key={proc.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <p>{proc.nome}</p>
                  <p className="text-blue-600">R$ {proc.valor.toFixed(2)}</p>
                </div>
              ))}
              <div className="pt-3 border-t flex items-center justify-between">
                <p>Subtotal Procedimentos</p>
                <p className="text-blue-600">
                  R$ {atendimento.procedimentos.reduce((sum, p) => sum + p.valor, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {atendimento.materiais.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Materiais Utilizados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {atendimento.materiais.map(mat => (
                <div key={mat.id} className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p>{mat.nome}</p>
                      <p className="text-sm text-gray-600">
                        {mat.quantidade} x R$ {mat.valorUnitario.toFixed(2)}
                      </p>
                    </div>
                    <p className="text-green-600">
                      R$ {(mat.quantidade * mat.valorUnitario).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t flex items-center justify-between">
                <p>Subtotal Materiais</p>
                <p className="text-green-600">
                  R$ {atendimento.materiais.reduce((sum, m) => sum + (m.quantidade * m.valorUnitario), 0).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {atendimento.medicacoes && atendimento.medicacoes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Medicações Utilizadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {atendimento.medicacoes.map(med => (
                <div key={med.id} className="p-3 bg-red-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p>{med.nome}</p>
                      <p className="text-sm text-gray-600">
                        {med.quantidade} {med.unidade} x R$ {med.valorUnitario.toFixed(2)}
                      </p>
                    </div>
                    <p className="text-red-600">
                      R$ {(med.quantidade * med.valorUnitario).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t flex items-center justify-between">
                <p>Subtotal Medicações</p>
                <p className="text-red-600">
                  R$ {atendimento.medicacoes.reduce((sum, m) => sum + (m.quantidade * m.valorUnitario), 0).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {atendimento.observacoes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-gray-700">{atendimento.observacoes}</p>
          </CardContent>
        </Card>
      )}

      <Card className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <p className="text-[rgb(0,0,0)]">Valor Total do Atendimento</p>
            <p className="text-3xl text-[rgb(0,0,0)]">R$ {atendimento.valorTotal.toFixed(2)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}