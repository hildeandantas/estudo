"use client";
import Lenis from "lenis";
import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useState } from "react";
export default function HomePage() {
  const { scrollYProgress } = useScroll({
    // offset: ["start start", "end start"]
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  useEffect(() => {
    // 1. Inicializa o Lenis
    const lenis = new Lenis();

    // 2. Cria o loop de animação necessário para o scroll suave funcionar
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 3. Limpa a instância do Lenis quando o componente for desmontado (boa prática)
    return () => {
      lenis.destroy();
    };
  }, []); // O array vazio garante que isso rode apenas 1 vez quando a página carregar

  const text = "loading";

  function LoadOverlay({ text }: { text: string }) {
    const letters = Array.from(text);

    const containerVariants = {
      // hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.3, // Tempo de espera (em segundos) entre cada letra
        },
      },
    };

    const letterVariants = {
      hidden: { y: "100%" }, // Começa invisível e um pouco abaixo
      visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 0 },
      },
    } as const;

    const [progress, setProgress] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(interval);
            return 100;
          }

          // Avança de forma irregular (passos aleatórios entre 1 e 8)
          const increment = Math.floor(Math.random() * 8) + 1;
          return Math.min(prevProgress + increment, 100);
        });
      }, 250); // Atualiza a cada 250ms

      return () => clearInterval(interval);
    }, []);

    return (
      <motion.div className="absolute h-screen w-screen bg-black grid ">
        <motion.div
          className="w-screen fixed top-0 bg-white h-2"
          style={{
            placeSelf:'start',
            scaleX: progress/100,
          }}
        />
        <motion.div className="max-h-fit overflow-hidden">
          <motion.h1
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-white text-4xl font-bold flex tracking-wider"
          >
            {letters.map((letter, index) => (
              <motion.span key={index} variants={letterVariants}>
                {/* Se for um espaço vazio, usamos um caractere de espaço sem quebra para manter o espaçamento */}
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
          </motion.h1>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.main className="relative w-full">
      <LoadOverlay text="Loading" />
      {/* <motion.section className="relative flex h-[96vh] w-full items-end justify-start p-12 overflow-hidden">
        <motion.div
          initial={{
            scale: 1.3,
          }}
          animate={{
            scale: 1.1,
          }}
          transition={{
            type: "spring",
            duration: 5,
            ease: "easeIn",
          }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/0750901c24da79fd06b0e7e23bf61ff0.jpg')",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // 0.5 define 50% de opacidade na cor preta
            backgroundBlendMode: "overlay", // Mescla a cor por cima da imagem
            y: backgroundY,
          }}
        />
        <motion.div className="z-10 text-white">
          <div className="overflow-hidden">
            <motion.h1
              className="text-[12vw] leading-relaxed font-extrabold "
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{
                duration: 1.5,
                // ease: [0.16, 1, 0.3, 1]
                ease: [0.19, 1, 0.22, 1],
              }}
            >
              Hildean Dantas
            </motion.h1>
          </div>
          <motion.h2 className="z-10">Desenvolvedor</motion.h2>
        </motion.div>
      </motion.section>
      <motion.section className="relative z-20 flex h-screen w-full "></motion.section> */}
    </motion.main>
  );
}
