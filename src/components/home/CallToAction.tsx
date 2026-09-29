export default function CallToAction() {
  return (
    <section className="bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-10 text-center sm:px-12 lg:py-14">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Ready to equip your business?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-blue-100">
            Register your business to unlock account pricing, invoice-based
            ordering and full order history. Approval usually takes one working
            day.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="/register"
              className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              Register Your Business
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Talk to Sales
            </a>
          </div>

          <p className="mt-6 text-xs text-blue-100">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-semibold text-white underline underline-offset-4"
            >
              Log in
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}