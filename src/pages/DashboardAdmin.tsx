import { useEffect, useState } from 'react';
import { adminAPI } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const DashboardAdmin = () => {
  const [pending, setPending] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const response = await adminAPI.getPending();
      setPending(response.data);
    } catch (error) {
      console.error('Error fetching pending:', error);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await adminAPI.approve(id);
      toast({ title: 'UMKM approved!' });
      fetchPending();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
          <div className="space-y-4">
            {pending.map((umkm: any) => (
              <Card key={umkm._id}>
                <CardHeader>
                  <CardTitle>{umkm.nama}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{umkm.deskripsi}</p>
                  <div className="mt-4 flex gap-2">
                    <Button onClick={() => handleApprove(umkm._id)}>Approve</Button>
                    <Button variant="destructive">Reject</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
