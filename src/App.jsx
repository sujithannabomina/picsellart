import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import BuyerLogin from "./pages/BuyerLogin";
import SellerLogin from "./pages/SellerLogin";
import ViewImage from "./pages/ViewImage";

// These three are simple static pages – we define them here
function FAQPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Frequently Asked Questions
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Answers to common questions about buying and selling on Picsellart.
        </p>
      </header>

      <div className="space-y-6">
        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            What is Picsellart?
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Picsellart is a curated marketplace where photographers and
            creators sell high-quality digital images to designers, agencies
            and brands.
          </p>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            How do I become a seller?
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Choose a seller plan, sign in with Google and upload your approved
            images. You set your own price within the plan limits.
          </p>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            How are images delivered to buyers?
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            After a successful Razorpay payment, buyers receive instant access
            to a clean, watermark-free download from their dashboard.
          </p>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Do images have watermarks?
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Public previews on Explore and View are watermarked. Purchased
            downloads are full-resolution and watermark-free.
          </p>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            What is your refund policy?
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Because files are instantly downloadable, refunds are only offered
            when a file is corrupt, incomplete or does not match the listing
            description.
          </p>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Can I use images commercially?
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Yes, unless a listing clearly says otherwise. Each file includes a
            standard commercial license. Reselling or redistributing the raw
            files is not allowed.
          </p>
        </section>
      </div>
    </div>
  );
}

function ContactPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Contact Us
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Send a message – our small team typically replies within 24–48 hours.
        </p>
      </header>

      <div className="space-y-6">
        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <form className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Your name
                </label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-200"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-200"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Subject
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-200"
                placeholder="Question or feedback"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Message
              </label>
              <textarea
                rows={4}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-200"
                placeholder="Tell us how we can help…"
              />
            </div>

            <button
              type="button"
              className="w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:shadow-lg"
            >
              Send message
            </button>
          </form>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            For urgent payment issues
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Include your Razorpay payment ID, buyer email address and the file
            name you purchased. This helps us locate your order quickly.
          </p>
          <p className="mt-4 text-xs text-slate-500">
            Support hours: Monday – Friday, 10:00 – 18:00 IST.
          </p>
        </section>
      </div>
    </div>
  );
}

function RefundsPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Refunds &amp; Cancellations
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Picsellart provides instant digital downloads. Please review this
          policy carefully before purchasing.
        </p>
      </header>

      <div className="space-y-6">
        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Eligibility</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
            <li>
              Refunds are not offered for change-of-mind or “I don’t need this
              file anymore.”
            </li>
            <li>
              If the delivered file is corrupt, incomplete, or does not match
              the listing description, you may request a replacement or refund.
            </li>
            <li>
              We may replace the file, issue store credit, or refund at our
              discretion after verifying the issue.
            </li>
          </ul>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            How to request help
          </h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-600">
            <li>Provide your order ID and the affected file name.</li>
            <li>
              Explain the issue clearly and attach screenshots if possible.
            </li>
            <li>Contact us using the form on the Contact page.</li>
          </ol>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Abuse &amp; fraud
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            We monitor suspicious activity across accounts. Repeated refund
            abuse, chargebacks, or file sharing may result in account suspension
            and removal from the marketplace.
          </p>
        </section>
      </div>
    </div>
  );
}

function Header() {
  const navLinkBase =
    "text-sm font-medium text-slate-600 hover:text-slate-900 transition";
  const activeClasses = "text-slate-900 underline underline-offset-4";

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4">
        <NavLink to="/" className="flex items-center gap-2">
          <span className="inline-flex h-3 w-3 rounded-full bg-fuchsia-500 shadow-[0_0_0_3px_rgba(217,70,239,0.35)]" />
          <span className="text-base font-semibold tracking-tight text-slate-900">
            Picsellart
          </span>
        </NavLink>

        <nav className="flex items-center gap-6">
          <NavLink
            to="/explore"
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? activeClasses : ""}`
            }
          >
            Explore
          </NavLink>
          <NavLink
            to="/faq"
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? activeClasses : ""}`
            }
          >
            FAQ
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? activeClasses : ""}`
            }
          >
            Contact
          </NavLink>
          <NavLink
            to="/refunds"
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? activeClasses : ""}`
            }
          >
            Refunds
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <NavLink
            to="/buyer-login"
            className="rounded-full border border-slate-300 px-4 py-1.5 text-xs font-medium text-slate-800 hover:border-slate-400"
          >
            Buyer Login
          </NavLink>
          <NavLink
            to="/seller-login"
            className="rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-4 py-1.5 text-xs font-semibold text-white shadow-md hover:shadow-lg"
          >
            Seller Login
          </NavLink>
        </div>
      </div>
    </header>
  );
}

function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Header />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/refunds" element={<RefundsPage />} />
          <Route path="/buyer-login" element={<BuyerLogin />} />
          <Route path="/seller-login" element={<SellerLogin />} />
          <Route path="/view/:encodedPath" element={<ViewImage />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
