import Navbar from "@/components/fcws/Navbar";
import Footer from "@/components/fcws/Footer";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-2xl md:text-3xl text-primary">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground">Last updated: July 2026</p>
          </div>
        </div>

        <div className="space-y-8 text-sm md:text-base text-foreground/80 leading-relaxed">
          <section>
            <h2 className="font-heading font-bold text-lg text-primary mb-3">1. Introduction</h2>
            <p>
              Family Care Workforce Solutions ("FCWS," "we," "us," or "our") is committed to protecting the privacy
              and confidentiality of our clients, caregivers, employees, and website visitors. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your information when you visit our website or
              use our care services.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-lg text-primary mb-3">2. Information We Collect</h2>
            <p className="mb-3">We may collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Personal Information:</strong> Full name, email address, phone number, and home address.</li>
              <li><strong>Health Information:</strong> Care needs, medical conditions, and medication details provided by clients or their families.</li>
              <li><strong>Employment Information:</strong> Background checks, certifications, training records, and scheduling data for caregivers.</li>
              <li><strong>Usage Data:</strong> IP address, browser type, and pages visited on our website.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading font-bold text-lg text-primary mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and coordinate compassionate home care services.</li>
              <li>To match qualified caregivers with clients based on care needs and specializations.</li>
              <li>To communicate with families regarding schedules, updates, and care plans.</li>
              <li>To comply with legal and regulatory requirements in Liberia.</li>
              <li>To improve our services, website, and overall care quality.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading font-bold text-lg text-primary mb-3">4. Information Sharing</h2>
            <p>
              We do not sell or rent your personal information. We may share information with: healthcare providers
              involved in client care (with consent), government agencies when required by law, and trusted
              partners who support our operations under strict confidentiality agreements.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-lg text-primary mb-3">5. Data Security</h2>
            <p>
              We implement appropriate technical, administrative, and physical safeguards to protect your
              information from unauthorized access, alteration, disclosure, or destruction. Access to personal and
              health information is restricted to authorized personnel only.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-lg text-primary mb-3">6. Your Rights</h2>
            <p>
              You have the right to request access to, correction of, or deletion of your personal information. To
              exercise these rights, please contact us using the information below.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-lg text-primary mb-3">7. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at:
              <br />
              Family Care Workforce Solutions
              <br />
              FDA Community, Bernard's Farm, Monrovia, Liberia
              <br />
              +231 88 898 87976 / +231 76 143 5652
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}