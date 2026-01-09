// frontend/src/pages/SchemasPage.tsx

import { Sidebar } from '../components/layout/Sidebar';
import { PageHeader } from '../components/layout/PageHeader';

export default function SchemasPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#08090A] to-[#101011]">
      <Sidebar />
      
      <main className="ml-[240px]">
        <PageHeader breadcrumbItems={[{ label: 'Schemas' }]} />
        
        <div className="px-32 py-8 flex items-center justify-center text-neutral-500">
          <p className="text-15">Section Schemas (à venir)</p>
        </div>
      </main>
    </div>
  );
}