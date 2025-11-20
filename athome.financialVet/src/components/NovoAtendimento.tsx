import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Plus, Trash2, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Atendimento, Material, Procedimento, Medicacao } from '../App';

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
  { nome: 'Dipirona 500mg/ml', valorUnitario: 25.00, unidade: 'frasco' as const },
  { nome: 'Flunixin Meglumine', valorUnitario: 45.00, unidade: 'frasco' as const },
  { nome: 'Penicilina Benzatina', valorUnitario: 38.00, unidade: 'frasco' as const },
  { nome: 'Ivermectina', valorUnitario: 3.50, unidade: 'ml' as const },
  { nome: 'Dexametasona', valorUnitario: 2.80, unidade: 'ml' as const },
  { nome: 'Ringer Lactato', valorUnitario: 18.00, unidade: 'frasco' as const },
];

const ESPECIES_PADRAO = ['Equinos', 'Caninos', 'Felinos', 'Bovinos', 'Caprinos'];

interface NovoAtendimentoProps {
  onSuccess: () => void;
}

export function NovoAtendimento({ onSuccess }: NovoAtendimentoProps) {
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [nomeAnimal, setNomeAnimal] = useState('');
  const [idadeAnimal, setIdadeAnimal] = useState('');
  const [especie, setEspecie] = useState('');
  const [nomeProprietario, setNomeProprietario] = useState('');
  const [telefoneProprietario, setTelefoneProprietario] = useState('');
  const [local, setLocal] = useState('');
  const [endereco, setEndereco] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [procedimentosSelecionados, setProcedimentosSelecionados] = useState<Procedimento[]>([]);
  const [materiaisUtilizados, setMateriaisUtilizados] = useState<Material[]>([]);
  const [medicacoesUtilizadas, setMedicacoesUtilizadas] = useState<Medicacao[]>([]);
  
  const [procedimentosCadastrados, setProcedimentosCadastrados] = useState<Procedimento[]>([]);
  const [materiaisCadastrados, setMateriaisCadastrados] = useState<{ nome: string; valorUnitario: number }[]>([]);
  const [medicacoesCadastradas, setMedicacoesCadastradas] = useState<{ nome: string; valorUnitario: number; unidade: 'frasco' | 'ml' }[]>([]);
  const [especiesDisponiveis, setEspeciesDisponiveis] = useState<string[]>([]);
  
  const [salvando, setSalvando] = useState(false);

  // Inicializar dados padrão se não existirem
  useEffect(() => {
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
    } else {
      setProcedimentosCadastrados(JSON.parse(procStored));
    }

    // Inicializar materiais
    let matStored = localStorage.getItem('materiais');
    if (!matStored) {
      localStorage.setItem('materiais', JSON.stringify(MATERIAIS_PADRAO));
      setMateriaisCadastrados(MATERIAIS_PADRAO);
    } else {
      setMateriaisCadastrados(JSON.parse(matStored));
    }

    // Inicializar medicações
    let medStored = localStorage.getItem('medicacoes');
    if (!medStored) {
      localStorage.setItem('medicacoes', JSON.stringify(MEDICACOES_PADRAO));
      setMedicacoesCadastradas(MEDICACOES_PADRAO);
    } else {
      setMedicacoesCadastradas(JSON.parse(medStored));
    }

    // Inicializar espécies
    let espStored = localStorage.getItem('especies');
    if (!espStored) {
      localStorage.setItem('especies', JSON.stringify(ESPECIES_PADRAO));
      setEspeciesDisponiveis(ESPECIES_PADRAO);
    } else {
      setEspeciesDisponiveis(JSON.parse(espStored));
    }
  }, []);

  // Carregar procedimentos e materiais cadastrados
  const getProcedimentosCadastrados = (): Procedimento[] => {
    const stored = localStorage.getItem('procedimentos');
    return stored ? JSON.parse(stored) : [];
  };

  const getMateriaisCadastrados = (): { nome: string; valorUnitario: number }[] => {
    const stored = localStorage.getItem('materiais');
    return stored ? JSON.parse(stored) : [];
  };

  const getMedicacoesCadastradas = (): { nome: string; valorUnitario: number; unidade: 'frasco' | 'ml' }[] => {
    const stored = localStorage.getItem('medicacoes');
    return stored ? JSON.parse(stored) : [];
  };

  const adicionarProcedimento = (procedimentoId: string) => {
    const procedimentos = getProcedimentosCadastrados();
    const proc = procedimentos.find(p => p.id === procedimentoId);
    if (proc && !procedimentosSelecionados.find(p => p.id === proc.id)) {
      setProcedimentosSelecionados([...procedimentosSelecionados, proc]);
    }
  };

  const removerProcedimento = (id: string) => {
    setProcedimentosSelecionados(procedimentosSelecionados.filter(p => p.id !== id));
  };

  const adicionarMaterial = () => {
    const novoMaterial: Material = {
      id: Date.now().toString(),
      nome: '',
      quantidade: 1,
      valorUnitario: 0
    };
    setMateriaisUtilizados([...materiaisUtilizados, novoMaterial]);
  };

  const atualizarMaterial = (id: string, campo: keyof Material, valor: any) => {
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

  const removerMaterial = (id: string) => {
    setMateriaisUtilizados(materiaisUtilizados.filter(m => m.id !== id));
  };

  const adicionarMedicacao = () => {
    const novaMedicacao: Medicacao = {
      id: Date.now().toString(),
      nome: '',
      quantidade: 1,
      valorUnitario: 0,
      unidade: 'frasco'
    };
    setMedicacoesUtilizadas([...medicacoesUtilizadas, novaMedicacao]);
  };

  const atualizarMedicacao = (id: string, campo: keyof Medicacao, valor: any) => {
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

  const removerMedicacao = (id: string) => {
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
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setSalvando(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const novoAtendimento: Atendimento = {
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

    toast.success('Atendimento salvo com sucesso!');
    
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dados do Atendimento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data">Data do Atendimento *</Label>
              <Input
                id="data"
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="local">Local</Label>
              <Input
                id="local"
                value={local}
                onChange={(e) => setLocal(e.target.value)}
                placeholder="Nome do local"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                placeholder="Endereço completo"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dados do Animal e Proprietário</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nomeAnimal">Nome do Animal *</Label>
              <Input
                id="nomeAnimal"
                value={nomeAnimal}
                onChange={(e) => setNomeAnimal(e.target.value)}
                placeholder="Nome do animal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="idadeAnimal">Idade do Animal</Label>
              <Input
                id="idadeAnimal"
                value={idadeAnimal}
                onChange={(e) => setIdadeAnimal(e.target.value)}
                placeholder="Ex: 5 anos"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="especie">Espécie *</Label>
              <Select value={especie} onValueChange={setEspecie}>
                <SelectTrigger id="especie">
                  <SelectValue placeholder="Selecione a espécie" />
                </SelectTrigger>
                <SelectContent>
                  {especiesDisponiveis.map((esp) => (
                    <SelectItem key={esp} value={esp}>{esp}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nomeProprietario">Nome do Proprietário *</Label>
              <Input
                id="nomeProprietario"
                value={nomeProprietario}
                onChange={(e) => setNomeProprietario(e.target.value)}
                placeholder="Nome completo"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="telefone">Telefone/WhatsApp do Proprietário *</Label>
              <Input
                id="telefone"
                value={telefoneProprietario}
                onChange={(e) => setTelefoneProprietario(e.target.value)}
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Procedimentos Realizados</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Adicionar Procedimento</Label>
            <Select onValueChange={adicionarProcedimento}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um procedimento" />
              </SelectTrigger>
              <SelectContent>
                {procedimentosCadastrados
                  .filter(p => !procedimentosSelecionados.find(ps => ps.id === p.id))
                  .map((proc) => (
                    <SelectItem key={proc.id} value={proc.id}>
                      {proc.nome} - R$ {proc.valor.toFixed(2)}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {procedimentosSelecionados.length > 0 && (
            <div className="space-y-2">
              {procedimentosSelecionados.map((proc) => (
                <div key={proc.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <p>{proc.nome}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-blue-600">R$ {proc.valor.toFixed(2)}</p>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removerProcedimento(proc.id)}
                    >
                      <Trash2 className="size-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="text-right text-blue-600">
                Subtotal: R$ {procedimentosSelecionados.reduce((sum, p) => sum + p.valor, 0).toFixed(2)}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Materiais Utilizados</CardTitle>
            <Button onClick={adicionarMaterial} size="sm">
              <Plus className="size-4 mr-2" />
              Adicionar Material
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {materiaisUtilizados.map((material) => (
            <div key={material.id} className="p-4 bg-green-50 rounded-lg space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="md:col-span-2 space-y-2">
                  <Label>Material</Label>
                  <Select
                    value={material.nome}
                    onValueChange={(valor) => atualizarMaterial(material.id, 'nome', valor)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o material" />
                    </SelectTrigger>
                    <SelectContent>
                      {materiaisCadastrados.map((mat, index) => (
                        <SelectItem key={index} value={mat.nome}>
                          {mat.nome} - R$ {mat.valorUnitario.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Quantidade</Label>
                  <Input
                    type="number"
                    min="1"
                    value={material.quantidade}
                    onChange={(e) => atualizarMaterial(material.id, 'quantidade', parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Valor Unit. (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={material.valorUnitario}
                    onChange={(e) => atualizarMaterial(material.id, 'valorUnitario', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removerMaterial(material.id)}
                  className="text-red-600"
                >
                  <Trash2 className="size-4 mr-2" />
                  Remover
                </Button>
                <div className="text-right text-gray-700">
                  Subtotal: R$ {(material.quantidade * material.valorUnitario).toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Medicações Utilizadas</CardTitle>
            <Button onClick={adicionarMedicacao} size="sm">
              <Plus className="size-4 mr-2" />
              Adicionar Medicação
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {medicacoesUtilizadas.map((medicacao) => (
            <div key={medicacao.id} className="p-4 bg-purple-50 rounded-lg space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <div className="md:col-span-2 space-y-2">
                  <Label>Medicação</Label>
                  <Select
                    value={medicacao.nome}
                    onValueChange={(valor) => atualizarMedicacao(medicacao.id, 'nome', valor)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a medicação" />
                    </SelectTrigger>
                    <SelectContent>
                      {medicacoesCadastradas.map((med, index) => (
                        <SelectItem key={index} value={med.nome}>
                          {med.nome} - R$ {med.valorUnitario.toFixed(2)}/{med.unidade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Unidade</Label>
                  <Select
                    value={medicacao.unidade}
                    onValueChange={(valor: 'frasco' | 'ml') => atualizarMedicacao(medicacao.id, 'unidade', valor)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="frasco">Frasco</SelectItem>
                      <SelectItem value="ml">ML</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Quantidade</Label>
                  <Input
                    type="number"
                    min="1"
                    step={medicacao.unidade === 'ml' ? '0.1' : '1'}
                    value={medicacao.quantidade}
                    onChange={(e) => atualizarMedicacao(medicacao.id, 'quantidade', parseFloat(e.target.value) || 1)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Valor Unit. (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={medicacao.valorUnitario}
                    onChange={(e) => atualizarMedicacao(medicacao.id, 'valorUnitario', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removerMedicacao(medicacao.id)}
                  className="text-red-600"
                >
                  <Trash2 className="size-4 mr-2" />
                  Remover
                </Button>
                <div className="text-right text-gray-700">
                  Subtotal: R$ {(medicacao.quantidade * medicacao.valorUnitario).toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Observações</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder="Observações sobre o atendimento..."
            rows={4}
          />
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <CardContent className="pt-6 bg-[rgb(26,13,102)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[rgb(255,255,255)]">Valor Total do Atendimento</p>
              <p className="text-3xl text-[rgb(255,255,255)]">R$ {calcularTotal().toFixed(2)}</p>
            </div>
            <Button
              onClick={salvarAtendimento}
              size="lg"
              disabled={salvando}
              className="bg-white text-[rgb(0,0,0)] hover:bg-blue-50"
            >
              {salvando ? (
                <>
                  <Loader2 className="size-5 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="size-5 mr-2" />
                  Salvar Atendimento
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
