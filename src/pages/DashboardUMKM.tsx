import { useEffect, useState } from 'react';
import { umkmAPI } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Save, X } from 'lucide-react';

const DashboardUMKM = () => {
  const [umkm, setUmkm] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchMyUMKM();
  }, []);

  const fetchMyUMKM = async () => {
    try {
      const response = await umkmAPI.getMy();
      setUmkm(response.data);
      setEditData(response.data);
    } catch (error) {
      console.error('Error fetching UMKM:', error);
    }
  };

  const handleSave = async () => {
    try {
      await umkmAPI.update(umkm._id, editData);
      toast({ title: 'Profil UMKM berhasil diperbarui!' });
      setUmkm(editData);
      setIsEditing(false);
      fetchMyUMKM();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'Gagal memperbarui profil',
      });
    }
  };

  const handleCancel = () => {
    setEditData(umkm);
    setIsEditing(false);
  };

  const handleChange = (field: string, value: string) => {
    setEditData({ ...editData, [field]: value });
  };

  if (!umkm) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    </div>
  );

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
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-foreground">Dashboard UMKM</h1>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} className="gap-2">
                <Pencil className="w-4 h-4" />
                Edit Profil
              </Button>
            )}
          </div>

          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {isEditing ? (
                    <Input
                      value={editData.nama}
                      onChange={(e) => handleChange('nama', e.target.value)}
                      className="text-2xl font-bold mb-2"
                    />
                  ) : (
                    <CardTitle className="text-2xl">{umkm.nama}</CardTitle>
                  )}
                </div>
                <Badge className={getStatusColor(umkm.status)}>
                  {umkm.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo/Foto */}
              <div className="space-y-2">
                <Label>Logo UMKM</Label>
                {isEditing ? (
                  <div className="space-y-2">
                    <Input
                      type="text"
                      value={editData.foto}
                      onChange={(e) => handleChange('foto', e.target.value)}
                      placeholder="URL foto/logo"
                    />
                    <p className="text-xs text-muted-foreground">
                      Masukkan URL foto atau gunakan /placeholder.svg untuk default
                    </p>
                  </div>
                ) : (
                  <img
                    src={umkm.foto || '/placeholder.svg'}
                    alt={umkm.nama}
                    className="w-32 h-32 rounded-lg object-cover border"
                  />
                )}
              </div>

              {/* Deskripsi */}
              <div className="space-y-2">
                <Label>Deskripsi</Label>
                {isEditing ? (
                  <Textarea
                    value={editData.deskripsi}
                    onChange={(e) => handleChange('deskripsi', e.target.value)}
                    rows={4}
                  />
                ) : (
                  <p className="text-muted-foreground">{umkm.deskripsi}</p>
                )}
              </div>

              {/* Alamat */}
              <div className="space-y-2">
                <Label>Alamat</Label>
                {isEditing ? (
                  <Textarea
                    value={editData.alamat}
                    onChange={(e) => handleChange('alamat', e.target.value)}
                    rows={2}
                  />
                ) : (
                  <p className="text-muted-foreground">{umkm.alamat}</p>
                )}
              </div>

              {/* Kota */}
              <div className="space-y-2">
                <Label>Kota</Label>
                {isEditing ? (
                  <Input
                    value={editData.kota}
                    onChange={(e) => handleChange('kota', e.target.value)}
                  />
                ) : (
                  <p className="text-muted-foreground">{umkm.kota}</p>
                )}
              </div>

              {/* NIB */}
              <div className="space-y-2">
                <Label>NIB (Opsional)</Label>
                {isEditing ? (
                  <Input
                    value={editData.nib || ''}
                    onChange={(e) => handleChange('nib', e.target.value)}
                  />
                ) : (
                  <p className="text-muted-foreground">{umkm.nib || '-'}</p>
                )}
              </div>

              {/* Operator */}
              <div className="space-y-2">
                <Label>Operator</Label>
                <p className="text-muted-foreground">{umkm.operator}</p>
              </div>

              {/* Dinas */}
              {umkm.dinas && (
                <div className="space-y-2">
                  <Label>Dinas</Label>
                  <p className="text-muted-foreground">{umkm.dinas}</p>
                </div>
              )}

              {/* Kontak */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Informasi Kontak</Label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">WhatsApp</Label>
                    {isEditing ? (
                      <Input
                        value={editData.kontak?.whatsapp || ''}
                        onChange={(e) => handleChange('kontak', { ...editData.kontak, whatsapp: e.target.value })}
                        placeholder="08123456789"
                      />
                    ) : (
                      <p className="text-muted-foreground">{umkm.kontak?.whatsapp || '-'}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Email</Label>
                    {isEditing ? (
                      <Input
                        value={editData.kontak?.email || ''}
                        onChange={(e) => handleChange('kontak', { ...editData.kontak, email: e.target.value })}
                        placeholder="email@example.com"
                      />
                    ) : (
                      <p className="text-muted-foreground">{umkm.kontak?.email || '-'}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Instagram</Label>
                    {isEditing ? (
                      <Input
                        value={editData.kontak?.instagram || ''}
                        onChange={(e) => handleChange('kontak', { ...editData.kontak, instagram: e.target.value })}
                        placeholder="@username"
                      />
                    ) : (
                      <p className="text-muted-foreground">{umkm.kontak?.instagram || '-'}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Facebook</Label>
                    {isEditing ? (
                      <Input
                        value={editData.kontak?.facebook || ''}
                        onChange={(e) => handleChange('kontak', { ...editData.kontak, facebook: e.target.value })}
                        placeholder="username"
                      />
                    ) : (
                      <p className="text-muted-foreground">{umkm.kontak?.facebook || '-'}</p>
                    )}
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} className="gap-2">
                    <Save className="w-4 h-4" />
                    Simpan Perubahan
                  </Button>
                  <Button onClick={handleCancel} variant="outline" className="gap-2">
                    <X className="w-4 h-4" />
                    Batal
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Products Section */}
          {umkm.products && umkm.products.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Produk</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {umkm.products.map((product: any) => (
                    <div key={product._id} className="border rounded-lg p-4">
                      <h3 className="font-semibold">{product.nama}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{product.deskripsi}</p>
                      <p className="text-primary font-semibold mt-2">
                        Rp {product.harga?.toLocaleString('id-ID')}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardUMKM;
