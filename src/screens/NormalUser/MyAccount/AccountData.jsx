export default function AccountData() {
  return (
    <section className="flex flex-col bg-[#fff] rounded-2xl lg:h-2/3 p-6 gap-4">
      <span className="text-3xl opacity-80">Copa XIRO</span>
      <div className="flex flex-col text-lg gap-y-4 mt-4">
        <p>
          Copa XIRO es una iniciativa para premiar la confianza y el apoyo de
          nuestra comunidad. <br /> Próximamente más novedades.
        </p>
        <p>
          Seguinos en{" "}
          <a
            rel="noreferrer"
            className="text-green-800 hover:text-green-600 duration-75 underline"
            target="_blank"
            href="https://www.instagram.com/xiroapp.com.ar/profilecard/?igsh=aHR6aXdoNDNvbWps"
          >
            @xiroapp.com.ar
          </a>
        </p>
      </div>
    </section>
  );
}
