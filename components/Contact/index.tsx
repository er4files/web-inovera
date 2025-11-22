import NewsLatterBox from "./NewsLatterBox";

const Contact = () => {
  return (
    <section id="contact" className="overflow-hidden py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 lg:w-7/12 xl:w-8/12">
            <div
              className="wow fadeInUp shadow-three dark:bg-gray-dark mb-12 rounded-sm bg-white px-8 py-11 sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]"
              data-wow-delay=".15s"
            >
              <h2 className="mb-3 text-2xl font-bold text-black dark:text-white sm:text-3xl lg:text-2xl xl:text-3xl">
                Hubungi Kami
              </h2>
              <p className="mb-12 text-base font-medium text-body-color">
                Tim kami akan segera menghubungi Anda melalui email.
              </p>
              <form>
                <div className="-mx-4 flex flex-wrap">
                  <div className="w-full px-4 md:w-1/2">
                    <div className="mb-8">
                      <label
                        htmlFor="name"
                        className="mb-3 block text-sm font-medium text-dark dark:text-white"
                      >
                        Nama Anda
                      </label>
                      <input
                        type="text"
                        placeholder="Masukkan nama Anda"
                        className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                      />
                    </div>
                  </div>
                  <div className="w-full px-4 md:w-1/2">
                    <div className="mb-8">
                      <label
                        htmlFor="email"
                        className="mb-3 block text-sm font-medium text-dark dark:text-white"
                      >
                        Email Anda
                      </label>
                      <input
                        type="email"
                        placeholder="Masukkan email Anda"
                        className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                      />
                    </div>
                  </div>
                  <div className="w-full px-4">
                    <div className="mb-8">
                      <label
                        htmlFor="message"
                        className="mb-3 block text-sm font-medium text-dark dark:text-white"
                      >
                        Pesan Anda
                      </label>
                      <textarea
                        name="message"
                        rows={5}
                        placeholder="Masukkan pesan Anda"
                        className="border-stroke dark:text-body-color-dark dark:shadow-two w-full resize-none rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                      ></textarea>
                    </div>
                  </div>
                  <div className="w-full px-4">
                    <button className="shadow-submit dark:shadow-submit-dark rounded-sm bg-primary px-9 py-4 text-base font-medium text-white duration-300 hover:bg-primary/90">
                      Kirim Pesan
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Info about company contact details */}
          <div className="w-full px-4 lg:w-5/12 xl:w-4/12">
            <div className="wow fadeInUp shadow-three dark:bg-gray-dark relative z-10 rounded-sm bg-white p-8 sm:p-11 lg:p-8 xl:p-11" data-wow-delay=".2s">
              <h3 className="mb-4 text-2xl font-bold leading-tight text-black dark:text-white">
                Informasi Perusahaan
              </h3>
              <p className="text-lg text-body-color">
                <strong>Alamat:</strong><br />
                Jl. Solo Raya, Sukoharjo, Jawa Tengah, Indonesia 57556
                <br /><br />
                <strong>Telepon:</strong><br />
                +62 822-4428-6612 (Rahmad)
              </p>
                 {/* Google Maps Embed */}
      <div className="mt-8">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d988.6791051658939!2d110.79224076958053!3d-7.605806999525571!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a15f7299c54e3%3A0x6a2aac4b3eea1550!2sJl.%20Raya%20Solo%20-%20Baki%2C%20Dusun%202%2C%20Gedangan%2C%20Kec.%20Grogol%2C%20Kabupaten%20Sukoharjo%2C%20Jawa%20Tengah%2057552!5e0!3m2!1sid!2sid!4v1763817172083!5m2!1sid!2sid"
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
