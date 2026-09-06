"use client";

import { useEffect, useState } from "react";

// Estimarea livrării, calculată în browser — nu la build.
//
// Dacă am calcula-o pe server, pagina fiind statică ar rămâne înghețată data
// de la ultimul deploy și ar minți vizitatorul. În browser e mereu corectă.
// Se sar sâmbăta și duminica; comenzile după ora 15 pleacă a doua zi.
export default function DeliveryEstimate({ cutoffHour = 15, minDays = 2, maxDays = 3 }) {
  const [text, setText] = useState("");

  useEffect(() => {
    const now = new Date();
    const start = new Date(now);
    if (now.getHours() >= cutoffHour) start.setDate(start.getDate() + 1);

    const addWorkdays = (from, days) => {
      const d = new Date(from);
      let left = days;
      while (left > 0) {
        d.setDate(d.getDate() + 1);
        if (d.getDay() !== 0 && d.getDay() !== 6) left--;
      }
      return d;
    };

    const fmt = (d) => d.toLocaleDateString("ro-RO", { day: "numeric", month: "long" });
    const from = addWorkdays(start, minDays);
    const to = addWorkdays(start, maxDays);

    const hoursLeft = cutoffHour - now.getHours();
    const prefix =
      hoursLeft > 0 && now.getDay() !== 0 && now.getDay() !== 6
        ? `Comandă în următoarele ${hoursLeft} ${hoursLeft === 1 ? "oră" : "ore"} și `
        : "";

    setText(`${prefix}primești coletul între ${fmt(from)} și ${fmt(to)}`);
  }, [cutoffHour, minDays, maxDays]);

  if (!text) return null;
  return <p className="trust__row"><i aria-hidden="true">✦</i>{text}</p>;
}
