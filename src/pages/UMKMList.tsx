import { useEffect, useState } from 'react';
import { umkmAPI } from '@/lib/api';
import UMKMCard from '@/components/UMKMCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const UMKMList = () => {
  const [umkms, setUmkms] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUMKMs();
  }, [page, search]);

  const fetchUMKMs = async () => {
    try {
      const response = await umkmAPI.getAll({ page, limit: 12, search });
      setUmkms(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching UMKMs:', error);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">Daftar UMKM</h1>
          
          <div className="flex gap-2 mb-8">
            <Input
              placeholder="Cari UMKM..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-md"
            />
            <Button onClick={fetchUMKMs}>
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {umkms.map((umkm: any) => (
              <UMKMCard key={umkm._id} {...umkm} id={umkm._id} />
            ))}
          </div>

          <div className="flex justify-center gap-2">
            <Button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
              Previous
            </Button>
            <span className="py-2 px-4">Page {page} of {totalPages}</span>
            <Button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}>
              Next
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UMKMList;
