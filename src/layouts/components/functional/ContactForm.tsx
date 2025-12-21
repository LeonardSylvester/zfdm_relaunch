import { useEffect, useMemo, useRef, useState } from "react";

const SUBMIT_ENDPOINT = "https://www.g2wcrm.b-24.de/receiveContact.php";
const IS_DEVELOPMENT = import.meta.env.DEV;

const INTEREST_OPTIONS = [
  { value: "Offer", label: "Beratung für individuelles Angebot" },
  { value: "Order", label: "Per Rechnung bestellen (10% Rabatt)" },
] as const;

const DEVICE_OPTIONS = [
  { value: "Zeiterfassung mit RFID", label: "Zeiterfassung mit Chip" },
  {
    value: "Zeiterfassung mit Fingerabdruck",
    label: "Zeiterfassung mit Fingerabdruck",
  },
  {
    value: "Zeiterfassung mit Gesichtserkennung",
    label: "Zeiterfassung mit Gesichtserkennung",
  },
] as const;

type InterestValue = (typeof INTEREST_OPTIONS)[number]["value"];

type FormState = {
  title: "Herr" | "Frau";
  firstname: string;
  lastname: string;
  companyname: string;
  email: string;
  tel: string;
  interest: InterestValue;
  packet: "Starter" | "Medium";
  noEmployee: string;
  device:
    | "Zeiterfassung mit RFID"
    | "Zeiterfassung mit Fingerabdruck"
    | "Zeiterfassung mit Gesichtserkennung";
  nodevice: string;
  street: string;
  postcode: string;
  placename: string;
  callback: "-" | "Ja" | "Nein";
  source:
    | "Google Suchmaschine"
    | "Bing Suchmaschine"
    | "Facebook"
    | "LinkedIn"
    | "Ich wurde von einem Get2world Kundenberater kontaktiert"
    | "Weiterempfehlung"
    | "Google Ads"
    | "Bing Ads"
    | "Newsletter"
    | "ChatGPT"
    | "Perplexity"
    | "Gemini"
    | "Webseite";
  recommender: string;
  message: string;
};

const INITIAL_STATE: FormState = {
  title: "Herr",
  firstname: "",
  lastname: "",
  companyname: "",
  email: "",
  tel: "",
  interest: "Offer",
  packet: "Starter",
  noEmployee: "25",
  device: "Zeiterfassung mit RFID",
  nodevice: "1",
  street: "",
  postcode: "",
  placename: "",
  callback: "-",
  source: "Webseite",
  recommender: "-",
  message: "",
};

// UTM Source Mapping: utm_source Wert -> CRM Source
const UTM_SOURCE_MAP: Record<string, FormState["source"]> = {
  google: "Google Suchmaschine",
  bing: "Bing Suchmaschine",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  newsletter: "Newsletter",
};

// sessionStorage Key für First-Touch Attribution
const SOURCE_STORAGE_KEY = "zfdm_traffic_source";

// Erkennt die Traffic-Quelle anhand von URL-Parametern und Referrer
const detectTrafficSource = (): FormState["source"] | null => {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);

  // 1. Expliziter ?source= Parameter (höchste Priorität)
  const sourceParam = params.get("source");
  if (sourceParam) {
    const validSources: FormState["source"][] = [
      "Google Suchmaschine",
      "Bing Suchmaschine",
      "Facebook",
      "LinkedIn",
      "Weiterempfehlung",
      "Google Ads",
      "Bing Ads",
      "Newsletter",
      "ChatGPT",
      "Perplexity",
      "Gemini",
    ];
    const match = validSources.find(
      (s) => s.toLowerCase() === sourceParam.toLowerCase(),
    );
    return match || (sourceParam as FormState["source"]);
  }

  // 2. UTM Parameter
  const utmSource = params.get("utm_source")?.toLowerCase();
  if (utmSource) {
    return UTM_SOURCE_MAP[utmSource] || (utmSource as FormState["source"]);
  }

  // 3. Click IDs (bezahlte Werbung)
  if (params.get("gclid")) return "Google Ads";
  if (params.get("fbclid")) return "Facebook";
  if (params.get("msclkid")) return "Bing Ads";

  // 4. Referrer-Analyse
  const referrer = document.referrer;
  if (referrer) {
    try {
      const hostname = new URL(referrer).hostname.toLowerCase();

      // Eigene Domains ignorieren (interne Navigation)
      if (hostname.includes("zfdm.") || hostname.includes("get2world.")) {
        return null;
      }

      // Suchmaschinen
      if (hostname.includes("google.")) return "Google Suchmaschine";
      if (hostname.includes("bing.")) return "Bing Suchmaschine";

      // Social Media
      if (hostname.includes("facebook.") || hostname.includes("fb."))
        return "Facebook";
      if (hostname.includes("linkedin.")) return "LinkedIn";

      // AI-Suchmaschinen
      if (hostname.includes("chatgpt.") || hostname.includes("chat.openai."))
        return "ChatGPT";
      if (hostname.includes("perplexity.")) return "Perplexity";
      if (hostname.includes("gemini.google.")) return "Gemini";
    } catch {
      // Ungültige Referrer-URL ignorieren
    }
  }

  return null; // Keine Source erkannt
};

// First-Touch Attribution: Speichert die erste erkannte Source in sessionStorage
const getOrDetectSource = (): FormState["source"] => {
  if (typeof window === "undefined") return "Webseite";

  // Prüfe ob bereits eine Source in dieser Session gespeichert wurde
  try {
    const storedSource = sessionStorage.getItem(SOURCE_STORAGE_KEY);
    if (storedSource) {
      return storedSource as FormState["source"];
    }
  } catch {
    // sessionStorage nicht verfügbar (z.B. privater Modus)
  }

  // Neue Source erkennen
  const detectedSource = detectTrafficSource();

  if (detectedSource) {
    try {
      sessionStorage.setItem(SOURCE_STORAGE_KEY, detectedSource);
    } catch {
      // sessionStorage nicht verfügbar
    }
    return detectedSource;
  }

  // Default für direkten Zugriff
  return "Webseite";
};

type LabelMessage = {
  text: string;
  tone: "neutral" | "success" | "error";
};

type WindowWithTracking = Window & {
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
  clarity?: (...args: unknown[]) => void;
};

const TEST_MODAL_MESSAGE =
  "Bitte beachten Sie, dass für Sie mit der bestellung Ihres individuellen Test-Sets unsere allgemeinen Geschäftsbedingungen (AGB) akzeptieren. Sie erhalten deshalb mit dem Test-Set auch eine Rechnung, die zu begleichen ist, wenn Sie das Test-Set nicht fristgerecht zurücksenden.";

const ORDER_MODAL_MESSAGE =
  "Mit dieser Bestellung akzeptieren Sie unsere allgemeinen Geschäftsbedingungen (AGB). Sie können können aber die Bestellung innerhalb von 14 Tagen Retounieren.";

type ModalVariant = "test" | "order";

export function ContactForm() {
  const [formState, setFormState] = useState<FormState>(INITIAL_STATE);
  const [labelMessage, setLabelMessage] = useState<LabelMessage>({
    text: "",
    tone: "neutral",
  });
  const [isSending, setIsSending] = useState(false);
  const [formStarted, setFormStarted] = useState(false);
  const [progressVisible, setProgressVisible] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalVariant, setModalVariant] = useState<ModalVariant>("test");
  const [minEmployees, setMinEmployees] = useState<number | null>(null);

  const progressIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const interestParam = params.get("interest")?.toLowerCase();
    const modelParam = params.get("model")?.toLowerCase();
    const sizeParam = params.get("model_size")?.toLowerCase();
    const employeesParam = params.get("employees");
    const minEmployeesParam = params.get("min_employees");

    // Automatische Source-Erkennung mit First-Touch Attribution
    const detectedSource = getOrDetectSource();

    setFormState((previous) => {
      let updated: FormState = { ...previous };

      // Source setzen (aus URL-Parameter, UTM, Referrer oder sessionStorage)
      updated.source = detectedSource;

      if (interestParam) {
        const map: Record<string, InterestValue | undefined> = {
          order: "Order",
          offer: "Offer",
        };
        const interestValue = map[interestParam];
        if (interestValue) {
          updated.interest = interestValue;
        }
      }

      if (modelParam) {
        const modelMap: Record<string, FormState["device"] | undefined> = {
          chip: "Zeiterfassung mit RFID",
          finger: "Zeiterfassung mit Fingerabdruck",
          fingerabdruck: "Zeiterfassung mit Fingerabdruck",
          face: "Zeiterfassung mit Gesichtserkennung",
          gesichtserkennung: "Zeiterfassung mit Gesichtserkennung",
        };
        const device = modelMap[modelParam];
        if (device) {
          updated.device = device;
        }
      }

      if (sizeParam) {
        const sizeMap: Record<string, FormState["packet"] | undefined> = {
          starter: "Starter",
          medium: "Medium",
        };
        const packet = sizeMap[sizeParam];
        if (packet) {
          updated.packet = packet;
        }
      }

      if (employeesParam) {
        updated.noEmployee = employeesParam;
      }

      return updated;
    });

    if (minEmployeesParam) {
      const minEmp = parseInt(minEmployeesParam, 10);
      if (!isNaN(minEmp) && minEmp > 0) {
        setMinEmployees(minEmp);
      }
    }
  }, []);

  useEffect(() => {
    setLabelMessage({ text: "", tone: "neutral" });
  }, [formState.interest, formState.source]);

  useEffect(() => {
    if (!isSending) {
      return;
    }

    progressIntervalRef.current = window.setInterval(() => {
      setProgressValue((current) => {
        if (current >= 100) {
          return 0;
        }
        return current + 1;
      });
    }, 500);

    return () => {
      if (progressIntervalRef.current) {
        window.clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };
  }, [isSending]);

  const showAddressFields = formState.interest === "Order";
  const showOfferButton = formState.interest === "Offer";
  const showOrderButton = formState.interest === "Order";
  const showSourceSelection = true;
  const showRecommender = formState.source === "Weiterempfehlung";

  const submitButtonLabel = useMemo(() => {
    if (formState.interest === "Order") {
      return "Jetzt bestellen";
    }
    return "Jetzt Beratung anfragen";
  }, [formState.interest]);

  const currentModalMessage =
    modalVariant === "order" ? ORDER_MODAL_MESSAGE : TEST_MODAL_MESSAGE;

  const updateField = <Key extends keyof FormState>(
    field: Key,
    value: FormState[Key],
  ) => {
    setFormState((previous) => ({ ...previous, [field]: value }));

    if (!formStarted) {
      setFormStarted(true);
      trackEvent("form_started", {
        event_category: "form",
        event_label: "form_started",
        form_type: "contact",
      });
    }
  };

  const resetProgress = () => {
    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setIsSending(false);
    setProgressVisible(false);
    setProgressValue(0);
  };

  const trackEvent = (eventName: string, params?: Record<string, unknown>) => {
    const currentWindow = window as WindowWithTracking;
    currentWindow.gtag?.("event", eventName, params);
  };

  const validateForm = ():
    | false
    | {
        firstname: string;
        lastname: string;
        address: string;
        phone: string;
        employees: string;
        packet: string;
        callback: string;
        deviceType: string;
        source: string;
        message: string;
        nodevice: string;
      } => {
    const state = formState;

    if (!state.firstname || state.firstname.trim().length === 0) {
      window.alert("Ihr Vorname fehlt");
      return false;
    }

    if (state.firstname.trim().length > 100) {
      window.alert("Maximal 100 Charakter erlaubt in Vornamesfeld");
      return false;
    }

    let nodeviceValue = state.nodevice.trim();
    if (nodeviceValue.length === 0 || nodeviceValue === "0") {
      nodeviceValue = "1";
      updateField("nodevice", "1");
    }

    if (!state.lastname || state.lastname.trim().length === 0) {
      window.alert("Ihr Nachname fehlt");
      return false;
    }

    if (state.lastname.trim().length > 100) {
      window.alert("Maximal 100 Charakter erlaubt in Nachnamesfeld");
      return false;
    }

    if (state.companyname.trim().length < 3) {
      window.alert("Firmenfeld muss mindestens 3 Charakter beinhalten");
      return false;
    }

    if (state.companyname.trim().length > 100) {
      window.alert("Firmenfeld muss maximal 100 Charakter beinhalten");
      return false;
    }

    if (state.email.trim().length === 0 || state.email.trim().length > 100) {
      window.alert(
        "Geben Sie eine gültige E-Mail Adresse des Vorgesetzten ein. Die E-Mail Adresse des Vorgesetzten darf maximal 100 Zeichen lang sein",
      );
      return false;
    }

    const atpos = state.email.indexOf("@");
    const dotpos = state.email.lastIndexOf(".");
    if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= state.email.length) {
      window.alert("Geben Sie eine gültige E-Mail Adresse ein.");
      return false;
    }

    let address = "-";
    const streetValue = state.street.trim();

    if (streetValue.length > 0) {
      const digitExpression = /\d+/;
      const hasHouseNumber = digitExpression.test(streetValue);
      if (!hasHouseNumber) {
        const confirmed = window.confirm(
          "Es gibt keine Hausnummer in der Adresse. Ist die Adresse korrekt ?",
        );
        if (!confirmed) {
          return false;
        }
      }
    }

    if (showAddressFields) {
      if (streetValue.length < 5) {
        window.alert("Bitte geben Sie Ihre Strasse und Hausnummer ein.");
        return false;
      }
      if (streetValue.length > 200) {
        window.alert("Ihre Adresse scheint nicht richtig zu sein");
        return false;
      }
      address = streetValue;

      if (state.postcode.trim().length < 4) {
        window.alert("Bitte geben Sie Ihre Postleitzahl ein.");
        return false;
      }

      if (state.placename.trim().length < 2) {
        window.alert("Bitte geben Sie Ihren Ort ein.");
        return false;
      }
    } else if (showOfferButton) {
      if (streetValue.length > 200) {
        window.alert("Ihre Adresse scheint nicht richtig zu sein");
        return false;
      }
      if (streetValue.length > 10 && streetValue.length < 200) {
        address = streetValue;
      }
    }

    if (state.postcode.trim().length > 0 && state.postcode.trim().length < 4) {
      window.alert("Ihre PLZ ist nicht richtig");
      return false;
    }

    if (state.placename.trim().length > 100) {
      window.alert("Maximal 100 Charakter erlaubt in Ortnamesfeld");
      return false;
    }

    const messageLength = state.message.trim().length;
    if (messageLength > 1 && messageLength < 5) {
      window.alert("Ihre Nachricht ist sehr kurz");
      return false;
    }
    if (messageLength > 1001) {
      window.alert(
        "Bitte versuchen Sie die Nachtricht in 1000 Charakter zu fassen",
      );
      return false;
    }

    if (state.tel.trim().length <= 1 || state.tel.trim().length >= 21) {
      window.alert("Ihre Telefonnummer scheint nicht richtig zu sein");
      return false;
    }

    if (!state.noEmployee || state.noEmployee.trim().length === 0) {
      window.alert("Geben Sie einen gültigen Mitarbeiterzahl ein.");
      return false;
    }

    if (minEmployees !== null) {
      const currentEmployees = parseInt(state.noEmployee, 10);
      if (isNaN(currentEmployees) || currentEmployees < minEmployees) {
        window.alert(`Mindestens ${minEmployees} Mitarbeiter erforderlich.`);
        return false;
      }
    }

    const employeesValue = state.noEmployee;

    const selectedPacket = "-";
    const callbackValue = showOrderButton ? "Bestellung" : "Angebot";

    const sourceIndex = (
      [
        "Google Suchmaschine",
        "Bing Suchmaschine",
        "Facebook",
        "LinkedIn",
        "Ich wurde von einem Get2world Kundenberater kontaktiert",
        "Weiterempfehlung",
      ] as FormState["source"][]
    ).indexOf(state.source);

    if (sourceIndex === 4) {
      window.alert(
        "Bitte kontaktieren Sie unsere Kundenberater direkt für die Bestellung oder Angebot. Vielen Dank.",
      );
      return false;
    }

    if (sourceIndex === 5) {
      if (formState.recommender.trim().length < 3) {
        window.alert(
          "Bitte geben Sie den Namen des Empfehlers. Name des Empfehlers muss mindestens 3 Charakter enthalten.",
        );
        return false;
      }
    }

    return {
      firstname: state.firstname,
      lastname: state.lastname,
      address,
      phone: state.tel,
      employees: employeesValue,
      packet: selectedPacket,
      callback: callbackValue,
      deviceType: state.device,
      source: state.source,
      message: formState.message,
      nodevice: nodeviceValue,
    };
  };

  const sendForm = async () => {
    const validation = validateForm();
    if (!validation) {
      return;
    }

    const {
      firstname,
      lastname,
      address,
      phone,
      employees,
      packet,
      callback,
      deviceType,
      source,
      message,
      nodevice,
    } = validation;

    const params =
      "title=" +
      encodeURIComponent(formState.title) +
      "&firstname=" +
      encodeURIComponent(firstname) +
      "&name=" +
      encodeURIComponent(lastname) +
      "&email=" +
      encodeURIComponent(formState.email) +
      "&companyname=" +
      encodeURIComponent(formState.companyname) +
      "&phoneno=" +
      encodeURIComponent(phone) +
      "&noEmployee=" +
      encodeURIComponent(employees) +
      "&address=" +
      encodeURIComponent(address) +
      "&whichpacket=" +
      encodeURIComponent(packet) +
      "&type=" +
      encodeURIComponent(deviceType) +
      "&source=" +
      encodeURIComponent(source) +
      "&usermsg=" +
      encodeURIComponent(message) +
      "&callback=" +
      encodeURIComponent(callback) +
      "&postcode=" +
      encodeURIComponent(formState.postcode) +
      "&placename=" +
      encodeURIComponent(formState.placename) +
      "&nodevice=" +
      encodeURIComponent(nodevice) +
      "&recommender=" +
      encodeURIComponent(formState.recommender);

    try {
      setIsSending(true);
      setProgressVisible(true);
      setProgressValue(0);
      setLabelMessage({ text: "", tone: "neutral" });

      if (IS_DEVELOPMENT) {
        console.log("Form data being sent:", params);
      }

      const response = await fetch(SUBMIT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
      });

      const text = await response.text();

      resetProgress();

      if (text.includes("success")) {
        setLabelMessage({
          text: "Wir werden Sie bald kontaktieren, vielen Dank.",
          tone: "success",
        });

        trackEvent("form_submitted", {
          event_category: "conversion",
          event_label: "lead",
          form_type: "contact",
          interest: formState.interest,
          value: 500,
        });

        const currentWindow = window as WindowWithTracking;
        currentWindow.gtag?.("event", "contact", {
          event_category: "success",
          event_label: "Quelle",
          value: source,
        });

        currentWindow.gtag?.("event", "conversion", {
          send_to: "AW-878299546/jsQfCNPShr0bEJqT56ID",
          value: 1.0,
          currency: "EUR",
        });

        currentWindow.fbq?.("track", "Purchase", {
          value: 500.0,
          currency: "EUR",
          contents: [
            {
              id: deviceType,
              quantity: formState.nodevice,
            },
          ],
          content_type: "product",
        });
        currentWindow.clarity?.("event", "contact_anfrage");
      } else {
        setLabelMessage({ text, tone: "error" });
      }
    } catch (error) {
      console.error(error);
      resetProgress();
      setLabelMessage({
        text: "Das Senden ist fehlgeschlagen. Bitte versuchen Sie es später erneut.",
        tone: "error",
      });
    }
  };

  const handleModalConfirm = async () => {
    setIsModalOpen(false);
    await sendForm();
  };

  const handleOfferClick = async () => {
    await sendForm();
  };

  const labelToneClass =
    labelMessage.tone === "success"
      ? "text-green-600"
      : labelMessage.tone === "error"
        ? "text-red-600"
        : "text-gray-700";

  return (
    <section id="kontakt" className="section -mt-32">
      <div className="container">
        <div className="row justify-center">
          <div className="lg:col-10">
            {/* Berater-Vorstellung */}
            <div
              className="mb-12 flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start bg-light border border-border/20 rounded-xl p-6 shadow-sm"
              data-aos="fade-up-sm"
            >
              <img
                src="/images/avatar/ZFDM-Kundenberater-Simon.webp"
                alt="Simon Zipf - Ihr Ansprechpartner"
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-md"
              />
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-semibold text-text-dark mb-3">
                  Hallo, ich bin Simon Zipf!
                </h3>
                <p className="text-base md:text-lg text-text leading-relaxed mb-4">
                  Als Ihr persönlicher Ansprechpartner freue ich mich darauf,
                  Sie kennenzulernen. Füllen Sie das untenstehende Formular aus
                  oder kontaktieren Sie mich direkt per Telefon oder E-Mail.
                  Gemeinsam finden wir die perfekte Zeiterfassungslösung für Ihr
                  Unternehmen!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center md:justify-start">
                  <a
                    href="tel:+4961839210941"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      className="w-4 h-4 fill-current"
                    >
                      <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" />
                    </svg>
                    +49 6183 921 0941
                  </a>
                  <a
                    href="mailto:anfrage@get2world.com"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      className="w-4 h-4 fill-current"
                    >
                      <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
                    </svg>
                    anfrage@get2world.com
                  </a>
                </div>
              </div>
            </div>

            <div data-aos="fade-up-sm" data-aos-delay="100">
              <h2 className="h3 mb-6 text-text-dark">Kontaktformular</h2>
              <div className="rounded-xl bg-light border border-border/20 p-6 shadow-sm">
                <form
                  id="frmContact"
                  className="space-y-6"
                  onSubmit={async (event) => {
                    event.preventDefault();
                    if (formState.interest === "Order") {
                      setModalVariant("order");
                      setIsModalOpen(true);
                    } else {
                      await handleOfferClick();
                    }
                  }}
                >
                  <div className="grid gap-4 sm:grid-cols-3">
                    <label className="form-label">
                      Anrede
                      <select
                        name="title"
                        id="idTitle"
                        className="form-input custom-select"
                        value={formState.title}
                        onChange={(event) =>
                          updateField(
                            "title",
                            event.target.value as FormState["title"],
                          )
                        }
                      >
                        <option value="Herr">Herr</option>
                        <option value="Frau">Frau</option>
                      </select>
                    </label>
                    <label className="form-label">
                      Ihr Vorname*
                      <input
                        autoComplete="given-name"
                        id="IDFirstName"
                        type="text"
                        maxLength={100}
                        className="form-input"
                        value={formState.firstname}
                        onChange={(event) =>
                          updateField("firstname", event.target.value)
                        }
                      />
                    </label>
                    <label className="form-label">
                      Ihr Nachname*
                      <input
                        autoComplete="family-name"
                        type="text"
                        name="name"
                        maxLength={100}
                        className="form-input"
                        value={formState.lastname}
                        onChange={(event) =>
                          updateField("lastname", event.target.value)
                        }
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <label className="form-label">
                      Firma*
                      <input
                        autoComplete="organization"
                        type="text"
                        name="companyname"
                        maxLength={100}
                        className="form-input"
                        value={formState.companyname}
                        onChange={(event) =>
                          updateField("companyname", event.target.value)
                        }
                      />
                    </label>
                    <label className="form-label">
                      Ihre E-Mail*
                      <input
                        autoComplete="email"
                        type="email"
                        name="email"
                        maxLength={100}
                        className="form-input"
                        value={formState.email}
                        onChange={(event) =>
                          updateField("email", event.target.value)
                        }
                      />
                    </label>
                    <label className="form-label">
                      Telefon/Mobilnummer*
                      <input
                        type="tel"
                        id="custTel"
                        name="tel"
                        maxLength={20}
                        className="form-input"
                        value={formState.tel}
                        onChange={(event) =>
                          updateField(
                            "tel",
                            event.target.value
                              .replace(/[^0-9.]/g, "")
                              .replace(/(\..*)\./g, "$1"),
                          )
                        }
                      />
                    </label>
                  </div>

                  <label className="form-label">
                    Anzahl Mitarbeiter*
                    <input
                      type="text"
                      name="noEmployee"
                      id="noEmployee"
                      maxLength={3}
                      className="form-input"
                      value={formState.noEmployee}
                      onChange={(event) =>
                        updateField(
                          "noEmployee",
                          event.target.value
                            .replace(/[^0-9.]/g, "")
                            .replace(/(\..*)\./g, "$1"),
                        )
                      }
                    />
                  </label>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="form-label">
                      Interesse*
                      <select
                        name="interest"
                        id="idInterest"
                        className="form-input custom-select"
                        value={formState.interest}
                        onChange={(event) =>
                          updateField(
                            "interest",
                            event.target.value as InterestValue,
                          )
                        }
                      >
                        {INTEREST_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="form-label">
                      Zeiterfassungssystem*
                      <select
                        name="device"
                        id="idDevice"
                        className="form-input custom-select"
                        value={formState.device}
                        onChange={(event) =>
                          updateField(
                            "device",
                            event.target.value as FormState["device"],
                          )
                        }
                      >
                        {DEVICE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  {showAddressFields && (
                    <div className="grid gap-4 sm:grid-cols-3">
                      <label className="form-label sm:col-span-3">
                        Strasse und Hausnummer*
                        <input
                          type="text"
                          name="street"
                          autoComplete="street-address"
                          maxLength={100}
                          className="form-input"
                          value={formState.street}
                          onChange={(event) =>
                            updateField("street", event.target.value)
                          }
                        />
                      </label>
                      <label className="form-label">
                        Postleitzahl*
                        <input
                          type="text"
                          name="postcode"
                          autoComplete="postal-code"
                          maxLength={10}
                          className="form-input"
                          value={formState.postcode}
                          onChange={(event) =>
                            updateField("postcode", event.target.value)
                          }
                        />
                      </label>
                      <label className="form-label sm:col-span-2">
                        Ort*
                        <input
                          type="text"
                          name="placename"
                          autoComplete="address-level2"
                          maxLength={100}
                          className="form-input"
                          value={formState.placename}
                          onChange={(event) =>
                            updateField("placename", event.target.value)
                          }
                        />
                      </label>
                    </div>
                  )}

                  <label className="form-label">
                    Ihre Nachricht (optional)
                    <textarea
                      name="message"
                      id="txtCustMessage"
                      maxLength={1000}
                      rows={4}
                      className="form-input min-h-[80px] resize-y"
                      value={formState.message}
                      onChange={(event) =>
                        updateField("message", event.target.value)
                      }
                    />
                  </label>

                  {labelMessage.text && (
                    <div className="text-sm">
                      <span className={`font-medium ${labelToneClass}`}>
                        {labelMessage.text}
                      </span>
                    </div>
                  )}

                  <div id="divOffer" className="mt-6">
                    <button type="submit" className="btn btn-primary w-full">
                      {showOfferButton
                        ? "Jetzt Demo buchen"
                        : submitButtonLabel}
                    </button>
                  </div>

                  {progressVisible && (
                    <div
                      className="h-2 w-full overflow-hidden rounded-full bg-border/20 mt-4"
                      id="sendStatus"
                    >
                      <div
                        id="pgValue"
                        className="h-full bg-primary transition-all"
                        style={{ width: `${progressValue}%` }}
                      />
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-text-dark/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-lg bg-light border border-border/20 p-6 shadow-lg">
            <button
              type="button"
              className="float-right text-2xl font-semibold text-text hover:text-text-dark transition-colors"
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>
            <div className="mt-4 space-y-6">
              <div className="text-sm leading-relaxed text-text">
                {currentModalMessage}
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Abbrechen
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleModalConfirm}
                >
                  Bestätigen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
