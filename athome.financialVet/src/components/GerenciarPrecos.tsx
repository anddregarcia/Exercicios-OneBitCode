import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, Trash2, Edit2, Check, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ProcedimentoCadastrado {
  id: string;
  nome: string;
  valor: number;
}

interface MaterialCadastrado {
  nome: string;
  valorUnitario: number;
}

interface MedicacaoCadastrada {
  nome: string;
  valorUnitario: number;
  unidade: 'frasco' | 'ml';
}

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

const MEDICACOES_PADRAO: MedicacaoCadastrada[] = [
  { nome: 'Dipirona 500mg/ml', valorUnitario: 25.00, unidade: 'frasco' },
  { nome: 'Flunixin Meglumine', valorUnitario: 45.00, unidade: 'frasco' },
  { nome: 'Penicilina Benzatina', valorUnitario: 38.00, unidade: 'frasco' },
  { nome: 'Ivermectina', valorUnitario: 3.50, unidade: 'ml' },
  { nome: 'Dexametasona', valorUnitario: 2.80, unidade: 'ml' },
  { nome: 'Ringer Lactato', valorUnitario: 18.00, unidade: 'frasco' },
];

const ESPECIES_PADRAO = ['Equinos', 'Caninos', 'Felinos', 'Bovinos', 'Caprinos'];

export function GerenciarPrecos() {
  const [procedimentos, setProcedimentos] = useState<ProcedimentoCadastrado[]>([]);
  const [materiais, setMateriais] = useState<MaterialCadastrado[]>([]);
  const [medicacoes, setMedicacoes] = useState<MedicacaoCadastrada[]>([]);
  const [especies, setEspecies] = useState<string[]>([]);
  
  // Loading states
  const [salvandoProc, setSalvandoProc] = useState(false);
  const [salvandoMat, setSalvandoMat] = useState(false);
  const [salvandoMed, setSalvandoMed] = useState(false);
  const [salvandoEsp, setSalvandoEsp] = useState(false);
  
  // Novos procedimentos/materiais/medicações
  const [novoProcNome, setNovoProcNome] = useState('');
  const [novoProcValor, setNovoProcValor] = useState('');
  const [novoMatNome, setNovoMatNome] = useState('');
  const [novoMatValor, setNovoMatValor] = useState('');
  const [novaMedNome, setNovaMedNome] = useState('');
  const [novaMedValor, setNovaMedValor] = useState('');
  const [novaMedUnidade, setNovaMedUnidade] = useState<'frasco' | 'ml'>('frasco');
  const [novaEspecie, setNovaEspecie] = useState('');
  
  // Edição
  const [editandoProcId, setEditandoProcId] = useState<string | null>(null);
  const [editandoMatIndex, setEditandoMatIndex] = useState<number | null>(null);
  const [editandoMedIndex, setEditandoMedIndex] = useState<number | null>(null);
  const [editandoEspIndex, setEditandoEspIndex] = useState<number | null>(null);
  
  const [editProcNome, setEditProcNome] = useState('');
  const [editProcValor, setEditProcValor] = useState('');
  const [editMatNome, setEditMatNome] = useState('');
  const [editMatValor, setEditMatValor] = useState('');
  const [editMedNome, setEditMedNome] = useState('');
  const [editMedValor, setEditMedValor] = useState('');
  const [editMedUnidade, setEditMedUnidade] = useState<'frasco' | 'ml'>('frasco');
  const [editEspNome, setEditEspNome] = useState('');

  useEffect(() => {
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
    } else {
      setProcedimentos(JSON.parse(procStored));
    }

    // Carregar materiais
    let matStored = localStorage.getItem('materiais');
    if (!matStored) {
      localStorage.setItem('materiais', JSON.stringify(MATERIAIS_PADRAO));
      setMateriais(MATERIAIS_PADRAO);
    } else {
      setMateriais(JSON.parse(matStored));
    }

    // Carregar medicações
    let medStored = localStorage.getItem('medicacoes');
    if (!medStored) {
      localStorage.setItem('medicacoes', JSON.stringify(MEDICACOES_PADRAO));
      setMedicacoes(MEDICACOES_PADRAO);
    } else {
      setMedicacoes(JSON.parse(medStored));
    }

    // Carregar espécies
    let espStored = localStorage.getItem('especies');
    if (!espStored) {
      localStorage.setItem('especies', JSON.stringify(ESPECIES_PADRAO));
      setEspecies(ESPECIES_PADRAO);
    } else {
      setEspecies(JSON.parse(espStored));
    }
  };

  // ===== PROCEDIMENTOS =====
  const adicionarProcedimento = async () => {
    if (!novoProcNome || !novoProcValor) {
      toast.error('Preencha o nome e o valor do procedimento');
      return;
    }

    setSalvandoProc(true);
    await new Promise(resolve => setTimeout(resolve, 300));

    const novoProcedimento: ProcedimentoCadastrado = {
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
    toast.success('Procedimento adicionado com sucesso!');
  };

  const excluirProcedimento = (id: string) => {
    const novosProcedimentos = procedimentos.filter(p => p.id !== id);
    setProcedimentos(novosProcedimentos);
    localStorage.setItem('procedimentos', JSON.stringify(novosProcedimentos));
    toast.success('Procedimento excluído');
  };

  const iniciarEdicaoProcedimento = (proc: ProcedimentoCadastrado) => {
    setEditandoProcId(proc.id);
    setEditProcNome(proc.nome);
    setEditProcValor(proc.valor.toString());
  };

  const salvarEdicaoProcedimento = async (id: string) => {
    if (!editProcNome || !editProcValor) {
      toast.error('Preencha todos os campos');
      return;
    }

    setSalvandoProc(true);
    await new Promise(resolve => setTimeout(resolve, 300));

    const novosProcedimentos = procedimentos.map(p => 
      p.id === id ? { ...p, nome: editProcNome, valor: parseFloat(editProcValor) } : p
    );
    
    setProcedimentos(novosProcedimentos);
    localStorage.setItem('procedimentos', JSON.stringify(novosProcedimentos));
    setEditandoProcId(null);
    setSalvandoProc(false);
    toast.success('Procedimento atualizado!');
  };

  const cancelarEdicaoProcedimento = () => {
    setEditandoProcId(null);
    setEditProcNome('');
    setEditProcValor('');
  };

  // ===== MATERIAIS =====
  const adicionarMaterial = async () => {
    if (!novoMatNome || !novoMatValor) {
      toast.error('Preencha o nome e o valor do material');
      return;
    }

    setSalvandoMat(true);
    await new Promise(resolve => setTimeout(resolve, 300));

    const novoMaterial: MaterialCadastrado = {
      nome: novoMatNome,
      valorUnitario: parseFloat(novoMatValor)
    };

    const novosMateriais = [...materiais, novoMaterial];
    setMateriais(novosMateriais);
    localStorage.setItem('materiais', JSON.stringify(novosMateriais));
    
    setNovoMatNome('');
    setNovoMatValor('');
    setSalvandoMat(false);
    toast.success('Material adicionado com sucesso!');
  };

  const excluirMaterial = (index: number) => {
    const novosMateriais = materiais.filter((_, i) => i !== index);
    setMateriais(novosMateriais);
    localStorage.setItem('materiais', JSON.stringify(novosMateriais));
    toast.success('Material excluído');
  };

  const iniciarEdicaoMaterial = (mat: MaterialCadastrado, index: number) => {
    setEditandoMatIndex(index);
    setEditMatNome(mat.nome);
    setEditMatValor(mat.valorUnitario.toString());
  };

  const salvarEdicaoMaterial = async (index: number) => {
    if (!editMatNome || !editMatValor) {
      toast.error('Preencha todos os campos');
      return;
    }

    setSalvandoMat(true);
    await new Promise(resolve => setTimeout(resolve, 300));

    const novosMateriais = materiais.map((m, i) => 
      i === index ? { nome: editMatNome, valorUnitario: parseFloat(editMatValor) } : m
    );
    
    setMateriais(novosMateriais);
    localStorage.setItem('materiais', JSON.stringify(novosMateriais));
    setEditandoMatIndex(null);
    setSalvandoMat(false);
    toast.success('Material atualizado!');
  };

  const cancelarEdicaoMaterial = () => {
    setEditandoMatIndex(null);
    setEditMatNome('');
    setEditMatValor('');
  };

  // ===== MEDICAÇÕES =====
  const adicionarMedicacao = async () => {
    if (!novaMedNome || !novaMedValor) {
      toast.error('Preencha o nome e o valor da medicação');
      return;
    }

    setSalvandoMed(true);
    await new Promise(resolve => setTimeout(resolve, 300));

    const novaMedicacao: MedicacaoCadastrada = {
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
    toast.success('Medicação adicionada com sucesso!');
  };

  const excluirMedicacao = (index: number) => {
    const novasMedicacoes = medicacoes.filter((_, i) => i !== index);
    setMedicacoes(novasMedicacoes);
    localStorage.setItem('medicacoes', JSON.stringify(novasMedicacoes));
    toast.success('Medicação excluída');
  };

  const iniciarEdicaoMedicacao = (med: MedicacaoCadastrada, index: number) => {
    setEditandoMedIndex(index);
    setEditMedNome(med.nome);
    setEditMedValor(med.valorUnitario.toString());
    setEditMedUnidade(med.unidade);
  };

  const salvarEdicaoMedicacao = async (index: number) => {
    if (!editMedNome || !editMedValor) {
      toast.error('Preencha todos os campos');
      return;
    }

    setSalvandoMed(true);
    await new Promise(resolve => setTimeout(resolve, 300));

    const novasMedicacoes = medicacoes.map((m, i) => 
      i === index ? { nome: editMedNome, valorUnitario: parseFloat(editMedValor), unidade: editMedUnidade } : m
    );
    
    setMedicacoes(novasMedicacoes);
    localStorage.setItem('medicacoes', JSON.stringify(novasMedicacoes));
    setEditandoMedIndex(null);
    setSalvandoMed(false);
    toast.success('Medicação atualizada!');
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
      toast.error('Digite o nome da espécie');
      return;
    }

    if (especies.includes(novaEspecie)) {
      toast.error('Esta espécie já existe');
      return;
    }

    setSalvandoEsp(true);
    await new Promise(resolve => setTimeout(resolve, 300));

    const novasEspecies = [...especies, novaEspecie];
    setEspecies(novasEspecies);
    localStorage.setItem('especies', JSON.stringify(novasEspecies));
    
    setNovaEspecie('');
    setSalvandoEsp(false);
    toast.success('Espécie adicionada com sucesso!');
  };

  const excluirEspecie = (index: number) => {
    const novasEspecies = especies.filter((_, i) => i !== index);
    setEspecies(novasEspecies);
    localStorage.setItem('especies', JSON.stringify(novasEspecies));
    toast.success('Espécie excluída');
  };

  const iniciarEdicaoEspecie = (esp: string, index: number) => {
    setEditandoEspIndex(index);
    setEditEspNome(esp);
  };

  const salvarEdicaoEspecie = async (index: number) => {
    if (!editEspNome) {
      toast.error('Digite o nome da espécie');
      return;
    }

    setSalvandoEsp(true);
    await new Promise(resolve => setTimeout(resolve, 300));

    const novasEspecies = especies.map((e, i) => i === index ? editEspNome : e);
    
    setEspecies(novasEspecies);
    localStorage.setItem('especies', JSON.stringify(novasEspecies));
    setEditandoEspIndex(null);
    setSalvandoEsp(false);
    toast.success('Espécie atualizada!');
  };

  const cancelarEdicaoEspecie = () => {
    setEditandoEspIndex(null);
    setEditEspNome('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Preços e Configurações</CardTitle>
          <p className="text-gray-600">Cadastre e atualize valores de procedimentos, materiais, medicações e espécies</p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="procedimentos" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="procedimentos">Procedimentos</TabsTrigger>
          <TabsTrigger value="materiais">Materiais</TabsTrigger>
          <TabsTrigger value="medicacoes">Medicações</TabsTrigger>
          <TabsTrigger value="especies">Espécies</TabsTrigger>
        </TabsList>

        {/* PROCEDIMENTOS */}
        <TabsContent value="procedimentos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Adicionar Novo Procedimento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="novoProcNome">Nome do Procedimento</Label>
                  <Input
                    id="novoProcNome"
                    value={novoProcNome}
                    onChange={(e) => setNovoProcNome(e.target.value)}
                    placeholder="Ex: Castração"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="novoProcValor">Valor (R$)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="novoProcValor"
                      type="number"
                      step="0.01"
                      min="0"
                      value={novoProcValor}
                      onChange={(e) => setNovoProcValor(e.target.value)}
                      placeholder="0.00"
                    />
                    <Button onClick={adicionarProcedimento} disabled={salvandoProc} className="text-[rgb(255,255,255)]">
                      {salvandoProc ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Procedimentos Cadastrados ({procedimentos.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {procedimentos.map((proc) => (
                  <div key={proc.id} className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                    {editandoProcId === proc.id ? (
                      <>
                        <Input
                          value={editProcNome}
                          onChange={(e) => setEditProcNome(e.target.value)}
                          className="flex-1 bg-white"
                        />
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={editProcValor}
                          onChange={(e) => setEditProcValor(e.target.value)}
                          className="w-32 bg-white"
                        />
                        <Button
                          size="sm"
                          onClick={() => salvarEdicaoProcedimento(proc.id)}
                          disabled={salvandoProc}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {salvandoProc ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={cancelarEdicaoProcedimento}
                        >
                          <X className="size-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <p className="flex-1">{proc.nome}</p>
                        <p className="w-32 text-blue-600">R$ {proc.valor.toFixed(2)}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => iniciarEdicaoProcedimento(proc)}
                        >
                          <Edit2 className="size-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => excluirProcedimento(proc.id)}
                        >
                          <Trash2 className="size-4 text-red-500" />
                        </Button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* MATERIAIS */}
        <TabsContent value="materiais" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Adicionar Novo Material</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="novoMatNome">Nome do Material</Label>
                  <Input
                    id="novoMatNome"
                    value={novoMatNome}
                    onChange={(e) => setNovoMatNome(e.target.value)}
                    placeholder="Ex: Seringa 10ml"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="novoMatValor">Valor Unitário (R$)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="novoMatValor"
                      type="number"
                      step="0.01"
                      min="0"
                      value={novoMatValor}
                      onChange={(e) => setNovoMatValor(e.target.value)}
                      placeholder="0.00"
                    />
                    <Button onClick={adicionarMaterial} disabled={salvandoMat} className="text-[rgb(255,255,255)]">
                      {salvandoMat ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Materiais Cadastrados ({materiais.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {materiais.map((mat, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                    {editandoMatIndex === index ? (
                      <>
                        <Input
                          value={editMatNome}
                          onChange={(e) => setEditMatNome(e.target.value)}
                          className="flex-1 bg-white"
                        />
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={editMatValor}
                          onChange={(e) => setEditMatValor(e.target.value)}
                          className="w-32 bg-white"
                        />
                        <Button
                          size="sm"
                          onClick={() => salvarEdicaoMaterial(index)}
                          disabled={salvandoMat}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {salvandoMat ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={cancelarEdicaoMaterial}
                        >
                          <X className="size-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <p className="flex-1">{mat.nome}</p>
                        <p className="w-32 text-green-600">R$ {mat.valorUnitario.toFixed(2)}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => iniciarEdicaoMaterial(mat, index)}
                        >
                          <Edit2 className="size-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => excluirMaterial(index)}
                        >
                          <Trash2 className="size-4 text-red-500" />
                        </Button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* MEDICAÇÕES */}
        <TabsContent value="medicacoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Adicionar Nova Medicação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="novaMedNome">Nome da Medicação</Label>
                  <Input
                    id="novaMedNome"
                    value={novaMedNome}
                    onChange={(e) => setNovaMedNome(e.target.value)}
                    placeholder="Ex: Dipirona 500mg/ml"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="novaMedUnidade">Unidade</Label>
                  <Select value={novaMedUnidade} onValueChange={(value: 'frasco' | 'ml') => setNovaMedUnidade(value)}>
                    <SelectTrigger id="novaMedUnidade">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="frasco">Por Frasco</SelectItem>
                      <SelectItem value="ml">Por ML</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="novaMedValor">Valor (R$)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="novaMedValor"
                      type="number"
                      step="0.01"
                      min="0"
                      value={novaMedValor}
                      onChange={(e) => setNovaMedValor(e.target.value)}
                      placeholder="0.00"
                    />
                    <Button onClick={adicionarMedicacao} disabled={salvandoMed} className="text-[rgb(255,255,255)]">
                      {salvandoMed ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Medicações Cadastradas ({medicacoes.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {medicacoes.map((med, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                    {editandoMedIndex === index ? (
                      <>
                        <Input
                          value={editMedNome}
                          onChange={(e) => setEditMedNome(e.target.value)}
                          className="flex-1 bg-white"
                        />
                        <Select value={editMedUnidade} onValueChange={(value: 'frasco' | 'ml') => setEditMedUnidade(value)}>
                          <SelectTrigger className="w-32 bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="frasco">Frasco</SelectItem>
                            <SelectItem value="ml">ML</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={editMedValor}
                          onChange={(e) => setEditMedValor(e.target.value)}
                          className="w-32 bg-white"
                        />
                        <Button
                          size="sm"
                          onClick={() => salvarEdicaoMedicacao(index)}
                          disabled={salvandoMed}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {salvandoMed ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={cancelarEdicaoMedicacao}
                        >
                          <X className="size-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <p className="flex-1">{med.nome}</p>
                        <p className="w-24 text-purple-600 text-sm">({med.unidade})</p>
                        <p className="w-32 text-purple-600">R$ {med.valorUnitario.toFixed(2)}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => iniciarEdicaoMedicacao(med, index)}
                        >
                          <Edit2 className="size-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => excluirMedicacao(index)}
                        >
                          <Trash2 className="size-4 text-red-500" />
                        </Button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ESPÉCIES */}
        <TabsContent value="especies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Adicionar Nova Espécie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="novaEspecie">Nome da Espécie</Label>
                  <div className="flex gap-2">
                    <Input
                      id="novaEspecie"
                      value={novaEspecie}
                      onChange={(e) => setNovaEspecie(e.target.value)}
                      placeholder="Ex: Suínos"
                    />
                    <Button onClick={adicionarEspecie} disabled={salvandoEsp} className="text-[rgb(255,255,255)]">
                      {salvandoEsp ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Espécies Cadastradas ({especies.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {especies.map((esp, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg">
                    {editandoEspIndex === index ? (
                      <>
                        <Input
                          value={editEspNome}
                          onChange={(e) => setEditEspNome(e.target.value)}
                          className="flex-1 bg-white"
                        />
                        <Button
                          size="sm"
                          onClick={() => salvarEdicaoEspecie(index)}
                          disabled={salvandoEsp}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {salvandoEsp ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={cancelarEdicaoEspecie}
                        >
                          <X className="size-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <p className="flex-1">{esp}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => iniciarEdicaoEspecie(esp, index)}
                        >
                          <Edit2 className="size-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => excluirEspecie(index)}
                        >
                          <Trash2 className="size-4 text-red-500" />
                        </Button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
