import Link from 'next/link';
import PageLayout from '@/components/PageLayout';
import BlogDetailClient from './BlogDetailClient';

const blogsData = {
  '1': {
    id: 1,
    title: "Walking in Faith: A Journey of Trust",
    date: "December 15, 2024",
    category: "Faith",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&auto=format",
    content: "Faith is not just a belief system, but a way of life that transforms how we see the world around us. When we walk in faith, we learn to trust God's plan even when we cannot see the full picture. This journey requires courage, patience, and an unwavering belief that God's love guides us through every season of life.\n\nIn our daily walk, we encounter challenges that test our faith, but these moments become opportunities for spiritual growth and deeper connection with our Creator. Faith teaches us to look beyond our circumstances and trust in God's perfect timing and wisdom.\n\nWhen we embrace faith as a lifestyle, we discover that it's not about having all the answers, but about trusting the One who does. This trust transforms our perspective on difficulties, turning them into stepping stones rather than stumbling blocks."
  },
  '2': {
    id: 2,
    title: "The Power of Community in Christian Life",
    date: "December 10, 2024",
    category: "Community",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&h=400&fit=crop&auto=format",
    content: "Christian community is more than just gathering together; it's about building meaningful relationships that reflect God's love. When believers come together, they create a support system that strengthens individual faith and collective witness.\n\nThrough fellowship, prayer, and shared experiences, we learn to bear one another's burdens and celebrate each other's victories. This sense of belonging helps us grow spiritually and serves as a powerful testimony to the world about God's transformative love.\n\nIn community, we find accountability, encouragement, and the strength to face life's challenges. Together, we can accomplish far more than we ever could alone, reflecting the unity that Christ prayed for among His followers."
  },
  '3': {
    id: 3,
    title: "Finding Hope in Difficult Times",
    date: "December 5, 2024",
    category: "Hope",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop&auto=format",
    content: "Life's challenges can feel overwhelming, but our faith provides an anchor of hope that keeps us steady in the storm. When we face difficulties, it's natural to question and struggle, but these moments often become the catalyst for deeper spiritual understanding.\n\nHope is not passive waiting, but active trust in God's goodness and sovereignty. Through prayer, scripture, and community support, we discover that even in our darkest hours, God's light continues to shine, offering comfort, strength, and the promise of better days ahead.\n\nTrue hope is rooted not in our circumstances, but in the unchanging character of God. This hope sustains us through trials and gives us the courage to keep moving forward, knowing that our story is not over."
  },
  '4': {
    id: 4,
    title: "The Joy of Serving Others",
    date: "November 28, 2024",
    category: "Service",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop&auto=format",
    content: "Service to others is at the heart of Christian living, reflecting Christ's love in action. When we serve, we discover that giving of ourselves brings unexpected joy and fulfillment. Whether it's helping a neighbor, volunteering at church, or supporting community initiatives, acts of service connect us to God's heart for humanity.\n\nThrough serving others, we learn humility, compassion, and the true meaning of love. Each act of kindness, no matter how small, has the potential to transform lives and demonstrate the reality of God's kingdom on earth.\n\nService is not just about meeting needs; it's about building relationships and showing others that they matter. In serving, we find purpose and discover that we receive far more than we give."
  }
};

export async function generateStaticParams() {
  return Object.keys(blogsData).map((id) => ({ id }));
}

export default function BlogDetailPage({ params }: { params: { id: string } }) {
  const blog = blogsData[params.id as keyof typeof blogsData];

  if (!blog) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Blog not found</h1>
            <Link href="/blogs" className="text-purple-600 hover:text-purple-700">Return to Blogs</Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <BlogDetailClient blog={blog} />
    </PageLayout>
  );
}