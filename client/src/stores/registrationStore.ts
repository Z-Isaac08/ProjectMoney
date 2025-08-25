import { create } from "zustand";

export const useRegistrationStore = create((set, get) => ({
  currentStep: 1,
  totalSteps: 3,
  formData: {
    personal: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      position: "",
    },
    preferences: {
      dietary: "",
      accessibility: "",
      networking: false,
      newsletter: true,
    },
    payment: {
      method: "card",
      billingInfo: {},
    },
  },
  errors: {},
  isValid: false,

  // Navigation
  nextStep: () => {
    const currentStep = get().currentStep;
    const totalSteps = get().totalSteps;
    if (currentStep < totalSteps) {
      set({ currentStep: currentStep + 1 });
    }
  },

  prevStep: () => {
    const currentStep = get().currentStep;
    if (currentStep > 1) {
      set({ currentStep: currentStep - 1 });
    }
  },

  setStep: (step) => set({ currentStep: step }),

  // Form data management
  updateFormData: (section, data) => {
    const currentFormData = get().formData;
    set({
      formData: {
        ...currentFormData,
        [section]: {
          ...currentFormData[section],
          ...data,
        },
      },
    });
  },

  // Validation
  validateStep: (step) => {
    const formData = get().formData;
    const errors = {};

    switch (step) {
      case 1: // Personal info
        if (!formData.personal.firstName) errors.firstName = "Prénom requis";
        if (!formData.personal.lastName) errors.lastName = "Nom requis";
        if (!formData.personal.email) errors.email = "Email requis";
        if (!formData.personal.phone) errors.phone = "Téléphone requis";
        break;

      case 2: // Preferences (optionnel, toujours valide)
        break;

      case 3: // Payment
        if (!formData.payment.method)
          errors.paymentMethod = "Méthode de paiement requise";
        break;
    }

    set({ errors, isValid: Object.keys(errors).length === 0 });
    return Object.keys(errors).length === 0;
  },

  // Reset form
  resetForm: () =>
    set({
      currentStep: 1,
      formData: {
        personal: {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          company: "",
          position: "",
        },
        preferences: {
          dietary: "",
          accessibility: "",
          networking: false,
          newsletter: true,
        },
        payment: {
          method: "card",
          billingInfo: {},
        },
      },
      errors: {},
      isValid: false,
    }),
}));
