import { useEffect, useState } from 'react';
import { adminAPI, umkmAPI } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Pencil, Trash2, Save, X } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

const DashboardAdmin = () => {
  const [pending, setPending] = useState([]);
  const [allUMKM, setAllUMKM] = useState([]);
  const [stats, setStats] = useState<any>(null);
  const [operatorStats, setOperatorStats] = useState<any>(null);
  const [selectedOperator, setSelectedOperator] = useState<string>('global');
  const [auditLogs, setAuditLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUMKM, setSelectedUMKM] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isUploadingFoto, setIsUploadingFoto] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchPending(), fetchStats(), fetchAllUMKM(), fetchAuditLogs(), fetchOperatorStats()]);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const fetchPending = async () => {
    try {
      const response = await adminAPI.getPending();
      setPending(response.data || []);
    } catch (error) {
      console.error('Error fetching pending:', error);
      setPending([]);
    }
  };

  const fetchAllUMKM = async () => {
    try {
      const response = await adminAPI.getAllUMKM();
      setAllUMKM(response.data || []);
    } catch (error) {
      console.error('Error fetching all UMKM:', error);
      setAllUMKM([]);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({ variant: 'destructive', title: 'Error loading stats' });
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const response = await adminAPI.getAuditLogs(20);
      setAuditLogs(response.data || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      setAuditLogs([]);
    }
  };

  const fetchOperatorStats = async (operator?: string) => {
    try {
      const response = await adminAPI.getOperatorStats(operator);
      setOperatorStats(response.data);
    } catch (error) {
      console.error('Error fetching operator stats:', error);
      toast({ variant: 'destructive', title: 'Error loading operator stats' });
    }
  };

  useEffect(() => {
    if (selectedOperator && selectedOperator !== 'global') {
      fetchOperatorStats(selectedOperator);
    } else {
      fetchOperatorStats();
    }
  }, [selectedOperator]);

  const handleApprove = async (id: string) => {
    try {
      await adminAPI.approve(id);
      toast({ title: 'UMKM berhasil disetujui!' });
      fetchPending();
      fetchAllUMKM();
      fetchStats();
      fetchAuditLogs();
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
      fetchAuditLogs();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  const handleUMKMClick = (umkm: any) => {
    setSelectedUMKM(umkm);
    setEditData(umkm);
    setIsEditMode(false);
  };

  const handleCloseDialog = () => {
    setSelectedUMKM(null);
    setIsEditMode(false);
    setEditData({});
  };

  const handleEditChange = (field: string, value: any) => {
    setEditData({ ...editData, [field]: value });
  };

  const handleSaveEdit = async () => {
    try {
      await umkmAPI.update(selectedUMKM._id, editData);
      toast({ title: 'UMKM berhasil diperbarui!' });
      setSelectedUMKM(editData);
      setIsEditMode(false);
      fetchAllUMKM();
      fetchStats();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Gagal memperbarui UMKM',
      });
    }
  };

  const handleDelete = async () => {
    try {
      await umkmAPI.delete(selectedUMKM._id);
      toast({ title: 'UMKM berhasil dihapus!' });
      setDeleteConfirmOpen(false);
      handleCloseDialog();
      fetchAllUMKM();
      fetchPending();
      fetchStats();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Gagal menghapus UMKM',
      });
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'File harus berupa gambar',
      });
      return;
    }

    setIsUploadingBanner(true);
    try {
      const response = await umkmAPI.uploadImage(selectedUMKM._id, 'banner', file);
      const newBannerUrl = response.data.url;
      
      setEditData({ ...editData, banner: newBannerUrl });
      setSelectedUMKM({ ...selectedUMKM, banner: newBannerUrl });
      
      toast({ title: 'Banner berhasil diupload!' });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Gagal mengupload banner',
      });
    } finally {
      setIsUploadingBanner(false);
    }
  };

  const handleFotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'File harus berupa gambar',
      });
      return;
    }

    setIsUploadingFoto(true);
    try {
      const response = await umkmAPI.uploadImage(selectedUMKM!._id, 'foto', file);
      toast({ title: 'Foto profil berhasil diupload!' });
      
      // Update editData and selectedUMKM
      const updatedData = { ...editData, foto: response.data.url };
      setEditData(updatedData);
      setSelectedUMKM({ ...selectedUMKM!, foto: response.data.url });
      
      // Refresh UMKM list
      fetchAllUMKM();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Gagal mengupload foto',
      });
    } finally {
      setIsUploadingFoto(false);
    }
  };

  const handleDeleteImage = async (type: 'foto' | 'banner') => {
    if (!selectedUMKM) return;

    try {
      await umkmAPI.update(selectedUMKM._id, { [type]: '' });
      toast({ title: `${type === 'foto' ? 'Foto profil' : 'Banner'} berhasil dihapus!` });
      
      // Update editData and selectedUMKM
      const updatedData = { ...editData, [type]: '' };
      setEditData(updatedData);
      setSelectedUMKM({ ...selectedUMKM, [type]: '' });
      
      // Refresh UMKM list
      fetchAllUMKM();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Gagal menghapus gambar',
      });
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-20 flex items-center justify-center">
          <div className="text-foreground">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  const chartData = stats?.categoryStats?.map((cat: any, index: number) => ({
    name: cat._id || 'Tidak Ada Kategori',
    value: cat.count,
    color: COLORS[index % COLORS.length],
  })) || [];

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

          {/* Category Pie Chart */}
          {chartData.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Distribusi Kategori UMKM (Approved)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="pending" className="w-full">
            <TabsList>
              <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
              <TabsTrigger value="all">Semua UMKM</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="audit">Audit Log</TabsTrigger>
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
                  <Card 
                    key={umkm._id} 
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handleUMKMClick(umkm)}
                  >
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

            <TabsContent value="analytics" className="space-y-6 mt-6">
              {/* Operator Filter */}
              <Card>
                <CardHeader>
                  <CardTitle>Filter Kategori Operator</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={selectedOperator} onValueChange={setSelectedOperator}>
                    <SelectTrigger className="w-full max-w-md">
                      <SelectValue placeholder="Pilih operator untuk melihat detail" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="global">Semua Operator (Global)</SelectItem>
                      <SelectItem value="Dinas Provinsi Sumatera Selatan">
                        Dinas Provinsi Sumatera Selatan
                      </SelectItem>
                      <SelectItem value="Kabupaten/Kota Wilayah Sumatera Selatan">
                        Kabupaten/Kota Wilayah Sumatera Selatan
                      </SelectItem>
                      <SelectItem value="Stakeholder (Binaan Perusahaan/Lembaga)">
                        Stakeholder (Binaan Perusahaan/Lembaga)
                      </SelectItem>
                      <SelectItem value="Perseorangan (Usia 17-40 Tahun)">
                        Perseorangan (Usia 17-40 Tahun)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Operator Statistics Pie Chart */}
              {operatorStats?.operatorStats && (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {selectedOperator !== 'global'
                        ? `Detail Pendaftaran - ${selectedOperator}` 
                        : 'Statistik Pendaftaran Per Operator'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <PieChart>
                        <Pie
                          data={(selectedOperator !== 'global' ? operatorStats.detailStats : operatorStats.operatorStats)?.map((item: any, index: number) => ({
                            name: item._id || 'Tidak Ada Data',
                            value: item.count,
                            color: COLORS[index % COLORS.length],
                          }))}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent, value }) => 
                            `${name}: ${value} (${(percent * 100).toFixed(1)}%)`
                          }
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {(selectedOperator !== 'global' ? operatorStats.detailStats : operatorStats.operatorStats)?.map((_: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}

              {/* Bar Chart */}
              {operatorStats?.operatorStats && (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {selectedOperator !== 'global'
                        ? `Perbandingan Pendaftaran - ${selectedOperator}` 
                        : 'Perbandingan Pendaftaran Per Operator'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart
                        data={(selectedOperator !== 'global' ? operatorStats.detailStats : operatorStats.operatorStats)?.map((item: any, index: number) => ({
                          name: item._id || 'Tidak Ada Data',
                          jumlah: item.count,
                          color: COLORS[index % COLORS.length],
                        }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="name" 
                          angle={-45}
                          textAnchor="end"
                          height={100}
                          interval={0}
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="jumlah" fill="#8884d8">
                          {(selectedOperator !== 'global' ? operatorStats.detailStats : operatorStats.operatorStats)?.map((_: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="audit" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Riwayat Aktivitas Admin</CardTitle>
                </CardHeader>
                <CardContent>
                  {auditLogs.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">
                      Belum ada aktivitas
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {auditLogs.map((log: any) => (
                        <div
                          key={log._id}
                          className="border-l-4 border-primary pl-4 py-2"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <Badge
                                className={
                                  log.action === 'approve'
                                    ? 'bg-green-500'
                                    : 'bg-red-500'
                                }
                              >
                                {log.action === 'approve' ? 'Disetujui' : 'Ditolak'}
                              </Badge>
                              <span className="ml-2 font-medium">{log.umkmName}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(log.createdAt).toLocaleString('id-ID')}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            oleh: {log.adminEmail}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* UMKM Detail Dialog */}
      <Dialog open={!!selectedUMKM} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{isEditMode ? 'Edit UMKM' : 'Detail UMKM'}</span>
              {!isEditMode && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditMode(true)}
                    className="gap-2"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setDeleteConfirmOpen(true)}
                    className="gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Hapus
                  </Button>
                </div>
              )}
            </DialogTitle>
            <DialogDescription>
              {isEditMode ? 'Edit informasi UMKM' : 'Informasi lengkap UMKM'}
            </DialogDescription>
          </DialogHeader>

          {selectedUMKM && (
            <div className="space-y-4 py-4">
              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <Label>Status:</Label>
                <Badge className={getStatusColor(selectedUMKM.status)}>
                  {selectedUMKM.status}
                </Badge>
              </div>

              {/* Banner */}
              <div className="space-y-2">
                <Label>Banner</Label>
                {isEditMode ? (
                  <div className="space-y-2">
                    {editData.banner && (
                      <img
                        src={editData.banner}
                        alt="Banner"
                        className="w-full h-40 rounded-lg object-cover border"
                      />
                    )}
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleBannerUpload}
                        disabled={isUploadingBanner}
                        className="cursor-pointer"
                      />
                      {selectedUMKM.banner && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteImage('banner')}
                          disabled={isUploadingBanner || isUploadingFoto}
                          className="gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Hapus
                        </Button>
                      )}
                    </div>
                    {isUploadingBanner && (
                      <p className="text-sm text-muted-foreground">Mengupload banner...</p>
                    )}
                  </div>
                ) : (
                  selectedUMKM.banner && (
                    <img
                      src={selectedUMKM.banner}
                      alt="Banner"
                      className="w-full h-40 rounded-lg object-cover border"
                    />
                  )
                )}
              </div>

              {/* Foto */}
              <div className="space-y-2">
                <Label>Foto Profil</Label>
                {isEditMode ? (
                  <div className="space-y-2">
                    {editData.foto && (
                      <img
                        src={editData.foto}
                        alt="Foto"
                        className="w-32 h-32 rounded-lg object-cover border"
                      />
                    )}
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFotoUpload}
                        disabled={isUploadingFoto}
                        className="cursor-pointer"
                      />
                      {selectedUMKM.foto && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteImage('foto')}
                          disabled={isUploadingBanner || isUploadingFoto}
                          className="gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Hapus
                        </Button>
                      )}
                    </div>
                    {isUploadingFoto && (
                      <p className="text-sm text-muted-foreground">Mengupload foto...</p>
                    )}
                  </div>
                ) : (
                  selectedUMKM.foto && (
                    <img
                      src={selectedUMKM.foto}
                      alt="Foto"
                      className="w-32 h-32 rounded-lg object-cover border"
                    />
                  )
                )}
              </div>

              {/* Nama */}
              <div className="space-y-2">
                <Label>Nama UMKM</Label>
                {isEditMode ? (
                  <Input
                    value={editData.nama || ''}
                    onChange={(e) => handleEditChange('nama', e.target.value)}
                  />
                ) : (
                  <p className="text-foreground font-medium">{selectedUMKM.nama}</p>
                )}
              </div>

              {/* NIB */}
              <div className="space-y-2">
                <Label>NIB</Label>
                {isEditMode ? (
                  <Input
                    value={editData.nib || ''}
                    onChange={(e) => handleEditChange('nib', e.target.value)}
                  />
                ) : (
                  <p className="text-muted-foreground">{selectedUMKM.nib || '-'}</p>
                )}
              </div>

              {/* Deskripsi */}
              <div className="space-y-2">
                <Label>Deskripsi</Label>
                {isEditMode ? (
                  <Textarea
                    value={editData.deskripsi || ''}
                    onChange={(e) => handleEditChange('deskripsi', e.target.value)}
                    rows={4}
                  />
                ) : (
                  <p className="text-muted-foreground">{selectedUMKM.deskripsi}</p>
                )}
              </div>

              {/* Alamat */}
              <div className="space-y-2">
                <Label>Alamat</Label>
                {isEditMode ? (
                  <Textarea
                    value={editData.alamat || ''}
                    onChange={(e) => handleEditChange('alamat', e.target.value)}
                    rows={2}
                  />
                ) : (
                  <p className="text-muted-foreground">{selectedUMKM.alamat}</p>
                )}
              </div>

              {/* Kota */}
              <div className="space-y-2">
                <Label>Kota</Label>
                {isEditMode ? (
                  <Input
                    value={editData.kota || ''}
                    onChange={(e) => handleEditChange('kota', e.target.value)}
                  />
                ) : (
                  <p className="text-muted-foreground">{selectedUMKM.kota}</p>
                )}
              </div>

              {/* Operator */}
              <div className="space-y-2">
                <Label>Operator</Label>
                {isEditMode ? (
                  <Select
                    value={editData.operator || selectedUMKM.operator}
                    onValueChange={(value) => handleEditChange('operator', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih operator" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dinas Provinsi Sumatera Selatan">
                        Dinas Provinsi Sumatera Selatan
                      </SelectItem>
                      <SelectItem value="Kabupaten/Kota Wilayah Sumatera Selatan">
                        Kabupaten/Kota Wilayah Sumatera Selatan
                      </SelectItem>
                      <SelectItem value="Stakeholder (Binaan Perusahaan/Lembaga)">
                        Stakeholder (Binaan Perusahaan/Lembaga)
                      </SelectItem>
                      <SelectItem value="Perseorangan (Usia 17-40 Tahun)">
                        Perseorangan (Usia 17-40 Tahun)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-muted-foreground">{selectedUMKM.operator}</p>
                )}
              </div>

              {/* Conditional Dinas Selection */}
              {isEditMode && (editData.operator || selectedUMKM.operator) === 'Dinas Provinsi Sumatera Selatan' && (
                <div className="space-y-2">
                  <Label>Dinas *</Label>
                  <Select
                    value={editData.dinas || selectedUMKM.dinas || ''}
                    onValueChange={(value) => handleEditChange('dinas', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Dinas" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      <SelectItem value="Dinas Koperasi dan UKM">Dinas Koperasi dan UKM</SelectItem>
                      <SelectItem value="Dinas Pertanian">Dinas Pertanian</SelectItem>
                      <SelectItem value="Dinas Perikanan">Dinas Perikanan</SelectItem>
                      <SelectItem value="Dinas Pariwisata dan Ekonomi Kreatif">Dinas Pariwisata dan Ekonomi Kreatif</SelectItem>
                      <SelectItem value="Dinas Perdagangan">Dinas Perdagangan</SelectItem>
                      <SelectItem value="Dinas Perindustrian">Dinas Perindustrian</SelectItem>
                      <SelectItem value="Dinas Peternakan">Dinas Peternakan</SelectItem>
                      <SelectItem value="Dinas Perkebunan">Dinas Perkebunan</SelectItem>
                      <SelectItem value="Dinas Komunikasi dan Informatika">Dinas Komunikasi dan Informatika</SelectItem>
                      <SelectItem value="Lainnya">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Conditional Kabupaten/Kota Selection */}
              {isEditMode && (editData.operator || selectedUMKM.operator) === 'Kabupaten/Kota Wilayah Sumatera Selatan' && (
                <div className="space-y-2">
                  <Label>Kabupaten/Kota *</Label>
                  <Select
                    value={editData.dinas || selectedUMKM.dinas || ''}
                    onValueChange={(value) => handleEditChange('dinas', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Kabupaten/Kota" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      <SelectItem value="Dinas Koperasi dan UKM Kabupaten Banyuasin">Dinas Koperasi dan UKM Kabupaten Banyuasin</SelectItem>
                      <SelectItem value="Dinas Koperasi dan UKM Kabupaten Empat Lawang">Dinas Koperasi dan UKM Kabupaten Empat Lawang</SelectItem>
                      <SelectItem value="Dinas Koperasi dan UKM Kabupaten Lahat">Dinas Koperasi dan UKM Kabupaten Lahat</SelectItem>
                      <SelectItem value="Dinas Koperasi dan UKM Kabupaten Muara Enim">Dinas Koperasi dan UKM Kabupaten Muara Enim</SelectItem>
                      <SelectItem value="Dinas Koperasi dan UKM Kabupaten Musi Banyuasin">Dinas Koperasi dan UKM Kabupaten Musi Banyuasin</SelectItem>
                      <SelectItem value="Dinas Koperasi dan UKM Kabupaten Musi Rawas">Dinas Koperasi dan UKM Kabupaten Musi Rawas</SelectItem>
                      <SelectItem value="Dinas Koperasi dan UKM Kabupaten Musi Rawas Utara">Dinas Koperasi dan UKM Kabupaten Musi Rawas Utara</SelectItem>
                      <SelectItem value="Dinas Koperasi dan UKM Kabupaten Ogan Ilir">Dinas Koperasi dan UKM Kabupaten Ogan Ilir</SelectItem>
                      <SelectItem value="Dinas Koperasi dan UKM Kabupaten Ogan Komering Ilir">Dinas Koperasi dan UKM Kabupaten Ogan Komering Ilir</SelectItem>
                      <SelectItem value="Dinas Koperasi dan UKM Kabupaten Ogan Komering Ulu">Dinas Koperasi dan UKM Kabupaten Ogan Komering Ulu</SelectItem>
                      <SelectItem value="Dinas Koperasi dan UKM Kabupaten Ogan Komering Ulu Selatan">Dinas Koperasi dan UKM Kabupaten Ogan Komering Ulu Selatan</SelectItem>
                      <SelectItem value="Dinas Koperasi dan UKM Kabupaten Ogan Komering Ulu Timur">Dinas Koperasi dan UKM Kabupaten Ogan Komering Ulu Timur</SelectItem>
                      <SelectItem value="Dinas Koperasi dan UKM Kabupaten Penukal Abab Lematang Ilir">Dinas Koperasi dan UKM Kabupaten Penukal Abab Lematang Ilir</SelectItem>
                      <SelectItem value="Dinas Koperasi dan UKM Kota Lubuklinggau">Dinas Koperasi dan UKM Kota Lubuklinggau</SelectItem>
                      <SelectItem value="Dinas Koperasi dan UKM Kota Pagar Alam">Dinas Koperasi dan UKM Kota Pagar Alam</SelectItem>
                      <SelectItem value="Dinas Koperasi dan UKM Kota Palembang">Dinas Koperasi dan UKM Kota Palembang</SelectItem>
                      <SelectItem value="Dinas Koperasi dan UKM Kota Prabumulih">Dinas Koperasi dan UKM Kota Prabumulih</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Conditional Stakeholder Selection */}
              {isEditMode && (editData.operator || selectedUMKM.operator) === 'Stakeholder (Binaan Perusahaan/Lembaga)' && (
                <div className="space-y-2">
                  <Label>Stakeholder *</Label>
                  <Select
                    value={editData.dinas || selectedUMKM.dinas || ''}
                    onValueChange={(value) => handleEditChange('dinas', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Stakeholder" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      <SelectItem value="Kemenkumham">Kemenkumham</SelectItem>
                      <SelectItem value="Bank Indonesia">Bank Indonesia</SelectItem>
                      <SelectItem value="Otoritas Jasa Keuangan">Otoritas Jasa Keuangan</SelectItem>
                      <SelectItem value="Lembaga Pembiayaan Ekspor Indonesia (LPEI)">Lembaga Pembiayaan Ekspor Indonesia (LPEI)</SelectItem>
                      <SelectItem value="Asosiasi Fintech Pendanaan Bersama Indonesia (AFPI)">Asosiasi Fintech Pendanaan Bersama Indonesia (AFPI)</SelectItem>
                      <SelectItem value="Asosiasi UMKM Indonesia (AKUMINDO)">Asosiasi UMKM Indonesia (AKUMINDO)</SelectItem>
                      <SelectItem value="Himpunan Pengusaha Muda Indonesia (HIPMI)">Himpunan Pengusaha Muda Indonesia (HIPMI)</SelectItem>
                      <SelectItem value="Ikatan Wanita Pengusaha Indonesia (IWAPI)">Ikatan Wanita Pengusaha Indonesia (IWAPI)</SelectItem>
                      <SelectItem value="Badan Pengawas Obat dan Makanan (BPOM)">Badan Pengawas Obat dan Makanan (BPOM)</SelectItem>
                      <SelectItem value="Kementerian Agama Sumatera Selatan">Kementerian Agama Sumatera Selatan</SelectItem>
                      <SelectItem value="Lembaga Sertifikasi Halal (LSH)">Lembaga Sertifikasi Halal (LSH)</SelectItem>
                      <SelectItem value="Badan Penyelenggara Jaminan Produk Halal (BPJPH)">Badan Penyelenggara Jaminan Produk Halal (BPJPH)</SelectItem>
                      <SelectItem value="Lainnya (Sebutkan di Keterangan)">Lainnya (Sebutkan di Keterangan)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Kategori */}
              <div className="space-y-2">
                <Label>Kategori</Label>
                {isEditMode ? (
                  <Select
                    value={editData.kategori || selectedUMKM.kategori || ''}
                    onValueChange={(value) => handleEditChange('kategori', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fashion">Fashion</SelectItem>
                      <SelectItem value="Kuliner">Kuliner</SelectItem>
                      <SelectItem value="Kerajinan">Kerajinan</SelectItem>
                      <SelectItem value="Teknologi">Teknologi</SelectItem>
                      <SelectItem value="Pertanian">Pertanian</SelectItem>
                      <SelectItem value="Jasa">Jasa</SelectItem>
                      <SelectItem value="Lainnya">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-muted-foreground">{selectedUMKM.kategori || '-'}</p>
                )}
              </div>

              {/* Dinas (Display only when not in edit mode) */}
              {!isEditMode && selectedUMKM.dinas && (
                <div className="space-y-2">
                  <Label>Dinas/Kabupaten/Stakeholder</Label>
                  <p className="text-muted-foreground">{selectedUMKM.dinas}</p>
                </div>
              )}

              {/* Kontak */}
              {selectedUMKM.kontak && (
                <div className="space-y-2">
                  <Label className="text-base font-semibold">Informasi Kontak</Label>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {selectedUMKM.kontak.whatsapp && (
                      <div>
                        <Label className="text-xs">WhatsApp</Label>
                        <p className="text-muted-foreground">{selectedUMKM.kontak.whatsapp}</p>
                      </div>
                    )}
                    {selectedUMKM.kontak.email && (
                      <div>
                        <Label className="text-xs">Email</Label>
                        <p className="text-muted-foreground">{selectedUMKM.kontak.email}</p>
                      </div>
                    )}
                    {selectedUMKM.kontak.instagram && (
                      <div>
                        <Label className="text-xs">Instagram</Label>
                        <p className="text-muted-foreground">{selectedUMKM.kontak.instagram}</p>
                      </div>
                    )}
                    {selectedUMKM.kontak.facebook && (
                      <div>
                        <Label className="text-xs">Facebook</Label>
                        <p className="text-muted-foreground">{selectedUMKM.kontak.facebook}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {isEditMode && (
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditMode(false)} className="gap-2">
                <X className="w-4 h-4" />
                Batal
              </Button>
              <Button onClick={handleSaveEdit} className="gap-2">
                <Save className="w-4 h-4" />
                Simpan
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus UMKM?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus UMKM "{selectedUMKM?.nama}"? 
              Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data terkait UMKM ini.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DashboardAdmin;
