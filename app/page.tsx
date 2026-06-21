import Link from "next/link";
import { ArrowRight, BookOpen, Package, Newspaper, Users, Zap, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
              MF
            </div>
            <span className="font-bold text-lg text-gray-900">MakersFlow</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">
              Sign In
            </Link>
            <Link href="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="space-y-6 mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Manage Your Learning & Store <span className="text-blue-600">Effortlessly</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A powerful admin portal to manage courses, products, and content all in one place. Perfect for educators and creators.
          </p>

          <div className="flex gap-4 justify-center pt-4">
            <Link href="/dashboard" className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium transition">
              Get Started <ArrowRight size={18} />
            </Link>
            <Link href="#features" className="flex items-center gap-2 border border-gray-300 text-gray-900 px-8 py-3 rounded-lg hover:bg-gray-50 font-medium transition">
              Learn More
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-1 shadow-2xl">
          <div className="rounded-xl bg-white p-12 text-center">
            <div className="grid grid-cols-3 gap-6">
              <div className="rounded-lg bg-blue-50 p-4">
                <BookOpen className="mx-auto text-blue-600 mb-2" size={32} />
                <p className="text-sm font-medium text-gray-900">123 Courses</p>
              </div>
              <div className="rounded-lg bg-emerald-50 p-4">
                <Package className="mx-auto text-emerald-600 mb-2" size={32} />
                <p className="text-sm font-medium text-gray-900">456 Products</p>
              </div>
              <div className="rounded-lg bg-orange-50 p-4">
                <Newspaper className="mx-auto text-orange-600 mb-2" size={32} />
                <p className="text-sm font-medium text-gray-900">89 Articles</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Powerful Features
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to manage your learning platform and online store
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="rounded-xl bg-white border border-gray-200 p-8 hover:shadow-lg transition">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 mb-4">
              <BookOpen className="text-blue-600" size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Course Management
            </h3>
            <p className="text-gray-600">
              Create, organize, and publish courses with rich content, pricing options, and access control.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-xl bg-white border border-gray-200 p-8 hover:shadow-lg transition">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 mb-4">
              <Package className="text-emerald-600" size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Store & Products
            </h3>
            <p className="text-gray-600">
              Manage your product catalog with categories, pricing, inventory, and customer management.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-xl bg-white border border-gray-200 p-8 hover:shadow-lg transition">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 mb-4">
              <Newspaper className="text-orange-600" size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Content Publishing
            </h3>
            <p className="text-gray-600">
              Publish news articles, updates, and announcements to keep your community engaged.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="rounded-xl bg-white border border-gray-200 p-8 hover:shadow-lg transition">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 mb-4">
              <Users className="text-purple-600" size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              User Management
            </h3>
            <p className="text-gray-600">
              Manage users, roles, permissions, and track user activity across your platform.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="rounded-xl bg-white border border-gray-200 p-8 hover:shadow-lg transition">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-pink-100 mb-4">
              <Zap className="text-pink-600" size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Real-time Updates
            </h3>
            <p className="text-gray-600">
              See instant updates, notifications, and real-time analytics on your dashboard.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="rounded-xl bg-white border border-gray-200 p-8 hover:shadow-lg transition">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-100 mb-4">
              <Shield className="text-cyan-600" size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Secure & Reliable
            </h3>
            <p className="text-gray-600">
              Enterprise-grade security, regular backups, and 99.9% uptime guarantee.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Manage Your Platform?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-xl mx-auto">
            Join hundreds of educators and creators using MakersFlow Admin to scale their business.
          </p>
          <Link href="/dashboard" className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 font-bold transition">
            Launch Dashboard <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
                MF
              </div>
              <span className="font-bold text-gray-900">MakersFlow</span>
            </div>
            
            <div className="flex gap-8">
              <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                Privacy
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                Terms
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                Contact
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600 text-sm">
            <p>© 2024 MakersFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
