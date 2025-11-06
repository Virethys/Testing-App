import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Crown, Users, TrendingUp, Award, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { umkmAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import UMKMCard from '@/components/UMKMCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Index = () => {
  const [umkms, setUmkms] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUMKMs();
  }, []);

  const fetchUMKMs = async () => {
    try {
      const response = await umkmAPI.getAll({ limit: 5 });
      setUmkms(response.data);
    } catch (error) {
      console.error('Error fetching UMKMs:', error);
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

    // Import authAPI
    const { authAPI } = await import('@/lib/api');
    
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

      const response = await authAPI.register(formData.email, formData.password, umkmData);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('userRole', response.user.role);
      localStorage.setItem('umkmId', response.user.umkmId);

      toast({
        title: 'Berhasil!',
        description: 'Pendaftaran UMKM berhasil. Menunggu persetujuan admin.',
      });

      setIsDialogOpen(false);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Gagal mendaftar. Silakan coba lagi.',
      });
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDJ2LTJoMzR6bS0yLTJIMnYtMmgzMnYyek0zNiAyOHYySDJ2LTJoMzR6bS0yLTJIMnYtMmgzMnYyem0yLTR2Mkgydi0yaDM0ek0zNCAxOEgydi0yaDMydjJ6bTItNHYySDJ2LTJoMzR6TTM0IDEwSDJ2LTJIM3YyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center justify-center mb-6"
            >
              <div className="bg-gradient-to-br from-primary to-primary-glow p-4 rounded-2xl shadow-lg">
                <Crown className="h-16 w-16 text-primary-foreground" />
              </div>
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-glow to-secondary bg-clip-text text-transparent">
              100.000 Sultan Muda
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-foreground">
              Sumatera Selatan
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Memberdayakan UMKM muda Sumatera Selatan untuk menjadi wirausahawan tangguh dan berdaya saing tinggi
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/umkm">
                <Button size="lg" className="w-full sm:w-auto">
                  Lihat UMKM
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Daftar UMKM
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Daftar UMKM Baru</DialogTitle>
                    <DialogDescription>
                      Isi formulir di bawah ini untuk mendaftarkan UMKM Anda
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Password *</Label>
                        <Input
                          id="password"
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                          minLength={6}
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
                        onValueChange={(value) => setFormData({ ...formData, operator: value })}
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>

                    <Button type="submit" className="w-full">
                      Daftar Sekarang
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tentang Program</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Program 100.000 Sultan Muda Sumatera Selatan adalah inisiatif pemberdayaan UMKM muda
              untuk menciptakan ekosistem wirausaha yang kuat di Sumatera Selatan
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: 'Pemberdayaan UMKM',
                description: 'Memberikan pelatihan dan pendampingan untuk UMKM muda berkembang',
              },
              {
                icon: TrendingUp,
                title: 'Peningkatan Kapasitas',
                description: 'Meningkatkan kemampuan bisnis dan manajemen UMKM',
              },
              {
                icon: Award,
                title: 'Sertifikasi & Legalitas',
                description: 'Membantu proses legalitas dan sertifikasi usaha',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="bg-gradient-to-br from-primary to-primary-glow p-3 rounded-lg w-fit mb-4">
                  <item.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* UMKM Carousel Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">UMKM Terdaftar</h2>
              <p className="text-muted-foreground">Jelajahi UMKM muda di Sumatera Selatan</p>
            </div>
            <Link to="/umkm">
              <Button variant="outline">
                Lihat Semua
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {umkms.length > 0 ? (
            <Carousel className="w-full">
              <CarouselContent>
                {umkms.map((umkm: any) => (
                  <CarouselItem key={umkm._id} className="md:basis-1/2 lg:basis-1/3">
                    <UMKMCard
                      id={umkm._id}
                      nama={umkm.nama}
                      deskripsi={umkm.deskripsi}
                      kota={umkm.kota}
                      foto={umkm.foto}
                      operator={umkm.operator}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            <p className="text-center text-muted-foreground">Belum ada UMKM terdaftar</p>
          )}
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Didukung Oleh</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-card p-6 rounded-lg shadow-md flex items-center justify-center h-32"
              >
                <span className="text-muted-foreground">Logo Partner {i}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
