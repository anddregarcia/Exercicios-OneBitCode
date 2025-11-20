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
export default function App(): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=App.d.ts.map