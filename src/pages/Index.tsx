import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Users, TrendingUp, Award, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { umkmAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import UMKMCard from '@/components/UMKMCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import logo from '@/assets/logo.png';
import realSultan from '@/assets/real-sultan.png';
import students from '@/assets/students.png';
import hermanDeru from '@/assets/herman-deru.png';
import astaCitaInfographic from '@/assets/asta-cita-infographic.png';
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
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
              <img src={logo} alt="The Real Sultan" className="h-40 md:h-48 w-auto" />
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
              
              {!isLoggedIn && (
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
                            <SelectItem value="Kemenkumham">
                              Kemenkumham
                            </SelectItem>
                            <SelectItem value="Bank Indonesia">
                              Bank Indonesia
                            </SelectItem>
                            <SelectItem value="Otoritas Jasa Keuangan">
                              Otoritas Jasa Keuangan
                            </SelectItem>
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
                            <SelectItem value="Asosiasi Pendamping UMKM">
                              Asosiasi Pendamping UMKM
                            </SelectItem>
                            <SelectItem value="BPOM">
                              BPOM
                            </SelectItem>
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
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Program 100.000 Sultan Muda Sumatera Selatan */}
      <section id="about" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8 max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Program 100.000 Sultan Muda<br />Sumatera Selatan
            </h2>
            <p className="text-base md:text-lg text-muted-foreground mb-6 text-justify">
              Sultan Muda Sumatera Selatan adalah generasi muda penuh semangat, berjiwa wirausaha, 
              dan siap menciptakan inovasi demi kemajuan daerah. Program ini ditujukan bagi individu 
              berusia 17 hingga 40 tahun yang telah menjalankan usaha atau memiliki ide bisnis berdampak 
              positif. Tak hanya itu, peserta diharapkan memiliki komitmen kuat untuk membangun Sumatera 
              Selatan, serta mampu bekerja sama dan memperluas jaringan demi memperbesar manfaat 
              yang dihasilkan.
            </p>
            <p className="text-base md:text-lg text-muted-foreground text-justify">
              Proses perekrutan <strong>Sultan Muda Sumatera Selatan</strong> dimulai dengan <strong>sosialisasi dan promosi</strong> melalui 
              kampanye media sosial, kolaborasi dengan sekolah dan kampus, serta penyelenggaraan 
              seminar dan event untuk meningkatkan <strong>kesadaran</strong> dan <strong>ketertarikan peserta</strong>. Setelah itu, 
              dilanjutkan dengan <strong>pendaftaran dan seleksi</strong> yang dapat dilakukan secara online maupun 
              offline, diikuti dengan <strong>seleksi administratif</strong> untuk memastikan kelayakan peserta. Tahap 
              akhir adalah <strong>wawancara dan studi kasus</strong> yang bertujuan menilai <strong>motivasi</strong>, <strong>kemampuan 
              komunikasi</strong>, dan <strong>ide bisnis</strong> yang diajukan oleh calon peserta, sehingga hanya <strong>kandidat 
              terbaik</strong> yang akan dipilih untuk mengikuti program.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Program Resmi Dimulai Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Program 100.000 Sultan Muda<br />Sumsel Resmi Dimulai
            </h2>
            <div className="flex justify-center mb-8">
              <img 
                src={realSultan} 
                alt="The Real Sultan - Program Launch" 
                className="max-w-md w-full h-auto rounded-lg shadow-lg"
              />
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto text-justify">
              Program <strong>100.000 Sultan Muda Sumatera Selatan</strong> resmi dimulai untuk menciptakan 
              pengusaha-pengusaha muda dalam menggeliatkan ekonomi. <strong>Gubernur Sumatera Selatan 
              Herman Deru</strong> pada Jumat (16/5) menyebut, melalui program ini juga diharapkan bisa 
              menciptakan <strong>lapangan kerja</strong>. Di tahun ini, target program ini dapat menciptakan <strong>sepuluh ribu 
              wirausaha muda</strong>. Dikutip dari sumsel.antaranews.com.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Asta Cita Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Asta Cita Presiden Republik Indonesia
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Program Strategis HDCU 2025–2029
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start max-w-6xl mx-auto">
            {/* Left Column - Infographic */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <img 
                src={astaCitaInfographic} 
                alt="Asta Cita Presiden Prabowo & Wapres Gibran" 
                className="w-full max-w-md h-auto rounded-lg shadow-lg"
              />
            </motion.div>

            {/* Right Column - Content */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-card p-6 rounded-lg shadow-lg"
              >
                <h3 className="text-xl font-bold mb-4">
                  Mendukung Asta Cita Presiden Republik Indonesia Tahun 2025, Menuju Indonesia Emas 2045.
                </h3>
                <div className="space-y-3 text-muted-foreground">
                  <p className="text-sm">
                    Program ini selaras dengan Asta Cita Presiden Prabowo dan Wapres Gibran, khususnya:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li>Poin 3: Mendorong kewirausahaan dan industri kreatif untuk membuka lapangan kerja.</li>
                    <li>Poin 4: Memperkuat SDM, pendidikan, teknologi, serta peran pemuda dan perempuan.</li>
                    <li>Poin 6: Membangun dari desa untuk pemerataan ekonomi dan pengentasan kemiskinan.</li>
                  </ul>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-card rounded-lg overflow-hidden shadow-lg"
              >
                <div className="relative h-64">
                  <img 
                    src={hermanDeru} 
                    alt="Herman Deru - Gubernur Sumatera Selatan" 
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                </div>
                <div className="p-6 bg-card">
                  <h3 className="text-lg font-bold mb-3">
                    Herman Deru Meluncurkan 12 Program Strategis HDCU Untuk Mewujudkan Sumsel Yang Lebih Maju
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Mencetak 100.000 'Sultan' Muda atau Wirausaha Muda Sumsel. Program ini bertujuan untuk 
                    menciptakan generasi wirausaha yang tangguh dengan menyediakan pelatihan, bimbingan, 
                    dan akses modal bagi anak muda. Dengan semangat entrepreneurship, diharapkan tercipta 
                    lapangan kerja baru dan meningkatkan daya saing ekonomi lokal, serta membangun iklim 
                    bisnis yang kondusif di Sumsel.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Image Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background/80 to-secondary/20" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDJ2LTJoMzR6bS0yLTJIMnYtMmgzMnYyek0zNiAyOHYySDJ2LTJoMzR6bS0yLTJIMnYtMmgzMnYyem0yLTR2Mkgydi0yaDM0ek0zNCAxOEgydi0yaDMydjJ6bTItNHYySDJ2LTJoMzR6TTM0IDEwSDJ2LTJIM3YyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
              Mencetak dan menumbuhkan generasi baru wirausahawan muda yang kompetitif berasal dari 
              Sumatera Selatan melalui inisiatif inovatif Pemerintah.
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              Program ini bertujuan menumbuhkan generasi wirausahawan muda yang kompetitif dari Sumatera Selatan. 
              Inisiatif ini lahir dari komitmen pemerintah untuk mendorong inovasi dan kemandirian ekonomi daerah. 
              Melalui pendekatan kreatif dan kolaboratif, program ini membuka peluang bagi ide-ide bisnis berdampak positif.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Business Ideas Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <img 
                src={students} 
                alt="Program Pelatihan Sultan Muda" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <p className="text-sm uppercase tracking-wider text-primary mb-4">
                TRANSFORMING ASPIRATIONS INTO REALITY
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Menampung Ide Bisnis & Nilai Tambah Usaha
              </h2>
              <p className="text-base text-muted-foreground mb-8">
                Program 100.000 Sultan Muda Sumsel menyediakan program bimbingan dan pelatihan yang disesuaikan 
                wirausaha muda.
              </p>
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Bergabung Sultan Muda
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Berita Terbaru Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Berita Terbaru Sumatera Selatan</h2>
              <p className="text-muted-foreground">Update terkini seputar program dan kegiatan Sultan Muda</p>
            </div>
            <Button variant="outline">
              Lihat Semua
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: item * 0.1 }}
                viewport={{ once: true }}
                className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer group"
              >
                <div className="relative h-48 bg-muted overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="p-6">
                  <div className="text-xs text-primary mb-2">
                    {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors">
                    Berita Program Sultan Muda {item}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Informasi terbaru mengenai perkembangan program 100.000 Sultan Muda Sumatera Selatan dan berbagai kegiatan pendukungnya.
                  </p>
                  <Button variant="link" className="p-0 h-auto">
                    Baca Selengkapnya <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* UMKM Carousel Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">UMKM Sultan Muda</h2>
              <p className="text-muted-foreground">Jelajahi dan dukung UMKM muda di Sumatera Selatan</p>
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
                  <CarouselItem key={umkm._id} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
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


      <Footer />
    </div>
  );
};

export default Index;
