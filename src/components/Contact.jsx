import { motion } from "framer-motion";
import { CONTACT } from "../constants";

const controlClass =
  "min-h-10 w-full rounded border border-neutral-600 bg-white px-3 py-2 text-neutral-900";

const Contact = () => {
  const mailtoAction = `mailto:${CONTACT.email.trim()}`;

  return (
    <div className="mx-auto max-w-xl px-4 pb-16 pt-8 sm:pt-12 md:pt-16">
      <motion.h1
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center text-[clamp(2rem,6vw,3.5rem)] font-normal leading-none tracking-tight"
      >
        Contact
      </motion.h1>
      <div className="contact-wrapper">
        <p className="contact-blurb text-sm leading-normal text-neutral-500 sm:text-base">
          Submitting opens your email app with a draft addressed to me.
        </p>

        <form
          action={mailtoAction}
          method="POST"
          encType="text/plain"
          className="contact-form pb-12 text-sm sm:text-base"
        >
          <label>
            <span>email</span>
            <input type="email" name="email" required className={controlClass} />
          </label>

          <label>
            <span>subject</span>
            <input name="subject" type="text" className={controlClass} />
          </label>

          <label>
            <span>body</span>
            <textarea name="body" rows={6} className={`${controlClass} resize-y`} />
          </label>

          <button
            type="submit"
            className="min-h-10 rounded border border-cyan-500/80 bg-cyan-600 px-6 py-2 text-center font-semibold text-white shadow-sm transition duration-300 hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
