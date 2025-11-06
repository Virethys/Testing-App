import { useEffect, useState } from 'react';
import { umkmAPI, productAPI } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const DashboardUMKM = () => {
  const [umkm, setUmkm] = useState<any>(null);

  useEffect(() => {
    fetchMyUMKM();
  }, []);

  const fetchMyUMKM = async () => {
    try {
      const response = await umkmAPI.getMy();
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
          <h1 className="text-4xl font-bold mb-8">Dashboard UMKM</h1>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{umkm.nama}</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge>{umkm.status}</Badge>
              <p className="mt-4">{umkm.deskripsi}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardUMKM;
