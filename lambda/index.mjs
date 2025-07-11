// 🔧 Lambda function for Alexa Smart Home Skill with Voice ID support

const https = require("https");

// Replace with your actual values:
const token = "YOUR_LONG_LIVED_ACCESS_TOKEN";
const hostname = "your-nabu-url.ui.nabu.casa";

const personNames = {
  "amzn1.ask.person.XXX1": "Your Name",
  "amzn1.ask.person.XXX2": "Partner"
};

const scriptMapping = {
  "turn on the lights": "script.turn_on_lights",
  "good night": "script.good_night",
  "shut everything": "script.shut_everything"
};

exports.handler = async (event) => {
  console.log("=== Alexa Skill triggered ===");
  console.log(JSON.stringify(event, null, 2));

  let personId = null;
  try {
    personId = event.context.System.person.personId;
    console.log("Detected personId:", personId);
  } catch {
    console.log("⚠️ No personId detected");
  }

  if (!personId || !(personId in personNames)) {
    console.log("❌ Unauthorized access");
    return speak("You are not authorized to perform this action.");
  }

  const command = event.request.intent.slots.command.value.toLowerCase();
  const scriptId = scriptMapping[command];

  if (!scriptId) {
    console.log("❌ Unknown command:", command);
    return speak("I didn't recognize that command.");
  }

  try {
    await callHomeAssistant(scriptId, token);
    const name = personNames[personId];
    console.log("✅ Executed script for", name);
    return speak(`Okay ${name}, I have executed the command.`);
  } catch (error) {
    console.error("❌ API call failed:", error);
    return speak("An error occurred while executing the command.");
  }
};

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

function callHomeAssistant(entityId, token) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ entity_id: entityId });

    const options = {
      hostname,
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
