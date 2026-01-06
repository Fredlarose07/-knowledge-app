import { Sidebar } from '../components/layout/Sidebar';
import { PageHeader } from '../components/layout/PageHeader';

export default function SchemasPage() {
  return (
    <div className="h-screen flex bg-gradient-to-b from-[#08090A] to-[#101011]">
      <Sidebar />
      
      <main className="flex-1 flex flex-col">
        <PageHeader breadcrumbItems={[{ label: 'Schemas' }]} />
        
        <div className="flex-1 flex items-center justify-center text-neutral-500">
          <p className="text-15">Section Schemas (à venir)</p>
        </div>
      </main>
    </div>
  );
}