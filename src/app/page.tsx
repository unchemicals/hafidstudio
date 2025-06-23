// --- File: src/app/page.tsx ---
// Final UX: Pertanyaan menjadi tombol interaktif untuk memulai chat baru.

"use client";

import { useState, useEffect, useRef } from "react";
import { Twitter, Linkedin, Instagram, Mail } from "lucide-react";

const CosmicBackground = () => {
  const nebulaRef = useRef(null);
  const starsRef = useRef(null);
  const meteorsRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 2;
      const y = (clientY / window.innerHeight - 0.5) * 2;
      if (nebulaRef.current)
        nebulaRef.current.style.transform = `translate(${x * 10}px, ${
          y * 10
        }px)`;
      if (starsRef.current)
        starsRef.current.style.transform = `translate(${x * 20}px, ${
          y * 20
        }px)`;
      if (meteorsRef.current)
        meteorsRef.current.style.transform = `translate(${x * 50}px, ${
          y * 50
        }px)`;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = starsRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let stars = [],
      animationFrameId;
    const setup = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = [];
      const starCount = window.innerWidth > 768 ? 150 : 75;
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.2 + 0.3,
          alpha: Math.random() * 0.4 + 0.1,
          twinkle: Math.random() * 0.01,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
        });
      }
    };
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        s.alpha += s.twinkle;
        if (s.alpha > 0.5 || s.alpha < 0.1) s.twinkle = -s.twinkle;
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, 2 * Math.PI);
        ctx.fill();
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0 || s.x > canvas.width) s.vx = -s.vx;
        if (s.y < 0 || s.y > canvas.height) s.vy = -s.vy;
      });
      animationFrameId = requestAnimationFrame(draw);
    };
    const handleResize = () => {
      cancelAnimationFrame(animationFrameId);
      setup();
      draw();
    };
    setup();
    draw();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    const createMeteor = () => {
      if (!meteorsRef.current) return;
      const meteor = document.createElement("div");
      meteor.className = "shooting-star";
      meteor.style.left = `${Math.random() * 100}%`;
      meteor.style.top = `${Math.random() * 40 - 20}%`;
      meteor.style.animationDuration = `${Math.random() * 2 + 2}s`;
      meteorsRef.current.appendChild(meteor);
      setTimeout(() => {
        meteor.remove();
      }, 4000);
    };
    const intervalId = setInterval(createMeteor, 6000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div ref={nebulaRef} className="nebula-bg"></div>
      <canvas ref={starsRef} className="stars-canvas"></canvas>
      <div ref={meteorsRef} className="meteors-container"></div>
    </>
  );
};

const SocialLink = ({ href, icon: Icon, ariaLabel }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={ariaLabel}
    className="text-gray-400 hover:text-white transition-transform duration-300 hover:scale-110"
  >
    <Icon size={22} />
  </a>
);

export default function HomePage() {
  const [question, setQuestion] = useState("");
  const [fullAnswer, setFullAnswer] = useState("");
  const [displayedAnswer, setDisplayedAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [animatedPlaceholder, setAnimatedPlaceholder] = useState("");
  const [submittedQuestion, setSubmittedQuestion] = useState("");

  // === PERUBAHAN 1: State baru untuk mengontrol mode edit ===
  const [isEditing, setIsEditing] = useState(false);

  const isFinishedAnswering =
    !isLoading &&
    displayedAnswer.length > 0 &&
    displayedAnswer.length === fullAnswer.length;

  useEffect(() => {
    const questions = [
      "Halo, apa kabar?...",
      "Lagi tertarik sama apa?...",
      "Bagaimana cara menghubungimu?...",
      "Spill skor UTBK",
      "Ask general question, ex: Apa itu large language models?...",
      "Udah punya pacar?...",
    ];
    let qIndex = 0,
      textIndex = 0,
      isDeleting = false,
      timeoutId;
    const type = () => {
      const currentText = questions[qIndex];
      let displayText = isDeleting
        ? currentText.substring(0, textIndex--)
        : currentText.substring(0, textIndex++);
      setAnimatedPlaceholder(displayText);
      let typeSpeed = isDeleting ? 25 : 100;
      if (!isDeleting && textIndex === currentText.length) {
        isDeleting = true;
        typeSpeed = 3000;
      } else if (isDeleting && textIndex === -1) {
        isDeleting = false;
        qIndex = (qIndex + 1) % questions.length;
        textIndex = 0;
        typeSpeed = 1500;
      }
      timeoutId = setTimeout(type, typeSpeed);
    };
    timeoutId = setTimeout(type, 250);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (fullAnswer) {
      let index = 0;
      const intervalId = setInterval(() => {
        setDisplayedAnswer(fullAnswer.substring(0, index + 1));
        index++;
        if (index === fullAnswer.length) clearInterval(intervalId);
      }, 30);
      return () => clearInterval(intervalId);
    }
  }, [fullAnswer]);

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    setSubmittedQuestion(question);
    setIsLoading(true);
    setFullAnswer("");
    setDisplayedAnswer("");
    setQuestion("");

    // === PERUBAHAN 2: Reset mode edit setiap kali submit pertanyaan baru ===
    setIsEditing(false);

    try {
      // Menggunakan `question` langsung karena `submittedQuestion` belum terupdate
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setFullAnswer(data.answer || "Maaf, tidak ada jawaban.");
    } catch (err) {
      console.error("Gagal:", err);
      setFullAnswer("Terjadi kesalahan saat menghubungi AI.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen bg-black text-white font-sans overflow-hidden">
      <CosmicBackground />
      <div className="relative z-10 flex flex-col h-full p-6 sm:p-10 lg:p-12 overflow-y-auto">
        <main className="w-full max-w-4xl mx-auto my-auto flex-grow flex flex-col justify-center transform -translate-y-4 sm:-translate-y-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
            <div className="md:col-span-3 text-center md:text-left">
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
                Hi, I'm Hafid 👨‍💻
              </h1>
              <p className="text-lg text-gray-300 mt-3">
                Student @ Universitas Airlangga | AI & LLM Enthusiast
              </p>
              <div className="mt-6 flex items-center justify-center md:justify-start gap-5">
                <SocialLink
                  href="https://linkedin.com/in/hafid-musolih-94aa97347/"
                  icon={Linkedin}
                  ariaLabel="LinkedIn"
                />
                <SocialLink
                  href="https://instagram.com/obvhfdd/"
                  icon={Instagram}
                  ariaLabel="Instagram"
                />
                <SocialLink
                  href="https://x.com/unchemicals"
                  icon={Twitter}
                  ariaLabel="Twitter"
                />
                <SocialLink
                  href="mailto:hafidmusolih06@gmail.com"
                  icon={Mail}
                  ariaLabel="Email"
                />
              </div>
            </div>
            <div className="md:col-span-2 flex justify-center md:justify-end order-first md:order-last">
              <img
                src="/hafid-photo.jpg"
                alt="Foto Profil Hafid"
                className="w-40 h-40 lg:w-48 lg:h-48 rounded-full border-4 border-gray-700/50 object-cover shadow-2xl"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://placehold.co/200x200/1a1a1a/ffffff?text=H";
                }}
              />
            </div>
          </div>
          <div className="mt-12 w-full">
            <h2 className="text-3xl font-semibold mb-4 text-center md:text-left">
              Ask Anything About Hafid
            </h2>
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/40 p-3 sm:p-4 rounded-xl">
              {/* === PERUBAHAN 3: Logika tampilan diubah total === */}
              {!submittedQuestion || isEditing ? (
                // Tampilkan form jika belum ada pertanyaan ATAU sedang dalam mode edit
                <form onSubmit={handleChatSubmit} className="relative w-full">
                  <textarea
                    id="chat"
                    rows="3"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder={animatedPlaceholder + "│"}
                    className="w-full p-3 pr-16 bg-black/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder-gray-400 resize-none"
                    // === PERUBAHAN 4: Logika "gajadi ngetik" ===
                    onBlur={() => {
                      if (!question) setIsEditing(false);
                    }}
                    autoFocus={isEditing} // Langsung fokus ke textarea saat mode edit
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    aria-label="Kirim pertanyaan"
                    className="absolute bottom-3 right-3 bg-purple-600/30 hover:bg-purple-600/50 text-white px-3 py-1.5 rounded-md flex items-center justify-center transition-colors disabled:bg-gray-600/50"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
                    </svg>
                  </button>
                </form>
              ) : (
                // Tampilkan pertanyaan yang sudah dikirim (pudar) JIKA tidak sedang mode edit
                <div
                  className="p-3 bg-black/20 rounded-lg"
                  // === PERUBAHAN 5: Seluruh blok pertanyaan menjadi tombol ===
                  onClick={() => {
                    if (isFinishedAnswering) setIsEditing(true);
                  }}
                >
                  <p
                    className={`text-gray-400 opacity-70 whitespace-pre-wrap break-words ${
                      isFinishedAnswering
                        ? "cursor-pointer hover:opacity-100"
                        : ""
                    }`}
                  >
                    {submittedQuestion}
                    {/* Tambahkan teks "Click untuk..." jika sudah selesai */}
                    {isFinishedAnswering ? (
                      <span className="text-purple-400 ml-2">
                        (Click untuk tanya lagi)
                      </span>
                    ) : (
                      ""
                    )}
                  </p>
                </div>
              )}

              {(isLoading || displayedAnswer) && (
                <div className="mt-3 pt-3 border-t border-purple-500/20">
                  <div className="p-3 bg-black/20 rounded-lg">
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <span className="animate-spin h-4 w-4 border-2 border-transparent border-t-white rounded-full"></span>
                        <span>Mikir bentar...</span>
                      </div>
                    ) : (
                      <p className="text-gray-200 text-sm sm:text-base whitespace-pre-wrap break-words">
                        {displayedAnswer}
                        {displayedAnswer.length !== fullAnswer.length
                          ? "│"
                          : ""}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Tombol lama dihapus, fungsinya dipindah ke blok pertanyaan */}
            </div>
          </div>
        </main>
        <footer className="w-full text-center text-xs sm:text-sm text-gray-500 pt-4 pb-2">
          <p>© {new Date().getFullYear()} Hafid. All rights reserved.</p>
          <p className="mt-1 text-[10px] sm:text-xs text-gray-600">
            Crafted with ❤️ and powered by Vercel and Gemini AI
          </p>
        </footer>
      </div>
    </div>
  );
}
