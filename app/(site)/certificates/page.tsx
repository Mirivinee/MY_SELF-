import { certificates } from "@/lib/content";

export default function CertificatesPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-semibold tracking-tight">Certificates</h1>
      <ul className="flex flex-col divide-y divide-border rounded-xl border border-border">
        {certificates.map((cert) => (
          <li key={cert.title}>
            <a
              href={cert.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-1 p-6 transition-colors hover:bg-surface sm:flex-row sm:items-baseline sm:justify-between"
            >
              <div>
                <p className="font-medium">{cert.title}</p>
                <p className="text-sm text-muted">
                  {cert.issuer} · {cert.year}
                </p>
                <p className="mt-1 text-sm text-muted">{cert.description}</p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
