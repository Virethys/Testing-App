import { useEffect, useState } from 'react';
import { adminAPI } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const DashboardAdmin = () => {
  const [pending, setPending] = useState([]);
  const [allUMKM, setAllUMKM] = useState([]);
  const [stats, setStats] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchPending();
    fetchStats();
    fetchAllUMKM();
  }, []);

  const fetchPending = async () => {
    try {
      const response = await adminAPI.getPending();
      setPending(response.data);
    } catch (error) {
      console.error('Error fetching pending:', error);
    }
  };

  const fetchAllUMKM = async () => {
    try {
      const response = await adminAPI.getAllUMKM();
      setAllUMKM(response.data.data);
    } catch (error) {
      console.error('Error fetching all UMKM:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await adminAPI.approve(id);
      toast({ title: 'UMKM berhasil disetujui!' });
      fetchPending();
      fetchAllUMKM();
      fetchStats();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  const handleReject = async (id: string) => {
    try {
      await adminAPI.reject(id);
      toast({ title: 'UMKM ditolak' });
      fetchPending();
      fetchAllUMKM();
      fetchStats();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  const filteredUMKM = (allUMKM || []).filter((umkm: any) => {
    const matchesSearch = umkm.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         umkm.kota.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || umkm.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8 text-foreground">Dashboard Admin</h1>

          {/* Statistics */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Total UMKM</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{stats.totalUMKM}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Disetujui</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{stats.approvedUMKM}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Menunggu</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-600">{stats.pendingUMKM}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Ditolak</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">{stats.rejectedUMKM}</div>
                </CardContent>
              </Card>
            </div>
          )}

          <Tabs defaultValue="pending" className="w-full">
            <TabsList>
              <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
              <TabsTrigger value="all">Semua UMKM</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4 mt-6">
              {pending.length === 0 ? (
                <Card>
                  <CardContent className="py-10 text-center text-muted-foreground">
                    Tidak ada UMKM yang menunggu persetujuan
                  </CardContent>
                </Card>
              ) : (
                pending.map((umkm: any) => (
                  <Card key={umkm._id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl">{umkm.nama}</CardTitle>
                          <div className="text-sm text-muted-foreground mt-1">
                            {umkm.operator} • {umkm.kota}
                          </div>
                        </div>
                        <Badge className="bg-yellow-500">{umkm.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{umkm.deskripsi}</p>
                      <div className="space-y-2 text-sm mb-4">
                        <div><strong>Alamat:</strong> {umkm.alamat}</div>
                        {umkm.nib && <div><strong>NIB:</strong> {umkm.nib}</div>}
                        {umkm.dinas && <div><strong>Dinas:</strong> {umkm.dinas}</div>}
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleApprove(umkm._id)} className="bg-green-600 hover:bg-green-700">
                          Setujui
                        </Button>
                        <Button variant="destructive" onClick={() => handleReject(umkm._id)}>
                          Tolak
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="all" className="space-y-4 mt-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Input
                  placeholder="Cari nama UMKM atau kota..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="approved">Disetujui</SelectItem>
                    <SelectItem value="pending">Menunggu</SelectItem>
                    <SelectItem value="rejected">Ditolak</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {filteredUMKM.map((umkm: any) => (
                  <Card key={umkm._id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{umkm.nama}</CardTitle>
                          <div className="text-sm text-muted-foreground mt-1">
                            {umkm.operator} • {umkm.kota}
                          </div>
                        </div>
                        <Badge className={getStatusColor(umkm.status)}>
                          {umkm.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{umkm.deskripsi}</p>
                    </CardContent>
                  </Card>
                ))}
                {filteredUMKM.length === 0 && (
                  <Card>
                    <CardContent className="py-10 text-center text-muted-foreground">
                      Tidak ada UMKM yang sesuai dengan filter
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
