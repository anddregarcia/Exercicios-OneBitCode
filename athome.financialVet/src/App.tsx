import { useState } from 'react';
import { NovoAtendimento } from './components/NovoAtendimento.js';
import { ListaAtendimentos } from './components/ListaAtendimentos.js';
import { GerenciarPrecos } from './components/GerenciarPrecos.js';
import { MeusDados } from './components/MeusDados.js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs.js';
import { Stethoscope } from 'lucide-react';

export interface Material {
  id: string;
  nome: string;
  quantidade: number;
  valorUnitario: number;
}

export interface Medicacao {
  id: string;
  nome: string;
  quantidade: number;
  valorUnitario: number;
  unidade: 'frasco' | 'ml';
}

export interface Procedimento {
  id: string;
  nome: string;
  valor: number;
}

export interface Atendimento {
  id: string;
  data: string;
  nomeAnimal: string;
  idadeAnimal: string;
  especie: string;
  nomeProprietario: string;
  telefoneProprietario: string;
  local: string;
  endereco: string;
  procedimentos: Procedimento[];
  materiais: Material[];
  medicacoes: Medicacao[];
  observacoes: string;
  valorTotal: number;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('novo');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto p-4 max-w-7xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-[rgb(26,13,102)] p-3 rounded-full">
              <Stethoscope className="size-8 text-white" />
            </div>
            <div>
              <h1 className="text-blue-900">VetField Pro</h1>
              <p className="text-gray-600">Sistema de Gestão para Atendimento Veterinário a Campo</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white p-1 rounded-lg shadow">
            <TabsTrigger value="novo">Novo Atendimento</TabsTrigger>
            <TabsTrigger value="lista">Atendimentos</TabsTrigger>
            <TabsTrigger value="precos">Gerenciar Preços</TabsTrigger>
            <TabsTrigger value="dados">Meus Dados</TabsTrigger>
          </TabsList>

          <TabsContent value="novo" className="mt-0">
            <NovoAtendimento onSuccess={() => setActiveTab('lista')} />
          </TabsContent>

          <TabsContent value="lista" className="mt-0">
            <ListaAtendimentos />
          </TabsContent>

          <TabsContent value="precos" className="mt-0">
            <GerenciarPrecos />
          </TabsContent>

          <TabsContent value="dados" className="mt-0">
            <MeusDados />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}