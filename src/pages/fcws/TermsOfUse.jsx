import Navbar from "@/components/fcws/Navbar";
import Footer from "@/components/fcws/Footer";
import { FileText } from "lucide-react";

export default function TermsOfUse() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center">
            <FileText className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-2xl md:text-3xl text-primary">Terms of Use</h1>
            <p className="text-sm text-muted-foreground">Last updated: July 2026</p>
          </div>
        </div>

        <div className="space-y-8 text-sm md:text-base text-foreground/80 leading-relaxed">
          <section>
            <h2 className="font-heading font-bold text-lg text-primary mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the Family Care Workforce Solutions ("FCWS") website and services, you agree
              to be bound by these Terms of Use. If you do not agree with any part of these terms, please do not
              use our services.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-lg text-primary mb-3">2. Services Provided</h2>
            <p>
              FCWS provides home care services including personal care, meal preparation, companionship, medication
              reminders, light housekeeping, and respite care. Services are provided in Liberia by trained and
              screened caregivers.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-lg text-primary mb-3">3. Client Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate and complete information about care needs and medical conditions.</li>
              <li>Notify FCWS of any changes in the client's condition or care requirements.</li>
              <li>Treat caregivers with respect and dignity.</li>
              <li>Ensure a safe environment for caregivers performing their duties.</li>
              <li>Settle payments for services as agreed upon.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading font-bold text-lg text-primary mb-3">4. Caregiver Obligations</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide care with compassion, professionalism, and respect.</li>
              <li>Maintain confidentiality of all client information.</li>
              <li>Follow care plans and report incidents promptly.</li>
              <li>Adhere to all FCWS policies, procedures, and training standards.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading font-bold text-lg text-primary mb-3">5. Limitation of Liability</h2>
            <p>
              FCWS shall not be liable for any indirect, incidental, or consequential damages arising from the use
              of our services. Our liability is limited to the cost of the services provided. We are not
              responsible for outcomes resulting from circumstances beyond our control, including pre-existing
              medical conditions or emergencies.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-lg text-primary mb-3">6. Termination</h2>
            <p>
              Either party may terminate services with reasonable notice. FCWS reserves the right to discontinue
              services if the safety of caregivers is at risk, if terms are violated, or if payment obligations
              are not met.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-lg text-primary mb-3">7. Governing Law</h2>
            <p>
              These Terms of Use shall be governed by and construed in accordance with the laws of the Republic of
              Liberia.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-lg text-primary mb-3">8. Changes to Terms</h2>
            <p>
              FCWS reserves the right to update these Terms of Use at any time. Continued use of our services after
              changes constitutes acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-bold text-lg text-primary mb-3">9. Contact Us</h2>
            <p>
              For questions regarding these Terms of Use, please contact us at:
              <br />
              Family Care Workforce Solutions
              <br />
              FDA Community, Bernard's Farm, Monrovia, Liberia
              <br />
              +231 88 988 7976 / +231 76 143 5652
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
