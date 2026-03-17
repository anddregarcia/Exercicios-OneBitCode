import EstimateForm from '../shared-form';

export default async function EditEstimatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EstimateForm estimateId={id} />;
}
