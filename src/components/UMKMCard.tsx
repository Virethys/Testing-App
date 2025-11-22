import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface UMKMCardProps {
  id: string;
  nama: string;
  deskripsi: string;
  kota: string;
  foto: string;
  operator: string;
}

const UMKMCard = ({ id, nama, deskripsi, kota, foto, operator }: UMKMCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <Link to={`/umkm/${id}`}>
        <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow cursor-pointer">
          <div className="aspect-video overflow-hidden bg-muted">
            <img
              src={foto || '/placeholder.svg'}
              alt={nama}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            />
          </div>
          <CardContent className="p-3">
            <h3 className="font-bold text-base mb-1.5 line-clamp-1">{nama}</h3>
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{deskripsi}</p>
            <div className="flex items-center text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 mr-1" />
              {kota}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

export default UMKMCard;
