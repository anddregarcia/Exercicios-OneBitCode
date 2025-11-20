import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Calendar, MapPin, FileText, Trash2, Search } from 'lucide-react';
import type { Atendimento } from '../App';
import { DetalhesAtendimento } from './DetalhesAtendimento';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { toast } from 'sonner@2.0.3';

const ESPECIES_CORES: Record<string, string> = {
  'Equinos': 'bg-amber-100 text-amber-800',
  'Caninos': 'bg-blue-100 text-blue-800',
  'Felinos': 'bg-purple-100 text-purple-800',
  'Bovinos': 'bg-green-100 text-green-800',
  'Caprinos': 'bg-orange-100 text-orange-800',
};

export function ListaAtendimentos() {
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
  const [atendimentoSelecionado, setAtendimentoSelecionado] = useState<Atendimento | null>(null);
  const [atendimentoParaExcluir, setAtendimentoParaExcluir] = useState<string | null>(null);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    carregarAtendimentos();
  }, []);

  const carregarAtendimentos = () => {
    const stored = localStorage.getItem('atendimentos');
    if (stored) {
      const atendimentosCarregados = JSON.parse(stored);
      // Ordenar por data (mais recente primeiro)
      atendimentosCarregados.sort((a: Atendimento, b: Atendimento) => 
        new Date(b.data).getTime() - new Date(a.data).getTime()
      );
      setAtendimentos(atendimentosCarregados);
    }
  };

  const excluirAtendimento = (id: string) => {
    const novosAtendimentos = atendimentos.filter(a => a.id !== id);
    localStorage.setItem('atendimentos', JSON.stringify(novosAtendimentos));
    setAtendimentos(novosAtendimentos);
    setAtendimentoParaExcluir(null);
    toast.success('Atendimento excluído com sucesso');
  };

  const formatarData = (data: string) => {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const atendimentosFiltrados = atendimentos.filter(atendimento => {
    const termoBusca = filtro.toLowerCase();
    return (
      atendimento.nomeAnimal.toLowerCase().includes(termoBusca) ||
      atendimento.nomeProprietario.toLowerCase().includes(termoBusca) ||
      atendimento.local.toLowerCase().includes(termoBusca) ||
      atendimento.especie.toLowerCase().includes(termoBusca)
    );
  });

  if (atendimentoSelecionado) {
    return (
      <DetalhesAtendimento
        atendimento={atendimentoSelecionado}
        onVoltar={() => setAtendimentoSelecionado(null)}
        onAtualizar={carregarAtendimentos}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Atendimentos Realizados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Search className="size-5 text-gray-400" />
            <Input
              placeholder="Buscar por animal, proprietário, local ou espécie..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>

          {atendimentosFiltrados.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="size-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhum atendimento encontrado</p>
            </div>
          ) : (
            <div className="space-y-3">
              {atendimentosFiltrados.map(atendimento => (
                <div
                  key={atendimento.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setAtendimentoSelecionado(atendimento)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-gray-900">{atendimento.nomeAnimal}</h3>
                        <Badge className={ESPECIES_CORES[atendimento.especie] || 'bg-gray-100 text-gray-800'}>
                          {atendimento.especie}
                        </Badge>
                      </div>

                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Proprietário: {atendimento.nomeProprietario}</p>
                        
                        <div className="flex items-center gap-4 flex-wrap">
                          <div className="flex items-center gap-1">
                            <Calendar className="size-4" />
                            <span>{formatarData(atendimento.data)}</span>
                          </div>
                          
                          {atendimento.local && (
                            <div className="flex items-center gap-1">
                              <MapPin className="size-4" />
                              <span>{atendimento.local}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-gray-500">
                            {atendimento.procedimentos.length} procedimento(s)
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            {atendimento.materiais.length} material(is)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Valor Total</p>
                        <p className="text-green-600">R$ {atendimento.valorTotal.toFixed(2)}</p>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAtendimentoParaExcluir(atendimento.id);
                        }}
                      >
                        <Trash2 className="size-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {atendimentosFiltrados.length > 0 && (
            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Total de atendimentos: {atendimentosFiltrados.length}</p>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Valor Total</p>
                  <p className="text-green-600">
                    R$ {atendimentosFiltrados.reduce((sum, a) => sum + a.valorTotal, 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!atendimentoParaExcluir} onOpenChange={() => setAtendimentoParaExcluir(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este atendimento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => atendimentoParaExcluir && excluirAtendimento(atendimentoParaExcluir)}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
