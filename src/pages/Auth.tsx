import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nama: '',
    operator: '',
    dinas: '',
    deskripsi: '',
    alamat: '',
    kota: '',
    telepon: '',
    nib: '',
  });

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const loginFormData = new FormData(e.currentTarget);
    const email = loginFormData.get('email') as string;
    const password = loginFormData.get('password') as string;

    try {
      const response = await authAPI.login(email, password);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      toast({ title: 'Login berhasil!' });
      
      // Redirect based on role
      if (response.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login gagal',
        description: error.message || 'Terjadi kesalahan',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password || !formData.nama || !formData.operator || !formData.deskripsi || !formData.alamat || !formData.kota) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Mohon lengkapi semua field yang wajib diisi',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const umkmData = {
        nama: formData.nama,
        operator: formData.operator,
        dinas: formData.dinas,
        deskripsi: formData.deskripsi,
        alamat: formData.alamat,
        kota: formData.kota,
        nib: formData.nib,
        kontak: {
          telepon: formData.telepon,
        },
      };

      console.log('Registering with data:', { email: formData.email, umkmData });
      const response = await authAPI.register(formData.email, formData.password, umkmData);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('userRole', response.user.role);
      localStorage.setItem('umkmId', response.user.umkmId);

      toast({
        title: 'Berhasil!',
        description: 'Pendaftaran UMKM berhasil. Menunggu persetujuan admin.',
      });

      setShowRegister(false);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Gagal mendaftar. Silakan coba lagi.',
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className={`container mx-auto px-4 ${showRegister ? 'max-w-3xl' : 'max-w-md'}`}>
          <Card>
            <CardHeader>
              <CardTitle>{showRegister ? 'Daftar UMKM Baru' : 'Login'}</CardTitle>
              <CardDescription>
                {showRegister 
                  ? 'Isi formulir di bawah ini untuk mendaftarkan UMKM Anda' 
                  : 'Masuk ke akun Anda (UMKM atau Admin)'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showRegister ? (
                // Login Form
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Login'}
                  </Button>
                  <div className="mt-4 text-center space-y-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => setShowRegister(true)}
                    >
                      Daftar sebagai UMKM
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Admin hanya dapat mendaftar melalui Postman atau API tools
                    </p>
                  </div>
                </form>
              ) : (
                // Register Form
                <form onSubmit={handleRegister} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="reg-email">Email *</Label>
                      <Input
                        id="reg-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="reg-password">Password *</Label>
                      <Input
                        id="reg-password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="nama">Nama UMKM *</Label>
                    <Input
                      id="nama"
                      value={formData.nama}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="operator">Operator Sultan Muda Sumatera Selatan 2025 *</Label>
                    <Select
                      value={formData.operator}
                      onValueChange={(value) => setFormData({ ...formData, operator: value, dinas: '' })}
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
                  </div>

                  {formData.operator === 'Dinas Provinsi Sumatera Selatan' && (
                    <div>
                      <Label htmlFor="dinas">Dinas</Label>
                      <Select
                        value={formData.dinas}
                        onValueChange={(value) => setFormData({ ...formData, dinas: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih dinas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Dinas Koperasi dan UKM">Dinas Koperasi dan UKM</SelectItem>
                          <SelectItem value="Dinas Pertanian">Dinas Pertanian</SelectItem>
                          <SelectItem value="Dinas Perkebunan">Dinas Perkebunan</SelectItem>
                          <SelectItem value="Dinas Perikanan dan Kelautan">
                            Dinas Perikanan dan Kelautan
                          </SelectItem>
                          <SelectItem value="Dinas Pendidikan">Dinas Pendidikan</SelectItem>
                          <SelectItem value="Dinas Perindustrian">Dinas Perindustrian</SelectItem>
                          <SelectItem value="Dinas Kebudayaan dan Pariwisata">
                            Dinas Kebudayaan dan Pariwisata
                          </SelectItem>
                          <SelectItem value="Dinas Perdagangan">Dinas Perdagangan</SelectItem>
                          <SelectItem value="Dinas Pemuda dan Olahraga">
                            Dinas Pemuda dan Olahraga
                          </SelectItem>
                          <SelectItem value="Dinas PPA">Dinas PPA</SelectItem>
                          <SelectItem value="DPMPTSP Sumsel">DPMPTSP Sumsel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {formData.operator === 'Kabupaten/Kota Wilayah Sumatera Selatan' && (
                    <div>
                      <Label htmlFor="dinas">Kabupaten/Kota</Label>
                      <Select
                        value={formData.dinas}
                        onValueChange={(value) => setFormData({ ...formData, dinas: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Kabupaten/Kota" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          <SelectItem value="Dinas Koperasi dan UKM Kabupaten Banyuasin">
                            Dinas Koperasi dan UKM Kabupaten Banyuasin
                          </SelectItem>
                          <SelectItem value="Dinas Koperasi dan UKM Kabupaten Empat Lawang">
                            Dinas Koperasi dan UKM Kabupaten Empat Lawang
                          </SelectItem>
                          <SelectItem value="Dinas Koperasi dan UKM Kabupaten Lahat">
                            Dinas Koperasi dan UKM Kabupaten Lahat
                          </SelectItem>
                          <SelectItem value="Dinas Koperasi dan UKM Kabupaten Muara Enim">
                            Dinas Koperasi dan UKM Kabupaten Muara Enim
                          </SelectItem>
                          <SelectItem value="Dinas Koperasi dan UKM Kabupaten Musi Banyuasin">
                            Dinas Koperasi dan UKM Kabupaten Musi Banyuasin
                          </SelectItem>
                          <SelectItem value="Dinas Koperasi dan UKM Kabupaten Musi Rawas">
                            Dinas Koperasi dan UKM Kabupaten Musi Rawas
                          </SelectItem>
                          <SelectItem value="Dinas Koperasi dan UKM Kabupaten Ogan Ilir">
                            Dinas Koperasi dan UKM Kabupaten Ogan Ilir
                          </SelectItem>
                          <SelectItem value="Dinas Koperasi dan UKM Kabupaten Ogan Komering Ilir">
                            Dinas Koperasi dan UKM Kabupaten Ogan Komering Ilir
                          </SelectItem>
                          <SelectItem value="Dinas Koperasi dan UKM Kabupaten Ogan Komering Ulu">
                            Dinas Koperasi dan UKM Kabupaten Ogan Komering Ulu
                          </SelectItem>
                          <SelectItem value="Dinas Koperasi dan UKM Kabupaten Ogan Komering Ulu Selatan">
                            Dinas Koperasi dan UKM Kabupaten Ogan Komering Ulu Selatan
                          </SelectItem>
                          <SelectItem value="Dinas Koperasi dan UKM Kabupaten Ogan Komering Ulu Timur">
                            Dinas Koperasi dan UKM Kabupaten Ogan Komering Ulu Timur
                          </SelectItem>
                          <SelectItem value="Dinas Koperasi dan UKM Kabupaten Penukal Abab Lematang Ilir">
                            Dinas Koperasi dan UKM Kabupaten Penukal Abab Lematang Ilir
                          </SelectItem>
                          <SelectItem value="Dinas Koperasi dan UKM Kota Prabumulih">
                            Dinas Koperasi dan UKM Kota Prabumulih
                          </SelectItem>
                          <SelectItem value="Dinas Koperasi dan UKM Kota Lubuklinggau">
                            Dinas Koperasi dan UKM Kota Lubuklinggau
                          </SelectItem>
                          <SelectItem value="Dinas Koperasi dan UKM Kota Pagar Alam">
                            Dinas Koperasi dan UKM Kota Pagar Alam
                          </SelectItem>
                          <SelectItem value="Dinas Koperasi dan UKM Kota Palembang">
                            Dinas Koperasi dan UKM Kota Palembang
                          </SelectItem>
                          <SelectItem value="Dinas Koperasi dan UKM Kabupaten Musi Rawas Utara">
                            Dinas Koperasi dan UKM Kabupaten Musi Rawas Utara
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {formData.operator === 'Stakeholder (Binaan Perusahaan/Lembaga)' && (
                    <div>
                      <Label htmlFor="dinas">Stakeholder (Binaan Perusahaan/Lembaga)</Label>
                      <Select
                        value={formData.dinas}
                        onValueChange={(value) => setFormData({ ...formData, dinas: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Stakeholder" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          <SelectItem value="Kemenkumham">Kemenkumham</SelectItem>
                          <SelectItem value="Bank Indonesia">Bank Indonesia</SelectItem>
                          <SelectItem value="Otoritas Jasa Keuangan">Otoritas Jasa Keuangan</SelectItem>
                          <SelectItem value="Direktorat Jenderal Perbendaharaan (DJPb)">
                            Direktorat Jenderal Perbendaharaan (DJPb)
                          </SelectItem>
                          <SelectItem value="Lembaga Jasa Keuangan Perbankan dan Non-perbankan">
                            Lembaga Jasa Keuangan Perbankan dan Non-perbankan
                          </SelectItem>
                          <SelectItem value="Kamar Dagang dan Industri Indonesia (KADIN)">
                            Kamar Dagang dan Industri Indonesia (KADIN)
                          </SelectItem>
                          <SelectItem value="Himpunan Pengusaha Muda Indonesia (HIPMI)">
                            Himpunan Pengusaha Muda Indonesia (HIPMI)
                          </SelectItem>
                          <SelectItem value="Asosiasi Pengusaha Indonesia">
                            Asosiasi Pengusaha Indonesia
                          </SelectItem>
                          <SelectItem value="Badan Standarisasi Nasional">
                            Badan Standarisasi Nasional
                          </SelectItem>
                          <SelectItem value="Asosiasi Pendamping UMKM">Asosiasi Pendamping UMKM</SelectItem>
                          <SelectItem value="BPOM">BPOM</SelectItem>
                          <SelectItem value="Kementerian Agama Sumatera Selatan">
                            Kementerian Agama Sumatera Selatan
                          </SelectItem>
                          <SelectItem value="Lainnya (Sebutkan di Keterangan)">
                            Lainnya (Sebutkan di Keterangan)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="nib">NIB (Nomor Induk Berusaha)</Label>
                    <Input
                      id="nib"
                      value={formData.nib}
                      onChange={(e) => setFormData({ ...formData, nib: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="deskripsi">Deskripsi UMKM *</Label>
                    <Textarea
                      id="deskripsi"
                      value={formData.deskripsi}
                      onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                      required
                      maxLength={1000}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="alamat">Alamat *</Label>
                    <Input
                      id="alamat"
                      value={formData.alamat}
                      onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="kota">Kota/Kabupaten *</Label>
                    <Input
                      id="kota"
                      value={formData.kota}
                      onChange={(e) => setFormData({ ...formData, kota: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="telepon">Nomor Telepon</Label>
                    <Input
                      id="telepon"
                      type="tel"
                      value={formData.telepon}
                      onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setShowRegister(false)}
                      disabled={isLoading}
                    >
                      Kembali ke Login
                    </Button>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Loading...' : 'Daftar Sekarang'}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
