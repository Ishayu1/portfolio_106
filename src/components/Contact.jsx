import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CONTACT } from "../constants";

const Contact = () => {
  const mailtoAction = `mailto:${CONTACT.email.trim()}`;

  return (
    <div className="mx-auto max-w-xl px-4 pb-16 pt-8 sm:pt-12 md:pt-16">
      <motion.h1
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-2 text-center text-3xl font-normal sm:text-4xl"
      >
        Contact
      </motion.h1>
      <p className="mb-8 text-center text-sm text-neutral-500 sm:text-base">
        Submitting opens your email app with a draft addressed to me.
      </p>

      <form
        action={mailtoAction}
        method="POST"
        encType="text/plain"
        className="flex flex-col gap-6 border-b border-neutral-900 pb-12"
      >
        <label className="flex flex-col gap-2 text-left text-sm sm:text-base">
          email
          <input
            type="email"
            name="email"
            required
            className="min-h-10 w-full rounded border border-neutral-600 bg-white px-3 py-2 text-black"
          />
        </label>

        <label className="flex flex-col gap-2 text-left text-sm sm:text-base">
          subject
          <input name="subject" className="min-h-10 w-full rounded border border-neutral-600 bg-white px-3 py-2 text-black" />
        </label>

        <label className="flex flex-col gap-2 text-left text-sm sm:text-base">
          body
          <textarea
            name="body"
            rows={6}
            className="w-full resize-y rounded border border-neutral-600 bg-white px-3 py-2 text-black"
          />
        </label>

        <button className="self-start rounded-lg bg-cyan-600 px-6 py-2 font-bold text-white shadow-lg transition duration-300 hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-300">
          Submit
        </button>
      </form>

      <div className="mt-10 text-center">
        <Link to="/" className="text-cyan-400 hover:underline">
          Back to home
        </Link>
      </div>
    </div>
  );
};

export default Contact;
