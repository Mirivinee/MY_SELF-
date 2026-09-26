import { certificates } from "@/lib/content";
import CertificatesList from "@/components/certificates/CertificatesList";

export default function CertificatesPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Certificates</h1>
        <p className="mt-2 text-muted">
          Courses and programs I&apos;ve completed. Click an entry to open its LinkedIn credential.
        </p>
      </div>
      <CertificatesList certificates={certificates} />
    </div>
  );
}
