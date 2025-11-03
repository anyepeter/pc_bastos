import Link from 'next/link';
import PageLayout from '@/components/PageLayout';
import CharityDetailClient from './CharityDetailClient';

const charityData = {
  '1': {
    id: 1,
    title: 'Education Support Program',
    description: 'Providing scholarships and educational resources to underprivileged children in rural communities.',
    location: 'Rural Communities, Cameroon',
    date: '2024-01-15',
    beneficiaries: '120 students',
    amountUsed: '45,000 CFA',
    totalGoal: '60,000 CFA',
    impact: 'Transforming Lives Through Education',
    fullDescription: 'Our Education Support Program is dedicated to breaking the cycle of poverty through quality education. We provide comprehensive support including school fees, uniforms, books, and learning materials to children from disadvantaged families. The program also includes teacher training, infrastructure development, and community engagement initiatives. Since its inception, we have successfully supported over 120 children in completing their primary and secondary education, with many going on to pursue higher education and vocational training. Our holistic approach ensures that children not only receive academic support but also develop life skills and values that will serve them throughout their lives.',
    images: [
      'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&h=600&fit=crop&auto=format'
    ]
  },
  '2': {
    id: 2,
    title: 'Healthcare Outreach Initiative',
    description: 'Mobile medical clinics providing free healthcare services to remote villages and communities.',
    location: 'Northern Cameroon',
    date: '2024-02-01',
    beneficiaries: '800 people',
    amountUsed: '32,500 CFA',
    totalGoal: '50,000 CFA',
    impact: 'Bringing Healthcare to Remote Communities',
    fullDescription: 'The Healthcare Outreach Initiative operates mobile medical clinics that travel to remote villages where healthcare services are scarce or non-existent. Our team of qualified medical professionals provides free consultations, treatments, vaccinations, and health education. The program focuses on preventive care, maternal health, child nutrition, and treatment of common diseases. We have established partnerships with local health centers to ensure continuity of care and have trained community health workers to provide basic healthcare services. Through this initiative, we have reached over 800 patients, significantly improving health outcomes in underserved communities.',
    images: [
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&h=600&fit=crop&auto=format'
    ]
  },
  '3': {
    id: 3,
    title: 'Clean Water Project',
    description: 'Building wells and water systems to provide clean drinking water to communities in need.',
    location: 'Eastern Cameroon',
    date: '2024-03-10',
    beneficiaries: '15 communities',
    amountUsed: '78,000 CFA',
    totalGoal: '100,000 CFA',
    impact: 'Providing Life-Sustaining Clean Water',
    fullDescription: 'Access to clean water is a fundamental human right, yet many communities in Eastern Cameroon lack this basic necessity. Our Clean Water Project focuses on drilling boreholes, constructing wells, and installing water purification systems in communities that lack access to safe drinking water. We work closely with local communities to identify the most suitable locations and ensure sustainable maintenance of the water systems. The project includes training local technicians for ongoing maintenance and establishing water committees to manage the facilities. Since the project began, we have provided clean water access to over 2000 people across 15 communities, dramatically reducing waterborne diseases and improving overall community health.',
    images: [
      'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1541844053589-346841d0b34c?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format'
    ]
  },
  '4': {
    id: 4,
    title: 'Food Security Program',
    description: 'Distributing food packages and supporting sustainable farming practices in vulnerable communities.',
    location: 'Western Cameroon',
    date: '2024-04-05',
    beneficiaries: '200 families',
    amountUsed: '28,750 CFA',
    totalGoal: '40,000 CFA',
    impact: 'Ensuring Food Security and Sustainable Agriculture',
    fullDescription: 'The Food Security Program addresses both immediate hunger and long-term food sustainability in vulnerable communities. We distribute emergency food packages during crisis periods while simultaneously implementing sustainable agriculture training programs. The initiative includes providing seeds, farming tools, and technical support to help families develop their own food production capabilities. We also establish community gardens and promote climate-resilient farming techniques. Our nutrition education component ensures families understand how to prepare balanced meals with available resources. Through this comprehensive approach, we have supported over 200 families in achieving food security while building their capacity for sustainable agricultural practices.',
    images: [
      'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=600&fit=crop&auto=format'
    ]
  }
};

export async function generateStaticParams() {
  return Object.keys(charityData).map((id) => ({ id }));
}

export default function CharityDetailPage({ params }: { params: { id: string } }) {
  const charity = charityData[params.id as keyof typeof charityData];

  if (!charity) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-100 pt-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Charity program not found</h1>
            <Link href="/charity" className="text-blue-600 hover:text-blue-700">Return to Charity Programs</Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <CharityDetailClient charity={charity} />
    </PageLayout>
  );
}