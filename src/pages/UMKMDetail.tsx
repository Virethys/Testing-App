import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { umkmAPI } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const UMKMDetail = () => {
  const { id } = useParams();
  const [umkm, setUmkm] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetchUMKM();
    }
  }, [id]);

  const fetchUMKM = async () => {
    try {
      const response = await umkmAPI.getById(id!);
      setUmkm(response.data);
    } catch (error) {
      console.error('Error fetching UMKM:', error);
    }
  };

  if (!umkm) return <div>Loading...</div>;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <img src={umkm.foto || '/placeholder.svg'} alt={umkm.nama} className="w-full h-96 object-cover rounded-lg mb-6" />
              <h1 className="text-4xl font-bold mb-4">{umkm.nama}</h1>
              <p className="text-muted-foreground mb-6">{umkm.deskripsi}</p>
              
              <h2 className="text-2xl font-bold mb-4">Produk</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {umkm.products?.map((product: any) => (
                  <Card key={product._id}>
                    <CardContent className="p-4">
                      <img src={product.foto || '/placeholder.svg'} alt={product.nama} className="w-full h-40 object-cover rounded mb-2" />
                      <h3 className="font-semibold">{product.nama}</h3>
                      <p className="text-sm text-muted-foreground">{product.deskripsi}</p>
                      <p className="font-bold mt-2">Rp {product.harga?.toLocaleString('id-ID')}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-4">Informasi Kontak</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{umkm.alamat}, {umkm.kota}</span>
                    </div>
                    {umkm.kontak?.telepon && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span className="text-sm">{umkm.kontak.telepon}</span>
                      </div>
                    )}
                    {umkm.kontak?.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span className="text-sm">{umkm.kontak.email}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <Badge>{umkm.operator}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UMKMDetail;
