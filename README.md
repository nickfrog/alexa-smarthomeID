# 🔊 Connect Alexa with Home Assistant – with Voice ID & Script Selection

Welcome to your private Alexa Skill "Smarthome ID"! This skill lets you trigger specific Home Assistant scripts using natural voice commands like “Alexa, ask "our home", "unser Haus" , "..." to trigger home assistant scripts — **only if you or an authorized person is speaking**. That makes your smart home safer - and more "child-secure".
---

## ✅ What does this skill do?

- Triggers Home Assistant scripts via voice commands
- Detects **who is speaking** using Alexa Voice ID (`personId`)
- Ignores unauthorized users (e.g. small children)
- Supports multiple commands via dynamic mapping
- Easily extendable

---

## 📁 Project Structure

```bash
smarthome-id-skill/
├── lambda/
│   └── index.js              # Node.js Lambda function
├── skill/
│   └── interactionModel.json # Alexa intent model
└── README.md                 # This guide
```

---

## 🛠 Requirements

- AWS account with access to [Lambda](https://console.aws.amazon.com/lambda)
- Amazon Developer account for [Alexa Skills](https://developer.amazon.com/)
- A Home Assistant setup (preferably using Nabu Casa URL)
- A Long-Lived Access Token from Home Assistant (User > Profile > Create Token)
- Voice ID must be enabled for each authorized person (see below)

---

## 🚀 Step-by-Step Setup

### 1. Create Alexa Skill

1. Go to the [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask)
2. Click **"Create Skill"**
3. Name: `Smarthome ID` (or any name you prefer)
4. Language: **German (DE)** (just in my case...)
5. Skill type: **Custom**
6. Hosting: **Provision your own** (you’ll use AWS Lambda)
7. Click **Create Skill**

### 2. Insert the Interaction Model

1. Go to **Interaction Model > JSON Editor**
2. Paste the contents of `skill/interactionModel.json`
3. Click **Save Model** and then **Build Model**

### 3. Create AWS Lambda Function

1. Go to [AWS Lambda](https://console.aws.amazon.com/lambda/home)
2. Create a new function, e.g., `AlexaSmarthomeID`
3. Runtime: **Node.js 20**
4. In the `Code` tab, paste the contents of `lambda/index.js`
5. Under “Configuration > Permissions”, ensure the Lambda has no VPC assigned

#### 3.1 Customize your Lambda code

In `lambda/index.js`, replace:

```js
const token = "YOUR_LONG_LIVED_ACCESS_TOKEN";
const hostname = "your-nabu-url.ui.nabu.casa"; // without https

const personNames = {
  "amzn1.ask.person.XXX1": "Your Name",
  "amzn1.ask.person.XXX2": "Partner"
};

const scriptMapping = {
  "turn on the lights": "script.turn_on_lights",
  "good night": "script.good_night",
  "shut everything": "script.shut_everything"
};
```

Tip: You’ll find your `personId` in the first CloudWatch log entry when the skill is triggered.

### 4. Link Alexa Skill to Lambda

1. In the Alexa Developer Console → go to **Endpoint**
2. Choose **AWS Lambda ARN**
3. Region: e.g. `EU (Ireland)` or your Lambda region
4. Paste your **Lambda ARN** from AWS Lambda (top right corner)

⚠️ Make sure to **disable Skill ID validation**

### 5. Test the Skill

1. Go to **Test** in the Alexa Developer Console
2. Enable testing in **Development** mode
3. Say: `Alexa, ask Smarthome ID to turn on the lights`

If your voice is recognized, Alexa will reply:
> “Okay [Name]...”

If another person without an VoiceID is recognized:
> “You are not authorized to perform this action.”

---

## 🧠 How to Enable Voice ID in the Alexa App

To make use of the voice recognition feature (`personId`), each authorized speaker must set up Voice ID in the Alexa app:

1. Open the **Alexa App**
2. Tap **More** → **Settings**
3. Tap **Your Profile & Family**
4. Select your account → then tap **Voice**
5. Follow the steps to set up your Voice ID

Repeat this process for each person (e.g. your partner) using their own Amazon account and profile in the household.

> 🔐 Voice ID allows Alexa to recognize who is speaking, enabling person-specific logic in your skill.

---

## 🧠 Ideas for Expansion

- Add more commands by updating the `scriptMapping`
- Customize voice responses for each script
- Handle rooms/zones separately
- Offer onboarding via external JSON/YAML config

---

## 🧪 Security Tips

- Use a restricted Home Assistant user for the access token
- Voice recognition (`personId`) only works if Voice ID is enabled in the Alexa app
- this is not 100% secure... so act responsible if you add things like open the garage or main door

---

Enjoy your safe and personalized smart home automation! 💡🧒🏻🔒
