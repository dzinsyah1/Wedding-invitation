import type { WeddingData } from "@/types/wedding";
import { theme } from "@/data/theme";
import { world } from "@/data/world";

export const wedding: WeddingData = {
  slug: "rizky-aisyah",
  names: {
    display: "Rizky & Aisyah",
    groom: "Rizky",
    bride: "Aisyah",
  },
  dateDisplay: "20.09.2026",
  tagline: "Our Little Journey",
  welcome: {
    bismillah: "Bismillahirrahmanirrahim",
    greeting: "Assalamu'alaikum Warahmatullahi Wabarakatuh",
    message:
      "Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada pernikahan kami.",
    doa: "Semoga Allah SWT memberkahi pernikahan ini dan menjadikan kami pasangan yang sakinah, mawaddah, warahmah.",
  },
  couple: {
    groom: {
      fullName: "Rizky Pratama",
      nickname: "Rizky",
      photo: "/images/groom-portrait.png",
      parents: "Putra dari Bapak Ahmad Pratama & Ibu Siti Aminah",
      title: "The Groom",
    },
    bride: {
      fullName: "Aisyah Putri Hasan",
      nickname: "Aisyah",
      photo: "/images/bride-portrait.png",
      parents: "Putri dari Bapak Hasan Abdullah & Ibu Fatimah Zahra",
      title: "The Bride",
    },
  },
  events: [
    {
      id: "akad",
      title: "Akad Nikah",
      date: "Minggu, 20 September 2026",
      time: "09.00 WIB",
      venue: "Masjid Al-Hikmah",
      address: "Jl. Melati Indah No. 12, Jakarta Selatan",
      mapUrl: "https://maps.google.com/?q=Masjid+Al-Hikmah+Jakarta+Selatan",
      notes: "Diharapkan hadir 15 menit sebelum acara dimulai.",
    },
    {
      id: "reception",
      title: "Walimatul Ursy",
      date: "Minggu, 20 September 2026",
      time: "11.00 – 14.00 WIB",
      venue: "The Garden Hall",
      address: "Jl. Kemang Raya No. 88, Jakarta Selatan",
      mapUrl: "https://maps.google.com/?q=The+Garden+Hall+Kemang+Jakarta",
      dressCode: "Earth tone, sage, ivory, atau dusty rose",
      notes: "Acara dilanjutkan dengan jamuan dan foto bersama.",
    },
  ],
  story: [
    {
      id: "meet",
      year: "2019",
      title: "First Meeting",
      description:
        "Kami bertemu di sebuah taman kampus yang teduh. Percakapan sederhana itu menjadi awal dari perjalanan yang tak pernah kami duga.",
      image: "/images/gallery-meeting.png",
    },
    {
      id: "closer",
      year: "2021",
      title: "We Became Closer",
      description:
        "Waktu mengajarkan kami untuk tumbuh bersama. Dari tawa, doa, hingga langkah-langkah kecil yang perlahan terasa seperti rumah.",
      image: "/images/gallery-closer.png",
    },
    {
      id: "proposal",
      year: "2025",
      title: "The Proposal",
      description:
        "Di bawah cahaya senja dan bunga yang berguguran, sebuah janji diucapkan. Bukan hanya untuk hari ini, tetapi untuk seumur hidup.",
      image: "/images/gallery-proposal.png",
    },
    {
      id: "wedding",
      year: "2026",
      title: "Our Wedding",
      description:
        "Kini kami mengundang Anda untuk menjadi saksi dan bagian dari hari yang kami nantikan dengan penuh syukur.",
      image: "/images/gallery-wedding.png",
    },
  ],
  gallery: [
    {
      id: "g1",
      src: "/images/gallery-meeting.png",
      caption: "Awal pertemuan di taman yang tenang",
    },
    {
      id: "g2",
      src: "/images/gallery-closer.png",
      caption: "Tumbuh lebih dekat, langkah demi langkah",
    },
    {
      id: "g3",
      src: "/images/gallery-proposal.png",
      caption: "Sebuah janji di golden hour",
    },
    {
      id: "g4",
      src: "/images/gallery-wedding.png",
      caption: "Menuju hari yang kami nantikan",
    },
  ],
  countdown: {
    targetDate: "2026-09-20T09:00:00+07:00",
    timezone: "Asia/Jakarta",
  },
  rsvp: {
    enabled: true,
    maxGuests: 8,
  },
  gift: {
    message: "Kehadiran Anda adalah hadiah terindah bagi kami.",
    banks: [
      {
        bank: "BCA",
        number: "1234567890",
        holder: "Rizky Pratama",
      },
      {
        bank: "Mandiri",
        number: "9876543210",
        holder: "Aisyah Putri Hasan",
      },
    ],
    ewallets: [
      {
        name: "Dana",
        number: "081234567890",
        holder: "Rizky Pratama",
      },
    ],
    address: "Jl. Melati Indah No. 12, Jakarta Selatan, 12560",
  },
  music: {
    title: "Soft Garden Prelude",
    enabledByDefault: false,
  },
  world,
  theme,
};
