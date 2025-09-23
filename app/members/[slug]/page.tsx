import Link from 'next/link';
import MemberDetailClient from './MemberDetailClient';

const membersData = {
  ea: {
    denomination: "Eglise Anglicane (EA)",
    leader: "Evêque Mgr. DIBO BLANGWE Thomas",
    location: "Douala",
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1438032005730-c779502df39b?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop&auto=format"
    ],
    history: "The Anglican Church in Cameroon has been a cornerstone of Christian faith since its establishment. With deep roots in Anglican tradition, it has served the community with dedication and spiritual guidance for decades.",
    contact: { phone: "+237 233 42 15 67", email: "contact@ea-cameroon.org", address: "BP 1234, Douala, Cameroon" },
    founded: "1922"
  },
  cbc: {
    denomination: "Cameroon Baptist Convention (CBC)",
    leader: "President National Rev. Dr TEKE John Ekema",
    location: "Bamenda",
    images: [
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop&auto=format"
    ],
    history: "The Cameroon Baptist Convention stands as one of the oldest and most influential Protestant denominations in Cameroon, with a rich heritage of evangelism, education, and community development.",
    contact: { phone: "+237 233 36 12 45", email: "info@cbc-cameroon.org", address: "BP 5678, Bamenda, Cameroon" },
    founded: "1884"
  },
  eec: {
    denomination: "Eglise Evangélique du Cameroun (EEC)",
    leader: "Président Rev. BILLA MBENGA Alexandre",
    location: "Douala",
    images: [
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1438032005730-c779502df39b?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop&auto=format"
    ],
    history: "L'Eglise Evangélique du Cameroun has been a beacon of evangelical faith, committed to spreading the Gospel and serving communities across Cameroon with unwavering dedication.",
    contact: { phone: "+237 233 42 78 90", email: "contact@eec-cameroon.org", address: "BP 9012, Douala, Cameroon" },
    founded: "1957"
  },
  eelc: {
    denomination: "Eglise Evangélique Luthérienne du Cameroun (EELC)",
    leader: "Evêque national Mgr. BAIGUEL Jean",
    location: "Ngaoundéré",
    images: [
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&auto=format"
    ],
    history: "The Lutheran Church in Cameroon has maintained its Lutheran heritage while adapting to local contexts, providing spiritual guidance and community services throughout the northern regions.",
    contact: { phone: "+237 222 25 34 56", email: "info@eelc-cameroon.org", address: "BP 3456, Ngaoundéré, Cameroon" },
    founded: "1923"
  },
  eflc: {
    denomination: "Eglise Fraternelle Luthérienne du Cameroun (EFLC)",
    leader: "Président Rev. DEBSIA DABA Alvius",
    location: "Garoua",
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop&auto=format"
    ],
    history: "The Fraternal Lutheran Church of Cameroon emphasizes brotherhood and community fellowship, serving the northern regions with dedication to Lutheran principles and local engagement.",
    contact: { phone: "+237 222 27 45 67", email: "contact@eflc-cameroon.org", address: "BP 7890, Garoua, Cameroon" },
    founded: "1960"
  },
  epc: {
    denomination: "Eglise Presbytérienne Camerounaise (E P C)",
    leader: "Secrétaire Général Rev. ABESSOLO ZE",
    location: "Yaoundé",
    images: [
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1438032005730-c779502df39b?w=800&h=600&fit=crop&auto=format"
    ],
    history: "L'Eglise Presbytérienne Camerounaise has been instrumental in education and social development, maintaining strong Presbyterian traditions while serving diverse communities.",
    contact: { phone: "+237 222 22 12 34", email: "info@epc-cameroon.org", address: "BP 1357, Yaoundé, Cameroon" },
    founded: "1957"
  },
  epa: {
    denomination: "Eglise Protestante Africaine (EPA)",
    leader: "Secrétaire Général Rev MFOM Jules Perigord",
    location: "Lokolot",
    images: [
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop&auto=format"
    ],
    history: "The African Protestant Church represents indigenous Protestant Christianity, blending traditional African values with Protestant theology to serve local communities.",
    contact: { phone: "+237 233 45 67 89", email: "contact@epa-cameroon.org", address: "BP 2468, Lokolot, Cameroon" },
    founded: "1934"
  },
  nbc: {
    denomination: "Native Baptist Church (NBC)",
    leader: "Président National Rev. Dr NSOGA Job Salomon Modérateur",
    location: "Douala Buéa",
    images: [
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop&auto=format"
    ],
    history: "The Native Baptist Church has deep roots in Baptist tradition while embracing local cultural contexts, serving communities with evangelical fervor and social commitment.",
    contact: { phone: "+237 233 33 56 78", email: "info@nbc-cameroon.org", address: "BP 1111, Douala, Cameroon" },
    founded: "1898"
  },
  pcc: {
    denomination: "Presbyterian Church in Cameroon (PCC)",
    leader: "Rt. Rev MIKI Hans ABIA Rt. Vice",
    location: "Buea",
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1438032005730-c779502df39b?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop&auto=format"
    ],
    history: "The Presbyterian Church in Cameroon has been a pillar of education and healthcare, maintaining strong Presbyterian governance while adapting to Cameroonian contexts.",
    contact: { phone: "+237 233 32 23 45", email: "contact@pcc-cameroon.org", address: "BP 2222, Buea, Cameroon" },
    founded: "1886"
  },
  uebc: {
    
    denomination: "Union des Eglises Baptistes du Cameroun (UEBC)",
    leader: "Président Rev. EDOUBE Ernest",
    location: "Douala",
    images: [
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&auto=format"
    ],
    history: "L'Union des Eglises Baptistes du Cameroun unites Baptist churches across the nation, promoting Baptist principles and coordinating evangelical and social activities.",
    contact: { phone: "+237 233 42 34 56", email: "info@uebc-cameroon.org", address: "BP 3333, Douala, Cameroon" },
    founded: "1952"
  },
  ueec: {
    denomination: "Union des Eglises Evangéliques du Cameroun (UEEC)",
    leader: "Président Rev. HAMADINA Salomon",
    location: "Maroua",
    images: [
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1438032005730-c779502df39b?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop&auto=format"
    ],
    history: "L'Union des Eglises Evangéliques du Cameroun coordinates evangelical churches in the northern regions, emphasizing unity in diversity and community service.",
    contact: { phone: "+237 222 29 45 67", email: "contact@ueec-cameroon.org", address: "BP 4444, Maroua, Cameroon" },
    founded: "1965"
  },
  mpe: {
    denomination: "FULL GOSPEL Mission (Mission du plein Evangile)(MPE)",
    leader: "Général Surintendant Rev. SOKENG ALAIN Clément",
    location: "Yaoundé",
    images: [
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop&auto=format"
    ],
    history: "The Full Gospel Mission emphasizes the complete Gospel message with signs, wonders, and miracles, serving communities with Pentecostal fervor and social engagement.",
    contact: { phone: "+237 222 22 67 89", email: "info@mpe-cameroon.org", address: "BP 5555, Yaoundé, Cameroon" },
    founded: "1963"
  }
};

export async function generateStaticParams() {
  return Object.keys(membersData).map((slug) => ({
    slug,
  }));
}

export default function MemberDetailPage({ params }: { params: { slug: string } }) {
  const member = membersData[params.slug as keyof typeof membersData];

  if (!member) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Member not found</h1>
          <Link href="/members" className="text-purple-600 hover:text-purple-700">Return to Members</Link>
        </div>
      </div>
    );
  }

  return <MemberDetailClient member={member} />;
}