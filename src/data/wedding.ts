import type { WeddingData } from "@/types/wedding";
import { theme } from "@/data/theme";
import { world } from "@/data/world";

export const wedding: WeddingData = {
  slug: "dzin-titin",
  names: {
    display: "Dzin Syah & Titin",
    groom: "Dzin Syah",
    bride: "Titin",
  },
  dateDisplay: "21.11.2026",
  tagline: "Walk Through Our Garden",
  welcome: {
    bismillah: "Bismillahirrahmanirrahim",
    greeting: "Assalamu'alaikum Warahmatullahi Wabarakatuh",
    message:
      "Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada pernikahan kami.",
    doa: "Semoga Allah SWT memberkahi pernikahan ini dan menjadikan kami pasangan yang sakinah, mawaddah, warahmah.",
  },
  couple: {
    groom: {
      fullName: "Mugh Dzin Syah, S.T.",
      nickname: "Dzin Syah",
      photo: "/images/groom-portrait.jpg",
      portrait: "/photo-profile/groom-garden.jpg",
      parents: "Putra dari Alm. Bapak Nur Wahid & Ibu Ulfatun Nikmah",
      title: "The Groom",
    },
    bride: {
      fullName: "Mirrotin Nuriyyah, S.Tr.Kes.",
      nickname: "Titin",
      photo: "/images/bride-portrait.jpg",
      portrait: "/photo-profile/bride-garden.jpg",
      parents: "Putri dari Bapak Sunaryo & Ibu Djumilatin",
      title: "The Bride",
    },
  },
  events: [
    {
      id: "akad",
      title: "Akad Nikah",
      date: "Sabtu, 21 November 2026",
      time: "08.00 WIB",
      venue: "Kediaman Keluarga Mempelai Wanita",
      address: "Jl. Teratai Gg. IX No. 30, RT 04/RW 07, Dsn. Ngelundo Utara, Ds. Candimulyo, Kab. Jombang, Jawa Timur",
      // Exact house pin (No. 30, right next to Zaccheo Print). mapUrl opens directions from the guest's location.
      coords: { lat: -7.535954, lng: 112.243247 },
      mapUrl: "https://www.google.com/maps/dir/?api=1&destination=-7.535954,112.243247",
      notes: "Diharapkan hadir 15 menit sebelum acara dimulai.",
    },
    {
      id: "reception",
      title: "Walimatul Ursy",
      date: "Sabtu, 21 November 2026",
      time: "12.00 WIB s.d. Selesai",
      venue: "Kediaman Keluarga Mempelai Wanita",
      address: "Jl. Teratai Gg. IX No. 30, RT 04/RW 07, Dsn. Ngelundo Utara, Ds. Candimulyo, Kab. Jombang, Jawa Timur",
      coords: { lat: -7.535954, lng: 112.243247 },
      mapUrl: "https://www.google.com/maps/dir/?api=1&destination=-7.535954,112.243247",
      dressCode: "",
      notes: "",
    },
  ],
  // Story chapters shown in the swipeable "Our Story" modal and the full invitation.
  story: [
    {
      id: "awal-kisah",
      title: "Awal Kisah",
      description:
        "Tak pernah kami bayangkan bahwa sebuah sapaan di ruang digital akan menjadi awal dari cerita yang begitu berarti. Berawal dari dua orang asing yang saling bertukar cerita, perlahan tumbuh rasa nyaman yang menghapus segala keraguan. Dari ribuan kemungkinan, semesta mempertemukan kami di waktu yang paling tepat.",
      image: "/photo album/photo_2026-09-28 12.14.29.jpeg",
      focus: "50% 48%",
    },
    {
      id: "saling-bertumbuh",
      title: "Saling Bertumbuh",
      description:
        "Perjalanan kami tidak selalu dipenuhi kemudahan. Ada perbedaan yang harus dipahami, ego yang harus diredam, dan jarak yang harus dilalui dengan kesabaran. Namun dari setiap proses itu, kami belajar bahwa cinta bukan tentang menemukan yang sempurna, melainkan tentang saling menerima dan terus bertumbuh bersama.",
      image: "/photo album/photo_2026-09-28 12.14.31.jpeg",
      focus: "50% 32%",
    },
    {
      id: "satu-pilihan",
      title: "Satu Pilihan",
      description:
        "Semakin lama melangkah, semakin kami yakin bahwa hati ini telah menemukan tempat pulangnya. Dengan restu keluarga dan keyakinan yang sama, kami memutuskan untuk membawa hubungan ini ke jenjang yang lebih serius. Bukan karena perjalanan telah tanpa rintangan, tetapi karena kami ingin menghadapi setiap rintangan bersama.",
      image: "/photo album/photo_2026-09-28 12.14.43.jpeg",
      focus: "50% 52%",
    },
    {
      id: "awal-selamanya",
      title: "Awal Selamanya",
      description:
        "Hari ini menjadi saksi atas doa-doa yang akhirnya dipertemukan dalam satu ikatan suci. Di hadapan Tuhan dan orang-orang terkasih, kami mengucapkan janji untuk saling mencintai, menjaga, dan menguatkan sepanjang hidup. Pernikahan ini bukan akhir dari kisah kami, melainkan awal dari perjalanan panjang yang akan kami tulis bersama, selangkah demi selangkah.",
      image: "/photo album/photo_2026-09-28 12.14.40.jpeg",
      focus: "50% 42%",
    },
  ],
  gallery: [
    {
      id: "g1",
      src: "/images/gallery-meeting.jpg",
      caption: "Awal pertemuan di taman yang tenang",
    },
    {
      id: "g2",
      src: "/images/gallery-closer.jpg",
      caption: "Tumbuh lebih dekat, langkah demi langkah",
    },
    {
      id: "g3",
      src: "/images/gallery-proposal.jpg",
      caption: "Sebuah janji di golden hour",
    },
    {
      id: "g4",
      src: "/images/gallery-wedding.jpg",
      caption: "Menuju hari yang kami nantikan",
    },
  ],
  album: [
    { id: "a1", src: "/photo album/photo_2026-09-28 12.14.29.jpeg", caption: "" },
    { id: "a2", src: "/photo album/photo_2026-09-28 12.14.31.jpeg", caption: "" },
    { id: "a3", src: "/photo album/photo_2026-09-28 12.14.32.jpeg", caption: "" },
    { id: "a4", src: "/photo album/photo_2026-09-28 12.14.33.jpeg", caption: "" },
    { id: "a5", src: "/photo album/photo_2026-09-28 12.14.35.jpeg", caption: "" },
    { id: "a6", src: "/photo album/photo_2026-09-28 12.14.39.jpeg", caption: "" },
    { id: "a7", src: "/photo album/photo_2026-09-28 12.14.40.jpeg", caption: "" },
    { id: "a8", src: "/photo album/photo_2026-09-28 12.14.42.jpeg", caption: "" },
    { id: "a9", src: "/photo album/photo_2026-09-28 12.14.43.jpeg", caption: "" },
    { id: "a10", src: "/photo album/photo_2026-09-28 12.14.46.jpeg", caption: "" },
    { id: "a11", src: "/photo album/photo_2026-09-28 12.14.48.jpeg", caption: "" },
  ],
  quran: {
    arabic:
      "وَمِنْ اٰيٰتِهٖٓ اَنْ خَلَقَ لَكُمْ مِّنْ اَنْفُسِكُمْ اَزْوَاجًا لِّتَسْكُنُوْٓا اِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَّوَدَّةً وَّرَحْمَةً ۗاِنَّ فِيْ ذٰلِكَ لَاٰيٰتٍ لِّقَوْمٍ يَّتَفَكَّرُوْنَ",
    translation:
      "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.",
    source: "QS. Ar-Rum : 21",
  },
  prayer: {
    arabic: "بَارَكَ اللّٰهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِيْ خَيْرٍ",
    translation:
      "Semoga Allah memberkahimu dalam suka maupun duka, dan menyatukan kalian berdua dalam kebaikan.",
    source: "HR. Abu Dawud, Tirmidzi & Ibnu Majah",
  },
  closing: {
    message:
      "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu. Atas kehadiran dan doanya, kami ucapkan terima kasih.",
    salam: "Wassalamu'alaikum Warahmatullahi Wabarakatuh",
  },
  countdown: {
    targetDate: "2026-11-21T08:00:00+07:00",
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
        number: "3660439586",
        holder: "Mugh Dzin Syah",
        owner: "Mempelai Pria",
      },
      {
        bank: "BNI",
        number: "0456571736",
        holder: "Mirrotin Nuriyyah",
        owner: "Mempelai Wanita",
      },
    ],
    address:
      "Jl. Teratai Gg. IX No. 30, RT 04/RW 07, Dsn. Ngelundo Utara, Ds. Candimulyo, Kab. Jombang, Jawa Timur 61413",
  },
  music: {
    title: "Soft Garden Prelude",
    enabledByDefault: true,
  },
  world,
  theme,
};
