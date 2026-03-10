"use client";

import { FormEvent, useState } from "react";

type LeadData = {
  firstName: string;
  email: string;
  birthDate?: string;
};

export function LeadCapture({ onSubmit }: { onSubmit: (lead: LeadData) => void }) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit({ firstName, email, birthDate: birthDate || undefined });
  };

  return (
    <form onSubmit={submit} className="glass mx-auto flex w-full max-w-xl flex-col gap-4 rounded-2xl p-6">
      <h3 className="text-xl font-semibold">Avant votre résultat, où envoyer votre diagnostic ?</h3>
      <input
        required
        placeholder="Prénom"
        className="rounded-lg border border-white/20 bg-white/10 p-3"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <input
        required
        type="email"
        placeholder="Email"
        className="rounded-lg border border-white/20 bg-white/10 p-3"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="date"
        className="rounded-lg border border-white/20 bg-white/10 p-3"
        value={birthDate}
        onChange={(e) => setBirthDate(e.target.value)}
      />
      <button className="rounded-lg bg-gradient-to-r from-neon to-softViolet px-6 py-3 font-semibold text-deepBlue">
        Voir mon diagnostic IA
      </button>
    </form>
  );
}
