import { create } from "zustand";

// Données de l'événement principal
const mainEvent = {
  id: "main-event-2025",
  title: "Lorem Ipsum Conference 2025",
  subtitle: "Consectetur Adipiscing Elite Summit",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  longDescription: `
    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    
    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 
    totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
  `,
  date: "2025-09-15",
  time: "08:30",
  endTime: "18:00",
  price: 45000,
  originalPrice: 65000,
  maxParticipants: 300,
  currentRegistrations: 127,
  location: {
    venue: "Centre de Conférences Ivoire",
    address: "Boulevard de la République, Plateau",
    city: "Abidjan",
    country: "Côte d'Ivoire",
  },
  categories: ["Business", "Technologie", "Innovation"],
  speakers: [
    {
      id: 1,
      name: "Dr. Lorem Ipsum",
      title: "CEO & Founder",
      company: "TechCorp International",
      bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    },
    {
      id: 2,
      name: "Prof. Dolor Sit",
      title: "Innovation Director",
      company: "Future Labs",
      bio: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
    },
    {
      id: 3,
      name: "Ing. Amet Consectetur",
      title: "Tech Lead",
      company: "Digital Solutions",
      bio: "Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    },
  ],
  schedule: [
    { time: "08:30", title: "Accueil et petit-déjeuner", type: "break" },
    {
      time: "09:00",
      title: "Discours d'ouverture",
      speaker: "Dr. Lorem Ipsum",
      type: "keynote",
    },
    {
      time: "10:00",
      title: "Lorem Ipsum Technologies",
      speaker: "Prof. Dolor Sit",
      type: "presentation",
    },
    { time: "11:00", title: "Pause café", type: "break" },
    {
      time: "11:30",
      title: "Workshop: Consectetur Adipiscing",
      speaker: "Ing. Amet Consectetur",
      type: "workshop",
    },
    { time: "12:30", title: "Déjeuner networking", type: "break" },
    { time: "14:00", title: "Panel: Eiusmod Tempor Incididunt", type: "panel" },
    { time: "15:30", title: "Pause", type: "break" },
    { time: "16:00", title: "Session Q&A", type: "discussion" },
    {
      time: "17:00",
      title: "Clôture et remise de certificats",
      type: "ceremony",
    },
    { time: "18:00", title: "Cocktail de fin", type: "break" },
  ],
  features: [
    "Certificat de participation",
    "Kit de bienvenue",
    "Déjeuner et pauses inclus",
    "Accès aux supports de présentation",
    "Networking avec les experts",
    "Support technique",
  ],
  gallery: [
    "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=400&fit=crop",
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop",
    "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=400&fit=crop",
    "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=400&fit=crop",
  ],
  socialMedia: {
    facebook: "#",
    twitter: "#",
    linkedin: "#",
    instagram: "#",
  },
  contact: {
    email: "contact@loremipsumconf.ci",
    phone: "+225 01 02 03 04 05",
    whatsapp: "+225 07 08 09 10 11",
  },
  library: {
    documents: [
      {
        id: 1,
        title: "Guide du participant",
        type: "pdf",
        size: "2.3 MB",
        url: "#",
      },
      {
        id: 2,
        title: "Supports de présentation",
        type: "zip",
        size: "15.7 MB",
        url: "#",
      },
      {
        id: 3,
        title: "Plan de la venue",
        type: "pdf",
        size: "1.2 MB",
        url: "#",
      },
      {
        id: 4,
        title: "Liste des participants",
        type: "excel",
        size: "890 KB",
        url: "#",
      },
      {
        id: 5,
        title: "Code de conduite",
        type: "pdf",
        size: "445 KB",
        url: "#",
      },
      {
        id: 6,
        title: "Programme détaillé",
        type: "pdf",
        size: "1.8 MB",
        url: "#",
      },
    ],
  },
};

export const useEventStore = create((set, get) => ({
  event: mainEvent,
  loading: false,
  error: null,
  registrationData: null,
  paymentStatus: null,

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setRegistrationData: (data) => set({ registrationData: data }),
  setPaymentStatus: (status) => set({ paymentStatus: status }),

  // Simulate registration process
  registerForEvent: async (formData) => {
    set({ loading: true, error: null });

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const registration = {
        id: `REG-${Date.now()}`,
        ...formData,
        eventId: mainEvent.id,
        registeredAt: new Date().toISOString(),
        status: "pending_payment",
      };

      set({
        registrationData: registration,
        loading: false,
      });

      return registration;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Simulate payment process
  processPayment: async (paymentData) => {
    set({ loading: true, error: null });

    try {
      // Simulate payment API call
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const payment = {
        id: `PAY-${Date.now()}`,
        ...paymentData,
        status: "completed",
        paidAt: new Date().toISOString(),
      };

      set({
        paymentStatus: "completed",
        loading: false,
      });

      return payment;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Get availability
  getAvailableSpots: () => {
    const event = get().event;
    return event.maxParticipants - event.currentRegistrations;
  },

  // Check if event is sold out
  isSoldOut: () => {
    return get().getAvailableSpots() <= 0;
  },

  // Get discount percentage
  getDiscountPercentage: () => {
    const event = get().event;
    if (!event.originalPrice || event.originalPrice <= event.price) return 0;
    return Math.round(
      ((event.originalPrice - event.price) / event.originalPrice) * 100
    );
  },
}));
