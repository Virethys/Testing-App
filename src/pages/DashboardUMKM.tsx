import { useEffect, useState, useRef } from 'react';
import { umkmAPI, productAPI } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Save, X, Trash2, Plus, Upload, Image as ImageIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DashboardUMKM = () => {
  const [umkm, setUmkm] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    nama: '',
    deskripsi: '',
    harga: '',
    stok: '',
  });
  const [productPhoto, setProductPhoto] = useState<File | null>(null);
  const [productPhotoPreview, setProductPhotoPreview] = useState<string | null>(null);
  const fotoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const productPhotoRef = useRef<HTMLInputElement>(null);
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'foto' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Ukuran file maksimal 5MB',
      });
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'foto') {
        setFotoPreview(reader.result as string);
      } else {
        setBannerPreview(reader.result as string);
      }
    };
    reader.readAsDataURL(file);

    // Upload immediately
    setIsUploading(true);
    try {
      const response = await umkmAPI.uploadImage(umkm._id, type, file);
      toast({ title: `${type === 'foto' ? 'Foto profil' : 'Banner'} berhasil diupload!` });
      
      // Update both umkm and editData
      const updatedData = { ...umkm, [type]: response.data.url };
      setUmkm(updatedData);
      setEditData(updatedData);
      
      // Clear preview
      if (type === 'foto') {
        setFotoPreview(null);
      } else {
        setBannerPreview(null);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Gagal mengupload file',
      });
      // Clear preview on error
      if (type === 'foto') {
        setFotoPreview(null);
      } else {
        setBannerPreview(null);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (type: 'foto' | 'banner') => {
    setIsUploading(true);
    try {
      await umkmAPI.update(umkm._id, { [type]: '' });
      toast({ title: `${type === 'foto' ? 'Foto profil' : 'Banner'} berhasil dihapus!` });
      
      const updatedData = { ...umkm, [type]: '' };
      setUmkm(updatedData);
      setEditData(updatedData);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Gagal menghapus file',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleProductPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Ukuran file maksimal 5MB',
      });
      return;
    }

    setProductPhoto(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setProductPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateProduct = async () => {
    try {
      if (!productForm.nama || !productForm.deskripsi || !productForm.harga) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Mohon lengkapi semua field yang wajib diisi',
        });
        return;
      }

      setIsUploading(true);

      // Create product first
      const productData = {
        nama: productForm.nama,
        deskripsi: productForm.deskripsi,
        harga: Number(productForm.harga),
        kategori: 'Lainnya',
        stok: Number(productForm.stok) || 0,
      };

      const response = await productAPI.create(productData);
      const newProduct = response.data;

      // Upload photo if selected
      if (productPhoto) {
        await productAPI.uploadImage(newProduct._id, productPhoto);
      }

      toast({ title: 'Produk berhasil ditambahkan!' });
      
      // Reset form and close dialog
      setProductForm({ nama: '', deskripsi: '', harga: '', stok: '' });
      setProductPhoto(null);
      setProductPhotoPreview(null);
      setIsProductDialogOpen(false);
      
      // Refresh UMKM data
      fetchMyUMKM();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Gagal menambahkan produk',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;

    try {
      await productAPI.delete(productId);
      toast({ title: 'Produk berhasil dihapus!' });
      fetchMyUMKM();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Gagal menghapus produk',
      });
    }
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
              {/* Banner */}
              <div className="space-y-2">
                <Label>Banner UMKM</Label>
                {isEditing ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Input
                        ref={bannerInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'banner')}
                        disabled={isUploading}
                        className="cursor-pointer"
                      />
                      {umkm.banner && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteImage('banner')}
                          disabled={isUploading}
                          className="gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Hapus Banner
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Upload banner (Max 5MB, 1200x400px recommended)
                    </p>
                    {(bannerPreview || umkm.banner) && (
                      <img
                        src={bannerPreview || umkm.banner}
                        alt="Banner preview"
                        className="w-full h-40 rounded-lg object-cover border"
                      />
                    )}
                  </div>
                ) : (
                  <img
                    src={umkm.banner || '/placeholder.svg'}
                    alt={`${umkm.nama} banner`}
                    className="w-full h-40 rounded-lg object-cover border"
                  />
                )}
              </div>

              {/* Logo/Foto */}
              <div className="space-y-2">
                <Label>Logo/Foto Profil UMKM</Label>
                {isEditing ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Input
                        ref={fotoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'foto')}
                        disabled={isUploading}
                        className="cursor-pointer"
                      />
                      {umkm.foto && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteImage('foto')}
                          disabled={isUploading}
                          className="gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Hapus Foto
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Upload foto profil (Max 5MB, 400x400px recommended)
                    </p>
                    {(fotoPreview || umkm.foto) && (
                      <img
                        src={fotoPreview || umkm.foto}
                        alt="Foto preview"
                        className="w-32 h-32 rounded-lg object-cover border"
                      />
                    )}
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Produk</CardTitle>
              <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Tambah Produk
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Tambah Produk Baru</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    {/* Product Photo Upload */}
                    <div className="space-y-2">
                      <Label>Foto Produk</Label>
                      <div className="flex flex-col gap-2">
                        {productPhotoPreview ? (
                          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
                            <img
                              src={productPhotoPreview}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                            <Button
                              size="sm"
                              variant="destructive"
                              className="absolute top-2 right-2"
                              onClick={() => {
                                setProductPhoto(null);
                                setProductPhotoPreview(null);
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <div
                            className="w-full aspect-video rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2"
                            onClick={() => productPhotoRef.current?.click()}
                          >
                            <ImageIcon className="w-12 h-12 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Klik untuk upload foto</p>
                          </div>
                        )}
                        <input
                          ref={productPhotoRef}
                          type="file"
                          accept="image/*"
                          onChange={handleProductPhotoChange}
                          className="hidden"
                        />
                      </div>
                    </div>

                    {/* Product Name */}
                    <div className="space-y-2">
                      <Label htmlFor="nama">Nama Produk *</Label>
                      <Input
                        id="nama"
                        value={productForm.nama}
                        onChange={(e) => setProductForm({ ...productForm, nama: e.target.value })}
                        placeholder="Masukkan nama produk"
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="deskripsi">Deskripsi *</Label>
                      <Textarea
                        id="deskripsi"
                        value={productForm.deskripsi}
                        onChange={(e) => setProductForm({ ...productForm, deskripsi: e.target.value })}
                        placeholder="Masukkan deskripsi produk"
                        rows={4}
                      />
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                      <Label htmlFor="harga">Harga *</Label>
                      <Input
                        id="harga"
                        type="number"
                        value={productForm.harga}
                        onChange={(e) => setProductForm({ ...productForm, harga: e.target.value })}
                        placeholder="Masukkan harga"
                      />
                    </div>

                    {/* Stock */}
                    <div className="space-y-2">
                      <Label htmlFor="stok">Stok</Label>
                      <Input
                        id="stok"
                        type="number"
                        value={productForm.stok}
                        onChange={(e) => setProductForm({ ...productForm, stok: e.target.value })}
                        placeholder="Masukkan jumlah stok"
                      />
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleCreateProduct} disabled={isUploading} className="flex-1">
                        {isUploading ? 'Menyimpan...' : 'Simpan Produk'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsProductDialogOpen(false);
                          setProductForm({ nama: '', deskripsi: '', harga: '', stok: '' });
                          setProductPhoto(null);
                          setProductPhotoPreview(null);
                        }}
                      >
                        Batal
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {umkm.products && umkm.products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {umkm.products.map((product: any) => (
                    <Card key={product._id} className="overflow-hidden">
                      {product.foto && product.foto !== '/placeholder.svg' && (
                        <div className="aspect-video w-full overflow-hidden bg-muted">
                          <img
                            src={product.foto}
                            alt={product.nama}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg">{product.nama}</h3>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteProduct(product._id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {product.deskripsi}
                        </p>
                        <p className="font-bold text-primary">
                          Rp {product.harga?.toLocaleString('id-ID')}
                        </p>
                        {product.stok !== undefined && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Stok: {product.stok}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Belum ada produk. Tambahkan produk pertama Anda!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardUMKM;
