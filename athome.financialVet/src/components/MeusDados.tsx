import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Save, User, Upload, X, Image, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export interface DadosProfissional {
  nome: string;
  crmv: string;
  telefone: string;
  email: string;
  pix: string;
  banco: string;
  agencia: string;
  conta: string;
  observacoesPagamento: string;
  logo?: string; // Base64 da imagem do logo
}

export function MeusDados() {
  const [dados, setDados] = useState<DadosProfissional>({
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
  
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const dadosSalvos = localStorage.getItem('dadosProfissional');
    if (dadosSalvos) {
      setDados(JSON.parse(dadosSalvos));
    }
  }, []);

  const salvarDados = async () => {
    setSalvando(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    localStorage.setItem('dadosProfissional', JSON.stringify(dados));
    toast.success('Dados salvos com sucesso!');
    setSalvando(false);
  };

  const atualizarCampo = (campo: keyof DadosProfissional, valor: string) => {
    setDados({ ...dados, [campo]: valor });
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDados({ ...dados, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setDados({ ...dados, logo: "" });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <User className="size-6 text-blue-600" />
            <div>
              <CardTitle>Meus Dados Profissionais</CardTitle>
              <p className="text-gray-600 text-sm mt-1">
                Estes dados serão incluídos nos PDFs enviados aos clientes
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-gray-900">Dados Pessoais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  value={dados.nome}
                  onChange={(e) => atualizarCampo('nome', e.target.value)}
                  placeholder="Dr(a). Seu Nome"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="crmv">CRMV</Label>
                <Input
                  id="crmv"
                  value={dados.crmv}
                  onChange={(e) => atualizarCampo('crmv', e.target.value)}
                  placeholder="CRMV-UF 12345"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={dados.telefone}
                  onChange={(e) => atualizarCampo('telefone', e.target.value)}
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={dados.email}
                  onChange={(e) => atualizarCampo('email', e.target.value)}
                  placeholder="seu.email@exemplo.com"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6 space-y-4">
            <h3 className="text-gray-900">Dados Bancários para Pagamento</h3>
            <p className="text-sm text-gray-600">
              Essas informações aparecerão no final do PDF para que o cliente possa efetuar o pagamento
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="pix">Chave PIX</Label>
                <Input
                  id="pix"
                  value={dados.pix}
                  onChange={(e) => atualizarCampo('pix', e.target.value)}
                  placeholder="CPF, CNPJ, E-mail, Telefone ou Chave Aleatória"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="banco">Banco</Label>
                <Input
                  id="banco"
                  value={dados.banco}
                  onChange={(e) => atualizarCampo('banco', e.target.value)}
                  placeholder="Ex: Banco do Brasil"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="agencia">Agência</Label>
                <Input
                  id="agencia"
                  value={dados.agencia}
                  onChange={(e) => atualizarCampo('agencia', e.target.value)}
                  placeholder="0000-0"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="conta">Conta</Label>
                <Input
                  id="conta"
                  value={dados.conta}
                  onChange={(e) => atualizarCampo('conta', e.target.value)}
                  placeholder="00000-0"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="observacoesPagamento">Observações sobre Pagamento</Label>
                <Textarea
                  id="observacoesPagamento"
                  value={dados.observacoesPagamento}
                  onChange={(e) => atualizarCampo('observacoesPagamento', e.target.value)}
                  placeholder="Ex: Pagamento à vista tem 10% de desconto. Parcelamento em até 3x sem juros."
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6 space-y-4">
            <h3 className="text-gray-900">Logo da Clínica</h3>
            <p className="text-sm text-gray-600">
              Adicione um logo para que ele apareça no cabeçalho dos PDFs enviados aos clientes
            </p>
            
            <div className="space-y-4">
              {dados.logo ? (
                <div className="flex items-start gap-4">
                  <div className="border-2 border-gray-200 rounded-lg p-4 bg-white">
                    <img 
                      src={dados.logo} 
                      alt="Logo da empresa" 
                      className="max-h-24 max-w-48 object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-2">Preview do logo que aparecerá no PDF</p>
                    <Button
                      variant="outline"
                      onClick={removeLogo}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="size-4 mr-2" />
                      Remover Logo
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                  <Image className="size-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600 mb-4">Nenhum logo carregado</p>
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => document.getElementById('logo')?.click()}
                  >
                    <Upload className="size-4 mr-2" />
                    Fazer Upload do Logo
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">PNG, JPG ou JPEG (recomendado: fundo transparente)</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button onClick={salvarDados} className="bg-blue-600 hover:bg-blue-700">
              {salvando ? (
                <Loader2 className="size-4 mr-2 animate-spin" />
              ) : (
                <Save className="size-4 mr-2" />
              )}
              Salvar Dados
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}