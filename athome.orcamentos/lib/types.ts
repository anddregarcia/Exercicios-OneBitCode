export type EstimateStatus = 'approved' | 'pending' | 'canceled';
export type PaymentMethod = 'pix' | 'debit' | 'boleto' | 'credit';

export type Client = {
  id: string;
  name: string;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  street?: string | null;
  city?: string | null;
  state?: string | null;
};

export type Material = { id: string; name: string; default_price: number };

export type EstimateMaterial = {
  id?: string;
  material_id?: string | null;
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
};
