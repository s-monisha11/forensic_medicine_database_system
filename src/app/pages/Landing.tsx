import { useNavigate } from "react-router";
import { FileText, Shield, BarChart3, Users, ArrowRight, CheckCircle } from "lucide-react";

export function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: FileText,
      title: "Case Management",
      description: "Comprehensive clinical and autopsy case tracking system",
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "Role-based access control and audit logging",
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports",
      description: "Generate court reports and statistical analysis",
    },
    {
      icon: Users,
      title: "Multi-User Support",
      description: "JMO, Medical Officers, Clerical Staff, and Administrators",
    },
  ];

  const benefits = [
    "Digital case registration and patient records",
    "Automated MLR and PMR report generation",
    "Evidence management with chain of custody",
    "Court dispatch tracking and receipt management",
    "Research analytics with anonymized data",
    "Secure cloud backup and data protection",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

        <div className="container mx-auto px-4 py-6 relative z-10">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur rounded-lg p-2">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-xl">FMDDS</h1>
                <p className="text-xs text-white/80">Forensic Medicine Department</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-2 border border-white/30 rounded-lg hover:bg-white/10 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="px-6 py-2 bg-white text-blue-900 rounded-lg hover:bg-white/90 transition-colors"
              >
                Sign Up
              </button>
            </div>
          </nav>
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl mb-6 leading-tight">
                Forensic Medicine Department
                <br />
                <span className="text-blue-300">Database System</span>
              </h2>
              <p className="text-xl text-white/90 mb-8">
                A comprehensive digital solution for managing forensic medical cases, reports, and
                investigations at the University of Sri Lanka.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-2 px-8 py-4 bg-white text-blue-900 rounded-lg hover:bg-white/90 transition-colors shadow-lg"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="px-8 py-4 border-2 border-white/30 rounded-lg hover:bg-white/10 transition-colors">
                  Learn More
                </button>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-6">
                <div>
                  <p className="text-3xl mb-1">610+</p>
                  <p className="text-sm text-white/70">Cases Managed</p>
                </div>
                <div>
                  <p className="text-3xl mb-1">28</p>
                  <p className="text-sm text-white/70">Active Users</p>
                </div>
                <div>
                  <p className="text-3xl mb-1">98%</p>
                  <p className="text-sm text-white/70">Uptime</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1614935151651-0bea6508db6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3JlbnNpYyUyMG1lZGljaW5lJTIwbGFib3JhdG9yeSUyMG1lZGljYWwlMjByZXNlYXJjaHxlbnwxfHx8fDE3Nzk5MzgzMTN8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Forensic Medicine Laboratory"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white text-gray-900 rounded-xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 rounded-lg p-3">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Secure & Certified</p>
                    <p className="text-lg">ISO 27001 Compliant</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl text-foreground mb-4">Comprehensive Features</h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to manage forensic medical operations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg text-card-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Image Gallery Section */}
      <div className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl text-foreground mb-4">Modern Forensic Medicine</h2>
            <p className="text-xl text-muted-foreground">
              State-of-the-art facilities and digital workflows
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1518152006812-edab29b069ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600"
                alt="Medical Laboratory"
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1639772823849-6efbd173043c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600"
                alt="Forensic Analysis"
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1582719471384-894fbb16e074?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600"
                alt="Medical Professional"
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl text-foreground mb-6">
              Why Choose FMDDS?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our system streamlines forensic medical operations, ensuring accuracy, security, and
              compliance with legal requirements.
            </p>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="bg-success/10 rounded-full p-1 mt-1">
                    <CheckCircle className="w-5 h-5 text-success" />
                  </div>
                  <p className="text-foreground">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8">
            <h3 className="text-2xl text-card-foreground mb-6">Ready to Get Started?</h3>
            <p className="text-muted-foreground mb-6">
              Join the digital transformation in forensic medicine. Sign up today for a secure,
              efficient case management system.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/signup")}
                className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Create Account
              </button>
              <button
                onClick={() => navigate("/login")}
                className="w-full px-6 py-4 border border-border rounded-lg hover:bg-accent transition-colors"
              >
                Sign In to Existing Account
              </button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-4">
              For authorized personnel only. Contact your administrator for access.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary rounded-lg p-2">
                  <FileText className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-card-foreground">FMDDS</h3>
                  <p className="text-xs text-muted-foreground">Forensic Medicine</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                University of Sri Lanka
                <br />
                Department of Forensic Medicine
              </p>
            </div>

            <div>
              <h4 className="text-card-foreground mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Support
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-card-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Data Protection
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Compliance
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-card-foreground mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Email: fmdds@university.lk</li>
                <li>Phone: +94 11 234 5678</li>
                <li>Emergency: +94 11 234 5679</li>
                <li>Monday - Friday, 8:00 AM - 5:00 PM</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 Forensic Medicine Department Database System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
