import { Crown, Mail, Phone, Instagram, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-muted border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-br from-primary to-primary-glow p-2 rounded-lg">
                <Crown className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-foreground">100.000 Sultan Muda</span>
                <span className="text-sm text-muted-foreground">Sumatera Selatan</span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
              Program pemberdayaan UMKM muda Sumatera Selatan untuk menciptakan wirausaha tangguh
              dan berdaya saing tinggi.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Menu</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary text-sm">
                  Home
                </Link>
              </li>
              <li>
                <a href="/#about" className="text-muted-foreground hover:text-primary text-sm">
                  Tentang Program
                </a>
              </li>
              <li>
                <Link to="/umkm" className="text-muted-foreground hover:text-primary text-sm">
                  Daftar UMKM
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-muted-foreground hover:text-primary text-sm">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Kontak</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-muted-foreground text-sm">
                <Mail className="h-4 w-4" />
                <span>info@sultanmuda.id</span>
              </li>
              <li className="flex items-center space-x-2 text-muted-foreground text-sm">
                <Phone className="h-4 w-4" />
                <span>+62 711 000 0000</span>
              </li>
            </ul>
            <div className="flex space-x-3 mt-4">
              <a
                href="#"
                className="bg-background p-2 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="bg-background p-2 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground text-sm">
          <p>&copy; 2025 100.000 Sultan Muda Sumatera Selatan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
