import { Calendar, MapPin, ArrowLeft, Users, Clock } from 'lucide-react';
import Link from 'next/link';
import WorkshopClient from './WorkshopClient';
import PageLayout from '@/components/PageLayout';

const workshopsData = {
  '1': {
    title: 'Leadership Development Workshop',
    description: 'Equipping church leaders with essential skills for effective ministry and community leadership.',
    fullDescription: 'This comprehensive leadership development workshop is designed to empower church leaders with the essential skills needed for effective ministry and community leadership. Participants will learn about servant leadership, team building, conflict resolution, and strategic planning. The program includes interactive sessions, case studies, and practical exercises that will help leaders develop their unique leadership style while staying true to Christian principles.',
    location: 'Douala Conference Center',
    date: '2024-02-15',
    duration: '3 days',
    capacity: '50 participants',
    images: [
      'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop&auto=format'
    ]
  },
  '2': {
    title: 'Youth Ministry Training',
    description: 'Comprehensive training program for youth pastors and volunteers working with young people.',
    fullDescription: 'This intensive youth ministry training program is specifically designed for youth pastors, volunteers, and anyone passionate about working with young people. The training covers age-appropriate ministry techniques, understanding youth culture, digital ministry strategies, and creating engaging programs that resonate with today\'s youth while maintaining strong biblical foundations.',
    location: 'Yaoundé Youth Center',
    date: '2024-02-22',
    duration: '2 days',
    capacity: '40 participants',
    images: [
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&auto=format'
    ]
  },
  '3': {
    title: 'Music Ministry Workshop',
    description: 'Training for worship leaders, musicians, and choir members to enhance musical ministry.',
    fullDescription: 'This music ministry workshop brings together worship leaders, musicians, and choir members for comprehensive training in musical ministry. Topics include worship planning, song selection, team coordination, sound engineering basics, and creating an atmosphere of worship. Both traditional and contemporary worship styles will be explored.',
    location: 'Bamenda Music Academy',
    date: '2024-03-01',
    duration: '2 days',
    capacity: '60 participants',
    images: [
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop&auto=format'
    ]
  },
  '4': {
    title: 'Community Outreach Training',
    description: 'Strategies and practical skills for effective community engagement and social impact.',
    fullDescription: 'This community outreach training focuses on equipping participants with strategies and practical skills for effective community engagement and creating meaningful social impact. The program covers needs assessment, program development, partnership building, and sustainable community development approaches rooted in Christian values.',
    location: 'Garoua Community Hall',
    date: '2024-03-08',
    duration: '3 days',
    capacity: '45 participants',
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop&auto=format'
    ]
  }
};

export async function generateStaticParams() {
  return [
    { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }
  ];
}

export default function WorkshopDetailPage({ params }: { params: { id: string } }) {
  const workshop = workshopsData[params.id as keyof typeof workshopsData];

  if (!workshop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-purple-100 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Workshop not found</h1>
          <Link href="/workshops" className="text-green-600 hover:text-green-700">Return to Workshops</Link>
        </div>
      </div>
    );
  }

  return (
    <PageLayout>
      <WorkshopClient workshop={workshop} />
    </PageLayout>
  );
}