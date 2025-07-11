import https from "https";

// 🔐 Home Assistant Token & Nabu Casa Hostname
const token = "xxx"; // <<< ersetzen!
const nabuCasaHost = "xxx.ui.nabu.casa"; // <<< Ersetzen

// 👥 Personenerkennung
const authorizedPersons = [
  "amzn1.ask.person....", // <<< Ersetzen
  "amzn1.ask.person.DEINID2"  // <<< Ersetzen
];

const personNames = {
  "amzn1.ask.person.XYZ": "Name1", // <<< Ersetzen
  "amzn1.ask.person.XYZ": "Name2" // <<< Ersetzen
};

// 🎛️ Mapping Sprachbefehl → Skript
const scriptMapping = {
  "hell": "script.nfcscript",
  "gute nacht": "script.gute_nacht",
  "musik": "script.musik_start",
  "kino": "script.kino_modus" // <<< Ersetzen durch deine Scripte
};

// 🧠 Haupt-Handler
export const handler = async (event) => {
  console.log("=== Skill ausgelöst ===");
  console.log(JSON.stringify(event, null, 2));

  const personId = event.context?.System?.person?.personId || null;
  const personName = personNames[personId] || "jemand";

  if (!personId || !authorizedPersons.includes(personId)) {
    console.log(`❌ Zugriff verweigert für ${personId}`);
    return speak("Du bist nicht berechtigt, das auszuführen.");
  }

  const command = event.request?.intent?.slots?.command?.value?.toLowerCase() || "";
  console.log(`${personName} sagt:`, command);

  const scriptEntityId = scriptMapping[command];
  if (!scriptEntityId) {
    console.log("❌ Unbekanntes Kommando:", command);
    return speak("Dieses Kommando kenne ich leider nicht.");
  }

  try {
    await callHomeAssistant(scriptEntityId, token);
    console.log(`✅ ${personName} hat '${command}' ausgelöst → ${scriptEntityId}`);
    return speak(`Gerne ${personName}.`);
  } catch (error) {
    console.error("❌ Fehler beim API-Aufruf:", error);
    return speak("Beim Ausführen ist ein Fehler passiert.");
  }
};

// 💬 Sprachantwort erzeugen
function speak(text) {
  return {
    version: "1.0",
    response: {
      outputSpeech: {
        type: "PlainText",
        text
      },
      shouldEndSession: true
    }
  };
}

// 🔁 API-Aufruf an Home Assistant
function callHomeAssistant(entityId, token) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ entity_id: entityId });

    const options = {
      hostname: nabuCasaHost,
      port: 443,
      path: "/api/services/script/turn_on",
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Content-Length": data.length
      }
    };

    const req = https.request(options, (res) => {
      res.on("data", () => {});
      res.on("end", resolve);
    });

    req.on("error", reject);
    req.write(data);
    req.end();
  });
}
